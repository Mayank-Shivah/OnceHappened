import React from "react";
import "./style.scss";

const NoPost = ({ message, subMessage }) => (
  <div className="no-post-container">
    <h2>{message}</h2>
    <p>{subMessage}</p>
 
  </div>
);

export default NoPost;
