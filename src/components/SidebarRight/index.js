import React, { useState } from "react";
import "./style.scss";

export default function SidebarRight() {
  // Simulate trial status (false = still free trial, true = trial ended)
  const [trialEnded, setTrialEnded] = useState(false);

  return (
    <aside className="sidebar-right">
      {/* Advertisement or trial messages */}
      {!trialEnded ? (
        <div className="ad-section">
          <div className="ad-card">
            <img
              src="/images/63fc8a1dec3611677494813.png"
              alt="Black Friday Special Offer"
              className="ad-image"
            />
            {/* <button className="ad-btn">Buy Now</button> */}
            <img
             src="/images/63fc8a0517f821677494789.png"
              alt="Gold Investment"
              className="ad-image bottom-image d-none d-md-block"
            />
          </div>
         
          <div className="ad-card">
            <img
              src="/images/bluet.png"
              alt="Wati Ad"
              className="ad-image d-none d-md-block"
            />
            {/* <button className="ad-btn dark">Sign Up</button> */}
          </div>
          {/* <div className="ad-card">
           <img src="/images/340x215-12.jpg" alt="Wati Ad" className="ad-image" />

            <button className="ad-btn dark">Sign Up</button>
          </div> */}
          <div className="ad-label d-none d-md-block">Advertisement</div>
          {/* Button to simulate trial completion for demo */}
        <div className="trials-sece d-none d-md-block">
            <button onClick={() => setTrialEnded(true)} className="trial-complete-btn">
            Simulate Trial Complete
          </button>
        </div>
        </div>
      ) : (
        <div className="trial-ended-message d-none d-md-block">
          <strong>Your free trial has ended.</strong>
        </div>
      )}
    </aside>
  );
}

