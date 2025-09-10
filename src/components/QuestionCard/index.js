import React, { useState } from "react";
import {
  FaHeart,
  FaThumbsDown,
  FaHeartBroken,
  FaShareAlt,
} from "react-icons/fa";
import "./style.scss";

export default function QuestionCard({ question }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="question-card">
      {/* <h2 className="question-title">{question.title}</h2> */}
      <div className={`question-description${expanded ? " expanded" : ""}`}>
        <span>{question.description}</span>
        {!expanded && (
          <button
            className="read-more"
            onClick={() => setExpanded(true)}
            type="button"
          >
            Read more
          </button>
        )}

      </div>
      {/* <hr className="divider" /> */}
      <div className="question-actions">
        <div className="d-flex g-1">
          <button className="upvote">
            <FaHeart />
          </button>
          <button className="downvote ms-2">
            <FaThumbsDown />
          </button>
           <div className="share-dropdown-container">
          <button className="share-btn">
           Send To
          </button>
        </div>
        </div>
       
      </div>
    </div>
  );
}
