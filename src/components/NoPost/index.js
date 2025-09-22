import React from "react";
import "./style.scss"; // or .scss for custom styling

const NoPost = ({ onAddNew }) => (
  <div className="no-post-container">
    {/* Optional: Replace src with your own SVG or image */}
    {/* <img className="no-post-image" src="/assets/no-data.svg" alt="No posts" /> */}
    <h2>No Posts Available</h2>
    <p>There are currently no posts to display. Try adding a new post or check back later.</p>
    {onAddNew && (
      <button className="add-post-btn" onClick={onAddNew}>
        Add New Post
      </button>
    )}
  </div>
);

export default NoPost;
