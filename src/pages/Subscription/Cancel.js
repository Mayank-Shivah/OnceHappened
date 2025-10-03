import React from "react";
import "./success-cancel.scss";

export default function Cancel() {
  return (
    <div className="success-cancel-container">
      <h2 className="cancel">❌ Payment Canceled</h2>
      <p>No worries — you can try again anytime.</p>
      <a href="/" className="btn-back">Go Back</a>
    </div>
  );
}
