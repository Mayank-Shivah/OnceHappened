// src/App.js
import React, { useState, useEffect } from "react";
import useHorizontalDragScroll from "./hooks/useHorizontalDragScroll";
import Swal from "sweetalert2";
import ThemeProvider from "./components/ThemeProvider"; // Persisted theme!
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Blog from "./pages/singleblog";
import Topics from "./pages/Topics";
import SupportSuggestion from "./pages/SupportSuggestion";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import MyProfile from "./pages/MyProfile";
import About from "./pages/AboutUs";
import Subscription from "./pages/Subscription";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { startIdleTimer } from "./services/authService";
import { AuthProvider } from "./context/AuthContext";
import PopupManager from "./components/PopupManager";
import { isLoggedIn } from "./services/authService";
import Success from "./pages/Subscription/Success";
import Cancel from "./pages/Subscription/Cancel";
import { SearchProvider } from "./context/SearchContext";
// Custom hook to restrict copy, paste, cut, right-click, and shortcuts
function useRestrictInteractions() {
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    // Disable copy, cut, paste, right-click
    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);
    document.addEventListener("paste", preventDefault);
    document.addEventListener("contextmenu", preventDefault);

    const blockKeys = (e) => {
      // Block inspect shortcuts Ctrl+Shift+I or Ctrl+Shift+J or F12
      if (
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        Swal.fire({
          icon: "warning",
          title: "Inspect is disabled",
          timer: 30000,
          showConfirmButton: true,
          backdrop: `rgba(0,0,0,0.4)`,
          customClass: { popup: "swal-custom-popup" },
          didOpen: (popup) => {
            popup.parentNode.style.zIndex = "9999999999999999999";
            const overlay = document.querySelector(".swal2-container");
            if (overlay) overlay.style.zIndex = "9999999998";
          },
        });
      }

      // Block Ctrl+V, Ctrl+C, Ctrl+A
      if (
        e.ctrlKey &&
        ["v", "c", "a"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        Swal.fire({
          icon: "warning",
          title: "Copy-Pasting is Disabled",
          showConfirmButton: true,
          backdrop: `rgba(0,0,0,0.4)`,
          didOpen: (popup) => {
            popup.parentNode.style.zIndex = "9999999999999999999";
            const overlay = document.querySelector(".swal2-container");
            if (overlay) overlay.style.zIndex = "9999999998";
          },
        });
      }
    };

    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("cut", preventDefault);
      document.removeEventListener("paste", preventDefault);
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);
}
function App() {
 useRestrictInteractions(); // globally restrict interactions
 useHorizontalDragScroll(".category-list");
  const [fontSize, setFontSize] = useState(18);
  const [loading, setLoading] = useState(true);

  // Protect routes based on authentication
  const PrivateRoute = ({ children }) => {
    return isLoggedIn() ? children : <Navigate to="/" replace />;
  };

  useEffect(() => {
    if (isLoggedIn()) {
      startIdleTimer(30 * 60 * 1000); // 30 minutes
    }
    // Apply saved language preference to Google translate widget
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("preferredLanguage");
      const sel = document.querySelector(".goog-te-combo");
      if (sel && saved && sel.value !== saved) {
        sel.value = saved;
        sel.dispatchEvent(new Event("change"));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <ThemeProvider>
            <PopupManager>
            <Routes>
              {/* Main layout wraps all content pages */}
              <Route element={<Layout fontSize={fontSize} />}>
                <Route path="/" element={<Home fontSize={fontSize} />} />
                <Route path="/blog" element={<Blog fontSize={fontSize} />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                {/* Protected routes */}
          

                <Route
                  path="/support-suggestion"
                  element={
                    <PrivateRoute>
                      <SupportSuggestion />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-profile"
                  element={
                    <PrivateRoute>
                      <MyProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <PrivateRoute>
                      <Subscription />
                    </PrivateRoute>
                  }
                />
              </Route>
              {/* Routes outside layout */}
              <Route path="/topics" element={<Topics fontSize={fontSize} />} />
              {/* Stripe payment return routes */}
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
            </Routes>
            {/* Toast notifications */}
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </PopupManager>
        </ThemeProvider>
      </BrowserRouter>      </SearchProvider>    </AuthProvider>
  );
}

export default App;
