import React, { useState, useRef, useEffect, useContext } from "react";
import { FaBars, FaCheckCircle, FaFacebookF, FaInstagram } from "react-icons/fa";
import "./style.scss";
import ThemeToggleBtn from "../ThemeToggleBtn";
import FontSizeChanger from "../FontSizeChanger";
import { isLoggedIn, getUser, logout } from "../../services/authService";
import { ThemeContext } from "../ThemeProvider";
import { useTranslation } from "react-i18next";

// ✅ Import the Popup hook
import { usePopup } from "../PopupManager";

// ✅ Import GoogleTranslate component
import GoogleTranslate from "../GoogleTranslate";

export default function Header() {
  const [showLang, setShowLang] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false); // 🔹 add translate state
  const langRef = useRef();

  const { resetTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const loggedIn = isLoggedIn();
  const user = getUser();

  // ✅ Access popup functions
  const { openLogin, openRegister, openForgot } = usePopup();

  // ✅ on click show GoogleTranslate component
  const changeLanguage = () => {
    setShowTranslate(true);
  };

  // prevent background scroll when dropdown open
  useEffect(() => {
    if (showLang) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showLang]);

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLang(false);
      }
    };
    if (showLang) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showLang]);

  const handleLogout = () => {
    logout();
    setShowLang(false);
    resetTheme();
  };

  return (
    <header>
      <div className="container">
        <div className="quora-header">
          <div className="logo">
            <a href="/" className="once-text">Once happened...</a>
          </div>
          <div className="happened-sec">
            <div className="lang-dropdown-wrapper" ref={langRef}>
              <div
                className="profile-circle"
                onClick={() => setShowLang((s) => !s)}
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >
                <FaBars />
              </div>

              {showLang && (
                <div className="lang-overlay" onClick={() => setShowLang(false)}>
                  <div
                    className="lang-dropdown"
                    onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
                  >
                    {/* If not logged in */}
                    {!loggedIn && (
                      <>
                        <div className="lang-option border-bottom-set custom-border-set">
                          Hello,<br /> how are you? Hope you are doing good.
                        </div>
                        <div className="lang-option active">
                          <button
                            type="button"
                            className="link-button btn-border border-line"
                            onClick={() => {
                              openRegister();
                              setShowLang(false);
                            }}
                          >
                            Sign Up
                          </button>
                          <span style={{ margin: "0 10px" }}> Or </span>
                          <button
                            type="button"
                            className="link-button btn-border border-line"
                            onClick={() => {
                              openLogin();
                              setShowLang(false);
                            }}
                          >
                            Login
                          </button>
                        </div>
                      </>
                    )}

                    {/* If logged in */}
                    {loggedIn && (
                      <>
                        <div className="lang-option border-bottom-set d-block">
                          <span className="profile-test">
                            Hello {user?.name || "Guest"},
                          </span>
                          how are you? <br />Hope you are doing good!
                        </div>
                        <div className="after-login">
                          <div className="lang-option border-bottom-set custom-link text-decoration-none">
                            <a
                              href="/my-profile"
                              className="text-decoration-none"
                              onClick={() => setShowLang(false)}
                            >
                              <span className="lang-avatar">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                              </span>
                              Your Profile
                              <FaCheckCircle className="lang-check" />
                            </a>
                          </div>
                          <div className="lang-option border-bottom-set">
                            <ThemeToggleBtn />
                          </div>
                          <div className="lang-option border-bottom-set">
                            <FontSizeChanger />
                          </div>
                          <div className="lang-option border-bottom-set">
                            <button type="button" className="link-button" onClick={changeLanguage}>
                              Translate To
                            </button>
                            {/* 🔹 Render GoogleTranslate only when Translate To clicked */}
                            {showTranslate && <GoogleTranslate />}
                          </div>
                          <div className="lang-option border-bottom-set">
                            <a href="/subscription" className="link-button border-bottom-set" onClick={() => setShowLang(false)}>
                              Subscription
                            </a>
                          </div>
                          <div className="lang-option border-bottom-set">
                            <a href="/support-suggestion" className="link-button border-bottom-set" onClick={() => setShowLang(false)}>
                              Suggestion & Support
                            </a>
                          </div>
                          <div className="lang-option ">
                            <button type="button" className="link-button border-bottom-set" onClick={handleLogout}>
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="lang-option">
                      <p className="p-0 m-0">Stay Always Smiling :-)</p>
                    </div>
                    <div className="bottom-section-footer">
                      <div className="lang-option border-bottom-set">
                        <a href="/return-policy" className="link-button" onClick={() => setShowLang(false)}>Return Policy</a>
                      </div>
                      <div className="lang-option border-bottom-set">
                        <a href="/privacy-policy" className="link-button" onClick={() => setShowLang(false)}>Privacy Policy</a>
                      </div>
                      <div className="lang-option border-bottom-set">
                        <a href="/terms-conditions" className="link-button" onClick={() => setShowLang(false)}>Terms & Conditions</a>
                      </div>
                      <div className="lang-option border-bottom-set">
                        <a href="/about-us" className="link-button" onClick={() => setShowLang(false)}>About Us</a>
                      </div>
                      <div className="lang-options">
                        <ul>
                          <li><a href="/" className="facebook"><FaFacebookF /></a></li>
                          <li><a href="https://www.instagram.com/once.happened" className="instagram"><FaInstagram /></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </header>
  );
}
