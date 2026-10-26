import api from "../../../api/axios";

// AI calls need a longer timeout than normal requests.
const AI_TIMEOUT = 90000;

// ==========================================
// AI RESUME ANALYSIS
// ==========================================

export async function analyzeResume(resumeText) {
  if (!resumeText || !resumeText.trim()) {
    throw new Error("Please provide resume text.");
  }

  const response = await api.post(
    "/api/ai/resume/analyze",
    { resumeText: resumeText.trim() },
    { timeout: AI_TIMEOUT }
  );

  return response.data;
}

// ==========================================
// AI JOB MATCH
// ==========================================

export async function matchJob(jobId) {
  if (!jobId) {
    throw new Error("Job ID is required.");
  }

  const response = await api.post(
    `/api/ai/jobs/${jobId}/match`,
    null,
    { timeout: AI_TIMEOUT }
  );

  return response.data;
}

// ==========================================
// AI INTERVIEW PREPARATION
// ==========================================

export async function prepareInterview(jobId, numberOfQuestions = 5) {
  if (!jobId) {
    throw new Error("Job ID is required.");
  }

  const response = await api.post(
    "/api/ai/interview/prepare",
    {
      jobId: Number(jobId),
      numberOfQuestions: Number(numberOfQuestions),
    },
    { timeout: AI_TIMEOUT }
  );

  return response.data;
}

// ==========================================
// SHARED AI ERROR MESSAGE HELPER
// ==========================================

export function getAIErrorMessage(error) {
  const status = error.response?.status;
  const data = error.response?.data;
  const message =
    typeof data === "string" ? data : data?.message || data?.error;

  if (error.code === "ECONNABORTED") {
    return "The AI request took too long. Please try again.";
  }

  if (!error.response) {
    return "Cannot reach the backend. Make sure Spring Boot is running on port 8080.";
  }

  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "Access denied. Check your account permissions.";
  if (status === 404) return message || "Resource not found.";
  if (status === 400) return message || "Invalid request.";
  if (status === 429) return "AI rate limit reached. Please wait a moment and try again.";

  if (status === 503) {
    return (
      "The Gemini AI provider is currently overloaded (HTTP 503). " +
      "This is a Google-side issue. Please wait a few minutes and retry."
    );
  }

  if (status === 502 || status === 504) {
    return message || "AI service gateway error. Please try again.";
  }

  if (status >= 500) return message || "A backend error occurred. Please try again.";

  return message || error.message || "Something went wrong.";
}
