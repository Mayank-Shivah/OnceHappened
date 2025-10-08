import React from "react";

import "./style.scss";
import BottomAd from "../BottomAdd";
import { useAuth } from "../../context/AuthContext";  // adjust path as needed



export default function Footer() {
    const { hasActiveSubscription } = useAuth();
  
  return (
    <footer className="">
     
    {!hasActiveSubscription && (
        <div class="bottom-ad-section site-footer">
          
          <BottomAd></BottomAd>
          </div>
     )}
      
    </footer>
  );
}

