import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
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
    const timeAgo = (date) => {
        if (!date) return "";
        const sec = Math.floor((new Date() - new Date(date)) / 1000);
        if (sec < 60) return `${sec} sec ago`;
        if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
        if (sec < 86400) return `${Math.floor(sec / 3600)} hr ago`;
        return `${Math.floor(sec / 86400)} days ago`;
    };

    /* ---------- BOOKMARK ---------- */
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

    const postTime = timeAgo(question?.updated_at || question?.created_at);

    const truncateByWords = (text, wordLimit = 10) => {
        if (!text) return "";
        const words = text.split(" ");
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + "..."
            : text;
    };

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
                            {truncateByWords(
                                "Approaching Valentine’s Day this year, Approaching Valentine’s Day this year",
                                8
                            )}
                        </h2>
                        <span onClick={toggleBookmark} style={{ cursor: "pointer" }}>
                            {bookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
                        </span>
                    </div>

                    {/* TAGS + TIME */}
                    <div className="d-flex align-items-start justify-content-between mb-1">
                        <h5 className="mb-0">
                            <a href="#">#title</a> <a href="#">#demo</a> <a href="#">#title</a>
                        </h5>
                        <span className="time-text">{postTime}</span>
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
