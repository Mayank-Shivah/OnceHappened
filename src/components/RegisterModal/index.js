import React, { useState } from "react";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faPhone, faCircleXmark, faEye, faEyeSlash, faCircleExclamation
} from "@fortawesome/free-solid-svg-icons";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

const publicRoutes = { login: "/login" };

export default function RegisterModal({ onClose }) {
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
      if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords must match";
      if (!values.dobDay || !values.dobMonth || !values.dobYear) errors.dob = "Complete DOB required";
      if (!values.gender) errors.gender = "Gender is required";
      if (!values.city) errors.city = "City is required";
      if (!values.country) errors.country = "Country is required";
      if (!values.agreed) errors.agreed = "Please agree to the privacy policy and terms";
      return errors;
    },
    onSubmit: (values) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert("Registered Successfully!");
        onClose();
      }, 2000);
    },
  });

  const handleChange = formik.handleChange;

  // Overlay click closes modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-contents signup-form">
        <button className="close-btn" type="button" onClick={onClose}> <FontAwesomeIcon icon={faCircleXmark} size="lg" /></button>
        <section className="signup-section  position-relative">
          <h1 className="text-center">Once happened</h1>

          <p className="other-section text-center">Where People Share thier stories, and learna thing or two form others.</p>
          <form onSubmit={formik.handleSubmit} className="w-100">
            {/* Email */}
            <div className="form-group mt-2">
              <label htmlFor="email" className="d-block pb-2">
                Email id.
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control ps-2"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={handleChange}
                />
              </label>
              <div className="tip" style={{ fontSize: '12px', color: '#888', marginTop: '-2px' }}> (tip: Use your secondary email) </div>
              {formik.errors.email && (
                <p className="field__message error-msg"><FontAwesomeIcon icon={faCircleExclamation} /> {formik.errors.email}</p>
              )}
            </div>

            {/* Nickname */}
            <div className="form-group mt-2">
              <label htmlFor="nickname" className="d-block pb-2">
                Your Nickname
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  className="form-control ps-2"
                  placeholder="Nickname"
                  value={formik.values.nickname}
                  onChange={handleChange}
                />
              </label>
              {formik.errors.nickname && (
                <p className="field__message error-msg"><FontAwesomeIcon icon={faCircleExclamation} /> {formik.errors.nickname}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group mt-2">
              <label htmlFor="password" className="d-block pb-2">
                Password
                <div className="position-relative d-flex align-items-center pt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className="form-control ps-2"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={handleChange}
                  />
                  <div
                    className="position-absolute pe-2 end-0"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </div>
                </div>
              </label>
              <div className="tip" style={{ fontSize: '12px', color: '#888', marginTop: '-2px' }}>
                (tip: Use a long password with numbers and symbols $ %)
              </div>
              {formik.errors.password && (
                <p className="field__message error-msg"><FontAwesomeIcon icon={faCircleExclamation} /> {formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group mt-2">
              <label htmlFor="confirmPassword" className="d-block pb-2">
                Confirm
                <div className="position-relative d-flex align-items-center pt-1">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    className="form-control ps-2"
                    placeholder="Re-enter your password"
                    value={formik.values.confirmPassword}
                    onChange={handleChange}
                  />
                  <div
                    className="position-absolute pe-2 end-0"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                  </div>
                </div>
              </label>
              {formik.errors.confirmPassword && (
                <p className="field__message error-msg"><FontAwesomeIcon icon={faCircleExclamation} /> {formik.errors.confirmPassword}</p>
              )}
            </div>

            {/* Row: DOB + Gender */}
            <div className="row mb-2">
              <div className="col">
                <label className="d-block pb-2">Date of Birth</label>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <select name="dobDay" className="form-control" value={formik.values.dobDay} onChange={handleChange} style={{ width: '32%' }}>
                    <option value="">DD</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <select name="dobMonth" className="form-control" value={formik.values.dobMonth} onChange={handleChange} style={{ width: '36%' }}>
                    <option value="">MM</option>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <select name="dobYear" className="form-control" value={formik.values.dobYear} onChange={handleChange} style={{ width: '32%' }}>
                    <option value="">YYYY</option>
                    {Array.from({ length: 70 }, (_, i) => new Date().getFullYear() - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                {formik.errors.dob && (<p className="field__message error-msg">{formik.errors.dob}</p>)}
              </div>
              <div className="col">
                <label className="d-block pb-2">Gender</label>
                <select name="gender" className="form-control" value={formik.values.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="notsay">Rather not say</option>
                </select>
                {formik.errors.gender && (<p className="field__message error-msg">{formik.errors.gender}</p>)}
              </div>
            </div>

            {/* Row: City + Country */}
            <div className="row mb-2">
              <div className="col">
                <label className="d-block pb-2">city</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formik.values.city}
                  onChange={handleChange}
                  className="form-control ps-2"
                />
                {formik.errors.city && (<p className="field__message error-msg">{formik.errors.city}</p>)}
              </div>
              <div className="col">
                <label className="d-block pb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  list="country-list"
                  placeholder="Country"
                  value={formik.values.country}
                  onChange={handleChange}
                  className="form-control ps-2"
                  autoComplete="off"
                />
                <datalist id="country-list">
                  {["India", "United States", "United Kingdom", "Canada", "Australia"].map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {formik.errors.country && (<p className="field__message error-msg">{formik.errors.country}</p>)}
              </div>
            </div>

            {/* Terms checkbox and submit */}
            <div className="form-group mb-2">
              <label style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 14 }}>
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
                <p className="field__message error-msg">{formik.errors.agreed}</p>
              )}
            </div>
            <div>
              <a href="/privacy-policy" className="tag-links"  target="_blank" rel="noopener noreferrer">Privacy Policy</a> and&nbsp;
              <a href="/terms-of-service" className="tag-links"  target="_blank" rel="noopener noreferrer">Terms of Service</a>.
            </div>
            <div className="login-btn mt-3">
              <button
                type="submit"
                className="py-2 submit-btn  border-radius w-100 d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                {loading ? (<ClipLoader color={"#fff"} loading={loading} size={25} />) : "Register"}
              </button>
            </div>

            {/* Already have an account */}
            <div className="col-12">
              <p className="mt-3 mb-0 text-center" style={{ fontSize: 14 }}>
                Already have an account?&nbsp;
                <Link to={publicRoutes.login} className="ms-1 custom-link">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
