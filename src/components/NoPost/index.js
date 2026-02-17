import React from "react";
import "./style.scss";

const NoPost = ({ message, subMessage }) => (
  <div className="no-post-container">
<img src="images/vector.png" alt="No Post" class="img-fluid no-post-img" />

    <h2>{message}</h2>
    <p>{subMessage}</p>
 
  </div>
);

export default NoPost;
