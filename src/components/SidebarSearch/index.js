import React, { useRef } from "react";

export default function SidebarSearch({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onClear,
  placeholder = "Search topic..."
}) {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    inputRef.current.blur(); // hide keyboard (mobile)
    onSearchSubmit?.(searchTerm);
  };

  return (
    <form className="sidebar-search" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {searchTerm ? (
        <button
          type="button"
          className="clear-btn"
          onClick={onClear}
        >
          ×
        </button>
      ) : (
        <span className="search-icon">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="7" cy="7" r="6" stroke="black" strokeWidth="1" fill="none" />
            <line x1="11" y1="11" x2="15" y2="15" stroke="black" strokeWidth="1" />
          </svg>
        </span>
      )}
    </form>
  );
}
