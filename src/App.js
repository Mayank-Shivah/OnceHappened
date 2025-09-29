import React, { useState, useEffect } from "react";
import ThemeProvider from "./components/ThemeProvider";
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
import Loader from "./components/Loader";
import "react-toastify/dist/ReactToastify.css";

// 🔹 PopupManager
import PopupManager from "./components/PopupManager";
import { isLoggedIn } from "./services/authService"; // ✅ import auth check

// Custom hook to restrict copy, paste, cut, right-click, and certain shortcuts globally
function useRestrictInteractions() {
  useEffect(() => {
    // Block copy, cut, paste, and context menu globally
    const preventDefault = e => e.preventDefault();

    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);
    document.addEventListener("paste", preventDefault);
    document.addEventListener("contextmenu", preventDefault);

    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J
    const blockKeys = e => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        alert("Inspect is disabled");
      }
    };
    document.addEventListener("keydown", blockKeys);

    // Clean up event listeners on unmount
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
  // Font Size state here, at top level
  const [fontSize, setFontSize] = useState(18);
  const [loading, setLoading] = useState(true);
  // Call the custom hook at app level
  // useRestrictInteractions();
  const PrivateRoute = ({ children }) => {
    return isLoggedIn() ? children : <Navigate to="/" replace />;
    // 👆 if not logged in, redirect (e.g. to home or login page)
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
        <ThemeProvider>
          <BrowserRouter>
            <PopupManager>
              <Routes>
                {/* All routes inside Layout */}
                <Route element={<Layout fontSize={fontSize} />}>
                  {/* ✅ Public Routes */}
                  <Route path="/" element={<Home fontSize={fontSize} />} />
                  <Route path="/blog" element={<Blog fontSize={fontSize} />} />

                  <Route path="/about-us" element={<About />} />
                  <Route path="/terms-conditions" element={<TermsConditions />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                  {/* ✅ Protected Routes (login required) */}
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

                {/* Auth routes outside Layout */}
                <Route path="/topics" element={<Topics fontSize={fontSize} />} />
              </Routes>

              {/* ✅ Toast notifications */}
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
          </BrowserRouter>
        </ThemeProvider>
    </>    
  );
}

export default App;
