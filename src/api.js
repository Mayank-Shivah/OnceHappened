import axios from "axios";
import Swal from "sweetalert2"; // Optional: For global error alerts (if using SweetAlert elsewhere)

const api = axios.create({
  baseURL: "https://dashboard.oncehappened.com/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

//ssl files code update

// Add token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Optional: Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    // Handle common errors globally
    if (error.response?.status === 401) {
      // Token expired/invalid – logout and redirect
      localStorage.removeItem("token");
      Swal.fire('Session Expired!', 'Please log in again.', 'warning');
      window.location.href = '/'; // Or use React Router navigate if in a component
    } else if (error.response?.status >= 500) {
      // Server error
      console.error("Server error:", error.response?.data || error.message);
      Swal.fire('Error!', 'Something went wrong on the server. Please try again.', 'error');
    } else if (!error.response) {
      // Network error (e.g., offline)
      console.error("Network error:", error.message);
      Swal.fire('Error!', 'No internet connection. Please check your network.', 'error');
    }
    
    // Re-throw the error for component-level handling
    return Promise.reject(error);
  }
);

export default api;
