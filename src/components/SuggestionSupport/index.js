import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faPhone,
  faCommentDots,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./style.scss";

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faCircleXmark} size="lg" />
        </button>
        <h2 className="modal-title">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

const getValidationSchema = (selectedCategory) =>
  Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, "Invalid phone number")
      .required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    category: Yup.string().required("Category is required"),
    message: Yup.string().required("Describe your issue is required"),
    customMessage:
      selectedCategory === "Other"
        ? Yup.string().required("Please enter details for Other")
        : Yup.string(),
  });

const SuggestionSupport = () => {
  const [openModal, setOpenModal] = useState(""); // "Suggestion" or "Support"
  const [selectedCategory, setSelectedCategory] = useState("");

  const initialValues = {
    name: "",
    phone: "",
    email: "",
    category: "",
    message: "",
    customMessage: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: getValidationSchema(selectedCategory),
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      alert(JSON.stringify(values, null, 2));
      resetForm();
      setOpenModal("");
      setSelectedCategory("");
    },
  });

  const supportOptions = [
    "Password Reset",
    "Payment & Subscription",
    "Content Related",
    "FAQs",
    "Other",
  ];

  return (
    <div className="support-container">
      <div className="support-header">
        <button
          className="outline-btn"
          onClick={() => setOpenModal("Suggestion")}
        >
          Suggestion
        </button>
        <button
          className="outline-btn"
          onClick={() => setOpenModal("Support")}
        >
         Type & Send Here.......
        </button>
      </div>

         <Modal open={openModal === "Suggestion"} onClose={() => setOpenModal("")} title="Suggestion">
        <form onSubmit={formik.handleSubmit}>
          <div className={`form-group ${formik.errors.name && formik.touched.name ? "error" : ""}`}>
            <label htmlFor="name">Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FontAwesomeIcon icon={faUser} className="input-icon" />
            </div>
            {formik.errors.name && formik.touched.name && (
              <p className="field__message error-msg">{formik.errors.name}</p>
            )}
          </div>
        
          <div className={`form-group ${formik.errors.email && formik.touched.email ? "error" : ""}`}>
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            </div>
            {formik.errors.email && formik.touched.email && (
              <p className="field__message error-msg">{formik.errors.email}</p>
            )}
          </div>
          <div className={`form-group ${formik.errors.message && formik.touched.message ? "error" : ""}`}>
            <label htmlFor="message">Your suggestion</label>
            <div className="input-wrapper">
              <textarea
                name="message"
                id="message"
                class="add-msg"
                placeholder="Your suggestion..."
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
              />
              <FontAwesomeIcon icon={faCommentDots} className="input-icon" />
            </div>
            {formik.errors.message && formik.touched.message && (
              <p className="field__message error-msg">{formik.errors.message}</p>
            )}
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </Modal>

      <Modal
        open={openModal === "Support"}
        onClose={() => {
          setOpenModal("");
          setSelectedCategory("");
          formik.resetForm();
        }}
        title="Support"
      >
        <form onSubmit={formik.handleSubmit}>
          {/* Name */}
          <div
            className={`form-group ${
              formik.errors.name && formik.touched.name ? "error" : ""
            }`}
          >
            <label htmlFor="name">Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FontAwesomeIcon icon={faUser} className="input-icon" />
            </div>
            {formik.errors.name && formik.touched.name && (
              <p className="field__message error-msg">{formik.errors.name}</p>
            )}
          </div>

          {/* Phone */}
          {/* <div
            className={`form-group ${
              formik.errors.phone && formik.touched.phone ? "error" : ""
            }`}
          >
            <label htmlFor="phone">Phone</label>
            <div className="input-wrapper">
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Enter phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FontAwesomeIcon icon={faPhone} className="input-icon" />
            </div>
            {formik.errors.phone && formik.touched.phone && (
              <p className="field__message error-msg">{formik.errors.phone}</p>
            )}
          </div> */}

          {/* Email */}
          <div
            className={`form-group ${
              formik.errors.email && formik.touched.email ? "error" : ""
            }`}
          >
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            </div>
            {formik.errors.email && formik.touched.email && (
              <p className="field__message error-msg">{formik.errors.email}</p>
            )}
          </div>

          {/* Category Select */}
          <div
            className={`form-group ${
              formik.errors.category && formik.touched.category ? "error" : ""
            }`}
          >
            <label htmlFor="category">Select category</label>
            <div className="input-wrapper">
               <select
              name="category"
              id="category"
              value={formik.values.category}
              onChange={(e) => {
                formik.handleChange(e);
                setSelectedCategory(e.target.value);
                // Clear message fields when category changes
                formik.setFieldValue("message", "");
                formik.setFieldValue("customMessage", "");
              }}
              onBlur={formik.handleBlur}
            >
              <option value="" disabled>
                --Choose an option--
              </option>
              {supportOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            </div>
           
            {formik.errors.category && formik.touched.category && (
              <p className="field__message error-msg">
                {formik.errors.category}
              </p>
            )}
          </div>
  {/* Show extra textarea ONLY if "Other" is selected */}
          {selectedCategory === "Other" && (
            <div
              className={`form-group ${
                formik.errors.customMessage && formik.touched.customMessage
                  ? "error"
                  : ""
              }`}
            >
              <label htmlFor="customMessage">
                Please provide additional details
              </label>
              <div className="input-wrapper">
                <textarea
                  name="customMessage"
                  id="customMessage"
                   class="add-msg"
                  placeholder="Enter additional details..."
                  value={formik.values.customMessage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={3}
                />
                <FontAwesomeIcon icon={faCommentDots} className="input-icon" />
              </div>
              {formik.errors.customMessage && formik.touched.customMessage && (
                <p className="field__message error-msg">
                  {formik.errors.customMessage}
                </p>
              )}
            </div>
          )}

          {/* Always visible Describe your issue */}
          <div
            className={`form-group ${
              formik.errors.message && formik.touched.message ? "error" : ""
            }`}
          >
            <label htmlFor="message">Describe your issue</label>
            <div className="input-wrapper">
              <textarea
                name="message"
                id="message"
                class="add-msg"
                placeholder="Describe your issue..."
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
              />
              <FontAwesomeIcon icon={faCommentDots} className="input-icon" />
            </div>
            {formik.errors.message && formik.touched.message && (
              <p className="field__message error-msg">{formik.errors.message}</p>
            )}
          </div>

        
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default SuggestionSupport;
