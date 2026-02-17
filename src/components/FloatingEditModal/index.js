import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
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
          <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
            ×
          </button>
        </div>

        {/*  */}
        <div className="containers">
          <div className="row align-items-start justify-content-between">
            {/*  */}
            <div className="col-lg-4 col-md-4 col-6">
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
            {/*  */}
            <div className="col-lg-4 col-md-4 col-6">
              {/* 🔹 TITLE */}
              <input
                className="custom-input mb-3"
                placeholder="Enter topic title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            {/*  */}

            <div className="col-lg-4 col-md-4 col-12">
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
            <button className="modal-btn modal-btn-light">Save Draft</button>
            <button className="modal-btn modal-btn-custom">Publish</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
