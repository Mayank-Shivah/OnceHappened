import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTelegram } from "react-icons/fa";

export default function ShareModal({ url, onClose }) {
  const handleCopy = () => {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern way
    navigator.clipboard.writeText(url)
      .then(() => alert("Link copied!"))
      .catch((err) => alert("Failed to copy link"));
  } else {
    // Fallback for insecure context or older browsers
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed"; // avoid scrolling
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert("Link copied!");
    } catch (err) {
      alert("Failed to copy link");
    }
    document.body.removeChild(textArea);
  }
};

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Share this link via</h3>
        
        <div className="social-icons">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noreferrer">
            <FaFacebook size={28} color="#3B5998" />
          </a>
          {/* <a href={`https://www.instagram.com/?url=${url}`} target="_blank" rel="noreferrer">
            <FaInstagram size={28} color="#e4405f" />
          </a> */}
          <a href={`https://wa.me/?text=${url}`} target="_blank" rel="noreferrer">
            <FaWhatsapp size={28} color="#25d366" />
          </a>
          {/* <a href={`https://t.me/share/url?url=${url}`} target="_blank" rel="noreferrer">
            <FaTelegram size={28} color="#0088cc" />
          </a> */}
        </div>

        <div className="copy-link">
          <input type="text" value={url} readOnly />
          <button onClick={handleCopy}>Copy</button>
        </div>
      </div>
    </div>
  );
}
