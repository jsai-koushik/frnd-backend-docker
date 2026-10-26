
import api from "./api";

export const authService = {
  async login(credentials) {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },
};