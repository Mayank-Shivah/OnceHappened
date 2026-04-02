import React, { useState, useEffect } from "react";
import "./style.scss";
import SidebarSearch from "../../components/SidebarSearch";
import api from "../../api";

export default function Categories({
  onCategorySelect,
  selectedCategory,
  onSearch
}) {
  const [categories, setCategories] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});

  // 🔹 Filter states (NEW)
  const [activeFilter, setActiveFilter] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/topics");
        const topics = res.data?.topics || [];
        setCategories(topics);

        // auto select Discover by default (use null to represent Discover)
        if (!selectedCategory && onCategorySelect) {
          onCategorySelect(null); // null = Discover
        }
      } catch (err) {
        console.error(
          "Failed to load categories:",
          err.response?.data || err.message
        );
      }
    };
    fetchCategories();
  }, [onCategorySelect, selectedCategory]);

  // 🔹 update search term
  const handleSearchChange = (value) => {
    if (!selectedCategory) return;
    setSearchTerms((prev) => ({
      ...prev,
      [selectedCategory]: value
    }));
  };

  // 🔹 when press Enter
  const handleSearchSubmit = (value) => {
    if (onSearch) {
      onSearch(value, selectedCategory, activeFilter);
    }
  };

  // 🔹 clear search for this category
  const handleClear = () => {
    if (!selectedCategory) return;
    setSearchTerms((prev) => ({
      ...prev,
      [selectedCategory]: ""
    }));
    if (onSearch) {
      onSearch("", selectedCategory, activeFilter);
    }
  };

  return (
    <aside className="sidebar-left-main">
      {/* 🔹 FILTER TOGGLE SECTION */}
      <div className="filter-section">

{/* Filter button and dropdown Mobile-view*/}
<div className="filter-mode">
  <button className="filter-items actives" >
    Read Mode
  </button>
   <button className="filter-items">
    Watch
  </button>
</div>

{/* end */}

        <button
          className="filter-btn"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <img src="/images/filter.png" alt="Filter Icon" className="filter-icon" />
          {/* <span className="filter-text">
            {activeFilter === "recent" ? "Most Recent" : activeFilter === "popular" ? "Most Popular" : "Trending"}
          </span> */}
        </button>

        {showFilters && (
          <ul className="filter-list">
            <li
              className={`filter-item ${activeFilter === "recent" ? "active" : ""
                }`}
              onClick={() => {
                setActiveFilter("recent");
                setShowFilters(false);
              }}
            >
              Most Recent
            </li>

            <li
              className={`filter-item ${activeFilter === "popular" ? "active" : ""
                }`}
              onClick={() => {
                setActiveFilter("popular");
                setShowFilters(false);
              }}
            >
              Most Popular
            </li>

            <li
              className={`filter-item ${activeFilter === "trending" ? "active" : ""
                }`}
              onClick={() => {
                setActiveFilter("trending");
                setShowFilters(false);
              }}
            >
              Trending
            </li>
          </ul>
        )}
      </div>

      {/* 🔹 CATEGORY LIST */}
      <ul className="category-list">
        <li
          className={`category-item ${selectedCategory === null ? "active-item" : ""}`}
          onClick={() => onCategorySelect && onCategorySelect(null)}
          style={{ cursor: "pointer" }}
        >
          <span className="cat-label">Discover</span>
        </li>
           <li className="category-item">
            <a className="cat-label" href="/feed" style={{ textDecoration: "none", color: "inherit" }}>Questions</a>
          </li>
        {categories.length > 0 ? (
          
          categories.map((cat) => (
            <li
              key={cat.id}
              className={`category-item ${selectedCategory === cat.id ? "active-item" : ""
                }`}
              onClick={() =>
                onCategorySelect && onCategorySelect(cat.id)
              }
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

      {/* 🔹 SEARCH PER CATEGORY - only show for non-Discover categories */}
      {selectedCategory !== null && selectedCategory && (
        <SidebarSearch
          searchTerm={searchTerms[selectedCategory] || ""}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onClear={handleClear}
          placeholder={`Search in ${categories.find((c) => c.id === selectedCategory)?.name ||
            "topic"
            }...`}
        />
      )}
    </aside>
  );
}
