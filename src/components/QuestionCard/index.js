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
  onHashtagSelect, // ✅ NEW: Callback when hashtag is clicked
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
  const [isMobile, setIsMobile] = useState(false);
  const user = loggedUser();
  const { openRegister } = usePopup();

  // Detect screen size for responsive word limit
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const voteKey = user ? `post_${question.id}_user_${user.id}_vote` : null;
  const bookmarkKey = user ? `post_${question.id}_user_${user.id}_bookmark` : null;
  const flagKey = user ? `post_${question.id}_user_${user.id}_flag` : null;

  /* ---------------- BOOKMARK ---------------- */
  // Initialize bookmark state from question prop when it changes
  useEffect(() => {
    if (question?.is_bookmarked !== undefined && question?.is_bookmarked !== null) {
      const isBookmarkedValue = question.is_bookmarked === true || question.is_bookmarked === "1" || question.is_bookmarked === 1;
      setBookmarked(isBookmarkedValue);
    }
  }, [question?.id, question?.is_bookmarked]);

  useEffect(() => {
    if (question?.is_flagged !== undefined && question?.is_flagged !== null) {
      const isFlaggedValue = question.is_flagged === true || question.is_flagged === "1" || question.is_flagged === 1;
      setIsFlagged(isFlaggedValue);
      setSelectedReason(question.flag_reason || "");
    }
  }, [question?.id, question?.is_flagged]);



  const toggleBookmarkOLD = () => {
    if (!isLoggedIn()) {
      openRegister();
      return;
    }
    const value = !bookmarked;
    setBookmarked(value);
    localStorage.setItem(bookmarkKey, value);
  };

  const toggleBookmark = async () => {
    if (!isLoggedIn()) {
      openRegister();
      return;
    }

    try {
      // Optimistically update UI
      const newBookmarkedState = !bookmarked;
      setBookmarked(newBookmarkedState);

      const res = await api.post("/posts/bookmark", {
        post_id: question.id,
        user_id: user.id,
      });

      // Bookmark state is already updated optimistically
      // If you want to sync with backend response, uncomment below:
      // setBookmarked(res.data.is_bookmarked);
    } catch (err) {
      console.log(err);
      // Revert state on error
      setBookmarked(!bookmarked);
    }
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
  const timeAgoS = (date) => {
    if (!date) return "";
    const sec = Math.floor((new Date() - new Date(date)) / 1000);
    if (sec < 60) return `${sec} sec ago`;
    if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} hr ago`;
    return `${Math.floor(sec / 86400)} days ago`;
  };

  const timeAgo = (date) => {
    if (!date) return "";

    const now = new Date();
    const past = new Date(date);
    const sec = Math.floor((now - past) / 1000);

    if (sec < 60) 
        return `${sec} sec ago`;

    if (sec < 3600) 
        return `${Math.floor(sec / 60)} min ago`;

    if (sec < 86400) 
        return `${Math.floor(sec / 3600)} hr ago`;

    const days = Math.floor(sec / 86400);

    // ✅ Show days only for 30 days
    if (days <= 30) {
        return days === 1 ? "1 day ago" : `${days} days ago`;
    }

    const months = Math.floor(days / 30);

    // ✅ After 12 months show years
    if (months < 12) {
        return months === 1 ? "1 month ago" : `${months} months ago`;
    }

    const years = Math.floor(months / 12);
    return years === 1 ? "1 year ago" : `${years} years ago`;
};


  const handleFlagSubmit = async (reason) => {
    try {
      await api.post("/posts/flag", {
        post_id: question.id,
        user_id: user.id,   // make sure you have user object
        reason: reason,
      });

      setSelectedReason(reason);
      setIsFlagged(true);
      setShowFlagMenu(false);
      setShowOtherInput(false);
      setOtherReason("");

    } catch (error) {
      console.error("Flag error:", error.response?.data || error);
    }
  };

  // ✅ Calculate reading time based on word count
  const calculateReadingTime = (html = "") => {
    // Strip HTML tags
    const text = html.replace(/<[^>]*>/g, "");
    
    // Count words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (words === 0) return "0 min read";
    
    // 50 words = 30 sec, so 1 word = 0.6 sec
    // 100 words = 1 min (60 sec), so 1 word = 0.6 sec
    // This means: time in seconds = words * 0.6, then convert to min/sec
    
    const readingTimeSeconds = Math.ceil(words * 0.6);
    
    if (readingTimeSeconds < 60) {
      return `${readingTimeSeconds} sec`;
    }
    
    const minutes = Math.round(readingTimeSeconds / 60);
    return `${minutes} min`;
  };

  const postTime = calculateReadingTime(question.description);

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

  const slug = question.slug; // "#nature,#life"

  const tags = question?.slug ? question.slug.split(",") : [];

  return (
    <div className="question-card">
      <div className={`question-description ${showReadMore ? "has-readmore" : ""}`}>
        {/* HEADING + BOOKMARK */}
        <div className="d-flex align-items-start justify-content-between mb-1">
          <h2 className="mb-0" title={question.title}>
            {truncateByWords(question.title, isMobile ? 20 : 20)}
          </h2>
          <span onClick={toggleBookmark} style={{ cursor: "pointer" }}>
            {bookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
          </span>
        </div>

        {/* TITLE + TIME */}
        <div className="d-flex align-items-start justify-content-between mb-1 flex-wrap">
          <h5 className="mb-0">
              {tags.map((tag, index) => {
                  const cleanTag = tag.trim().replace("#", "");

                  return (
                  <a
                      key={index}
                      href="#"
                      className="tag-link"
                      onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // ✅ NEW: Call the onHashtagSelect callback instead of navigate
                          onHashtagSelect?.(cleanTag);
                          // ✅ Forcefully scroll to top immediately (won't get stuck on ads)
                          window.scrollTo(0, 0);
                          // Also queue another scroll to ensure it's at top
                          setTimeout(() => window.scrollTo(0, 0), 10);
                      }}
                  >
                      #{cleanTag}
                  </a>
                  );
              })}
          </h5>
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
                  if (!isLoggedIn()) {
                    openRegister();
                    return;
                  }

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
                      onClick={() => handleFlagSubmit(reason)}
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
                          handleFlagSubmit(otherReason);
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
