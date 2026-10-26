import api from "../../api/axios";

// Re-export the shared api instance scoped to admin use.
// Token is attached automatically via the axios interceptor.
const adminApi = api;

export function getAdminError(error) {
  const status = error.response?.status;

  if (status === 401) return "Session expired. Please log in again.";
  if (status === 403) return "Access denied. ADMIN role required.";
  if (!error.response) return "Cannot connect to the backend. Check Spring Boot.";

  return error.response?.data?.message || "Something went wrong. Please try again.";
}

export default adminApi;
