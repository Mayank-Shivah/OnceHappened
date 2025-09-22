import React, { useState, useRef, useEffect, useContext } from "react";
import { FaBars, FaCheckCircle, FaFacebookF, FaInstagram } from "react-icons/fa";
import './style.scss';
import ThemeToggleBtn from "../ThemeToggleBtn";
import FontSizeChanger from "../FontSizeChanger";
import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";
import ForgotPopup from "../ForgotPassword";
import { isLoggedIn, getUser, logout } from "../../services/authService";
import { ThemeContext } from "../ThemeProvider"; // Import ThemeContext for resetTheme
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [showLang, setShowLang] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const langRef = useRef();
  // const [translateLoaded, setTranslateLoaded] = useState(false);

  const { resetTheme } = useContext(ThemeContext); // Use resetTheme from context

  const loggedIn = isLoggedIn();
  const user = getUser();

  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    // Check the current language and toggle it
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

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

  // Show login + hide all others
  const openLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
    setShowForgotModal(false);
    setShowLang(false);
  };

  // Show register + hide all others
  const openRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
    setShowForgotModal(false);
    setShowLang(false);
  };

  // Show forgot popup + hide login/register
  const openForgot = () => {
    setShowForgotModal(true);
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  // Logout with theme reset
  const handleLogout = () => {
    logout();
    setShowLang(false);
    resetTheme(); // Reset to light theme after logout
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="quora-header">
            <div className="logo">
              <a href="/" className="once-text">
                {/* <img src="./images/logo.png" alt="Once Happened" /> */}
                Once happened...
              </a>
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
                  <div className="lang-dropdown">

                    {/* 🔹 Show Sign Up/Login if not logged in */}
                    {!loggedIn && (
                      <>
                        <div className="lang-option border-bottom-set  custom-border-set">
                          Hello,<br /> how are you? Hope you are doing good.
                        </div>
                        <div className="lang-option active">
                          <button
                            type="button"
                            className="link-button btn-border border-line"
                            onClick={openRegister}
                          >
                            Sign Up
                          </button>
                          <span style={{ margin: "0 10px" }}> Or </span>
                          <button
                            type="button"
                            className="link-button btn-border border-line"
                            onClick={openLogin}
                          >
                            Login
                          </button>
                        </div>
                      </>
                    )}

                    {/* 🔹 Show Profile + Logout if logged in */}
                    {loggedIn && (
                      <>
                        <div className="lang-option border-bottom-set ">
                          Hello, {user?.name || "Guest"}
                          <br />how are you? Hope you are doing good.
                        </div>
                        <div className="after-login">
                          <div className="lang-option border-bottom-set custom-link text-decoration-none">
                            <a href="/my-profile" className="text-decoration-none" onClick={() => setShowLang(false)}>
                              <span className="lang-avatar">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                              </span>
                              {user?.name || "Guest"}
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
                            <button
                              type="button"
                              className="link-button"
                              onClick={changeLanguage}
                            >
                              Translate To
                            </button>
                          </div>
                          <div className="lang-option border-bottom-set">
                            <a
                              href="/subscription"
                              className="link-button border-bottom-set"
                              rel="noopener noreferrer"
                              onClick={() => setShowLang(false)}
                            >
                              Subscription
                            </a>
                          </div>
                          <div className="lang-option border-bottom-set">
                            <a
                              href="/support-suggestion"
                              className="link-button border-bottom-set"
                              rel="noopener noreferrer"
                              onClick={() => setShowLang(false)}
                            >
                              Suggestion & Support
                            </a>
                          </div>
                          <div className="lang-option ">
                            <button
                              type="button"
                              className="link-button border-bottom-set"
                              onClick={handleLogout}
                            >
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
                        <a
                          href="/return-policy"
                          className="link-button border-bottom-set"
                          rel="noopener noreferrer"
                          onClick={() => setShowLang(false)}
                        >
                          Return Policy
                        </a>
                      </div>
                      <div className="lang-option border-bottom-set">
                        <a
                          href="/privacy-policy"
                          className="link-button border-bottom-set"
                          rel="noopener noreferrer"
                          onClick={() => setShowLang(false)}
                        >
                          Privacy Policy
                        </a>
                      </div>
                      <div className="lang-option border-bottom-set">
                        <a
                          href="/terms-conditions"
                          className="link-button border-bottom-set"
                          rel="noopener noreferrer"
                          onClick={() => setShowLang(false)}
                        >
                          Terms & Conditions
                        </a>
                      </div>
                      <div className="lang-option border-bottom-set">
                        <a
                          href="/about-us"
                          className="link-button border-bottom-set"
                          rel="noopener noreferrer"
                          onClick={() => setShowLang(false)}
                        >
                         About Us
                        </a>
                      </div>
                      <div className="lang-options ">
                        <ul>
                          <li><a href="#" className="facebook"><FaFacebookF /></a></li>
                          <li><a href="#" className="instagram"><FaInstagram /></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Render Modals: Only Here! */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          openForgot={openForgot}
          openSignup={openRegister}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          openLogin={openLogin}
        />
      )}
      {showForgotModal && (
        <ForgotPopup
          onClose={() => setShowForgotModal(false)}
          onOtpSend={email => { /* send OTP logic */ }}
          onOtpValidate={(email, code) => { /* validate OTP logic */ }}
          onResetPassword={(email, newPassword) => {
            console.log(`Reset password for ${email} to ${newPassword}`);
          }}
          loading={false}
        />
      )}
    </>
  );
}
