import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../components/ThemeProvider";
import SidebarRight from "../components/SidebarRight";
import BackButton from "../components/BackButton";
function ReturnPolicy() {
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

          <main className="main-section-parent prive-main-sec px-0">

            <div className="privacy-card d-flex align-items-center justify-content-between ">
              <div class="d-flex align-items-center">
                <BackButton />
                <h1 >Return Policy</h1>
              </div>

              <h1 > <span> (Update Date:- 10/08/2025)</span></h1>
            </div>
            <div className="policy-page">
              <h4 className="mb-3">
                Contact Email: <a href="mailto:info@oncehappened.com" className="p-0">
                  info@oncehappened.com
                </a>
              </h4>
              <h2>
                1. Overview

              </h2>
              <p>
                At Once Happened, we aim to maintain fairness, clarity, and transparency in all financial transactions. This policy outlines how we handle payments, subscriptions, billing, and refunds for all users who access premium features or paid services through our platform.
                All payments on our platform are processed securely via Stripe, our authorized payment processor.
              </p>
              <h2>2. Payments and Billing
              </h2>
              <div className="accepted-sec">
                <h3>
                  2.1 Accepted Payment Methods
                </h3>
                <p>
                  We accept all major debit and credit cards and any other payment methods supported by Stripe in your region.
                </p>
                <h3>
                  2.2 Secure Processing
                </h3>
                <p>
                  Stripe handles all payment information in compliance with PCI DSS standards.

                  We do not store your complete card details on our servers.

                  Your payment information is encrypted and transmitted directly to Stripe’s secure infrastructure.
                </p>
                <h3>
                  2.3 Subscription Billing
                </h3>
                <p>
                  When you subscribe to a paid plan, the subscription automatically renews at the end of each billing cycle (monthly or yearly), unless canceled before the renewal date.
                  You authorize Once Happened (via Stripe) to charge the payment method associated with your account for each renewal period.
                </p>
                <h3>
                  2.4 Price Changes
                </h3>
                <p>
                  We may modify subscription prices occasionally.
                  If prices change, we’ll notify you in advance, and the new rates will apply from your next billing cycle unless you cancel beforehand.
                </p>

                <h3>
                  2.5 Taxes
                </h3>
                <p>
                  Prices shown on our website may or may not include applicable taxes (e.g., VAT, GST).
                  Taxes are calculated automatically based on your billing address and added during checkout if required by law.
                </p>

              </div>

              <h2>3. Subscription Management</h2>
              <div className="accepted-sec">
                <h3>
                  3.1 Cancelling a Subscription
                </h3>
                <p>
                  You can cancel your subscription anytime through your account settings or by using the Stripe billing portal link provided in your email receipts.

                  Cancelling stops future renewals but does not automatically refund past payments.

                  After cancellation, you will retain access to premium features until the end of your current billing cycle.

                </p>
                <h3>
                  3.2 Failed Payments
                </h3>
                <p>
                  If a payment fails, Stripe will retry the charge automatically for a limited period.

                  If payment remains unsuccessful, your subscription may be suspended or downgraded to a free plan until valid payment details are provided.

                </p>
              </div>

              <h2>
                4. Refund Policy
              </h2>
              <div className="accepted-sec">
                <h3>
                  4.1 General Refund Terms
                </h3>
                <p>
                  As our platform provides instant digital access to story-sharing features and premium tools, all payments are generally non-refundable once access has been granted.
                  However, we may grant refunds in exceptional cases such as:
                </p>
                <ol>
                  <li>
                    Duplicate or accidental charges.
                  </li>
                  <li>
                    Technical issues preventing access to premium features.
                  </li>
                  <li>
                    Unauthorized transactions verified through Stripe’s dispute process.
                  </li>
                  <li>
                    Other extenuating circumstances at our discretion.
                  </li>
                </ol>
              </div>

              <h2>4.2 Requesting a Refund</h2>
              <p>
                To request a refund:

                Contact us at <a href="mailto:info@oncehappened.com" className="ps-1">info@oncehappened.com
                </a>  within 7 days of your transaction.

                Provide your registered email, transaction ID, payment date, and reason for the request.

                We may require additional information to verify your identity.
              </p>
              <h2>4.3 Refund Processing</h2>
              <p>
                Approved refunds are processed via Stripe to the same payment method used for the original transaction.

                Refunds typically take 5–10 business days to appear, depending on your bank or card issuer.

                Stripe’s transaction fees may not be refundable in all cases.

              </p>
              <h2>4.4 Non-Refundable Situations</h2>
              <p>
                Refunds are not issued for:
              </p>
              <ul>



                <li>Change of mind or personal dissatisfaction.</li>

                <li>Content-related preferences.</li>
                <li>Accounts terminated for violating our Terms of Service.</li>

                Misuse or fraudulent activities.
              </ul>
              <h2>5. Chargebacks and Disputes</h2>
              <p>
                If you notice a charge you believe is incorrect or unauthorized, please contact us first at <a href="mailto:info@oncehappened.com"className="ps-1"> info@oncehappened.com

                </a> before initiating a chargeback.
                We will investigate and resolve your concern as quickly as possible.
              </p>
              <p>
                Unjustified chargebacks may lead to account suspension or additional dispute-related fees from Stripe.

              </p>
              <h5>
                6. Policy Updates
              </h5>
              <p>
                We may update this Refund, Payments, and Billing Policy occasionally to reflect changes in our operations, payment processor terms, or legal requirements.

Any updates will be posted here with an updated Effective Date.

              </p>
              <h5>
                7. Contact Us
              </h5>
              <p>
                If you have questions about this policy or need help with billing, please reach out to us at:
<a href="mailto:info@oncehappened.com" className="ps-1">
   info@oncehappened.com
</a>

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

export default ReturnPolicy;
