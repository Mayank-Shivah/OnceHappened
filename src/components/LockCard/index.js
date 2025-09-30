import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { usePopup } from "../PopupManager";
import { isLoggedIn } from "../../services/authService";
import { FaHeart, FaThumbsDown, FaEdit, FaTrash } from "react-icons/fa";

export default function LockPromoBox({
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
        // Your vote logic
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();

        if (isLoggedIn()) {
            navigate("/subscription");
        } else {
            openRegister();
        }
    };

    return (
        <div className="question-card position-relative" ref={descRef} id="price-section">
            <div className="lpb-bg-texts question-description has-readmore">
                <div className="desc-body collapsed">
                    <span>
                        Love does not always need grand gestures to flourish. The small, everyday acts often carry the most weight. A simple smile in the morning can brighten the entire day. Holding hands in silence can speak louder than words. A short text saying “Thinking of you” can warm the heart more than expensive gifts.

                        It’s the little details that make relationships strong. Remembering a partner’s favorite food, celebrating their small victories, or writing them a quick note of appreciation shows attentiveness. These moments create a sense of care and security. Even helping with small chores or apologizing sincerely when wrong can transform tension into connection.

                        Small gestures accumulate over time to build trust and intimacy. They remind us that love is not about extravagance but about consistency. Listening patiently, offering comfort, or being present during difficult times are simple yet powerful ways to show devotion. Over the years, it is these everyday acts that become the pillars of unshakable love.
                        Love does not always need grand gestures to flourish. The small, everyday acts often carry the most weight. A simple smile in the morning can brighten the entire day. Holding hands in silence can speak louder than words. A short text saying “Thinking of you” can warm the heart more than expensive gifts.

                        It’s the little details that make relationships strong. Remembering a partner’s favorite food, celebrating their small victories, or writing them a quick note of appreciation shows attentiveness. These moments create a sense of care and security. Even helping with small chores or apologizing sincerely when wrong can transform tension into connection.

                        Small gestures accumulate over time to build trust and intimacy. They remind us that love is not about extravagance but about consistency. Listening patiently, offering comfort, or being present during difficult times are simple yet powerful ways to show devotion. Over the years, it is these everyday acts that become the pillars of unshakable love.
                    </span>
                    <button class="read-more" type="button">Read More</button>
                </div>


            </div>

            <div className="question-actions position-relative">
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

                        {/* Static Like/Dislike counts (if showCounts) */}
                        {showCounts && (
                            <div className="d-flex" style={{ gap: "15px" }}>
                                <span
                                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                                >
                                    <FaHeart color="red" size={16} />
                                    {likeCount}
                                </span>
                                <span
                                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                                >
                                    <FaThumbsDown size={16} />
                                    {dislikeCount}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right: Status Badge (if status) + Share/Edit/Delete */}
                    <div className="right-actions d-flex align-items-center gap-2">
                        {statusDisplay && (
                            <span className="share-btn">{statusDisplay}</span>
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
                                onClick={() => onEdit?.()}
                            >
                                <FaEdit />
                            </button>
                        )}
                        {showDelete && (
                            <button
                                className="downvote"
                                onClick={() => onDelete?.()}
                            >
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
                        <li
                            onClick={handleButtonClick}
                            style={{ cursor: "pointer" }}
                        >
                            Unlock all stories
                        </li>
                        <li
                            onClick={handleButtonClick}
                            style={{ cursor: "pointer" }}
                        >
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
