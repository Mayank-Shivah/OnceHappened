import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./style.scss";

export default function SearchComponent() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ESC key close
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setValue("");
      }
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  const handleSearchClick = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 200);
      return;
    }

    // If open
    if (value.trim() === "") {
      setOpen(false);
    } else {
      console.log("SEARCH:", value); // 🔥 Your API call here
    }
  };

  return (
    <div className={`search-wrapper ${open ? "open" : ""}`} ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button type="button" onClick={handleSearchClick}>
        <FaSearch className="color-set" />
      </button>
    </div>
  );
}
