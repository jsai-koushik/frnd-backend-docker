
import axios from "axios";

// SmartHire API Configuration
const api = axios.create({
  // Docker: Requests go through the Nginx reverse proxy.
  // Local development: VITE_API_BASE_URL can override this.
  baseURL: import.meta.env.VITE_API_BASE_URL || "",

  headers: {
    "Content-Type": "application/json",
  },

  // Default timeout: 15 seconds
  // AI endpoints can override this with timeout: 90000
  timeout: 15000,
});

// ========================================
// REQUEST INTERCEPTOR - Attach JWT Token
// ========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("smarthire_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========================================
// RESPONSE INTERCEPTOR - Error Handling
// ========================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    // Request timeout
    if (error.code === "ECONNABORTED") {
      console.error(
        "SmartHire API timeout:",
        error.config?.url
      );
    }

    // Network or backend connection error
    if (!error.response) {
      console.error(
        "SmartHire API network error:",
        error.message
      );
    }

    // Handle expired or invalid JWT
    if (status === 401) {
      const isAuthEndpoint =
        error.config?.url?.includes("/api/auth/");

      // Do not clear storage for login/register failures
      if (!isAuthEndpoint) {
        localStorage.removeItem("smarthire_token");
        localStorage.removeItem("smarthire_user");
      }
    }

    // Log API errors
    console.error("SmartHire API Error:", {
      url: error.config?.url,
      status: status,
      message: error.message,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default api;
