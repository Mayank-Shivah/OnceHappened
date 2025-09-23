// src/components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton({ label = "Go Back" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="back-btn"
    >
 <FaArrowLeft style={{ marginRight: "6px" }} />
    </button>
  );
}
