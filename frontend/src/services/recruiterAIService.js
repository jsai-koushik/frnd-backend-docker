
import api from "../api/axios";

// ==========================================
// GET RECRUITER JOBS
// ==========================================

export const getRecruiterJobs = async () => {
  const response = await api.get("/api/recruiter/jobs");
  return response.data;
};

// ==========================================
// GET APPLICANTS FOR A JOB
// ==========================================

export const getJobApplicants = async (jobId) => {
  const response = await api.get(
    `/api/recruiter/jobs/${jobId}/applicants`
  );

  return response.data;
};

// ==========================================
// AI APPLICANT SCREENING
// ==========================================

export const screenApplicant = async (applicationId) => {
  const response = await api.post(
    `/api/recruiter/ai/applications/${applicationId}/screen`,
    null,
    {
      // AI processing may take longer than normal requests.
      timeout: 90000,
    }
  );

  return response.data;
};

// ==========================================
// GENERATE AI INTERVIEW QUESTIONS
// ==========================================

export const generateInterviewQuestions = async (
  jobId,
  numberOfQuestions
) => {
  const response = await api.post(
    `/api/recruiter/ai/jobs/${jobId}/interview-questions`,
    {
      numberOfQuestions: Number(numberOfQuestions),
    },
    {
      timeout: 90000,
    }
  );

  return response.data;
};

// ==========================================
// HANDLE AI API ERRORS
// ==========================================

export const getAIErrorMessage = (error) => {
  const status = error.response?.status;
  const data = error.response?.data;

  const message =
    typeof data === "string"
      ? data
      : data?.message || data?.error;

  // Axios timeout
  if (error.code === "ECONNABORTED") {
    return (
      "The AI request took too long to complete. " +
      "Please try again."
    );
  }

  // Network error
  if (!error.response) {
    return (
      "Unable to reach the backend. " +
      "Check your connection and make sure Spring Boot is running."
    );
  }

  // Authentication error
  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  // Authorization error
  if (status === 403) {
    return "Access denied. Please check your recruiter permissions.";
  }

  // Resource not found
  if (status === 404) {
    return message || "The requested resource was not found.";
  }

  // Invalid request
  if (status === 400) {
    return message || "Invalid request. Please check your selection.";
  }

  // AI service errors
  if (status === 502 || status === 503 || status === 504) {
    return (
      message ||
      "The AI service is temporarily unavailable. Please try again later."
    );
  }

  // Other backend errors
  if (status >= 500) {
    return message || "A backend error occurred. Please try again.";
  }

  return message || error.message || "Something went wrong.";
};

export default api;
