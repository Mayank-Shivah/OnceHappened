import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../components/ThemeProvider";
import SidebarRight from "../components/SidebarRight";
import BackButton from "../components/BackButton";
import { useAuth } from "../context/AuthContext";  // adjust path as needed


function PrivacyPolicy() {
  const { theme } = useContext(ThemeContext);
     const { user: loggedInUser, isAuth, fullUserData, hasActiveSubscription } = useAuth();
  


  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]');

    if (!metaTag) {
      // Create it if it doesn’t exist
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "robots");
      document.head.appendChild(metaTag);
    }

    // Set the desired content
    metaTag.setAttribute("content", "noindex, nofollow");

    // Optional cleanup (restore or remove when leaving page)
    return () => {
      metaTag.setAttribute("content", "noindex, nofollow");
    };
  }, []);

  const handleDeleteAccount = async () => {
  const confirmation = window.confirm(
    "⚠️ Once you delete your account, all your data and posts will be permanently removed. You won’t be able to access this account in the future.\n\nDo you really want to delete your account?"
  );

  if (!confirmation) return; // User cancelled

  try {
    // Send delete request to your backend API
    const response = await fetch(`https://dashboard.oncehappened.com/api/delete-account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fullUserData?.token}`, // if using JWT
      },
      body: JSON.stringify({ userId: fullUserData?.id }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Your account has been permanently deleted.");
      // Log out user after deletion
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/"; // redirect to homepage
    } else {
      alert(result.message || "Failed to delete your account. Try again later.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
};




  return (
    <div className={`main-layout ${theme}-theme`}>

      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>

          <main className="main-section-parent prive-main-sec px-0">
            <div className="privacy-card d-flex align-items-center justify-content-between ">
              <div class="d-flex align-items-center">
                <BackButton />
                <h1 >Privacy Policy </h1>
              </div>

              <h1 > <span> (Update Date:- 10/08/2025)</span></h1>
            </div>
            <div className="policy-page">
              <p>
                This Privacy Policy explains how Once Happened ("we", "us", "our") collects, uses, and shares information when you use our platform. It is designed to meet global standards and includes region-specific disclosures for the European Economic Area/United Kingdom (GDPR) and California (CCPA/CPRA).
              </p>

              <p>
                At Once Happened (“Once Happened.com,” “we,” or “us”), we are dedicated to protecting your privacy and keeping your information secure. We handle information about you in several ways. This Privacy Policy explains how we collect, use, disclose, and safeguard information that can identify you (“Personal Information”) when you create an Once Happened account and use oncehappened.com (the “Site”) or our mobile applications to post content to the Once Happened community platform, including stories you share (the “Services”).
              </p>

              <p>
                Our terms of service apply to this Privacy Policy. By creating an account with Once Happened, using the Services, visiting the platform or submitting any Personal Information through the Services, you acknowledge that we will collect, use, and disclose your Personal Information as described in this Privacy Policy. This Policy also applies to the Service and any related communications or support channels.
              </p>

              <p>
                If you do not agree with this policy and with the ways we use your Personal Information, you should discontinue use of the Services.
              </p>

              <p>You can contact us at <a href="mailto:info@oncehappened.com" className="p-0">info@oncehappened.com</a>.</p>

              <h2>Personal information:</h2>
              <p>
                Personal Information (sometimes called personal data) is any information that can be used to identify you as a person, either directly or indirectly.
              </p>

              <h2>Examples of Personal Information:</h2>
              <ul>
                <li>Direct identifiers: your name, email address, phone number.</li>
                <li>Indirect identifiers: your IP address, device ID, or location (city/country).</li>
                <li>Demographic info: age, gender, date of birth.</li>
                <li>Financial info: bank account number, credit card details, payment transaction details (though usually handled by secure processors) etc.</li>
              </ul>

              <h2>Eligibility:</h2>
              <p>
                Our Services are intended for individuals 18 years of age or older. By creating an account, you confirm that you meet this age requirement.
              </p>

              <h2>Children’s privacy:</h2>
              <p>
                The Service is not directed to children under 18, and we do not knowingly collect personal information from children under 18.
                If you are a parent/guardian and believe your child provided personal data, contact us at
                <a href="mailto:info@oncehappened.com" className="ps-1"> info@oncehappened.com</a> to request deletion. Please be detailed about what exactly you want removed in the query.
                Where local law requires a higher age (e.g., 16 in some EEA countries), we rely on parental consent or deny service.
              </p>

              <h2>The information we collect:</h2>
              <p>
                We collect only what we need to operate the Service and give you the best user experience:
              </p>

              <h3>Account data (you provide):</h3>
              <ul>
                <li>Email address</li>
                <li>Password</li>
                <li>Date of birth</li>
                <li>Country</li>
                <li>City</li>
                <li>Gender</li>
              </ul>

              <h3>Technical & log data (collected automatically):</h3>
              <ul>
                <li>IP address</li>
                <li>Device identifiers (e.g., device ID, OS, app version, browser)</li>
                <li>Basic usage logs (date/time, pages/screens viewed, features used)</li>
              </ul>

              <h3>Payments & subscriptions (via our payment processor):</h3>
              <p>
                We use a third-party payment processor to handle subscription payments. We receive limited billing metadata (e.g., transaction ID, status, plan, renewal dates) and do not receive full card numbers or bank details.
              </p>
              <p>
                💡 Readers are advised to use their “Secondary email” (not your official/personal/primary email linked to financial or social accounts) for signup/login to add an extra layer of privacy.
              </p>

              <h2>Cookies and similar technologies:</h2>
              <p>
                We use only what is necessary to run the Service (e.g., authentication, load balancing, security). If we add analytics or optional cookies, we will present a consent banner and controls.
              </p>
              <p>
                Global Privacy Control (GPC): If your browser sends a GPC or other opt-out signal, we treat it as a valid request to opt out of any sale/sharing (if ever applicable).<br />
                Do Not Track (DNT): We respond to GPC signals and strive to honor widely adopted controls.
              </p>

              <h2>How We Use Your Information:</h2>
              <ul>
                <li>Create and manage your account</li>
                <li>Identify you across the Services</li>
                <li>Personalize your experience, communicate, and support</li>
                <li>Process payments, manage subscriptions, display ads</li>
                <li>Detect and prevent fraud or unauthorized use</li>
                <li>Comply with legal requirements</li>
                <li>Analyze statistics to improve our Services and develop new features</li>
              </ul>

              <h2>Why we use your data:</h2>
              <p>
                We use your personal information to provide, maintain, and improve the Once Happened Services safely and effectively. Your data helps us to:
              </p>
              <ul>
                <li>Create and Manage Accounts securely</li>
                <li>Provide and Improve Services for better experience</li>
                <li>Enable Story Sharing and Interaction</li>
                <li>Process Payments and Subscriptions securely</li>
                <li>Enhance Security and Fraud Prevention</li>
                <li>Ensure Legal and Regulatory Compliance</li>
                <li>Communicate with You for updates and account notifications</li>
              </ul>

              <h2>We process personal data for the following purposes:</h2>
              <div className="privacy-table-wrapper">
                <table className="privacy-table">
                  <thead>
                    <tr>
                      <th>Purpose</th>
                      <th>What data</th>
                      <th>Legal basis / Justification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Create and manage your account</td>
                      <td>Email, password</td>
                      <td>Contract (Art. 6(1)(b)) – to provide the Service</td>
                    </tr>
                    <tr>
                      <td>Provide the Service, personalize experience</td>
                      <td>Account &amp; technical data</td>
                      <td>Contract; Legitimate interests (Art. 6(1)(f))</td>
                    </tr>
                    <tr>
                      <td>Prevent fraud, secure accounts</td>
                      <td>IP, device ID, logs</td>
                      <td>Legitimate interests; Legal obligation</td>
                    </tr>
                    <tr>
                      <td>Subscription management and billing</td>
                      <td>Limited payment metadata</td>
                      <td>Contract; Legitimate interests</td>
                    </tr>
                    <tr>
                      <td>Communicate with you</td>
                      <td>Email</td>
                      <td>Contract; Legitimate interests</td>
                    </tr>
                    <tr>
                      <td>Comply with law</td>
                      <td>Relevant records</td>
                      <td>Legal obligation (Art. 6(1)(c)); Legitimate interests</td>
                    </tr>
                    <tr>
                      <td>Marketing (optional)</td>
                      <td>Email</td>
                      <td>Consent (Art. 6(1)(a)); can withdraw anytime</td>
                    </tr>
                  </tbody>
                </table>
              </div>



              <h2>For California residents:</h2>
              <p>We do not “sell” or “share” personal information and do not use sensitive personal info beyond security/authentication purposes.</p>

              <h2>How we share information:</h2>
              <ul>
                <li>Service providers/Processors (hosting, payments, support)</li>
                <li>Legal/compliance requests when required</li>
                <li>Business transfers (merger/acquisition)</li>
              </ul>
              <p>We do not sell personal information.</p>

              <h2>Data retention:</h2>
              <p>
                We keep data only as long as needed. Account data can be deleted by emailing <a href="mailto:info@oncehappened.com">info@oncehappened.com</a>. Deletion is irreversible. Billing records may be retained for legal compliance.
              </p>

              <h2>Your rights:</h2>
              <ul>
                <li>Access, correction, deletion, and portability (global)</li>
                <li>GDPR: access, rectification, erasure, restriction, objection</li>
                <li>CCPA/CPRA: access, correction, deletion, opt out</li>
              </ul>
              <p>
                To exercise rights, email <a href="mailto:info@oncehappened.com">info@oncehappened.com</a>.
              </p>

              <h2>Security:</h2>
              <p>
                We apply encryption, salted passwords, and access control measures. No system is 100% secure—please use a strong password and keep it confidential.
              </p>

              <h2>Third-party links:</h2>
              <p>
                Our Service may link to third-party sites (e.g., Stripe). Their policies apply independently.
              </p>

              <h2>Changes to this Policy:</h2>
              <p>
                We may update this Policy as needed and will notify users if required. Continued use means acceptance of updates.
              </p>

              <h2>Payment processing:</h2>
              <p>
                Payments are handled by Stripe. We do not store your full card details. Please see
                <a href="https://stripe.com/au/privacy" target="_blank" rel="noreferrer"> Stripe’s Privacy Policy</a>.
              </p>

              <h2>Contact us:</h2>
              <p>
                Email: <a href="mailto:info@oncehappened.com">info@oncehappened.com</a>
              </p>

              {isAuth && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleDeleteAccount}
                    className="btn btn-dangers"
                  
                  >
                    Delete My Account
                  </button>
                </div>
              )}
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
