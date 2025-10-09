import React from "react";
import "./LanguagePopup.scss";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
];

export default function LanguagePopup({ onSelect, onClose }) {
  return (
    <div className="language-popup-overlay" onClick={onClose}>
      <div className="language-popup" onClick={(e) => e.stopPropagation()}>
        <h3>Select Language</h3>
        <ul>
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button onClick={() => onSelect(lang.code)}>{lang.name}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
