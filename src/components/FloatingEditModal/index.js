import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { FaPen } from "react-icons/fa";
import "./style.scss";
const topics = [
  "Education",
  "Information",
  "Science",
  "Mathematics",
  "Remote Learning",
  "Java",
  "Crypto Market",
  "Parenting"
];

Modal.setAppElement("#root");

export default function FloatingEditModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // New state for heading input
  const [headingBlog, setHeadingBlog] = useState("");

  // Dropdown close on outside click
  const dropdownRef = useRef();
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  function toggleTopic(topic) {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  }

  return (
    <>
      <button
        className="fab-pen-animate"
        onClick={() => setModalOpen(true)}
        aria-label="Edit Section"
      >
        <img src="/images/writing.png" alt="Edit Icon" />
      </button>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        className="modal-animate modal-set-up"
        style={{
          content: {},
          overlay: { backgroundColor: "rgba(42,48,58,0.11)", zIndex: 1201 }
        }}
      >
        <button className="modal-close-btn" aria-label="Close" onClick={() => setModalOpen(false)}>
          ×
        </button>
        <h2 style={{ marginBottom: 14 }}>Edit Section</h2>
        <div className="modal-label">Topics</div>
        <div className="multiselect-dropdown" ref={dropdownRef} style={{ marginBottom: 15 }}>
          <button
            type="button"
            className="multiselect-control"
            onClick={() => setDropdownOpen(open => !open)}
          >
            {selectedTopics.length ? selectedTopics.join(", ") : "Choose topic(s)"}
          </button>
          {dropdownOpen && (
            <div className="multiselect-options">
              {topics.map(topic => (
                <label key={topic}>
                  <input
                    className="input-custom"
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                    style={{ marginRight: 7 }}
                  />
                  {topic}
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Heading Blog input field */}
        <label htmlFor="headingBlog" className="modal-label ">Heading Blog</label>
        <input
          type="text"
          id="headingBlog"
          name="headingBlog"
          value={headingBlog}
          onChange={(e) => setHeadingBlog(e.target.value)}
          placeholder="Enter blog heading"
          className="modal-input"
          style={{ marginBottom: 15 }}
        />
        {/* WYSIWYG Editor */}
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbarClassName="editor-toolbar"
          wrapperClassName="editor-wrapper"
          editorClassName="editor-textarea"
          toolbar={{
            options: ['blockType', 'inline', 'list'],
            inline: { options: ['bold', 'italic'] },
            blockType: { inDropdown: true, options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote'] },
          }}
          placeholder="Write your section content..."
        />
        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
          <button className="modal-btn modal-btn-light" onClick={() => setModalOpen(false)}>Save Draft</button>
          <button className="modal-btn modal-btn-custom" onClick={() => setModalOpen(false)}>Save Ad</button>
        </div>
      </Modal>
    </>
  );
}
