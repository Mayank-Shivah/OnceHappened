import React from "react";
import {
  FaArrowUp,
  FaRegComment,
  FaEllipsisH,
  FaArrowDown,
} from "react-icons/fa";

const QuestionAnswerPage = () => {
  const question =
    "A relationship is one of the most profound aspects of human existence ?";

  // ✅ NUMBER OF FEEDS (duplicate full feed)
  const feeds = Array.from({ length: 3 });

  const answers = [
    {
      id: 1,
      user: "Ayush S.",
      bio: "IT & Politics (Active watcher since Atal Era)",
      time: "4y",
      text: "Lot of people are supporting Bhagwant Mann yes he joined politics just before 2014 elections...",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Bhagwant_Mann_and_Raghav_Chadha.jpg/640px-Bhagwant_Mann_and_Raghav_Chadha.jpg",
      upvotes: 61,
      comments: 8,
    },
  ];

  return (
    <>
      {feeds.map((_, index) => (
        <div className="feed mb-2" style={styles.container} key={index}>
          {/* ================= QUESTION ================= */}
          <h1 style={styles.question}>
            {question}
            <div className="show-More">
              <button className="show-more-btn">
                Show More Related posts
              </button>
            </div>
          </h1>

          {/* ================= TAGS ================= */}
          <div className="d-flex align-items-center justify-content-between mb-1 flex-wrap question-description">
            <h5 className="mb-0">
              {[
                "#LifeEvents",
                "#LifeJourney",
                "#PersonalGrowth",
                "#Milestones",
                "#SelfDiscovery",
                "#Growth",
                "#LifeLessons",
                "#NewBeginnings",
              ].map((tag, i) => (
                <a key={i} href="#" className="tag-link me-2">
                  {tag}
                </a>
              ))}
            </h5>
          </div>

          {/* ================= HEADER ================= */}
          <div style={styles.topBar}>
            <span>All related (38)</span>
            <span style={styles.sort}>Sort: Recommended ▾</span>
          </div>

          {/* ================= QUESTION CARD ================= */}
          <div className="question-card">
            <div className="question-description has-readmore">
              <div className="desc-body collapsed">
                <p>
                  A relationship is a delicate balance of love, trust, and
                  understanding that binds two souls together through the
                  ever-changing rhythms of life. It is not just about grand
                  gestures but about emotional connection and consistency.
                </p>
              </div>
            </div>

            <div className="question-actions d-flex justify-content-between align-items-center">
              <div className="w-100 text-center">
                <button className="show-more-btns border-0">
                  <FaArrowDown />
                </button>
              </div>
            </div>
          </div>
  <div className="question-card">
            <div className="question-description has-readmore">
              <div className="desc-body collapsed">
                <p>
                  A relationship is a delicate balance of love, trust, and
                  understanding that binds two souls together through the
                  ever-changing rhythms of life. It is not just about grand
                  gestures but about emotional connection and consistency.
                </p>
              </div>
            </div>

            <div className="question-actions d-flex justify-content-between align-items-center">
              <div className="w-100 text-center">
                <button className="show-more-btns border-0">
                  <FaArrowDown />
                </button>
              </div>
            </div>
          </div>
          {/* ================= ANSWERS ================= */}
          {answers.map((ans) => (
            <div key={ans.id} style={styles.card} className="d-none">
              {/* USER */}
              <div style={styles.userRow}>
                <div style={styles.avatar}></div>
                <div>
                  <strong>{ans.user}</strong>
                  <p style={styles.bio}>
                    {ans.bio} · {ans.time}
                  </p>
                </div>
              </div>

              {/* TEXT */}
              <p style={styles.text}>{ans.text}</p>

              {/* IMAGE */}
              {ans.image && (
                <img src={ans.image} alt="" style={styles.image} />
              )}

              {/* ACTIONS */}
              <div style={styles.actions}>
                <span style={styles.actionBtn}>
                  <FaArrowUp /> {ans.upvotes}
                </span>

                <span style={styles.actionBtn}>
                  <FaRegComment /> {ans.comments}
                </span>

                <span style={styles.actionBtn}>
                  <FaEllipsisH />
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default QuestionAnswerPage;

/* ================= STYLES ================= */

const styles = {
  container: {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px", // spacing between feeds
  },

  question: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#555",
    marginBottom: "15px",
  },

  sort: {
    cursor: "pointer",
  },

  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    marginTop: "15px",
    background: "#fff",
  },

  userRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#ccc",
    marginRight: "10px",
  },

  bio: {
    fontSize: "12px",
    color: "#777",
    margin: 0,
  },

  text: {
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.6",
  },

  image: {
    width: "100%",
    borderRadius: "8px",
    marginTop: "10px",
  },

  actions: {
    display: "flex",
    gap: "20px",
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },

  actionBtn: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
};