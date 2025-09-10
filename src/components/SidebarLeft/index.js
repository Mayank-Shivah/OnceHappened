import React from "react";
import Categories from "./Categories";
import DiscussionNow from "./DiscussionNow";
import Single from "./SingleAd";
import "./style.scss"; // Import sidebar CSS
import SingleAd from "./SingleAd";

export default function SidebarLeft() {
  return (
    <aside className="sidebar-left">
      <Categories />
      <SingleAd />
      <DiscussionNow />
    </aside>
  );
}