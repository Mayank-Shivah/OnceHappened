import axios from "axios";

const api = axios.create({
  baseURL: "http://dashboard.oncehappened.com/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Add token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
