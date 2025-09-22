import React from "react";
import Categories from "./Categories";
import DiscussionNow from "./DiscussionNow";
import SingleAd from "./SingleAd";
import "./style.scss";

// ✅ forward props into Categories (including onSearch)
export default function SidebarLeft({ onCategorySelect, selectedCategory, onSearch }) {
  return (
    <aside className="sidebar-left">
      <Categories
        onCategorySelect={onCategorySelect}
        selectedCategory={selectedCategory}
        onSearch={onSearch} 
      />
      <SingleAd />
      {/* <DiscussionNow /> */}
    </aside>
  );
}
