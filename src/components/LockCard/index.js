import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import api from "../../api";
import { usePopup } from "../PopupManager";
import { isLoggedIn } from "../../services/authService";
import {
    FaHeart,
    FaThumbsDown,
    FaEdit,
    FaTrash,
    FaBookmark,
    FaRegBookmark,
} from "react-icons/fa";

export default function LockCard({
    post,
    showActions,
    showCounts,
    showEdit,
    showDelete,
    vote,
    loading,
    likeCount,
    dislikeCount,
    onEdit,
    onDelete,
    statusDisplay,
    onHashtagSelect, // ✅ NEW: Callback when hashtag is clicked
}) {

    const descRef = useRef();
    const navigate = useNavigate();
    const { openRegister } = usePopup();

    const [bookmarked, setBookmarked] = useState(false);
    const [flagged, setFlagged] = useState(false);
    const [showShare, setShowShare] = useState(false);

    /* ================= FIX (ONLY ADDITION) ================= */
    const user = JSON.parse(localStorage.getItem("user"));
    const question = post;
    /* ====================================================== */

    const voteKey = user ? `post_${question?.id}_user_${user.id}_vote` : null;
    const bookmarkKey = user ? `post_${question?.id}_user_${user.id}_bookmark` : null;
    const flagKey = user ? `post_${question?.id}_user_${user.id}_flag` : null;

    // ✅ Initialize bookmark state from question prop
    useEffect(() => {
      if (question?.is_bookmarked !== undefined && question?.is_bookmarked !== null) {
        const isBookmarkedValue = question.is_bookmarked === true || question.is_bookmarked === "1" || question.is_bookmarked === 1;
        setBookmarked(isBookmarkedValue);
      }
    }, [question?.id, question?.is_bookmarked]);

    const handleButtonClick = (e) => {
        e.stopPropagation();
        if (isLoggedIn()) {
            navigate("/subscription");
        } else {
            openRegister();
        }
    };

    /* ---------- STRIP HTML ---------- */
    const stripHtml = (html = "") => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    /* ---------- TIME ---------- */
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
        const res = await api.post("/posts/bookmark", {
          post_id: question.id,
          user_id: user.id,
        });
    
        setBookmarked(!bookmarked);
      } catch (err) {
        console.log(err);
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

    const postTime = calculateReadingTime(question?.description || "");

    const truncateByWords = (text, wordLimit = 10) => {
        if (!text) return "";
        const words = text.split(" ");
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + "..."
            : text;
    };

    const slug = question.slug; // "#nature,#life"

    const tags = question?.slug ? question.slug.split(",") : [];

    return (
        <div
            className="question-card position-relative overflow-hidden"
            ref={descRef}
            id={`lock-${post?.id || "noid"}`}
        >
            <div className="lpb-bg-texts question-description has-readmore">
                <div className="desc-body collapsed">

                    {/* TITLE + BOOKMARK */}
                    <div className="d-flex align-items-start justify-content-between mb-1">
                        <h2 className="mb-0">
                            {question.title}
                        </h2>
                        <span onClick={toggleBookmark} style={{ cursor: "pointer" }}>
                            {bookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
                        </span>
                    </div>


                    {/* TAGS + TIME */}
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
                        {/* <span className="time-text">{postTime}</span> */}
                    </div>

                    <span>
                        {stripHtml(post?.description || "")}...
                    </span>

                    <button className="read-more" type="button" onClick={handleButtonClick}>
                        Read More
                    </button>
                </div>
            </div>

            <div className="question-actions position-relative">
                <div className="d-flex g-1 w-100 justify-content-between align-items-center">
                    <div className="left-actions d-flex align-items-center gap-2">
                        {showCounts && (
                            <div className="d-flex" style={{ gap: "15px" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <FaHeart color="red" size={16} />
                                    {likeCount ?? post?.likes_count ?? 0}
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <FaThumbsDown size={16} />
                                    {dislikeCount ?? post?.dislikes_count ?? 0}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="right-actions d-flex align-items-center gap-2">
                        {statusDisplay && (
                            <span className="share-btn">{statusDisplay}</span>
                        )}

                        {showEdit && (
                            <button className="upvote" onClick={() => onEdit?.(post)}>
                                <FaEdit />
                            </button>
                        )}

                        {showDelete && (
                            <button className="downvote" onClick={() => onDelete?.(post)}>
                                <FaTrash />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="lpb-center-content">
                <div className="lpb-yellow-box">
                    <div className="lpb-main-title">
                        <button className="once-btn" onClick={handleButtonClick}>
                            <span className="button-text">Once Happened +</span>
                        </button>
                    </div>
                    <ul className="lpb-features">
                        <li onClick={handleButtonClick}>Unlock all stories</li>
                        <li onClick={handleButtonClick}>Remove all ads.</li>
                    </ul>
                    <button className="once-btn" onClick={handleButtonClick}>
                        <span className="button-text">Find Out More</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
