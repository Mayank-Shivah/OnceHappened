// src/services/authService.js
import api from "../api"; // axios instance

// 🔹 Login user
export const login = async (email, password) => {
  const response = await api.post("/login", { email, password });

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  // ✅ Store full login data (includes user + token + subscription)
  if (response.data) {
    localStorage.setItem("userData", JSON.stringify(response.data));
  }

  if (response.data?.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    startIdleTimer();
  }

  return response.data;
};

// 🔹 Register user
export const register = async (payload) => {
  const response = await api.post("/register", payload);

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  // ✅ Save entire structure (in case register also includes subscription)
  if (response.data) {
    localStorage.setItem("userData", JSON.stringify(response.data));
  }

  if (response.data?.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    startIdleTimer();
  }

  return response.data;
};

// 🔹 Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};

// 🔹 Verify OTP
export const verifyOtp = async (email, otp) => {
  const response = await api.post("/verify-otp", { email, otp });
  return response.data;
};

// 🔹 Reset password
export const resetPassword = async (payload) => {
  const response = await api.post("/reset-password", payload);
  return response.data;
};

// 🔹 Get current user only
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getFullUserData = () => {
  try {
    return JSON.parse(localStorage.getItem("userData"));
  } catch {
    return null;
  }
};


// 🔹 Check login
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

// 🔹 Logged user shorthand
export const loggedUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// 🔹 Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userData");
  stopIdleTimer();
  window.location.reload();
};

// 🔹 Idle timeout management
let idleTimer = null;

export const startIdleTimer = (timeout = 30000) => {
  if (!isLoggedIn()) return;

  const resetTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      logout();
    }, timeout);
  };

  const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
  events.forEach((event) =>
    window.addEventListener(event, resetTimer, { passive: true })
  );

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
