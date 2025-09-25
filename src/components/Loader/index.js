import React, { useState, useEffect } from "react";
import "./loader.scss";

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
    </div>
  );
}