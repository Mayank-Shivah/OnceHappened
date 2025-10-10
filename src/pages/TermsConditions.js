import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../components/ThemeProvider";
import SidebarRight from "../components/SidebarRight";
import BackButton from "../components/BackButton";
function TermsConditions() {
  const { theme } = useContext(ThemeContext);


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





  return (
    <div className={`main-layout ${theme}-theme`}>

      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>

          <main className="main-section-parent prive-main-sec">
            <div className="privacy-card d-flex align-items-center justify-content-between ">
              <div class="d-flex align-items-center">
                <BackButton />
                <h1 >Terms & Conditions  </h1>
              </div>

              <h1 > <span> (Update Date:- 10/08/2025)</span></h1>
            </div>

            <div className="policy-page">
              <p>
                Welcome to Once happened ("we", "us", "our"). By accessing or using our platform, you agree to comply with these Terms and Conditions. If you do not agree, please do not use the Service.
              </p>
              <h2>1) Using the Service:</h2>
              <ul>
                <li><b>Eligibility:</b> You must be 18+ to use the platform.</li>
                <li>
                  We reserve all rights to the design, layout, and visual appearance of the Once Happened website and services, as well as all content provided on the platform. You may not copy, modify, or reproduce any part of our code, graphics, logos, or other design elements without our explicit written permission. Please do not use our logo, trademarks, or other branding in a way that suggests endorsement, partnership, or affiliation with Once Happened.

                </li>
                <li>
                  <b>Account:</b> You are responsible for keeping your account information, including password, secure. We may suspend or terminate accounts that violate these Terms.

                </li>
                <li>
                  <b>Anonymous Posting: </b>  The platform is designed for anonymous reading and writing. For added anonymity, you cannot view your own posts in your profile, and your posts may not appear in your feed exactly as originally written. Posts may be edited by our editorial team according to our content policy to improve readability and adhere to platform standards.
                </li>
                <li>
                  <b>Account Deletion & Deactivation</b>  You can not delete your Once Happened account it will stay dormant till you re-login and the posts will not be deleted.
                </li>
                <li>
                  Your account name/email will not be visible on the platform and posts, but any posts you made may remain on the platform in an anonymized form to maintain high anonymity.
                </li>

              </ul>
              <h2>2) Content Ownership & License:</h2>
              <ul>
                <li><b>Content Submission:</b> Once you share content on this platform, it automatically becomes the property of <strong><a href="/" className="p-0">
                  oncehappened.com</a></strong>. Unauthorized use of this content may result in legal action.
                </li>
                <li><b>Editing & Moderation:</b>  Our team of editors may edit, enhance, or moderate your content to improve presentation, remove unpermitted words, and ensure it meets platform standards.
                </li>
                <li><b>License to Use:</b>  You grant us a perpetual, worldwide, royalty-free license to use, reproduce, distribute, display, and modify your content for the purpose of operating, promoting, and improving the Service.</li>


                <li><b>Copyright Infringement:</b>
                  <ul>
                    <li>Respect for Intellectual Property: You may only post content that you own or have permission to use. By submitting content to Once Happened, you confirm that it does not infringe on the copyright or other intellectual property rights of any third party.
                    </li>
                    <li>Notice & Takedown: If you believe your copyrighted work has been used without authorization, you may submit a copyright infringement notice to us at<strong> <a href="mailto:info@oncehappened.com" className="p-0">info@oncehappened.com</a>.</strong> The notice should include your contact information, a description of the copyrighted work, and a description of where the infringing material is located.</li>
                    <li>Your contact information.
                    </li>
                    <li>A description of the copyrighted work.
                    </li>
                    <li>
                      A description of the content you believe infringes your copyright.
                    </li>
                    <li>
                      A statement that you have a good-faith belief that the use is unauthorized.
                    </li>
                    <li>
                      A statement that the information in the notice is accurate and that you are the copyright owner or authorized to act on their behalf.
                    </li>
                    <li>Removal of Infringing Content: Once Happened reserves the right to remove any content that infringes copyrights or violates intellectual property rights, without prior notice.
                    </li>

                    <li>
                      Repeat Infringers: Users who repeatedly post infringing content may have their accounts suspended or terminated.

                    </li>
                  </ul>
                </li>
              </ul>
              <h2>3) User Responsibilities:</h2>
              <p class="ms-2">
                You agree not to post:
              </p>


              <ul>
                <li>
                  Illegal, harmful, violent or violent inciting or offensive content.
                </li>
                <li>
                  Profanity or swearing or bullying or making fun of people with disabilities, slurs, or other obscenities.
                </li>
                <li>
                  Advertising content about any product or service.
                </li>
                <li>
                  Content of sexual or erotic or pornographic nature.

                </li>
                <li>
                  Content that infringes any intellectual property or personal right of another party, including copyright, trademark, or privacy rights.
                </li>
                <li>
                  Content that infringes any intellectual property or personal right of another party, including copyright, trademark, or privacy rights.
                </li>
                <li>
                  Stereotypes , posts engaging in harassment and usage of racist, discriminatory, or hateful language/speech based on race, sex/gender, ethnicity, caste, creed, nationality, sexual orientation, religion, serious mental condition or disability etc.
                </li>
                <li>
                  Interfere with or disrupt the Service.
                </li>
                <li>
                  Self-harm / Dangerous Activities, Promoting suicide, self-harm, or dangerous challenges, Instructions for unsafe practices that could cause injury.
                </li>
                <li>
                  Spam / Misleading / Malicious Content, Advertising unrelated products/services, Fake news, scams, or phishing links, Malware or harmful software distribution. Links to sale purchase of Illegal drugs, prostituition, weapons etc.
                </li>
                <li>
                  Privacy Violations, Sharing private information of others (addresses, phone numbers, banking details any form of personal data) with or without consent.
                </li>
                <li>
                  Low-Quality / Irrelevant Content, Excessive repetition, filler posts, or content that doesn’t contribute to the platform’s purpose.
                </li>
              </ul>











              <p>
                If you want to post regarding the above list it should be conveyed in an educational context with a clear message.

              </p>

              <p>
                Posts that violate these rules may be removed or edited, and you can report by contacting customer support <strong><a href="mailto:info@oncehappened.com" className="p-0"> info@oncehappened.com</a></strong> and highlight what exactly you found to be offensive and what should be added in its place.
              </p>
              <h2>4) Payments & Subscriptions:</h2>
              <ul>
                <li>Subscription services (if applicable) are billed through a secure third-party payment processor.</li>
                <li>Refunds are handled according to the processor’s policy. (Embed link to providers website )</li>
                <li>The Once Happened platform is intended for your personal, non-commercial use only. You may not sell, resell, or provide access to the platform or its services in any form. You also may not use the platform or services for advertising, promoting, or marketing any goods, services, or other commercial ventures.</li>
              </ul>
              <h2>5) Moderation & Platform Standards:</h2>
              <p>
                Once Happened may change, suspend, or limit access to any part of the platform or services at any time, without prior notice. We reserve the right to remove any content you post or submit for any reason. Once Happened may access, review, preserve, and disclose information as reasonably necessary to:


              </p>
              <ul>
                <li>Comply with applicable laws, regulations, legal processes, or governmental requests.</li>
                <li> Enforce these Terms of Service, including investigating potential violations.</li>
                <li>
                  Detect, prevent, or address fraud, security issues, or technical problems.
                </li>
                <li>
                  Respond to user support requests.
                </li>
                <li>
                  Protect the rights, property, or safety of the platform, its users, and the public. <br /> Posts are moderated to maintain quality, readability, and adherence to community standards.The platform may remove or edit content at its discretion to comply with these standards.

                </li>

              </ul>
              <h2>6) Disclaimers & Limitation of Liability:</h2>
              <p>The platform is provided "as is" without warranties of any kind.

                We are not liable for any loss or damage arising from your use of the platform.
              </p>
              <h2>7) Privacy:</h2>
              <p>Your use of the Service is also governed by our <strong><a href="/privacy-policy" className="p-0">Privacy Policy</a></strong></p>
              <h2>8) Changes to Terms:</h2>
              <p>We may update these Terms from time to time. Continued use of the Service constitutes acceptance of the updated Terms.</p>
              <h2>9) Governing Law:</h2>
              <p>
                These Terms are governed by the laws of India. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in Chandigarh, India. We apply this same policy globally to all jurisdictions in which our Services are available.
              </p>
              <h2>10) Contact:</h2>
              <p>
                For questions about these Terms, contact us at <strong><a href="mailto:info@oncehappened.com" className="p-0">info@oncehappened.com</a></strong>
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
