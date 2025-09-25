// src/services/authService.js
import api from "../api"; // axios instance

// export const verifyToken = async () => {
//   try {
//     const response = await api.get("/me"); // or /auth/check if you name it differently
//     // if valid, update local user info
//     if (response.data?.user) {
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//     }
//     return response.data;
//   } catch (err) {
//     console.error("Token verification failed:", err.response?.data || err.message);
//     logout(); // clear storage if invalid
//     return null;
//   }
// };

// Login user
export const login = async (email, password) => {
  const response = await api.post("/login", { email, password });

  // save token
  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  // ✅ ensure user also saved (needed for validation)
  if (response.data?.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    startIdleTimer();
  }

  // await verifyToken();

  return response.data;
};

// Register user
export const register = async (payload) => {
  const response = await api.post("/register", payload);

  // ✅ ensure user & token saved here too
  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }
  if (response.data?.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    startIdleTimer();
  }

  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  const response = await api.post("/verify-otp", { email, otp });
  return response.data;
};

// Reset password
export const resetPassword = async (payload) => {
  const response = await api.post("/reset-password", payload);
  return response.data;
};

// Get current user profile (requires Bearer token)
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ✅ FIX: check token AND user, not just token
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

export const loggedUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  stopIdleTimer();
  window.location.reload(); // or navigate to homepage
};

let idleTimer = null;

export const startIdleTimer = (timeout = 30000) => {
  // only start if user is logged in
  if (!isLoggedIn()) return;

  const resetTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      // console.warn("User inactive for 2 minutes. Logging out...");
      logout();
    }, timeout);
  };

  // events to track
  const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

  // attach listeners
  events.forEach((event) =>
    window.addEventListener(event, resetTimer, { passive: true })
  );

  // start first timer
  resetTimer();
};

export const stopIdleTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = null;

  const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
  events.forEach((event) =>
    window.removeEventListener(event, () => {}, false)
  );
};
