import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "./success-cancel.scss";

export default function Cancel() {
  useEffect(() => {
    Swal.fire({
      title: "❌ Payment Canceled",
      text: "No worries — you can try again anytime.",
      icon: "warning",
      confirmButtonText: "Go Back",
    }).then(() => {
      window.location.href = "/";
    });
  }, []);

  return (
    <div className="success-cancel-container">
      <h2 className="cancel">❌ Payment Canceled</h2>
      <p>No worries — you can try again anytime.</p>
      <a href="/" className="btn-back">Go Back</a>
    </div>
  );
}
