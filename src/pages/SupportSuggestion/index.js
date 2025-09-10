import React, { useContext } from "react";
import { useFormik } from "formik";
import SuggestionSupport from "../../components/SuggestionSupport";
import { ThemeContext } from "../../components/ThemeProvider";
import SidebarRight from "../../components/SidebarRight";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.scss';

function SupportSuggestion() {
  const { theme } = useContext(ThemeContext);

  const faqs = [
    {
      question: "Can I change my payment method after placing an order?",
      answer:
        "Unfortunately, once an order is confirmed, the payment method cannot be changed. You would need to cancel and reorder if changes are needed.",
    },
    // Add more FAQs as needed
  ];

  const formik = useFormik({
    initialValues: {
      email: "",
      category: "",
      suggestion: "",
      message: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.category) {
        errors.category = "Please select a category";
      }
      if (values.category === "Other" && !values.suggestion) {
        errors.suggestion = "Please enter a suggestion for 'Other' category";
      }
      if (!values.message) {
        errors.message = "Please describe your issue";
      }
      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      alert("Form Submitted: " + JSON.stringify(values, null, 2));
      resetForm();
    },
  });

  return (
    <div className={`main-layout ${theme}-theme`}>
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
          <main className="main-section-parent">
            {/* <SuggestionSupport /> */}

            <div className="ss-content-section">
              <div className="details-section">
                <h4>Suggestion</h4>
                <p>What type of content, new topics & website features should we add?</p>

                <form onSubmit={formik.handleSubmit} noValidate>              

                  {/* Category Select */}
                  <div className="form-group mb-2">
                    <label htmlFor="category" className="form-label">Select category</label>
                    <select
                      id="category"
                      name="category"
                      className={`form-control ${formik.touched.category && formik.errors.category ? "is-invalid" : ""}`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.category}
                    >
                      <option value="" disabled>
                        --Choose an option--
                      </option>
                      <option value="Password Reset">Password Reset</option>
                      <option value="Payment & Subscription">Payment & Subscription</option>
                      <option value="Content Related">Content Related</option>
                      <option value="FAQs">FAQs</option>
                      <option value="Other">Other</option>
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <div className="invalid-feedback">{formik.errors.category}</div>
                    )}
                  </div>

                  {/* Conditionally show Other Suggestion textarea */}
                  {formik.values.category === "Other" && (
                    <div className="mb-2">
                      <label htmlFor="suggestion" className="form-label">Other Suggestion</label>
                      <textarea
                        id="suggestion"
                        name="suggestion"
                        className={`form-control ${formik.touched.suggestion && formik.errors.suggestion ? "is-invalid" : ""}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.suggestion}
                        rows={1}
                      />
                      {formik.touched.suggestion && formik.errors.suggestion && (
                        <div className="invalid-feedback">{formik.errors.suggestion}</div>
                      )}
                    </div>
                  )}

                  {/* Message textarea with icon */}
                  <div className="form-group mb-2">
                    <label htmlFor="message" className="form-label">Describe your suggestion</label>
                    <div className="input-wrapper position-relative">
                      <textarea
                        id="message"
                        name="message"
                        className={`form-control add-msg ${formik.touched.message && formik.errors.message ? "is-invalid" : ""}`}
                        placeholder="Describe your issue..."
                        rows={2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.message}
                      />
                      <svg
                        data-prefix="fas"
                        data-icon="comment-dots"
                        className="svg-inline--fa fa-comment-dots input-icon position-absolute"
                        role="img"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                        style={{ right: "10px", top: "10px", pointerEvents: "none", width: "20px", height: "20px", color: "#888" }}
                      >
                        <path fill="currentColor" d="M256 480c141.4 0 256-107.5 256-240S397.4 0 256 0 0 107.5 0 240c0 54.3 19.2 104.3 51.6 144.5L2.8 476.8c-4.8 9-3.3 20 3.6 27.5s17.8 9.8 27.1 5.8l118.4-50.7C183.7 472.6 218.9 480 256 480zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                      </svg>
                      {formik.touched.message && formik.errors.message && (
                        <div className="invalid-feedback d-block">{formik.errors.message}</div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-custom">
                    Submit Suggestion
                  </button>
                </form>
              </div>
            </div>
  <div className="ss-content-section">

              <div className="details-section">

                <h4>

                  Customer-Support :- <a href="mailto:cs@oncehappend.com">cs@oncehappend.com</a>

                </h4>

               

                <form onSubmit={formik.handleSubmit}>

                  {/* Message textarea with icon */}

                  <div className="form-group mb-2">

                    <label htmlFor="message" className="form-label">Describe your issue</label>

                    <div className="input-wrapper position-relative">

                      <textarea

                        id="message"

                        name="message"

                        className={`form-control add-msg ${formik.touched.message && formik.errors.message ? 'is-invalid' : ''}`}

                        placeholder="Describe your issue..."

                        rows={1}

                        onChange={formik.handleChange}

                        onBlur={formik.handleBlur}

                        value={formik.values.message}

                      />

                      <svg

                        data-prefix="fas"

                        data-icon="comment-dots"

                        className="svg-inline--fa fa-comment-dots input-icon position-absolute"

                        role="img"

                        viewBox="0 0 512 512"

                        aria-hidden="true"

                        style={{ right: '10px', top: '10px', pointerEvents: 'none', width: '20px', height: '20px', color: '#888' }}

                      >

                        <path fill="currentColor" d="M256 480c141.4 0 256-107.5 256-240S397.4 0 256 0 0 107.5 0 240c0 54.3 19.2 104.3 51.6 144.5L2.8 476.8c-4.8 9-3.3 20 3.6 27.5s17.8 9.8 27.1 5.8l118.4-50.7C183.7 472.6 218.9 480 256 480zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />

                      </svg>

                      {formik.touched.message && formik.errors.message && (

                        <div className="invalid-feedback d-block">{formik.errors.message}</div>

                      )}

                    </div>

                  </div>



             



                  <button type="submit" className="btn btn-custom">

                    Submit

                  </button>

                </form>

              </div>

            </div>

            <div className="ss-content-section">
              <div className="details-section">
                <div className="main-accordion-section">
                  <h3>Frequently Asked Questions:</h3>
                  <div className="accordion" id="faqAccordion">
                    {faqs.map((faq, index) => (
                      <div className="accordion-item" key={index}>
                        <h2 className="accordion-header" id={`heading${index}`}>
                          <button
                            className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                            aria-expanded={index === 0 ? "true" : "false"}
                            aria-controls={`collapse${index}`}
                          >
                            {faq.question}
                          </button>
                        </h2>
                        <div
                          id={`collapse${index}`}
                          className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                          aria-labelledby={`heading${index}`}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body">{faq.answer}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <div className="d-block d-md-none">
            <SidebarRight />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportSuggestion;
