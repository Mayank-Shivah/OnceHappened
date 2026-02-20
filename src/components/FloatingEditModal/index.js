import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import { isLoggedIn, loggedUser } from "../../services/authService";
import Swal from "sweetalert2";
import api from "../../api";
import { usePopup } from "../PopupManager";
import "./style.scss";

Modal.setAppElement("#root");

const MAX_WORDS = 500;

export default function FloatingEditModal({
  editPost = null,
  defaultCategory = null,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [step, setStep] = useState(1); // 1 = writing, 2 = finalizing


  const [title, setTitle] = useState("");

  /* TAGS */
  const [tags, setTags] = useState([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherTag, setOtherTag] = useState("");

  const tagRef = useRef(null);
  const user = loggedUser();
  const { openRegister } = usePopup();

  const availableTags = [
    { id: 1, label: "#Item 1" },
    { id: 2, label: "#Item 2" },
    { id: 3, label: "#Item 3" },
    { id: 4, label: "#Item 4" },
  ];

  const extractFirstLines = (state) => {
  const text = state.getCurrentContent().getPlainText("\n").trim();
  console.log(text.split("\n")[0]);
  return text.split("\n")[0] || "";
};

const extractFirstLineOLD = (state) => {
  const text = state.getCurrentContent().getPlainText(" ").trim();
  return text.split(".")[0] || "";
};

const extractFirstLine = (state) => {
  const text = state.getCurrentContent().getPlainText(" ").trim();
  const firstSentence = text.split(".")[0] || "";

  if (firstSentence.length <= 40) {
    return firstSentence;
  }

  const trimmed = firstSentence.substring(0, 100);
  const lastSpace = trimmed.lastIndexOf(" ");

  return trimmed.substring(0, lastSpace) + "...";
};

const handleNext = () => {
  const firstLine = extractFirstLine(editorState);
  setTitle(firstLine);
  setStep(2);
};

  /* 🔹 FETCH TOPICS */
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get("/topics");
        if (res.data?.status) {
          setTopics(res.data.topics || []);

          if (!editPost && res.data.topics?.length) {
            setSelectedTopic(defaultCategory || res.data.topics[0].id);
          }
        }
      } catch {
        Swal.fire("Error", "Failed to load topics", "error");
      }
    };
    fetchTopics();
  }, [defaultCategory, editPost]);

  /* 🔹 EDIT MODE */
  useEffect(() => {
    if (!editPost) return;

    setModalOpen(true);
    setTitle(editPost.title || "");

    if (editPost.description) {
      const blocks = htmlToDraft(editPost.description);
      if (blocks) {
        const contentState = ContentState.createFromBlockArray(
          blocks.contentBlocks,
          blocks.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    }

    if (editPost.topics?.length) {
      setSelectedTopic(editPost.topics[0].id);
    }
  }, [editPost]);

  /* 🔹 OUTSIDE CLICK FOR TAGS */
  useEffect(() => { 
    const handler = (e) => {
      if (tagRef.current && !tagRef.current.contains(e.target)) {
        setTagDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getWordCount = (state) =>
    state
      .getCurrentContent()
      .getPlainText(" ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  const handleEditorChange = (state) => {
    setEditorState(state);
    setWordCount(getWordCount(state));
  };

  /* TAG HANDLERS */
  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.find((t) => t.label === tag.label)
        ? prev.filter((t) => t.label !== tag.label)
        : [...prev, tag]
    );
  };

  const removeTag = (label) => {
    setTags((prev) => prev.filter((t) => t.label !== label));
  };

  const handleOtherAdd = () => {
    if (!otherTag.trim()) return;
    setTags((prev) => [...prev, { id: Date.now(), label: otherTag }]);
    setOtherTag("");
    setShowOtherInput(false);
  };

  const getHtmlFromEditor = () =>
    draftToHtml(convertToRaw(editorState.getCurrentContent()));

  const submitPost = async (status) => {
    // Validation: Check topic
    if (!selectedTopic) {
      return Swal.fire("Error", "Please select a topic", "warning");
    }

    // Validation: Min 50 words for publish
    if (status === "published" && wordCount < 50) {
      return Swal.fire(
        "Error",
        `Minimum 50 words required to publish (you have ${wordCount})`,
        "warning"
      );
    }

    // For drafts, only require 1 word minimum
    if (wordCount < 1) {
      return Swal.fire("Error", "Please write some content", "warning");
    }

    const contentHtml = getHtmlFromEditor();
    const finalTitle = title || extractFirstLines(editorState);

    const payload = {
      content: contentHtml, // API expects 'content' field
      topic_id: selectedTopic, // API expects 'topic_id' (singular)
      title: finalTitle, // save title for frontend display
      tags: tags.map((t) => t.label).join(","), // send as comma-separated string
      status: status,
    };

    try {
      let res;
      if (editPost?.id) {
        // For updates, use the update endpoint
        res = await api.put(`/posts/${editPost.id}`, {
          content: contentHtml,
          topic_id: [selectedTopic], // update expects array
          title: finalTitle,
          tags: tags.map((t) => t.label).join(","),
        });
      } else {
        // For new posts, use /posts/submit
        res = await api.post(`/posts/submit`, payload);
      }

      if (res.data?.success || res.data?.status) {
        const msg =
          status === "draft"
            ? "Draft saved successfully!"
            : "Post published successfully!";
        Swal.fire("Success", msg, "success");
        setModalOpen(false);
        // Reload to show new post in feed (for publish only)
        if (status !== "draft") {
          setTimeout(() => window.location.reload(), 500);
        }
      } else {
        Swal.fire("Error", res.data?.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to submit post",
        "error"
      );
    }
  };

  const handleSaveDraft = () => submitPost("draft");
  const handlePublish = () => submitPost("published");

  return (
    <>
      {!editPost && (
        <div className="fe-edit">
          <button
            className="fab-pen-animate"
            onClick={() =>
              isLoggedIn() ? setModalOpen(true) : openRegister()
            }
          >
            <img src="/images/writing.png" alt="Write" />
          </button>
        </div>
      )}

      <Modal isOpen={modalOpen} className="modal-animate modal-set-up">
        {/* HEADER */}
        <div className="d-flex justify-content-between mb-3">
          <div className="modal-label">
            {topics.find((t) => t.id === selectedTopic)?.name || "Topic"}
          </div>
          <button className="modal-close-btn" onClick={() => setModalOpen(false)} >
            ×
          </button>
        </div>

        {/*  */}
        <div className="containers">
          <div className="row align-items-start justify-content-between">
            {/*  */}
         {step === 1 && (
            <div className="col-12 signle-topic">
              {/* 🔹 TOPIC DROPDOWN */}
              <div className="mb-3">
                <select
                  className="custom-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Select Topic
                  </option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            )}
           {/*  */}

            {step === 2 && (
            <div className=" col-12">
              {/* 🔹 TAGS */}
              <div className="custom-tag-wrapper mb-3" ref={tagRef}>
                <div
                  className="custom-tag-input"
                  onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
                >
                  {tags.length === 0 && (
                    <span className="tag-placeholder">Select tags</span>
                  )}
                  {tags.map((tag) => (
                    <span key={tag.id} className="tag-pill">
                      {tag.label}
                      <span
                        className="tag-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(tag.label);
                        }}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                </div>

                {tagDropdownOpen && (
                  <div className="custom-tag-dropdown">
                    {availableTags.map((tag) => (
                      <label key={tag.id} className="tag-option">
                        <input
                          type="checkbox"
                          checked={!!tags.find((t) => t.label === tag.label)}
                          onChange={() => toggleTag(tag)}
                        />
                        {tag.label}
                      </label>
                    ))}

                    <label className="tag-option">
                      <input
                        type="checkbox"
                        checked={showOtherInput}
                        onChange={() => setShowOtherInput(!showOtherInput)}
                      />
                      Other
                    </label>

                    {showOtherInput && (
                      <input
                        className="custom-input mt-2"
                        placeholder="Enter custom tag"
                        value={otherTag}
                        onChange={(e) => setOtherTag(e.target.value)}
                        onBlur={handleOtherAdd}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleOtherAdd();
                          }
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            )}
            {/*  */}

            {/*  */}
            {step === 2 && (
            <div className=" col-12">
              {/* 🔹 TITLE */}
              <input
                className="custom-input mb-3"
                placeholder="Enter topic title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 20))}
                maxLength="40"
              />
              <small className="text-muted">{title.length}/20</small>
            </div>
            )}
            {/*  */}

          </div>

        </div>


        {/*  */}









        {/* 🔹 EDITOR */}
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          toolbarHidden
          wrapperClassName="editor-wrapper"
          editorClassName="editor-textarea"
        />

        {/* FOOTER */}
        <div className="wordCountSection">
          <span>
            Word count: {wordCount}/{MAX_WORDS}
          </span>

          <div className="d-flex gap-2">
            {step === 1 && selectedTopic && wordCount > 0 && (
              <button
                className="modal-btn modal-btn-custom"
                onClick={handleNext}
              >
                Next
              </button>
            )}

            {step === 2 && (
              <>
                <button className="modal-btn modal-btn-light" onClick={handleSaveDraft}>
                  Save Draft
                </button>
                <button className="modal-btn modal-btn-custom" onClick={handlePublish}>
                  Publish
                </button>
              </>
            )}
          </div>
        </div>

      </Modal>
    </>
  );
}
