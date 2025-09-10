import React, { useState } from "react";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import './style.scss';

const publicRoutes = { forgot: "/forgot", signup: "/register" };

const LoginModal = ({ onClose, loading, formErrors = {}, loginSettingData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: values => {
      const errors = {};
      if (!values.email) errors.email = "Email required";
      if (!values.password) errors.password = "Password required";
      return errors;
    },
    onSubmit: values => {
      // handle submit (for now just log)
      console.log(values);
    },
  });

  // Allow close on overlay click
  const handleOverlay = e => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal-content signup-form login-form">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faCircleXmark} size="lg" />
        </button>
        <h1 className="text-center">Sign In</h1>
        
        <p className="other-section text-center">Let's again read people have written</p>
        <form onSubmit={formik.handleSubmit}>
          <div className={`form-group ${formik.errors.email ? "error" : ""}`}>
            <label htmlFor="email">Your E-mail</label>
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
          <div className={`form-group ${formik.errors.password ? "error" : ""}`}>
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
              <p className="field__message error-msg">{formik.errors.password}</p>
            )}
          </div>
          <div className="form-footer d-flex justify-content-between">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <Link to={publicRoutes.forgot}>Forgot Password?</Link>
          </div>
          <button type="submit" className="submit-btn w-100" disabled={loading}>
            {loading ? <ClipLoader size={20} /> : "Login"}
          </button>
        </form>
        <p className="account-details text-center mt-2">
          Want to create an account ?
          <Link to={publicRoutes.signup} className="custom-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
