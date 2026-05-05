import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API calls
export const authAPI = {
  register: (data) => apiClient.post("/api/auth/register", data),
  login: (data) => apiClient.post("/api/auth/login", data),
};

// Resume API calls
export const resumeAPI = {
  upload: (formData) =>
    apiClient.post("/api/resumes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: () => apiClient.get("/api/resumes"),
  delete: (id) => apiClient.delete(`/api/resumes/${id}`),
  getFile: (id) => apiClient.get(`/api/resumes/${id}/view`),

  // Parse resume details via AI
  parse: (id) => apiClient.post(`/api/resumes/${id}/parse`),

  // Update parsed details (e.g., social links)
  updateParsedDetails: (id, parsedDetails) =>
    apiClient.put(`/api/resumes/${id}/parsed-details`, { parsedDetails }),

  // Redefine resume based on JD (AI Tailor)
  redefine: (id, jobDescription) =>
    apiClient.post(`/api/resumes/${id}/redefine`, { jobDescription }),

  // Download tailored resume as DOCX
  downloadTailored: (id, tailoredData) =>
    apiClient.post(
      `/api/resumes/${id}/download-tailored`,
      { tailoredData },
      { responseType: "blob" }
    ),
};

// Application API calls
export const applicationAPI = {
  create: (data) => apiClient.post("/api/applications", data),
  getAll: () => apiClient.get("/api/applications"),
  search: (query) =>
    apiClient.get(`/api/applications/search?q=${encodeURIComponent(query)}`),
  getOne: (id) => apiClient.get(`/api/applications/${id}`),
  update: (id, data) => apiClient.patch(`/api/applications/${id}`, data),
  delete: (id) => apiClient.delete(`/api/applications/${id}`),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => apiClient.get("/api/dashboard/stats"),
};

// Utility for extracting error message
export const getErrorMessage = (error) => {
  return (
    error.response?.data?.error?.message || error.message || "An error occurred"
  );
};