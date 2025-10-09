import React, { useState } from "react";
import { useFormik } from "formik";
import useScrollLock from "../useScrollLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import ClipLoader from "react-spinners/ClipLoader";
import { register } from "../../services/authService";
import { toast } from "react-toastify";

export default function RegisterModal({ onClose, openLogin }) {
  useScrollLock(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      nickname: "",
      password: "",
      confirmPassword: "",
      dobDay: "",
      dobMonth: "",
      dobYear: "",
      gender: "",
      city: "",
      country: "",
      agreed: false,
    },
    validate: (values) => {
      const errors = {};

      if (!values.email) errors.email = "Email is required";
      if (!values.nickname) errors.nickname = "Nickname is required";
      if (!values.password) errors.password = "Password is required";
      if (values.password !== values.confirmPassword)
        errors.confirmPassword = "Passwords must match";

      // ✅ DOB Validation + 18+ Check
      if (!values.dobDay || !values.dobMonth || !values.dobYear) {
        errors.dob = "Complete DOB required";
      } else {
        const dob = new Date(
          `${values.dobYear}-${values.dobMonth}-${values.dobDay}`
        );
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 18) {
          errors.dob = "You must be at least 18 years old";
        }
      }

      if (!values.gender) errors.gender = "Required";
      if (!values.city) errors.city = "City is required";
      if (!values.country) errors.country = "Country is required";
      if (!values.agreed)
        errors.agreed = "Please agree to the privacy policy and terms";

      return errors;
    },
    validateOnChange: false, // show errors only when clicking Sign Up
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setLoading(true);
      try {
        const payload = {
          email: values.email,
          password: values.password,
          name: values.nickname,
          dob: `${values.dobYear}-${values.dobMonth}-${values.dobDay}`,
          gender: values.gender,
          city: values.city,
          country: values.country,
          phone: values.phone || "",
        };

        const data = await register(payload);
        // toast.success("Registered successfully, you are logged in.");

        if (data?.token || data?.authorisation?.token) {
          localStorage.setItem(
            "token",
            data.token || data.authorisation.token
          );
        }
        // ✅ Close modal first
        onClose();

        // ✅ Then show SweetAlert
        Swal.fire({
          title: 'Success!',
          text: 'Registered Successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // ✅ Reload only after SweetAlert closed
          window.location.reload();
        });
      } catch (err) {
        console.error("Register failed:", err.response?.data || err.message);
        // toast.error("The email has already been taken.");
        setErrors({ email: "The email has already been taken." });
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-contents signup-form">
        <div className="scroll-issue-div">


        <section className="signup-section position-relative pt-3">
          
          <div className="sign-popup mb-4">
            <h1 className="text-center ">Once happened...</h1>
            <button className="close-btn" type="button" onClick={onClose}>
              ×
            </button>
          </div>
          <p className="other-section text-center">
            Where People Share their stories, and learn a thing or two from
            others.
          </p>

          {/* Already have account */}
          <div className="col-12">
            <p className="mt-3 mb-2 text-center" style={{ fontSize: 14 }}>
              Already have an account?&nbsp;
              <button
                type="button"
                className="custom-link"
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={openLogin}
              >
                Login here
              </button>
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="w-100">
            {/* Email + Nickname */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mt-2">
                  <label htmlFor="email" className="d-block pb-2">
                    Email id
                  </label>
                  <div className="position-relative d-flex align-items-center pt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control ps-2"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon  position-absolute end-0 pe-2" />
                  </div>
                  {formik.errors.email && (
                    <p className="field__message error-msg">
                      <FontAwesomeIcon icon={faCircleExclamation} />{" "}
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mt-2">
                  <label htmlFor="nickname" className="d-block pb-2">
                    Your Nickname
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    id="nickname"
                    className="form-control ps-2"
                    placeholder="Nickname"
                    value={formik.values.nickname}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.nickname && (
                    <p className="field__message error-msg">
                      <FontAwesomeIcon icon={faCircleExclamation} />{" "}
                      {formik.errors.nickname}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Password + Confirm Password */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mt-2">
                  <label htmlFor="password" className="d-block pb-2">
                    Password
                  </label>
                  <div className="position-relative d-flex align-items-center pt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      className="form-control ps-2"
                      placeholder="Enter your password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    />
                    <FontAwesomeIcon
                      icon={showPassword ? faEye : faEyeSlash}
                      className="position-absolute end-0 pe-2"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  {formik.errors.password && (
                    <p className="field__message error-msg">
                      <FontAwesomeIcon icon={faCircleExclamation} />{" "}
                      {formik.errors.password}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mt-2">
                  <label htmlFor="confirmPassword" className="d-block pb-2">
                    Confirm
                  </label>
                  <div className="position-relative d-flex align-items-center pt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      className="form-control ps-2"
                      placeholder="Re-enter your password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                    />
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEye : faEyeSlash}
                      className="position-absolute end-0 pe-2"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  {formik.errors.confirmPassword && (
                    <p className="field__message error-msg">
                      <FontAwesomeIcon icon={faCircleExclamation} />{" "}
                      {formik.errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* DOB + Gender */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="d-block pb-1">Date of Birth</label>
                <div style={{ display: "flex", gap: "2px" }}>
                  <select
                    name="dobDay"
                    className="form-control"
                    value={formik.values.dobDay}
                    onChange={formik.handleChange}
                    style={{ width: "32%" }}
                  >
                    <option value="">DD</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    name="dobMonth"
                    className="form-control"
                    value={formik.values.dobMonth}
                    onChange={formik.handleChange}
                    style={{ width: "36%" }}
                  >
                    <option value="">MM</option>
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ].map((m, i) => (
                      <option key={m} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    name="dobYear"
                    className="form-control"
                    value={formik.values.dobYear}
                    onChange={formik.handleChange}
                    style={{ width: "32%" }}
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 70 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.errors.dob && (
                  <p className="field__message error-msg">
                    <FontAwesomeIcon icon={faCircleExclamation} />{" "}
                    {formik.errors.dob}
                  </p>
                )}
              </div>
              <div className="col-md-6">
                <label className="d-block pb-1">Gender</label>
                <select
                  name="gender"
                  className="form-control custom-select"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="notsay">LGBT</option>
                </select>
                {formik.errors.gender && (
                  <p className="field__message error-msg">
                    <FontAwesomeIcon icon={faCircleExclamation} />{" "}
                    {formik.errors.gender}
                  </p>
                )}
              </div>
            </div>

            {/* City + Country */}
            <div className="row mb-3">
              <div className="col">
                <label className="d-block pb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formik.values.city}
                  maxLength={15}
                  onChange={formik.handleChange}
                  className="form-control ps-2"
                />
                {formik.errors.city && (
                  <p className="field__message error-msg">
                    <FontAwesomeIcon icon={faCircleExclamation} />{" "}
                    {formik.errors.city}
                  </p>
                )}
              </div>
              <div className="col">
                <label className="d-block pb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  list="country-list"
                  placeholder="Country"
                  maxLength={15}
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  className="form-control ps-2"
                  autoComplete="off"
                />
                <datalist id="country-list">
                  {["India", "United States", "United Kingdom", "Canada", "Australia"].map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {formik.errors.country && (
                  <p className="field__message error-msg">
                    <FontAwesomeIcon icon={faCircleExclamation} />{" "}
                    {formik.errors.country}
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="form-group mb-2">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 400,
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  name="agreed"
                  checked={formik.values.agreed}
                  onChange={formik.handleChange}
                  style={{ marginRight: 7 }}
                />
                I have read and agree to Once happened's&nbsp;
              </label>
              {formik.errors.agreed && (
                <p className="field__message error-msg">
                  <FontAwesomeIcon icon={faCircleExclamation} />{" "}
                  {formik.errors.agreed}
                </p>
              )}
            </div>
            <div
              className="text-center text-md-start"
              style={{ fontSize: 13, color: "#555", lineHeight: 1.4 }}
            >
              <a
                href="/privacy-policy"
                className="tag-links me-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <span className="and-text">and</span>
              <a
                href="/terms-conditions"
                className="tag-links ms-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </a>
            </div>

            {/* Submit */}
            <div className="login-btn mt-4 mb-4">
              <button
                type="submit"
                className="py-2 submit-btn border-radius d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color={"#fff"} loading={loading} size={25} />
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
        </section>
        </div>
        
      </div>
    </div>
  );
}
