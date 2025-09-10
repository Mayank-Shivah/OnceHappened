import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaCheckCircle, FaFacebookF, FaInstagram } from "react-icons/fa";
import './style.scss';
import ThemeToggleBtn from "../ThemeToggleBtn";
import FontSizeChanger from "../FontSizeChanger";
import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";

export default function Header() {
  const [showLang, setShowLang] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const langRef = useRef();

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

  // Open Login modal and close Register modal + close dropdown
  const openLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
    setShowLang(false);
  };

  // Open Register modal and close Login modal + close dropdown
  const openRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
    setShowLang(false);
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="quora-header">
            <div className="logo">
              <a href="/" class="once-text">
                {/* <img src="./images/logo.png" alt="Once Happened" /> */}
                Once Happened...
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
                    <div className="lang-option border-bottom-set">
                      Hello,<br /> how are you? Hope you are doing good.
                    </div>
                    <div className="lang-option active">
                      <button
                        type="button"
                        className="link-button btn-border"
                        onClick={openRegister}
                      >
                        Sign Up
                      </button>
                      <span style={{ margin: "0 10px" }}> Or </span>
                      <button
                        type="button"
                        className="link-button btn-border"
                        onClick={openLogin}
                      >
                        Login
                      </button>
                    </div>
                    <div className="after-login">
                      <div className="lang-option border-bottom-set">
                        <span className="lang-avatar">M</span>My Profile
                        <FaCheckCircle className="lang-check" />
                      </div>
                      <div className="lang-option">
                        <ThemeToggleBtn />
                      </div>
                      <div className="lang-option">
                        <FontSizeChanger />
                      </div>
                      <div className="lang-option border-bottom-set">
                        <button type="button" className="link-button">Translate To</button>
                      </div>
                      <div className="lang-option border-bottom-set">
                        <button type="button" className="link-button">Subscribe</button>
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
                        <button type="button" className="link-button border-bottom-set">Logout</button>
                      </div>
                    </div>
                    <div className="lang-option">
                      <p>Stay Always Smiling :-)</p>
                    </div>
                    <div className="bottom-section-footer">
                      <div className="lang-option border-bottom-set">
                       
                              <a 
                        href="/return-policy"
                          className="link-button border-bottom-set"
                          rel="noopener noreferrer"
                          onClick={() => setShowLang(false)}>Return Policy</a>
                      </div>
                      <div className="lang-option border-bottom-set">
                        <a
                          href="/privacy-policy"
                          className="link-button border-bottom-set"
                          rel="noopener noreferrer"
                          onClick={() => setShowLang(false)}>Privacy Policy</a>
                      </div>
                      <div className="lang-option border-bottom-set">
                              <a
                          href="/terms-conditions"
                          className="link-button border-bottom-set"
                          rel="noopener noreferrer"
                          onClick={() => setShowLang(false)}>Terms & Conditions</a>
                  
                      </div>
                      <div className="lang-option border-bottom-set">
                        <button type="button" className="link-button">About Us</button>
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

      {/* Render modals conditionally */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
}
