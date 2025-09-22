import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaThumbsDown, FaTrash, FaEdit } from "react-icons/fa";
import "./style.scss";
import api from "../../api";
import { toast } from "react-toastify";
import { loggedUser, isLoggedIn } from "../../services/authService";

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

  useEffect(() => {
    if (question && descRef.current) {
      const lineHeightStr =
        getComputedStyle(descRef.current).lineHeight || "20px";
      const lineHeight = parseFloat(lineHeightStr);
      const contentHeight = descRef.current.scrollHeight;
      const lines = Math.round(contentHeight / lineHeight);
      setShowReadMore(lines > 9);
    }
  }, [question, expanded]);

  useEffect(() => {
    if (user) {
      const storedVotes = JSON.parse(localStorage.getItem("userVotes") || "{}");
      if (storedVotes[`${user.id}_${question.id}`] !== undefined) {
        setVote(storedVotes[`${user.id}_${question.id}`]);
        return;
      }
      let userAction = null;
      if (question?.likes?.length > 0) {
        const userLike = question.likes.find((like) => like.user_id === user.id);
        if (userLike) userAction = userLike.is_like === 1 ? true : false;
      }
      if (!userAction && question?.dislikes?.length > 0) {
        const userDislike = question.dislikes.find(
          (dislike) => dislike.user_id === user.id
        );
        if (userDislike) userAction = false;
      }
      setVote(userAction);
    }
  }, [question, user]);

  const handleVote = async (isLike) => {
    if (!isLoggedIn()) {
      toast.error("Please login first to Like OR Dislike");
      return;
    }
    let newVote = isLike;
    setVote(newVote);
    const storedVotes = JSON.parse(localStorage.getItem("userVotes") || "{}");
    storedVotes[`${user.id}_${question.id}`] = newVote;
    localStorage.setItem("userVotes", JSON.stringify(storedVotes));
    try {
      setLoading(true);
      const response = await api.post("/posts/like", {
        is_like: newVote === true ? 1 : 0,
        post_id: question.id,
        user_id: user?.id,
      });
      if (!response.data.success) {
        toast.error("Failed to update reaction");
      }
    } catch (err) {
      console.error("Vote failed:", err.response?.data || err.message);
      toast.error("Something went wrong while voting");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?id=${question.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="question-card">
      <div
        className={
          "question-description" +
          (expanded ? " expanded" : "") +
          (showReadMore && !expanded ? " show-fade" : "")
        }
        ref={descRef}
      >
        <span dangerouslySetInnerHTML={{ __html: question.description }} />
        {showReadMore && !expanded && (
          <button
            className="read-more"
            onClick={() => setExpanded(true)}
            type="button"
          >
            Read more
          </button>
        )}
      </div>

      {/* ✅ Actions row */}
      <div className="question-actions">
        <div className="d-flex g-1 w-100 justify-content-between align-items-center">
          {showActions && (
            <>
              {/* LIKE */}
            <div class="d-flex">
                <button
                className={`upvote ${vote === true ? "active" : ""}`}
                disabled={loading}
                onClick={() => handleVote(true)}
              >
                <FaHeart />
              </button>

              {/* DISLIKE */}
              <button
                className={`downvote ms-2 ${vote === false ? "active" : ""}`}
                disabled={loading}
                onClick={() => handleVote(false)}
              >
                <FaThumbsDown />
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
            <button
              className={`upvote`} // ✅ reuse same style as like
              onClick={() => onEdit?.(question.id)}
            >
              <FaEdit />
            </button>
          )}
          {showDelete && (
            <button
              className={`downvote ms-2`} // ✅ reuse same style as dislike
              onClick={() => onDelete?.(question.id)}
            >
              <FaTrash />
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
