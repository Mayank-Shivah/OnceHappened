import React, { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ThemeContext } from "../../components/ThemeProvider";
import SidebarRight from "../../components/SidebarRight";
import api from "../../api";
import { loggedUser } from "../../services/authService";
import { toast } from "react-toastify";   
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.scss";

function SupportSuggestion() {
  const { theme } = useContext(ThemeContext);

  // Logged-in user (sent invisibly to APIs)
  const user = loggedUser();
  const userId = user?.id ?? null;
  const userName = user?.name || "";
  const userEmail = user?.email || "";

  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // 🔹 Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/support-category"); // your API endpoint
        if (res.data?.status && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err.response?.data || err.message);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Fetch FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get("/faqs"); // Laravel API
        if (res.data?.status && Array.isArray(res.data.data)) {
          const formattedFaqs = res.data.data.map((faq) => ({
            question: faq.title,
            answer: faq.description,
          }));
          setFaqs(formattedFaqs);
        }
      } catch (err) {
        console.error("Failed to load FAQs:", err.response?.data || err.message);
      }
    };
    fetchFaqs();
  }, []);

  /* ===================== Suggestion ===================== */
  const suggestionForm = useFormik({
    initialValues: { sugMessage: "" },
    validationSchema: Yup.object({
      sugMessage: Yup.string().required("Please describe your suggestion"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setSubmitting(true);
        const description = values.sugMessage.trim();

        await api.post("/submit-suggestion", {
          name: userName,
          email: userEmail,
          description,
          user_id: userId,
        });

        toast.success("Suggestion submitted successfully!");
        resetForm();
      } catch (err) {
        console.error("Suggestion submit error:", err.response?.data || err.message);
        toast.error("Error while submitting suggestion. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* =========================== Support =========================== */
  const supportForm = useFormik({
    initialValues: { supCategory: "", supOther: "", supMessage: "" },
    validationSchema: Yup.object({
      supCategory: Yup.string().required("Please select a category"),
      supOther: Yup.string().when("supCategory", {
        is: "other",
        then: (s) => s.required("Please provide details for 'Other'"),
        otherwise: (s) => s,
      }),
      supMessage: Yup.string().required("Please describe your issue"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setSubmitting(true);
        const support_id = values.supCategory; // ✅ now the ID from API
        const description = values.supMessage.trim();

        await api.post("/submit-issue", {
          support_id,
          name: userName,
          email: userEmail,
          description,
        });

        toast.success("Support issue submitted successfully!");
        resetForm();
      } catch (err) {
        console.error("Support submit error:", err.response?.data || err.message);
        toast.error("Error while submitting issue. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={`main-layout ${theme}-theme`}>
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
          <main className="main-section-parent">
            {/* =============== Suggestion Section =============== */}
            <div className="ss-content-section">
              <div className="details-section">
                <h4>Suggestion</h4>
                <p>What type of content, new topics & website features should we add?</p>

                <form onSubmit={suggestionForm.handleSubmit} noValidate>
                  <div className="form-group mb-2">
                    <label htmlFor="sugMessage" className="form-label">
                      Describe your suggestion
                    </label>
                    <textarea
                      id="sugMessage"
                      name="sugMessage"
                      className={`form-control add-msg ${
                        suggestionForm.touched.sugMessage && suggestionForm.errors.sugMessage
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Your suggestion..."
                      rows={2}
                      onChange={suggestionForm.handleChange}
                      onBlur={suggestionForm.handleBlur}
                      value={suggestionForm.values.sugMessage}
                    />
                    {suggestionForm.touched.sugMessage &&
                      suggestionForm.errors.sugMessage && (
                        <div className="invalid-feedback d-block">
                          {suggestionForm.errors.sugMessage}
                        </div>
                      )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-custom"
                    disabled={suggestionForm.isSubmitting}
                  >
                    {suggestionForm.isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>

            {/* ============================ Support ============================ */}
            <div className="ss-content-section">
              <div className="details-section">
                <h4>
                  Customer-Support :-{" "}
                  <a href="mailto:cs@oncehappend.com">cs@oncehappend.com</a>
                </h4>

                <form onSubmit={supportForm.handleSubmit} noValidate>
                  <div className="form-group mb-2">
                    <label htmlFor="supCategory" className="form-label">Select category</label>
                    <select
                      id="supCategory"
                      name="supCategory"
                      className={`form-control ${
                        supportForm.touched.supCategory && supportForm.errors.supCategory
                          ? "is-invalid"
                          : ""
                      }`}
                      value={supportForm.values.supCategory}
                      onChange={supportForm.handleChange}
                      onBlur={supportForm.handleBlur}
                    >
                      <option value="" disabled>--Choose an option--</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                    {supportForm.touched.supCategory &&
                      supportForm.errors.supCategory && (
                        <div className="invalid-feedback">
                          {supportForm.errors.supCategory}
                        </div>
                      )}
                  </div>

                  {supportForm.values.supCategory === "other" && (
                    <div className="mb-2">
                      <label htmlFor="supOther" className="form-label">Additional details</label>
                      <textarea
                        id="supOther"
                        name="supOther"
                        rows={1}
                        className={`form-control ${
                          supportForm.touched.supOther && supportForm.errors.supOther
                            ? "is-invalid"
                            : ""
                        }`}
                        value={supportForm.values.supOther}
                        onChange={supportForm.handleChange}
                        onBlur={supportForm.handleBlur}
                      />
                      {supportForm.touched.supOther &&
                        supportForm.errors.supOther && (
                          <div className="invalid-feedback">
                            {supportForm.errors.supOther}
                          </div>
                        )}
                    </div>
                  )}

                  <div className="form-group mb-2">
                    <label htmlFor="supMessage" className="form-label">Describe your issue</label>
                    <textarea
                      id="supMessage"
                      name="supMessage"
                      className={`form-control add-msg ${
                        supportForm.touched.supMessage && supportForm.errors.supMessage
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Describe your issue..."
                      rows={1}
                      onChange={supportForm.handleChange}
                      onBlur={supportForm.handleBlur}
                      value={supportForm.values.supMessage}
                    />
                    {supportForm.touched.supMessage &&
                      supportForm.errors.supMessage && (
                        <div className="invalid-feedback d-block">
                          {supportForm.errors.supMessage}
                        </div>
                      )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-custom"
                    disabled={supportForm.isSubmitting}
                  >
                    {supportForm.isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>

            {/* ============================= FAQ ============================= */}
            <div className="ss-content-section">
              <div className="details-section">
                <div className="main-accordion-section">
                  <h3>Frequently Asked Questions:</h3>

                  {faqs.length > 0 ? (
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
                  ) : (
                    <div>No FAQs added yet.</div>
                  )}
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
