import React, { useContext } from "react";
import { ThemeContext } from "../components/ThemeProvider";
import SidebarRight from "../components/SidebarRight";
function TermsConditions() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`main-layout ${theme}-theme`}>

      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>

          <main className="main-section-parent p-0">
            <div className="privacy-card">
              <h1>Terms & Conditions <span> (Update Date:- 10/08/2025)</span></h1>
            </div>
            <div className="policy-page">
              <p>
                Welcome to our website. By accessing or using our site, you agree to comply with and be bound by the following terms and conditions.
              </p>
              <h2>1. Use of Website</h2>
              <p>
                You agree to use the website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the site.
              </p>
              <h2>2. Intellectual Property</h2>
              <p>
                All content, logos, and materials on the website are the intellectual property of the company and protected by applicable laws.
              </p>
              <h2>3. Limitation of Liability</h2>
              <p>
                We are not liable for any damages arising out of your use of the website.
              </p>
              <h2>4. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Your continued use of the website constitutes acceptance of any changes.
              </p>
              <h2>5. Contact Us</h2>
              <p>
                For any questions regarding these terms, please contact us at <a href="mailto:cs@oncehappend.com">cs@oncehappend.com</a>.
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

export default TermsConditions;
