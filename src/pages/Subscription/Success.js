import React, { useEffect, useState } from "react";
import api from "../../api";
import Swal from "sweetalert2";
import "./success-cancel.scss";
import { FaDoorClosed } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";


export default function Success() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { fullUserData, loginUser } = useAuth();


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    // ✅ No session_id → redirect immediately
    if (!sessionId) {
      window.location.href = "/subscription";
      return;
    }

    (async () => {
      try {
        // ✅ Step 1: Verify session from Stripe
        const { data } = await api.get(`/verify-session?session_id=${sessionId}`);

        if (!data.isPaid) {
          // Swal.fire(" Payment Not Completed", "Your payment could not be verified.", "error");
          setErrorMsg("× Payment not completed.");
          setLoading(false);
          return;
        }

        // ✅ Step 2: Check if session already exists in DB
        const check = await api.get(`/check-session/${sessionId}`).catch(() => ({ data: { exists: false } }));

        if (check?.data?.exists) {
          // Already processed — show data instantly
          setSubscription(check.data.subscription);
          // setLoading(false); // <-- 🩵 important fix here
          return; // Stop here — no new SweetAlerts
        }

        // ✅ Step 3: Activate new subscription only once
        // Swal.fire({
        //   title: "✅ Payment Successful!",
        //   text: "Your subscription is being activated...",
        //   icon: "success",
        //   timer: 2000,
        //   showConfirmButton: false,
        // });

        const activate = await api.post("/purchase-subscription", {
          subscription_id: data.metadata.plan_id,
          paymentid: sessionId,
          amount: data.metadata.amount,
        });

        const newSub = {
          user_name: data.metadata.user_name,
          plan_name: data.metadata.plan_name,
          amount: data.metadata.amount,
          payment_id: sessionId,
          ...activate.data.subscription,
        };

        // ✅ Update local state
        setSubscription(newSub);

        // ✅ Merge and update localStorage userData
        const existing = JSON.parse(localStorage.getItem("userData") || "{}");
        const updatedUserData = {
          ...existing,
          subscription: newSub,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));

        // ✅ Also update AuthContext (for live reactivity)
        loginUser(updatedUserData);

        const mainParent = document.querySelector(".main-section-parent");
        if (mainParent) mainParent.classList.add("sub-main-padding");

        Swal.fire({
          title: "🎉 Subscription Activated!",
          text: "Enjoy all premium stories without ads.", 
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (err) {
        console.error("Verification error:", err);
        Swal.fire("Error!", "Something went wrong while verifying payment.", "error");
        setErrorMsg("Verification failed.");
      } finally {
        // ✅ Always turn off loader
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Show loader only when still processing
  // if (loading) {
  //   return (
  //     <div className="success-cancel-container text-center">
  //       <h2>⏳ Processing your payment...</h2>
  //       <p>Please wait while we confirm your subscription.</p>
  //     </div>
  //   );
  // }

  // ✅ Show error if payment failed
  if (errorMsg) {
    return (
      <div className="success-cancel-container text-center">
        <h2 className="cancel">× {errorMsg}</h2>
        <a href="/" className="btn-back">Go Back</a>
      </div>
    );
  }

  // ✅ Show subscription info
  return (
 <>
 <div class="main-container-success ">
     <div className="success-cancel-container">
      <div className="payment-success-box">
        <h2 className="success">🎉 Payment & Subscription Confirmed!</h2>
        <p>Thank you for subscribing to <strong class="logo-setyle">Once Happened</strong>.</p>

        <div className="subscription-details">
          <h4>Payment Details</h4>
          <ul>
            <li><span>Plan Name:</span> {subscription?.plan_name}</li>
            <li><span>Amount Paid:</span> ${subscription?.amount}</li>
            <li><span>Start Date:</span> {new Date(subscription?.start_date).toLocaleString()}</li>
            <li><span>End Date:</span> {new Date(subscription?.end_date).toLocaleString()}</li>
            <li><span>Status:</span> {subscription?.is_active ? "Active" : "Inactive"}</li>
          </ul>

          <h4>User Info</h4>
          <ul>
            <li><strong>User Name:</strong> {subscription?.user_name}</li>
          </ul>

          <div className="mt-3">
            <a href="/" className="btn-back">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
 </div>
 </>
  );
}
