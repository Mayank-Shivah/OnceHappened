// src/components/ForgotPassword/index.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useScrollLock from "../useScrollLock";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2"; 
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";  // ✅ import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ ensure css is included
import './style.scss';

// 🔹 Import API services
import { forgotPassword, verifyOtp, resetPassword } from "../../services/authService";

const ForgotPopup = ({ onClose }) => {
useScrollLock(true);
  const MySwal = withReactContent(Swal);


  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset password, 4: success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  // Step 1: Send email for OTP
  const handleEmailSend = async () => {
    if (!email) {

      MySwal.fire({
      icon: "error",
      title: "Error",
      text: "Please enter your email",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });

      return;
    }
    try {
      setLoadingState(true);
      await forgotPassword(email);
      MySwal.fire({
      icon: "success",
      title: "Success",
      text: "OTP has been sent to your email",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });

      setStep(2);
    } catch (err) {

      MySwal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to send OTP",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });

      // toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingState(false);
    }
  };

  // Step 2: OTP input
  const handleOtpChange = (idx, val) => {
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);
      if (val && idx < 5) {
        document.getElementById(`otp-${idx + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {


      MySwal.fire({
      icon: "error",
      title: "Error",
      text: "Please enter all 6 digits",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });

      // toast.error("Please enter all 6 digits");
      return;
    }
    try {
      setLoadingState(true);
      await verifyOtp(email, code); // ✅ call verify API

      MySwal.fire({
      icon: "success",
      title: "Success",
      text: "OTP verified successfully",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });
      
      // toast.success("OTP verified successfully");
      setStep(3);
    } catch (err) {

      MySwal.fire({
      icon: "error",
      title: "Error",
      text: "Invalid OTP",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });


      // toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoadingState(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async () => {
    if (!newPassword) {
      MySwal.fire({
      icon: "error",
      title: "Error",
      text: "New Password is required",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });

      // toast.error("New Password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
     
    MySwal.fire({
      icon: "error",
      title: "Error",
      text: "Passwords do not match",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });

      // toast.error("Passwords do not match");
      return;
    }
    try {
      setLoadingState(true);
      await resetPassword({
        email,
        otp: otp.join(""), // ✅ include OTP with reset
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      MySwal.fire({
      icon: "success",
      title: "Success",
      text: "Password reset successfully",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });

      // toast.success("Password reset successfully");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {

      MySwal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to reset password",
      didOpen: (popup) => {
        popup.parentNode.style.zIndex = 9999;
      },      
    });

      // toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={e => e.target.classList.contains("modal-overlay") && onClose()}
    >
      <div className="modal-content forgot-form signup-form login-form">
        <div class="for-div">
    
          <h1 className="text-center mb-5">Forgot Password</h1>
                <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        {step === 1 && (
          <div className="form-group">
            <label htmlFor="forgot-email">Enter your email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="forgot-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your Email"
              />
            </div>
            <button
              className="submit-btn w-100 mt-4"
              onClick={handleEmailSend}
              disabled={loadingState}
            >
              {loadingState ? <ClipLoader size={20} /> : "Send"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label htmlFor="otp" className="text-center d-block">
              Enter OTP sent to your email
            </label>
            <div className="otp-input-group theme-otp">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  className="otp-box"
                />
              ))}
            </div>
            <button
              className="submit-btn w-100 mt-4"
              onClick={handleOtpSubmit}
              disabled={loadingState}
            >
              {loadingState ? <ClipLoader size={20} /> : "Verify"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="form-group">
              <label htmlFor="new-password" className="d-block">New Password</label>
              <div className="input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="new-password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <FontAwesomeIcon
                  icon={showNewPassword ? faEye : faEyeSlash}
                  className="input-icon toggle-password-icon"
                  onClick={() => setShowNewPassword(p => !p)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="form-group mt-4">
              <label htmlFor="confirm-password" className="d-block">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEye : faEyeSlash}
                  className="input-icon toggle-password-icon"
                  onClick={() => setShowConfirmPassword(p => !p)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <button
              className="submit-btn w-100 mt-4"
              onClick={handleResetPassword}
              disabled={loadingState}
            >
              {loadingState ? <ClipLoader size={20} /> : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPopup;
