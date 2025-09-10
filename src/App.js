import React, { useState } from "react";
import ThemeProvider from "./components/ThemeProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Blog from "./pages/singleblog";
import Topics from "./pages/Topics";
import SupportSuggestion from './pages/SupportSuggestion';
import "./styles/style.scss";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import MyProfile from "./pages/MyProfile";
;
function App() {
  // Font Size state here, at top level
  const [fontSize, setFontSize] = useState(18);

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Example: add font size changer at top right or wherever needed */}
        <Routes>
          {/* All routes inside Layout */}
          <Route element={<Layout fontSize={fontSize} />}>
            <Route path="/" element={<Home fontSize={fontSize} />} />
            <Route path="/blog" element={<Blog fontSize={fontSize} />} />
            <Route path="/support-suggestion" element={<SupportSuggestion />} />
            <Route path="/my-profile" element={<MyProfile />} />

            
            {/* add other common pages here */}
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
          </Route>
          {/* Auth routes outside Layout */}
          <Route path="/topics" element={<Topics fontSize={fontSize} />} />


          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
