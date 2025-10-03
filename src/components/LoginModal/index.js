  import React, { useState } from "react";
  import { useFormik } from "formik";
  import useScrollLock from "../useScrollLock";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
  import ClipLoader from "react-spinners/ClipLoader";
  import Swal from "sweetalert2"; 
  import withReactContent from "sweetalert2-react-content";
  import "./style.scss";
  import { login } from "../../services/authService";

  const MySwal = withReactContent(Swal);

  const LoginModal = ({ onClose, openForgot, openSignup }) => {
    useScrollLock(true); // ✅ lock background scroll when modal is open
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: (values) => {
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
        onClose();
        // ✅ SweetAlert2 success popup (always above modal)
        MySwal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: "Welcome back!",
          showConfirmButton: true,
          confirmButtonText: "OK",
          backdrop: `rgba(0,0,0,0.4) left top no-repeat`,
          customClass: {
            popup: "swal-custom-popup",
            title: "swal-custom-title",
          },
          didOpen: (popup) => {
            popup.parentNode.style.zIndex = 2000;
          },
        }).then(() => {
          window.location.reload();
        });

      } catch (err) {
        const errorData = err.response?.data;
        const apiErrors = errorData?.errors;

        // 🔹 Specific check for disabled account
        if (errorData?.error === "Account disabled") {
           // Close modal first
          onClose();
          MySwal.fire({
            icon: "error",
            title: "Account Disabled",
            text: "Please contact support, your account has been disabled",
            confirmButtonColor: "#d33",
            didOpen: (popup) => {
              popup.parentNode.style.zIndex = 9999;
            }
          });
          setSubmitting(false);
          return;
        }

        if (errorData?.error === "Invalid credentials") {
           // Close modal first
          onClose();
          MySwal.fire({
            icon: "error",
            title: "Login Faileds",
            text: "Please contact support, your account has been disabled",
            confirmButtonColor: "#d33",
            didOpen: (popup) => {
              popup.parentNode.style.zIndex = 9999;
            }
          });
          setSubmitting(false);
          return;
        }

        // if (apiErrors) {
        //   const formikErrors = {};
        //   if (apiErrors.email) formikErrors.email = apiErrors.email[0];
        //   if (apiErrors.password) formikErrors.password = apiErrors.password[0];
        //   setErrors(formikErrors);
        //   MySwal.fire({
        //     icon: "error",
        //     title: "Login Failed",
        //     text: "Incorrect email or password. Please try again.",
        //     confirmButtonText: "OK",
        //     didOpen: (popup) => {
        //       popup.parentNode.style.zIndex = 2000;
        //     }
        //   });
        // }

      } finally {
        setSubmitting(false);
      }
    },
  });


    const handleOverlay = (e) => {
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
          <p className="other-section text-center m-0">&</p>
          <p className="other-section text-center pb-3">
            Let's again read what people have written
          </p>

          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div className={`form-group ${formik.errors.email ? "error" : ""}`}>
              <label htmlFor="email">E-mail</label>
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
                  onClick={() => setShowPassword((p) => !p)}
                />
              </div>
              {formik.errors.password && (
                <p className="field__message error-msg">{formik.errors.password}</p>
              )}
            </div>

            {/* Footer */}
            <div className="form-footer d-flex justify-content-end">
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
            Want to create an account?
          <button
            type="button"
            className="custom-link bg-transparent border-0 p-0"
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
