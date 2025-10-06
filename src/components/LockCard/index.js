import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { usePopup } from "../PopupManager";
import { isLoggedIn } from "../../services/authService";
import { FaHeart, FaThumbsDown, FaEdit, FaTrash } from "react-icons/fa";

export default function LockCard({
    post,           // 🔹 now accepts post object
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
    const [showShare, setShowShare] = useState(false);

    const handleVote = (isUpvote) => {
        // your vote logic if needed
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();
        if (isLoggedIn()) {
            navigate("/subscription");
        } else {
            openRegister();
        }
    };

    // 🔹 Utility: strip HTML from API description
    const stripHtml = (html = "") => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    return (
        <div className="question-card position-relative" ref={descRef} id={`lock-${post?.id || "noid"}`}>
            <div className="lpb-bg-texts question-description has-readmore">
                <div className="desc-body collapsed">
                    <span>
           
                    
                        {stripHtml(post?.description || "")}...
                    </span>
                    <button className="read-more" type="button" onClick={handleButtonClick}>
                        Unlock to Read More
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
                            <span className="button-text">Unlock this Story</span>
                        </button>
                    </div>
                    <ul className="lpb-features">
                        <li onClick={handleButtonClick} style={{ cursor: "pointer" }}>
                            Unlock all stories
                        </li>
                        <li onClick={handleButtonClick} style={{ cursor: "pointer" }}>
                            Remove all ads.
                        </li>
                    </ul>
                    <button className="once-btn" onClick={handleButtonClick}>
                        <span className="button-text">Find Out More</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
