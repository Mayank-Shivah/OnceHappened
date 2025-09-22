import React, { useState, useEffect } from "react";
import "./style.scss";
import SidebarSearch from "../../components/SidebarSearch";
import api from "../../api";

export default function Categories({ onCategorySelect, selectedCategory, onSearch }) {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/topics");
        const topics = res.data?.topics || [];
        setCategories(topics);

        // auto select first category if not already selected
        if (topics.length > 0 && !selectedCategory && onCategorySelect) {
          onCategorySelect(topics[0].id);
        }
      } catch (err) {
        console.error("Failed to load categories:", err.response?.data || err.message);
      }
    };
    fetchCategories();
  }, [onCategorySelect, selectedCategory]);

  // handle search input change -> send to parent for posts filtering
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <aside className="sidebar-left-main">
      <div className="sidebar-title">Topics</div>
      <ul className="category-list">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <li
              key={cat.id}
              className={`category-item ${selectedCategory === cat.id ? "active-item" : ""}`}
              onClick={() => onCategorySelect && onCategorySelect(cat.id)}
              style={{ cursor: "pointer" }}
            >
              <span className="cat-label">{cat.name}</span>
            </li>
          ))
        ) : (
          <li className="category-item">
            <span className="cat-label">No Category Listed</span>
          </li>
        )}
      </ul>
      <div className="">
        <SidebarSearch
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange} // 🔑 sends search to parent
        />
      </div>
    </aside>
  );
}
