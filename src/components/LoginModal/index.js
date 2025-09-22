import React, { useState } from "react";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "./style.scss";
import { login } from "../../services/authService";

const LoginModal = ({ onClose, openForgot, openSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: values => {
      const errors = {};
      if (!values.email) errors.email = "Please enter your email";
      if (!values.password) errors.password = "Please enter your password";
      return errors;
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const data = await login(values.email, values.password);

        if (data?.token) {
          localStorage.setItem("token", data.token);
        }

        toast.success("You have logged in successfully!");
        setTimeout(() => {
          onClose();
          // window.location.reload();
        }, 1500);
      } catch (err) {
        const apiErrors = err.response?.data?.errors;

        if (apiErrors) {
          const formikErrors = {};
          if (apiErrors.email) {
            formikErrors.email = apiErrors.email[0];
          }
          if (apiErrors.password) {
            formikErrors.password = apiErrors.password[0];
          }
          setErrors(formikErrors);
        } else {
          toast.error("Incorrect email or password. Please try again.");
          setErrors({ password: "Incorrect email or password." });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOverlay = e => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal-content signup-form login-form">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h1 className="text-center">Log In</h1>
        <p class="other-section text-center m-0"
        >&</p>
        <p className="other-section text-center pb-3">
          Let's again read what people have written
        </p>

        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div className={`form-group ${formik.errors.email ? "error" : ""}`}>
            <label htmlFor="email"> E-mail </label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            </div>
            {formik.errors.email && (
              <p className="field__message error-msg">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div
            className={`form-group ${formik.errors.password ? "error" : ""}`}
          >
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="input-icon"
                onClick={() => setShowPassword(p => !p)}
              />
            </div>
            {formik.errors.password && (
              <p className="field__message error-msg">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="form-footer d-flex justify-content-between">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <button
              type="button"
              className="link-button btn-border"
              onClick={openForgot}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? <ClipLoader size={20} /> : "Log in"}
          </button>
        </form>

        <p className="account-details text-center mt-3">
          Want to create an account ?
          <button
            type="button"
            className="custom-link"
            style={{
              background: "none",
              border: "none",
         
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={openSignup}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
