import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api";

export default function Success() {
  const [msg, setMsg] = useState("Checking your payment...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setMsg("No session ID found.");
      return;
    }

    (async () => {
      try {
        // 1️⃣ Verify payment from Node backend
        const { data } = await axios.get(
          `http://localhost:5000/verify-session?session_id=${sessionId}`
        );

        if (data.isPaid) {
          setMsg("✅ Payment successful! Activating subscription...");
          console.log(data);

          // 2️⃣ Call Laravel API to update DB
          //await api.post("/purchase-subscription", {
            //subscription_id: data.metadata.subscriptionId, // Laravel package id
            //paymentid: data.stripe_subscription_id,       // Stripe subscription id
            //amount: data.metadata.amount || data.amount_total / 100,
          //});

          //setMsg("🎉 Subscription activated/renewed! Enjoy all posts.");
        } else {
          setMsg("❌ Payment not completed.");
        }
      } catch (err) {
        console.error("Purchase error:", err.response?.data || err.message);
        setMsg("Error verifying payment.");
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2>{msg}</h2>
    </div>
  );
}
