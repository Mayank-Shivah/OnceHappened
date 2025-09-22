import React, { useContext } from "react";
import { ThemeContext } from "../components/ThemeProvider";
import SidebarRight from "../components/SidebarRight";
function PrivacyPolicy() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`main-layout ${theme}-theme`}>

      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>

          <main className="main-section-parent p-0">
            <div className="privacy-card">
              <h1 >Privacy Policy <span> (Update Date:- 10/08/2025)</span></h1>
            </div>
            <div className="policy-page" >

              <p>
                Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website.
              </p>
              <h2>Information We Collect</h2>
              <p>
                We collect information you provide directly to us such as name, email address, phone number, and any other details you enter into our forms.
              </p>
              <h2>How We Use Information</h2>
              <p>
                We use the information to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.
              </p>
              <h2>Sharing Information</h2>
              <p>
                We do not sell or rent your personal information. We may share information with trusted service providers as necessary to operate our business.
              </p>
              <h2>Security</h2>
              <p>
                We implement reasonable security measures to protect your information from unauthorized access and disclosure.
              </p>
              <h2>Cookies</h2>
              <p>
                Our website uses cookies to enhance user experience. You can control cookie preferences through your browser settings.
              </p>
              <h2>Your Choices</h2>
              <p>
                You may update or delete your personal information by contacting us at <a href="mailto:cs@oncehappend.com">cs@oncehappend.com</a>.
              </p>
              <h2>Changes to this Privacy Policy</h2>
              <p>
                We may update this policy from time to time. We encourage you to review this page periodically for any changes.
              </p>
              <h2>Contact Us</h2>
              <p>
                For any questions about this policy, please reach out at <a href="mailto:cs@oncehappend.com">cs@oncehappend.com</a>.
              </p>
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

export default PrivacyPolicy;
