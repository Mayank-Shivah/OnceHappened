import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "./success-cancel.scss";

export default function Cancel() {
  

  return (
   <>
   <div className="main-container-success">
     <div className="success-cancel-container cancel-main-section">
      <h2 className="cancel">Payment Canceled</h2>
      <p>No worries — you can try again anytime.</p>
      <a href="/" className="btn-back">Go Back</a>
    </div>
   </div>
   
   </>
  );
}
