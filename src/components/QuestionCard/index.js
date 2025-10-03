import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaThumbsDown, FaTrash, FaEdit } from "react-icons/fa";
import "./style.scss";
import api from "../../api";
import { loggedUser, isLoggedIn } from "../../services/authService";
import { usePopup } from "../PopupManager";
import ShareModal from "../ShareModal";

export default function QuestionCard({
  question,
  showActions = true,
  showDelete = false,
  showEdit = false,
  showCounts = false,   // ✅ new prop
  isLiked = false,     // ✅ New prop: Force liked state (e.g., for Profile "Liked" tab)
  status = null,       // ✅ New prop: For My Posts/Drafts tabs (e.g., "approved", "unapproved", "published", "draft")
  onDelete,
  onEdit,
  onUnlike,
}) {
  const [expanded, setExpanded] = useState(false);
  const [vote, setVote] = useState(null); // true=like, false=dislike, null=none
  const [loading, setLoading] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const descRef = useRef();
  const user = loggedUser     ();
  const { openRegister } = usePopup();

  const voteKey = user ? `post_${question.id}_user_${user.id}_vote` : null;

  // ✅ Initialize vote from API or localStorage
  useEffect(() => {
    if (!user?.id) return;

    // check localStorage first
    const storedVote = voteKey ? localStorage.getItem(voteKey) : null;
    if (storedVote) {
      if (storedVote === "like") setVote(true);
      else if (storedVote === "dislike") setVote(false);
      else setVote(null);
      return;
    }

    // fallback: check API data in question.likes (✅ Fixed: Use String comparison for type safety)
    const userLike = question?.likes?.find((like) => String(like.user_id) === String(user.id));
    if (userLike) {
      if (userLike.is_like === 1) setVote(true);
      else if (userLike.is_like === 0) setVote(false);
      else setVote(null);
    } else {
      setVote(null);
    }

    // ✅ Fallback override: Force liked state if prop is true (e.g., Profile "Liked" tab)
    if (isLiked) {
      setVote(true);
    }
  }, [question, user?.id, isLiked]); // ✅ Added isLiked to deps for reactivity

  // ✅ Detect overflow text for read more/less
  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const style = window.getComputedStyle(el);
      let lh =
        parseFloat(style.lineHeight) ||
        parseFloat(style.fontSize) * 1.5 ||
        20;
      const lines = Math.ceil(el.scrollHeight / lh);
      setShowReadMore(lines > 9);
    };

    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [question]);

  // ✅ Handle Like / Dislike
  const handleVote = async (isLike) => {
    if (!isLoggedIn()) {
      openRegister();
      return;
    }

    if (!user?.id || !question?.id) {
      return;
    }

    const prevVote = vote;
    let newVote = null;
    let payloadIsLike = null;

    if (vote === isLike) {
      // case: clicked same button → reset to none
      newVote = null;
      payloadIsLike = 2; // special code for remove

      // ✅ If user unliked and this card was forced liked (Liked tab)
      if (isLike === true && isLiked) {
        onUnlike?.(question.id);  // 👈 notify parent to remove immediately
      }
    } else {
      // case: switch like ↔ dislike
      newVote = isLike;
      payloadIsLike = isLike ? 1 : 0;
    }

    // Optimistic update (UI + localStorage)
    setVote(newVote);
    if (voteKey) {
      if (newVote === true) localStorage.setItem(voteKey, "like");
      else if (newVote === false) localStorage.setItem(voteKey, "dislike");
      else localStorage.setItem(voteKey, "none");
    }

    try {
      setLoading(true);
      const payload = {
        post_id: question.id,
        user_id: user.id,
        is_like: payloadIsLike,
      };
      await api.post("/posts/like", payload);
    } catch (err) {
      console.error("Vote failed:", err.response?.data || err.message);

      // rollback
      setVote(prevVote);
      if (voteKey) {
        if (prevVote === true) localStorage.setItem(voteKey, "like");
        else if (prevVote === false) localStorage.setItem(voteKey, "dislike");
        else localStorage.setItem(voteKey, "none");
      }
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = `${window.location.origin}/?id=${question.id}`;

  // ✅ Deduplicate likes/dislikes for counts
  let likeCount = 0;
  let dislikeCount = 0;
  if (showCounts && Array.isArray(question.likes)) {
    const reactions = {};
    question.likes.forEach((like) => {
      reactions[like.user_id] = like.is_like; // overwrite with latest
    });
    likeCount = Object.values(reactions).filter((v) => String(v) === "1").length;
    dislikeCount = Object.values(reactions).filter((v) => String(v) === "0").length;
  }

  // ✅ Status display logic (for My Posts/Drafts tabs)
  // ✅ Status display logic
    const getStatusDisplay = (status) => {
      if (!status) return null;
      switch (status) {
        case "draft":
          return "Pending for Approval";
        case "approved":
          return "Approved";
        case "un-approved":
          return "Unapproved";
        case "published":
          return "Draft";
        default:
          return null;
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "approved":
          return "#28a745"; // Green
        case "draft":
          return "#ffc107"; // Orange
        case "unapproved":
          return "#dc3545"; // Red
        default:
          return "#6c757d"; // Gray
      }
    };

  const statusDisplay = getStatusDisplay(status);
  const statusColor = getStatusColor(status);

  return (
    <div className="question-card">
      {/* ✅ Description – Renders full question.description (updated from Profile state) */}
      <div
        className={`question-description ${
          showReadMore ? "has-readmore" : ""
        }`}
      >
        <div
          ref={descRef}
          className={`desc-body ${expanded ? "expanded" : "collapsed"}`}
        >
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

      {/* ✅ Actions (Bottom row: Left=Counts/Votes, Right=Status/Actions) */}
      <div className="question-actions" style={{ position: "relative" }}>
        <div className="d-flex g-1 w-100 justify-content-between align-items-center">
          {/* Left: Votes (if showActions) + Counts (if showCounts) */}
          <div className="left-actions d-flex align-items-center gap-2">
            {showActions && (
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
                    <img
                      src="images/heart.svg"
                      alt="like"
                      width="20"
                      height="20"
                    />
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
                    <img
                      src="images/dislike-icon.png"
                      alt="dislike"
                      width="20"
                      height="20"
                    />
                  )}
                </button>
              </div>
            )}

            {/* ✅ Static Like/Dislike counts (for My Posts tab) – Left bottom */}
            {showCounts && (
              <div className="d-flex" style={{ gap: "15px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <FaHeart color="red" size={16} />
                  {likeCount}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <FaThumbsDown size={16} />
                  {dislikeCount}
                </span>
              </div>
            )}
          </div>

          {/* Right: Status Badge (if status) + Share/Edit/Delete */}
          <div className="right-actions d-flex align-items-center gap-2">
            {/* ✅ Status Badge (Right bottom, parallel to counts) */}
            {statusDisplay && (
              <span
                className="share-btn"
                style={{ color: statusColor }} // ✅ keep consistent styling
              >
                {statusDisplay}
              </span>
            )}

            {/* SHARE BUTTON */}
            {showActions && (
              <div className="share-dropdown-container">
                <button
                  className="share-btn"
                  onClick={() => setShowShare(true)}
                >
                  Send To
                </button>
              </div>
            )}

            {showEdit && (
              <button
                className="upvote"
                onClick={() => onEdit?.(question)}
              >
                <FaEdit />
              </button>
            )}
            {showDelete && (
              <button
                className="downvote"
                onClick={() => onDelete?.(question.id)}
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Share Modal */}
      {showShare && (
        <ShareModal url={shareUrl} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
