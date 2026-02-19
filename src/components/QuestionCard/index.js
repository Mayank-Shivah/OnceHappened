import React, { useState, useEffect, useRef } from "react";
import {
  FaHeart,
  FaThumbsDown,
  FaTrash,
  FaEdit,
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaRegFlag,
} from "react-icons/fa";
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
  showCounts = false,
  isLiked = false,
  status = null,
  onDelete,
  onEdit,
  onUnlike,
}) {
  const [expanded, setExpanded] = useState(false);
  const [vote, setVote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);
  const [showFlagMenu, setShowFlagMenu] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isFlagged, setIsFlagged] = useState(false);

  const descRef = useRef();
  const user = loggedUser();
  const { openRegister } = usePopup();

  const voteKey = user ? `post_${question.id}_user_${user.id}_vote` : null;
  const bookmarkKey = user ? `post_${question.id}_user_${user.id}_bookmark` : null;
  const flagKey = user ? `post_${question.id}_user_${user.id}_flag` : null;

  /* ---------------- BOOKMARK ---------------- */
  useEffect(() => {
    if (!bookmarkKey) return;
    setBookmarked(localStorage.getItem(bookmarkKey) === "true");
  }, [bookmarkKey]);

  const toggleBookmark = () => {
    if (!isLoggedIn()) {
      openRegister();
      return;
    }
    const value = !bookmarked;
    setBookmarked(value);
    localStorage.setItem(bookmarkKey, value);
  };

  /* ---------------- FLAG ---------------- */
  const flagReasons = [
    "Spam or misleading",
    "Hate speech",
    "Harassment",
    "False information",
    "Inappropriate content",
    "Other",
  ];
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (flagRef.current && !flagRef.current.contains(e.target)) {
        setShowFlagMenu(false);
        setShowOtherInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
const flagRef = useRef(null);
  /* ---------------- TIME ---------------- */
  const timeAgo = (date) => {
    if (!date) return "";
    const sec = Math.floor((new Date() - new Date(date)) / 1000);
    if (sec < 60) return `${sec} sec ago`;
    if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} hr ago`;
    return `${Math.floor(sec / 86400)} days ago`;
  };

  const postTime = timeAgo(question.updated_at || question.created_at);

  /* ---------------- INIT VOTE ---------------- */
  useEffect(() => {
    if (!user?.id) return;

    const storedVote = voteKey && localStorage.getItem(voteKey);
    if (storedVote) {
      setVote(storedVote === "like" ? true : storedVote === "dislike" ? false : null);
      return;
    }

    const userLike = question?.likes?.find(
      (l) => String(l.user_id) === String(user.id)
    );

    if (userLike) {
      setVote(userLike.is_like === 1 ? true : userLike.is_like === 0 ? false : null);
    } else {
      setVote(null);
    }

    if (isLiked) setVote(true);
  }, [question, user?.id, isLiked]);

  /* ---------------- READ MORE ---------------- */
  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 20;
    setShowReadMore(Math.ceil(el.scrollHeight / lh) > 9);
  }, [question]);

  /* ---------------- LIKE / DISLIKE ---------------- */
  const handleVote = async (isLike) => {
    if (!isLoggedIn()) {
      openRegister();
      return;
    }

    const prevVote = vote;
    let newVote = null;
    let payload = null;

    if (vote === isLike) {
      newVote = null;
      payload = 2;
      if (isLike && isLiked) onUnlike?.(question.id);
    } else {
      newVote = isLike;
      payload = isLike ? 1 : 0;
    }

    setVote(newVote);
    voteKey &&
      localStorage.setItem(
        voteKey,
        newVote === true ? "like" : newVote === false ? "dislike" : "none"
      );

    try {
      setLoading(true);
      await api.post("/posts/like", {
        post_id: question.id,
        user_id: user.id,
        is_like: payload,
      });
    } catch {
      setVote(prevVote);
    } finally {
      setLoading(false);
    }
  };
  const truncateByWords = (text, wordLimit = 10) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const shareUrl = `${window.location.origin}/?id=${question.id}`;

  return (
    <div className="question-card">
      <div className={`question-description ${showReadMore ? "has-readmore" : ""}`}>
        {/* HEADING + BOOKMARK */}
        <div className="d-flex align-items-start justify-content-between mb-1">
          <h2 className="mb-0">
            {question.title}
          </h2>
          <span onClick={toggleBookmark} style={{ cursor: "pointer" }}>
            {bookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
          </span>
        </div>

        {/* TITLE + TIME */}
        <div className="d-flex align-items-start justify-content-between mb-1">
          <h5 className="mb-0"><strong>{question.slug}</strong></h5>
          <span className="time-text">{postTime}</span>
        </div>

        <div ref={descRef} className={`desc-body ${expanded ? "expanded" : "collapsed"}`}>
          <span dangerouslySetInnerHTML={{ __html: question.description }} />
        </div>
            
        {showReadMore && (
          <button className="read-more" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

      {/* ACTIONS */}
      <div className="question-actions d-flex justify-content-between align-items-center ms-auto">
        {/* LEFT: LIKE / DISLIKE */}
        {showActions && (
          <div className="d-flex">
            <button className="upvote" onClick={() => handleVote(true)} disabled={loading}>
              {vote === true ? (
                <FaHeart color="red" size={20} />
              ) : (
                <img src="images/heart.svg" alt="like" width="20" height="20" />
              )}
            </button>

            <button className="downvote" onClick={() => handleVote(false)} disabled={loading}>
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

        {/* RIGHT: FLAG + SEND TO */}
        <div className="d-flex align-items-center w-100 justify-content-end ">
          {/* <button onClick={toggleFlag} style={{ background: "none", border: "none" }}>
            {flagged ? <FaFlag color="#dc3545" /> : <FaRegFlag className="color-set" />}
          </button> */}

          <div className="flag-ui-wrapper" ref={flagRef}>
            {/* FLAG BUTTON */}
            <button
  className="flag-btn"
  onClick={() => {
    setShowFlagMenu(!showFlagMenu);
    setShowOtherInput(false);
  }}
>
  {isFlagged ? (
    <FaFlag color="#dc3545" />   // 🔴 solid when active
  ) : (
    <FaRegFlag className="color-set" /> // ⚪ outline by default
  )}
</button>


            {showFlagMenu && (
              <div className="flag-ui-dropdown">
                <p className="flag-title">Report this post</p>

                {/* LIST ALWAYS VISIBLE */}
                <ul className="flag-list">
                  {[
                    "Spam or misleading",
                    "Hate speech",
                    "Harassment or abuse",
                    "False information",
                    "Inappropriate content",
                  ].map((reason) => (
                    <li
                      key={reason}
                      onClick={() => {
                        setSelectedReason(reason);
                        setIsFlagged(true);
                        setShowFlagMenu(false);
                      }}
                    >
                      {reason}
                    </li>
                  ))}

                  {/* OTHER */}
                  <li
                    className="other"
                    onClick={() => setShowOtherInput(true)}
                  >
                    Other
                  </li>
                </ul>

                {/* INPUT APPEARS BELOW LIST */}
                {showOtherInput && (
                  <div className="flag-other-box">
                    <input
                      type="text"
                      placeholder="Enter your reason"
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (!otherReason.trim()) return;
                        setSelectedReason(otherReason);
                        setIsFlagged(true);
                        setShowFlagMenu(false);
                        setShowOtherInput(false);
                        setOtherReason("");
                      }}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {showActions && (
            <button className="share-btn" onClick={() => setShowShare(true)}>
              Send to My
            </button>
          )}

          {showEdit && <button className="upvote" onClick={() => onEdit?.(question)}><FaEdit /></button>}
          {showDelete && <button className="downvote" onClick={() => onDelete?.(question.id)}><FaTrash /></button>}
        </div>
      </div>

      {showShare && <ShareModal url={shareUrl} onClose={() => setShowShare(false)} />}
    </div>
  );
}
