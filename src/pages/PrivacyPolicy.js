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
            <div className="policy-page" >

              <p className="p-0">

                This Privacy Policy explains how Once Happened ("we", "us", "our") collects, uses, and shares information when you use our platform. It is designed to meet global standards and includes region‑specific disclosures for the European Economic Area/United Kingdom (GDPR) and California (CCPA/CPRA).
              </p>
              <p className="ps-0 p-0" >
                At Once Happened (“Once Happened.com,” “we,” or “us”), we are dedicated to protecting your privacy and keeping your information secure. We handle information about you in several ways. This Privacy Policy explains how we collect, use, disclose, and safeguard information that can identify you (“Personal Information”) when you create an Once Happened account and use oncehappened.com (the “Site”) or our mobile applications to post content to the Once Happened community platform , including stories you share (the “Services”).
              </p>
              <p className="ps-0" >
                Our terms of service apply to this Privacy Policy. By creating an account with Once Happened, using the Services, visiting the platform or submitting any Personal Information through the Services, you acknowledge that we will collect, use, and disclose your Personal Information as described in this Privacy Policy. This Policy also applies to the Service and any related communications or support channels.
              </p>
              <p className="ps-0" >
                If you do not agree with this policy and with the ways we use your Personal Information, you should discontinue use of the Services.
              </p>
              <p className="ps-0" >
                You can contact us at <a href="mailto:info@oncehappened.com" className="p-0 ps-1"> (info@oncehappened.com)
                </a>
              </p>
              <h2>Personal information:
              </h2>
              <p >
                Personal Information (sometimes called personal data) is: Any information that can be used to identify you as a person, either directly or indirectly.
              </p>
              <h2>
                    Examples of Personal Information:
              </h2>
              <ul>
                <li>Direct identifiers: your name, email address, phone number.</li>
                <li>Indirect identifiers: your IP address, device ID, or location (city/country).</li>
                <li>Demographic info: age, gender, date of birth.</li>
                <li>Financial info:  bank account number, credit card details, payment transaction details (though usually handled by secure processors) etc</li>
              </ul>
              <h2>Eligibility:</h2>
              <p>
                Our Services are intended for individuals 18 years of age or older. By creating an account, you confirm that you meet this age requirement.
              </p>
              <h2>Children’s privacy:</h2>
              <p>
                The Service is not directed to children under 18, and we do not knowingly collect personal information from children under 18.
              </p>
              <p>
                 If you are a parent/guardian and believe your child provided personal data, contact us <a href="mailto:info@oncehappened.com" className="ps-1">
                  (info@oncehappened.com)</a> to request deletion. Please be detailed what exactly you want to be removed in the query.
               
              </p>
              <p>
                 Where local law requires a higher age (e.g., 16 in some EEA countries), we rely on parental consent or deny service.
              </p>
              <h2> The information we collect:</h2>
              <p>
                We collect only what we need to operate the Service and give you best user experience:

               

              </p>
<h2>
   Account data (you provide):

               
</h2>
<ul>
  <li>
     Email address.
  </li>
  <li>
     Password.
  </li>
  <li>
     Date of birth.
  </li>
  <li>
     Country.
  </li>
  <li>
     City.
  </li>
  <li>
     Gender.
  </li>
  
</ul>
<h2>
  Technical & log data (collected automatically):

</h2>

              <p>
                IP address.<br/>
                Device identifiers (e.g., device ID, OS, app version, browser).<br/>
                Basic usage logs (date/time, pages/screens viewed, features used).<br/>

                Payments & subscriptions (via our payment processor):<br/>

                We use a third‑party payment processor to handle subscription payments. We receive limited billing metadata (e.g., transaction ID, status, plan, renewal dates) and do not receive full card numbers or bank details.
<br/>
                💡 Readers are advised to use their “Secondary email” (which is not your official/personal/primary email with which your financial or social media information is associated) as a “sign up/ login” email inorder to add an extra precautionary measure to your privacy as we care deeply for privacy and data protection of our users.
<br/>
                We do not intentionally collect special or sensitive categories of data (e.g., health, race, precise geolocation) and we do not profile users for targeted advertising.

              </p>
              <h2>Cookies and similar technologies:</h2>
              <p>
                We use only what is necessary to run the Service (e.g., authentication, load balancing, security). If we add analytics or other optional cookies, we will present a consent banner and controls. You can also manage cookies via your browser settings.
<br/>
                Global Privacy Control (GPC): If your browser sends a GPC or other recognized opt‑out preference signal, we will treat it as a valid request to opt out of any sale or sharing (if ever applicable).
<br/>
                Do Not Track (DNT): We respond to GPC signals; industry standards for DNT are not uniform, but we strive to honor widely adopted controls.

                .
              </p>
              <h2>How We Use Your Information:</h2>
              <p>
                Your information is used to:

                Create and manage your account.<br/>
                Identify you across the Services and enable posting, sharing, and reading.<br/>
                Personalize your experience on the platform, communicate with you and provide you with technical and customer support services.<br/>
                Process payments, manage subscriptions, display advertisements.<br/>
                Detect and prevent fraud or unauthorized use.<br/>
                Comply with legal requirements.<br/>
                Analyse statistics to better understand our users, improve our Services, and develop new features in future.<br/>

              </p>
              <h2>Why we use your data:</h2>
              <p>
                We use your personal information to provide, maintain, and improve the Once Happened Services safely and effectively. Specifically, your data helps us to:<br/>
                Create and Manage Accounts: Your email and password allow you to sign in and access your account securely.<br/>
                Provide and Improve Services: Your profile and demographic information (age, gender, location) help us personalize your experience. We can know our audience better and ensure quality content.<br/>
                Enable Story Sharing and Interaction: Your data allows you to post stories, share and interact with the community.<br/>
                Process Payments and Subscriptions: Payment information is securely handled through third-party processors to manage subscriptions.<br/>
                Security and Fraud Prevention: Device IDs, IP addresses, and login activity help us detect and prevent unauthorized access, abuse, or fraud.<br/>
                Legal and Regulatory Compliance: Some information may be used to comply with applicable laws or respond to legal requests.<br/>
                Communicate with You: We may use your email to send account-related notifications, subscription confirmations, or important updates about the platform.<br/>
                We also may use your Personal Information to enforce this Policy or our Terms of Service, to defend our legal rights and to comply with our legal obligations and internal policies.

              </p>
                    {isAuth && (
        <div className="text-center mt-4">
          <button
            onClick={handleDeleteAccount}
            className="btn btn-danger"
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
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
