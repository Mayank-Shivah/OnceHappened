import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTelegram } from "react-icons/fa";

export default function ShareModal({ url, onClose }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Share this link via</h3>
        
        <div className="social-icons">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noreferrer">
            <FaFacebook size={28} color="#1877f2" />
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
