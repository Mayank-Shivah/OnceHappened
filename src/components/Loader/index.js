import React from "react";
import "./loader.scss";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="loader-overlay" role="status" aria-live="polite" aria-label={message}>
      <div className="spinner"></div>
      <div className="loader-message" style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, 50%)",
        color: "#fff", // Adjust to match your theme/SCSS
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        zIndex: 2 // Ensure it's above spinner if needed
      }}>
        {message}
      </div>
    </div>
  );
}
