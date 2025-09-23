import React, { useState } from "react";
import ThemeProvider from "./components/ThemeProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Blog from "./pages/singleblog";
import Topics from "./pages/Topics";
import SupportSuggestion from './pages/SupportSuggestion';
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import MyProfile from "./pages/MyProfile";
import About from "./pages/AboutUs";
import Subscription from "./pages/Subscription";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔹 PopupManager
import PopupManager from "./components/PopupManager";

function App() {
  const [fontSize, setFontSize] = useState(18);

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* 🔥 Wrap the entire app in PopupManager */}
        <PopupManager>
          <Routes>
            {/* All routes inside Layout */}
            <Route element={<Layout fontSize={fontSize} />}>
              <Route path="/" element={<Home fontSize={fontSize} />} />
              <Route path="/blog" element={<Blog fontSize={fontSize} />} />
              <Route path="/support-suggestion" element={<SupportSuggestion />} />
              <Route path="/my-profile" element={<MyProfile />} />

              {/* Common pages */}
              <Route path="/about-us" element={<About />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/subscription" element={<Subscription />} />
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
  );
}

export default App;
