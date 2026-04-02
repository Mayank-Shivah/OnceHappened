import { useState, useRef, useEffect } from "react";

import "./DemoQuestionsFeed.scss";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "science", label: "Science", theme: "teal" },
  { id: "philosophy", label: "Philosophy", theme: "purple" },
  { id: "tech", label: "Technology", theme: "blue" },
  { id: "culture", label: "Culture", theme: "coral" },
];

const ALL_TAGS = ["#ai", "#space", "#mind", "#ethics", "#biology", "#future", "#language", "#quantum"];

const INITIAL_QUESTIONS = [
  {
    id: 1, cat: "science", tags: ["#space", "#quantum"],
    text: "Is dark matter composed of particles we haven't discovered yet?",
    author: "Priya S.", initials: "PS", time: "2h ago", answerCount: 18, views: 342,
    answers: [
      { name: "Dr. Arjun M.", init: "AM", time: "1h ago", text: "Current leading candidates include WIMPs and axions. The LUX-ZEPLIN experiment has narrowed the parameter space significantly, but no direct detection yet.", votes: 12 },
      { name: "Radhika T.", init: "RT", time: "45m ago", text: "There's also a possibility that dark matter is primordial black holes formed right after the Big Bang, though LIGO observations have constrained that hypothesis too.", votes: 7 },
      { name: "Vikram N.", init: "VN", time: "20m ago", text: "Some physicists prefer modified gravity theories like MOND. The debate is still very much open.", votes: 5 },
    ],
  },
  {
    id: 2, cat: "philosophy", tags: ["#mind", "#ethics"],
    text: "Can a machine ever be truly conscious, or only simulate consciousness?",
    author: "Aditya K.", initials: "AK", time: "5h ago", answerCount: 34, views: 891,
    answers: [
      { name: "Meena L.", init: "ML", time: "4h ago", text: "The hard problem of consciousness (Chalmers) suggests even a perfect functional simulation might lack qualia — the 'what it's like' experience.", votes: 21 },
      { name: "Rohan B.", init: "RB", time: "3h ago", text: "Functionalists would disagree — if the causal structure matches, consciousness follows. Substrate independence implies silicon could be just as conscious as neurons.", votes: 14 },
    ],
  },
  {
    id: 3, cat: "tech", tags: ["#ai", "#future"],
    text: "Will large language models eventually plateau, or is scaling indefinitely effective?",
    author: "Sana R.", initials: "SR", time: "1d ago", answerCount: 27, views: 619,
    answers: [
      { name: "Kiran D.", init: "KD", time: "22h ago", text: "Chinchilla scaling laws suggest we've been training on too little data for model size. Compute-optimal training still hits diminishing returns on reasoning tasks.", votes: 18 },
      { name: "Preethi V.", init: "PV", time: "18h ago", text: "The bottleneck is likely data quality and diversity, not just scale. Synthetic data generation is one path forward, though it risks mode collapse.", votes: 11 },
    ],
  },
  {
    id: 4, cat: "culture", tags: ["#language", "#mind"],
    text: "Does the language you speak fundamentally shape how you think?",
    author: "Deepa J.", initials: "DJ", time: "2d ago", answerCount: 41, views: 1204,
    answers: [
      { name: "Siddharth M.", init: "SM", time: "2d ago", text: "The Sapir-Whorf hypothesis in its strong form is largely discredited, but weaker linguistic relativity has empirical support.", votes: 29 },
      { name: "Nalini C.", init: "NC", time: "1d ago", text: "Russian speakers distinguish light and dark blue as separate categories, and studies show they're faster at discriminating those shades.", votes: 16 },
    ],
  },
];

const AVATAR_THEMES = ["purple", "teal", "blue", "coral", "amber"];

function Avatar({ initials, index, size = "md" }) {
  const theme = AVATAR_THEMES[index % AVATAR_THEMES.length];
  return (
    <div className={`avatar avatar--${size} avatar--${theme}`}>
      {initials}
    </div>
  );
}

function CategoryBadge({ cat }) {
  const c = CATEGORIES.find(c => c.id === cat);
  if (!c?.theme) return null;
  return <span className={`badge badge--${c.theme}`}>{c.label}</span>;
}

function TagChip({ tag, active, onClick }) {
  return (
    <button
      className={`tag-chip ${active ? "tag-chip--active" : ""}`}
      onClick={() => onClick(tag)}
    >
      {tag}
    </button>
  );
}

function AnswerItem({ answer, index, qId }) {
  const [votes, setVotes] = useState(answer.votes);
  const [voted, setVoted] = useState(false);

  const handleVote = () => {
    setVotes(v => voted ? v - 1 : v + 1);
    setVoted(v => !v);
  };

  return (
    <div className="answer-item">
      <div className="answer-item__header">
        <Avatar initials={answer.init} index={qId * 3 + index} size="sm" />
        <span className="answer-item__name">{answer.name}</span>
        <span className="answer-item__time">{answer.time}</span>
      </div>
      <p className="answer-item__text">{answer.text}</p>
      <div className="answer-item__actions">
        <button
          className={`vote-btn ${voted ? "vote-btn--active" : ""}`}
          onClick={handleVote}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1.5L9.5 8H1.5L5.5 1.5Z" fill="currentColor" />
          </svg>
          {votes}
        </button>
        <button className="reply-btn">Reply</button>
      </div>
    </div>
  );
}

function QuestionCard({ question, isOpen, onToggle, onAddAnswer }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  const handlePost = () => {
    if (!input.trim()) return;
    onAddAnswer(question.id, input.trim());
    setInput("");
  };

  return (
    <div className={`q-card ${isOpen ? "q-card--open" : ""}`}>
      <div className="q-card__head" onClick={onToggle}>
        <Avatar initials={question.initials} index={question.id} />
        <div className="q-card__body">
          <p className="q-card__text">{question.text}</p>
          <div className="q-card__meta">
            <CategoryBadge cat={question.cat} />
            {question.tags.map(t => (
              <span key={t} className="q-card__tag">{t}</span>
            ))}
          </div>
        </div>
        <div className="q-card__stats">
          <span className="q-card__stat">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5C1 3.46 3.46 1 6.5 1S12 3.46 12 6.5c0 1.12-.32 2.16-.87 3.04L12 12l-2.46-.87A5.48 5.48 0 0 1 6.5 12C3.46 12 1 9.54 1 6.5Z" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
            {question.answerCount}
          </span>
          <span className="q-card__stat">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <ellipse cx="6.5" cy="6.5" rx="5.5" ry="3.5" stroke="currentColor" strokeWidth="1" />
              <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
            </svg>
            {question.views}
          </span>
          <svg className={`chevron ${isOpen ? "chevron--open" : ""}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="q-card__feed">
          <div className="q-card__answers">
            {question.answers.length === 0 && (
              <p className="q-card__empty">No answers yet. Be the first!</p>
            )}
            {question.answers.map((a, i) => (
              <AnswerItem key={i} answer={a} index={i} qId={question.id} />
            ))}
          </div>
          <div className="q-card__compose">
            <Avatar initials="ME" index={7} size="sm" />
            <input
              ref={inputRef}
              className="compose-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handlePost()}
              placeholder="Write an answer…"
            />
            <button
              className={`compose-submit ${input.trim() ? "compose-submit--active" : ""}`}
              onClick={handlePost}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AskModal({ onClose, onSubmit }) {
  const [text, setText] = useState("");
  const [cat, setCat] = useState("science");
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (t) =>
    setSelectedTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({ text, cat, tags: selectedTags });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <span className="modal__title">Ask a question</span>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>

        <textarea
          className="modal__textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What's your question?"
          rows={3}
        />

        <p className="modal__label">Category</p>
        <div className="modal__cats">
          {CATEGORIES.filter(c => c.id !== "all").map(c => (
            <button
              key={c.id}
              className={`cat-btn cat-btn--${c.theme} ${cat === c.id ? "cat-btn--active" : ""}`}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <p className="modal__label">Tags</p>
        <div className="modal__tags">
          {ALL_TAGS.map(t => (
            <TagChip key={t} tag={t} active={selectedTags.includes(t)} onClick={toggleTag} />
          ))}
        </div>

        <div className="modal__footer">
          <button className="modal__cancel" onClick={onClose}>Cancel</button>
          <button
            className={`modal__submit ${text.trim() ? "modal__submit--ready" : ""}`}
            onClick={handleSubmit}
          >
            Post question
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DemoQuestionsFeed() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [activeCat, setActiveCat] = useState("all");
  const [activeTag, setActiveTag] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState("new");
  // ✅ ADD YOUR NEW STATE HERE (NOT ABOVE FILE)
  const [showFilters, setShowFilters] = useState(false);
  const toggleTag = (t) => setActiveTag(p => p === t ? null : t);

  const filtered = questions
    .filter(q =>
      (activeCat === "all" || q.cat === activeCat) &&
      (!activeTag || q.tags.includes(activeTag))
    )
    .sort((a, b) => sort === "top" ? b.views - a.views : b.id - a.id);

  const addAnswer = (qid, text) => {
    setQuestions(qs => qs.map(q => q.id !== qid ? q : {
      ...q,
      answerCount: q.answerCount + 1,
      answers: [...q.answers, { name: "You", init: "ME", time: "just now", text, votes: 0 }],
    }));
  };

  const addQuestion = ({ text, cat, tags }) => {
    const nq = {
      id: Date.now(), cat, tags, text,
      author: "You", initials: "ME",
      time: "just now", answerCount: 0, views: 1, answers: [],
    };
    setQuestions(qs => [nq, ...qs]);
    setOpenId(nq.id);
  };

  return (
    <div className="questions-feed mt-2">
      {showModal && (
        <AskModal onClose={() => setShowModal(false)} onSubmit={addQuestion} />
      )}

      <div className="questions-feed__header">
        <div>
          <h2 className="questions-feed__title">Interesting questions</h2>
          <p className="questions-feed__count">{filtered.length} question{filtered.length !== 1 ? "s" : ""}</p>

        </div>
        <div className="sort-toggle">
               <div className="questions-feed__filters">

        {/* FILTER BUTTON */}
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(prev => !prev)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 5h18M6 12h12M10 19h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Filters
        </button>

        {/* CATEGORY LIST (SHOW/HIDE) */}
        {showFilters && (
          <div className="cat-pills">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`cat-pill ${activeCat === c.id
                    ? `cat-pill--active cat-pill--${c.theme || "default"}`
                    : ""
                  }`}
                onClick={() => setActiveCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

      </div>
          {["new", "top"].map(s => (
            <button
              key={s}
              className={`sort-btn ${sort === s ? "sort-btn--active" : ""}`}
              onClick={() => setSort(s)}
            >
              {s === "new" ? "Newest" : "Top"}
            </button>
          ))}
        </div>
        <button className="ask-btn d-none" onClick={() => setShowModal(true)}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Ask a question
        </button>
      </div>


      <div className="questions-feed__tags">
        {ALL_TAGS.map(t => (
          <TagChip key={t} tag={t} active={activeTag === t} onClick={toggleTag} />
        ))}
      </div>

      <div className="questions-feed__list">
        {filtered.length === 0 ? (
          <div className="questions-feed__empty">No questions match this filter.</div>
        ) : (
          filtered.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              isOpen={openId === q.id}
              onToggle={() => setOpenId(p => p === q.id ? null : q.id)}
              onAddAnswer={addAnswer}
            />
          ))
        )}
      </div>
    </div>
  );
}