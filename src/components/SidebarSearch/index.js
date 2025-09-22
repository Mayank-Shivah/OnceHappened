import React from "react";

export default function SidebarSearch({ searchTerm, onSearchChange, placeholder = "Search topic..." }) {
    return (
        <div className="sidebar-search">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={searchTerm}
                onChange={onSearchChange}
            />
            <span className="search-icon">
                {/* SVG magnifier icon */}
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <circle cx="7" cy="7" r="6" stroke="black" strokeWidth="1" fill="none" />
                    <line x1="11" y1="11" x2="15" y2="15" stroke="black" strokeWidth="1" />
                </svg>
            </span>
        </div>
    );
}
