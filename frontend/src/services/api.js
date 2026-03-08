import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("secureid_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
};

export const kycApi = {
  verify: (payload) => api.post("/kyc/verify", payload),
};

export const faceApi = {
  enroll: (payload) => api.post("/face/enroll", payload),
  authenticate: (payload) => api.post("/face/authenticate", payload),
};

export const adminApi = {
  stats: () => api.get("/admin/stats"),
  students: () => api.get("/admin/students"),
  authLogs: () => api.get("/admin/auth-logs"),
  revoke: (studentId) => api.post(`/admin/students/${studentId}/revoke`),
};

export const studentApi = {
  getTimeline: () => api.get("/student/timeline"),
  getVerificationHistory: (studentId) =>
    api.get(`/verification/history/${studentId}`),
};

export default api;
