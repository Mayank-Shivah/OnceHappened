import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "https://dashboard.oncehappened.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global response handler (safe for /subscription)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;
    const isSubscriptionPage = currentPath.includes("/subscription");

    if (error.response?.status === 401) {
      // ✅ If on subscription page, skip logout
      if (isSubscriptionPage) {
        console.warn("⚠️ 401 on subscription page — skipping global logout.");
        return Promise.reject(error);
      }

      // 🔐 Normal behavior for all other pages
      localStorage.removeItem("token");
      Swal.fire("Session Expired!", "Please log in again.", "warning");
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (error.response?.status >= 500) {
      console.error("Server error:", error.response?.data || error.message);
      Swal.fire("Error!", "Something went wrong on the server. Please try again.", "error");
    } else if (!error.response) {
      console.error("Network error:", error.message);
      Swal.fire("Error!", "No internet connection. Please check your network.", "error");
    }

    return Promise.reject(error);
  }
);

export default api;
