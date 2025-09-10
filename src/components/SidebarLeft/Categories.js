import React, { useState } from "react";
import './style.scss';
import SidebarSearch from "../../components/SidebarSearch";
const categories = [
  { label: "Relationships" },
  { label: "Crime" },
  { label: "About Life" },
  { label: "Business" },
  { label: "Remote Learning" },
  { label: "Java" },
  { label: "Crypto Market" },
  { label: "Parenting" },
];

export default function SidebarLeft() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <aside className="sidebar-left-main">
      <div className="sidebar-title">Topics</div>
      <ul className="category-list">
        {categories.map((cat, idx) => (
          <li
            key={idx}
            className={`category-item ${activeIndex === idx ? "active-item" : ""}`}
            onClick={() => setActiveIndex(idx)}
          >
            <span className="cat-label">{cat.label}</span>
          </li>
        ))}
      </ul>
      <div className="pt-1">
        <SidebarSearch
          searchTerm={searchTerm}
          onSearchChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    </aside>
  );
}
