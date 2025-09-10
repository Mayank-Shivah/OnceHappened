import React from "react";
import './DiscussionNow.scss';
import { FaRegCommentDots } from "react-icons/fa";

const discussions = [
  {
    question: "PHP for WordPress",
    answers: 125,
  },
  {
    question: "A meeting or mediu.......",
    answers: 91,
  },
  {
    question: "PHP is a programming an.......",
    answers: 34,
  },
  {
    question: "PHP is a programming an......",
    answers: 32,
  },
  {
    question: "An activity involving physical exe........",
    answers: 30,
  },
  {
    question: "Deploy & Scale With an ...", // Example placeholder
    answers: 27,
  }
];

export default function DiscussionNow() {
  return (
    <aside className="discussion-now sidebar-left-main ">
      <div className="sidebar-title">Discussion Now</div>
      <ul className="discussion-list">
        {discussions.map((d, i) => (
          <li className="discussion-item" key={i}>
            <div className="discussion-question">{d.question}</div>
            <div className="discussion-meta">
              <FaRegCommentDots /> {d.answers} answered
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
