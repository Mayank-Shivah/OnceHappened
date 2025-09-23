// src/components/PopupManager.js
import React, { createContext, useContext, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import ForgotPopup from "./ForgotPassword";

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export default function PopupManager({ children }) {
  const [activeModal, setActiveModal] = useState(null);
  // values: "login" | "register" | "forgot" | null

  const openLogin = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const openForgot = () => setActiveModal("forgot");
  const closeAll = () => setActiveModal(null);

  return (
    <PopupContext.Provider
      value={{ activeModal, openLogin, openRegister, openForgot, closeAll }}
    >
      {children}

      {activeModal === "login" && (
        <LoginModal
          onClose={closeAll}
          openForgot={openForgot}
          openSignup={openRegister}
        />
      )}

      {activeModal === "register" && (
        <RegisterModal
          onClose={closeAll}
          openLogin={openLogin}
        />
      )}

      {activeModal === "forgot" && (
        <ForgotPopup
          onClose={closeAll}
        />
      )}
    </PopupContext.Provider>
  );
}
