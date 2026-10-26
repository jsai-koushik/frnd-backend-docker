package com.example.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * HTTP client for the Google Gemini generateContent REST API.
 *
 * Timeout / retry summary
 * ───────────────────────
 *   Connect timeout   : 10 s
 *   Per-request read  : 60 s
 *   Max attempts      : 3  (1 original + 2 retries)
 *   Retryable codes   : network timeout, 429, 502, 503, 504
 *   Backoff           : exponential 3 s → 6 s, honours Retry-After on 429
 *   Worst-case total  : 3 × 60 s + 3 + 6 s = ~189 s
 *
 * spring.mvc.async.request-timeout must be > 189 000 ms (set to 210 000).
 *
 * IMPORTANT – provider vs application errors
 * ───────────────────────────────────────────
 * HTTP 503 from Gemini means Google's servers are overloaded.
 * Increasing the Java-side timeout does NOT fix provider overload;
 * it only prevents premature local cancellation.
 * A distinct error message is returned for each failure class so
 * callers can distinguish the two cases.
 *
 * Model selection
 * ───────────────
 * gemini-2.0-flash was SHUT DOWN on 2026-06-01.
 * Use gemini-3.6-flash (stable) via gemini.api.model in
 * application.properties.
 */
@Service
public class AiProviderClient {

    // ── Gemini REST base URL ──────────────────────────────────────────

    private static final String BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/";

    // ── Retry / timeout constants ─────────────────────────────────────

    private static final int MAX_ATTEMPTS = 3;

    /** Per-request read timeout. 60 s is sufficient for gemini-3.6-flash. */
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(60);

    /** Base exponential-backoff delay. Doubles each attempt: 3 s, 6 s, 12 s. */
    private static final long BACKOFF_BASE_MS = 3_000L;

    /**
     * Safety cap on backoff / Retry-After so a bad header value cannot
     * stall the thread indefinitely.
     */
    private static final long MAX_BACKOFF_MS = 30_000L;

    // ── Spring-injected fields ────────────────────────────────────────

    private final String apiKey;
    private final String model;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    // ── Constructor ───────────────────────────────────────────────────

    public AiProviderClient(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.model}") String model,
            ObjectMapper objectMapper) {

        this.apiKey       = apiKey;
        this.model        = model;
        this.objectMapper = objectMapper;

        // One shared client; it pools connections internally.
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    // ── Public API (signature unchanged) ─────────────────────────────

    /**
     * Send {@code prompt} to Gemini and deserialise the JSON response
     * into {@code responseType}.
     *
     * All callers (AiService, RecruiterAiService) use this signature —
     * it must not change.
     */
    public <T> T generateJson(String prompt, Class<T> responseType) {

        validateConfig();

        String normalizedModel = normalizeModel(model);
        String geminiUrl       = BASE_URL + normalizedModel + ":generateContent";

        System.out.println("===== GEMINI REQUEST =====");
        System.out.println("Model    : " + normalizedModel);
        System.out.println("Endpoint : " + geminiUrl);

        HttpRequest request = buildHttpRequest(geminiUrl, prompt);

        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {

            System.out.println(
                    "Attempt " + attempt + " of " + MAX_ATTEMPTS);

            HttpResponse<String> response = send(request, attempt);

            if (response == null) {
                // Timed out on a non-final attempt; backoff already
                // applied inside send(). Loop to retry.
                continue;
            }

            int status = response.statusCode();
            System.out.println("Gemini HTTP status: " + status);

            if (status >= 200 && status < 300) {
                return parseResponse(response.body(), responseType);
            }

            if (isRetryable(status) && attempt < MAX_ATTEMPTS) {
                logError(status, response.body());
                long delay = backoffDelay(status, attempt, response);
                sleepMs(delay, attempt);
                continue;
            }

            // Non-retryable, or retryable but out of attempts.
            logError(status, response.body());
            throw buildException(status, response.body());
        }

        // Reached only when every attempt returned null (all timed out).
        throw new ResponseStatusException(
                HttpStatus.GATEWAY_TIMEOUT,
                "Gemini AI did not respond within "
                        + REQUEST_TIMEOUT.getSeconds() + " s on any of "
                        + MAX_ATTEMPTS + " attempts. "
                        + "This is a Gemini provider latency issue."
        );
    }

    // ── Config helpers ────────────────────────────────────────────────

    private void validateConfig() {

        if (apiKey == null || apiKey.isBlank() || apiKey.startsWith("${")) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini API key is not set. "
                            + "Provide GEMINI_API_KEY as an environment variable."
            );
        }

        if (model == null || model.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "gemini.api.model is not set in application.properties."
            );
        }
    }

    /**
     * Strip surrounding quotes, whitespace, and the optional
     * {@code models/} prefix, then validate the result is URL-safe.
     */
    private String normalizeModel(String raw) {

        String m = raw.trim()
                .replace("\"", "")
                .replace("'", "")
                .trim();

        if (m.startsWith("models/")) {
            m = m.substring("models/".length());
        }

        if (!m.matches("[A-Za-z0-9._-]+")) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Invalid gemini.api.model value: '" + m + "'. "
                            + "Expected a value like gemini-3.6-flash."
            );
        }

        return m;
    }

    // ── Request builder ───────────────────────────────────────────────

    private HttpRequest buildHttpRequest(String url, String prompt) {

        try {
            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "role", "user",
                                    "parts", List.of(Map.of("text", prompt))
                            )
                    ),
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json",
                            "temperature", 0.2
                    )
            );

            String json = objectMapper.writeValueAsString(body);

            return HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    // Key in header — never in query string or logs.
                    .header("x-goog-api-key", apiKey)
                    .timeout(REQUEST_TIMEOUT)
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to serialise Gemini request body.",
                    ex
            );
        }
    }

    // ── HTTP send ─────────────────────────────────────────────────────

    /**
     * Send {@code request} and return the response, or {@code null}
     * if the per-request timeout fires on a non-final attempt
     * (the caller will retry after backoff).
     *
     * On the final attempt a timeout is propagated as 504.
     */
    private HttpResponse<String> send(HttpRequest request, int attempt) {

        try {
            return httpClient.send(
                    request, HttpResponse.BodyHandlers.ofString());

        } catch (HttpTimeoutException ex) {

            System.err.println("Gemini timed out on attempt " + attempt
                    + " (limit=" + REQUEST_TIMEOUT.getSeconds() + "s)");

            if (attempt < MAX_ATTEMPTS) {
                sleepMs(BACKOFF_BASE_MS * (1L << (attempt - 1)), attempt);
                return null; // caller retries
            }

            throw new ResponseStatusException(
                    HttpStatus.GATEWAY_TIMEOUT,
                    "Gemini request timed out after "
                            + REQUEST_TIMEOUT.getSeconds()
                            + " s (attempt " + attempt + "/" + MAX_ATTEMPTS + "). "
                            + "This is Gemini provider latency, not a local bug.",
                    ex
            );

        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini request thread was interrupted.",
                    ex
            );

        } catch (IOException ex) {
            System.err.println("===== GEMINI NETWORK ERROR =====");
            ex.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Network error communicating with Gemini AI.",
                    ex
            );
        }
    }

    // ── Retry logic ───────────────────────────────────────────────────

    /** Returns true for HTTP codes that are worth retrying. */
    private boolean isRetryable(int status) {
        // 429 rate-limit, 502 bad gateway, 503 provider overload, 504 upstream timeout
        return status == 429
                || status == 502
                || status == 503
                || status == 504;
    }

    /**
     * Compute how long to wait before the next attempt.
     *
     * For HTTP 429 Google returns a {@code Retry-After} header (seconds).
     * We honour it, capped at {@code MAX_BACKOFF_MS}.
     * For all other codes use exponential backoff.
     */
    private long backoffDelay(int status, int attempt,
                               HttpResponse<String> response) {

        if (status == 429) {
            String header = response.headers()
                    .firstValue("Retry-After").orElse(null);
            if (header != null) {
                try {
                    long suggested = Long.parseLong(header.trim()) * 1_000L;
                    return Math.min(suggested, MAX_BACKOFF_MS);
                } catch (NumberFormatException ignored) {
                    // fall through to exponential
                }
            }
        }

        long delay = BACKOFF_BASE_MS * (1L << (attempt - 1)); // 3s, 6s, 12s
        return Math.min(delay, MAX_BACKOFF_MS);
    }

    // ── Response parsing ──────────────────────────────────────────────

    private <T> T parseResponse(String body, Class<T> type) {

        try {
            JsonNode root       = objectMapper.readTree(body);
            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Gemini returned no candidates in its response."
                );
            }

            JsonNode parts = candidates.get(0)
                    .path("content")
                    .path("parts");

            if (!parts.isArray() || parts.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Gemini returned no text parts in the first candidate."
                );
            }

            StringBuilder sb = new StringBuilder();
            for (JsonNode part : parts) {
                if (part.path("text").isTextual()) {
                    sb.append(part.path("text").asText());
                }
            }

            String text = sb.toString().trim();

            if (text.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Gemini returned an empty text response."
                );
            }

            return objectMapper.readValue(text, type);

        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (IOException ex) {
            System.err.println("===== GEMINI JSON PARSE ERROR =====");
            ex.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Failed to parse Gemini JSON response into "
                            + type.getSimpleName() + ".",
                    ex
            );
        }
    }

    // ── Error helpers ─────────────────────────────────────────────────

    /** Extracts provider error fields without echoing the API key. */
    private void logError(int status, String body) {

        System.err.println("===== GEMINI PROVIDER ERROR =====");
        System.err.println("HTTP: " + status);

        try {
            JsonNode err = objectMapper.readTree(body).path("error");
            System.err.println("Status  : " + err.path("status").asText("(none)"));
            System.err.println("Message : " + err.path("message").asText("(none)"));
        } catch (Exception ignored) {
            System.err.println("(response body is not JSON)");
        }
    }

    /**
     * Map Gemini HTTP status codes to {@link ResponseStatusException}
     * with clear, actionable messages.
     *
     * 503 from Gemini is explicitly labelled as a provider-side outage
     * so it is not confused with a local application timeout.
     */
    private ResponseStatusException buildException(int status, String body) {

        String providerMsg = extractProviderMessage(body);

        return switch (status) {

            // Bad API key — do not retry
            case 401, 403 -> new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini API key rejected (HTTP " + status + "). "
                            + "Check GEMINI_API_KEY. Provider: " + providerMsg
            );

            // Model not found — verify gemini.api.model is a valid endpoint
            case 404 -> new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini model not found (HTTP 404). "
                            + "Check gemini.api.model in application.properties. "
                            + "Provider: " + providerMsg
            );

            // Rate limit exhausted after all retries
            case 429 -> new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Gemini rate limit exceeded after " + MAX_ATTEMPTS
                            + " attempts (HTTP 429). "
                            + "Provider: " + providerMsg
            );

            // Provider overloaded — this is NOT fixed by increasing timeouts
            case 503 -> new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini provider is overloaded (HTTP 503). "
                            + "This is a Google-side outage. "
                            + "Increasing the local request timeout does NOT resolve provider overload. "
                            + "Wait a few minutes and retry. "
                            + "Provider: " + providerMsg
            );

            // Google infra timeout
            case 502, 504 -> new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Gemini infrastructure error (HTTP " + status + "). "
                            + "Provider: " + providerMsg
            );

            // Bad request — prompt or config error
            case 400 -> new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Gemini rejected the request (HTTP 400). "
                            + "Provider: " + providerMsg
            );

            default -> new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Unexpected Gemini HTTP " + status + ". "
                            + "Provider: " + providerMsg
            );
        };
    }

    private String extractProviderMessage(String body) {
        try {
            return objectMapper.readTree(body)
                    .path("error")
                    .path("message")
                    .asText("(no message)");
        } catch (Exception ignored) {
            return "(could not parse error body)";
        }
    }

    // ── Sleep helper ──────────────────────────────────────────────────

    private void sleepMs(long millis, int attempt) {

        System.out.println("Retrying in " + (millis / 1000.0)
                + " s (after attempt " + attempt + ")...");

        try {
            Thread.sleep(millis);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini retry wait interrupted.",
                    ex
            );
        }
    }
}
