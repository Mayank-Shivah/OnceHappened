import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaThumbsDown, FaTrash, FaEdit } from "react-icons/fa";
import "./style.scss";
import api from "../../api";
import { toast } from "react-toastify";
import { loggedUser, isLoggedIn } from "../../services/authService";

// 🔹 Use Popup context
import { usePopup } from "../PopupManager";

export default function QuestionCard({
  question,
  showActions = true,
  showDelete = false,
  showEdit = false,
  onDelete,
  onEdit,
}) {
  const [expanded, setExpanded] = useState(false);
  const [vote, setVote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const descRef = useRef();
  const user = loggedUser();

  // ✅ Access popup manager
  const { openRegister, openLogin } = usePopup();

  // ✅ Detect overflow text
  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const style = window.getComputedStyle(el);
      let lh = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5 || 20;
      const lines = Math.ceil(el.scrollHeight / lh);
      setShowReadMore(lines > 9);
    };

    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [question]);

  // ✅ Like / Dislike toggle
  const handleVote = async (isLike) => {
    if (!isLoggedIn()) {
      // 🔹 Instead of showing local RegisterModal,
      // we use PopupManager to open login/register popup
      openRegister();
      return;
    }

    if (!user?.id || !question?.id) {
      toast.error("Invalid user or question data");
      return;
    }

    const newVote = vote === isLike ? null : isLike;
    setVote(newVote);

    try {
      setLoading(true);
      const payload = { post_id: question.id, user_id: user.id };
      if (newVote === true) payload.is_like = 1;
      else if (newVote === false) payload.is_like = 0;
      await api.post("/posts/like", payload);
    } catch (err) {
      console.error("Vote failed:", err.response?.data || err.message);
      toast.error("Something went wrong while voting");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Copy link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/?id=${question.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="question-card">
      {/* ✅ Description */}
      <div className={`question-description ${showReadMore ? "has-readmore" : ""}`}>
        <div ref={descRef} className={`desc-body ${expanded ? "expanded" : "collapsed"}`}>
          <span dangerouslySetInnerHTML={{ __html: question.description }} />
        </div>

        {showReadMore && (
          <button
            className="read-more"
            onClick={() => setExpanded(!expanded)}
            type="button"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

      {/* ✅ Actions */}
      <div className="question-actions">
        <div className="d-flex g-1 w-100 justify-content-between align-items-center">
          {showActions && (
            <>
              <div className="d-flex">
                {/* LIKE */}
                <button
                  className={`upvote ${vote === true ? "active" : ""}`}
                  disabled={loading}
                  onClick={() => handleVote(true)}
                >
                  {vote === true ? (
                    <FaHeart color="red" size={20} />
                  ) : (
                    <img src="images/heart.svg" alt="like" width="20" height="20" />
                  )}
                </button>

                {/* DISLIKE */}
                <button
                  className={`downvote ${vote === false ? "active" : ""}`}
                  disabled={loading}
                  onClick={() => handleVote(false)}
                >
                  {vote === false ? (
                    <FaThumbsDown size={20} />
                  ) : (
                    <img src="images/dislike-icon.png" alt="dislike" width="20" height="20" />
                  )}
                </button>
              </div>

              {/* COPY */}
              <div className="share-dropdown-container">
                <button className="share-btn" onClick={handleCopyLink}>
                  {copied ? "Copied!" : "Send To"}
                </button>
              </div>
            </>
          )}

          {showEdit && (
            <button className="upvote" onClick={() => onEdit?.(question.id)}>
              <FaEdit />
            </button>
          )}
          {showDelete && (
            <button className="downvote" onClick={() => onDelete?.(question.id)}>
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
