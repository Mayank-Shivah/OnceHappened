import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { Editor } from "react-draft-wysiwyg";
import DOMPurify from "dompurify";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { isLoggedIn, loggedUser   } from "../../services/authService";
import Swal from "sweetalert2";
import api from "../../api";
import { usePopup } from "../PopupManager";   // ✅ import popup context
import "./style.scss";

Modal.setAppElement("#root");

const MIN_WORDS = 45;
const MAX_WORDS = 500;

export default function FloatingEditModal({
  editPost = null,
  onClose,
  defaultCategory = null,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topics, setTopics] = useState([]);
  const [wordCount, setWordCount] = useState(0); // ✅ word count state

  const dropdownRef = useRef();
  const user = loggedUser   ();

  // ✅ use popup manager
  const { openRegister } = usePopup();

  // open modal if editing post
  useEffect(() => {
    if (editPost) {
      setModalOpen(true);

      if (editPost.description) {
        const blocksFromHtml = htmlToDraft(editPost.description);
        if (blocksFromHtml) {
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
        }
      }

      if (editPost.topics?.length > 0) {
        setSelectedTopics([editPost.topics[0].id]);
      }
    }
  }, [editPost]);

  // fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get("/topics");
        if (res.data?.status && Array.isArray(res.data.topics)) {
          setTopics(res.data.topics);

          if (!editPost) {
            if (defaultCategory) {
              setSelectedTopics([defaultCategory]);
            } else if (res.data.topics.length > 0 && selectedTopics.length === 0) {
              setSelectedTopics([res.data.topics[0].id]);
            }
          }
        }
      } catch (err) {
        Swal.fire('Error!', 'Failed to load topics', 'error');
      }
    };
    fetchTopics();
  }, [defaultCategory, editPost]);

  // close dropdown outside click
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

  // toggle topic
  const toggleTopic = (topicId) => {
    setSelectedTopics([topicId]);
  };

  // ✅ Floating button click
  const handleClick = () => {
    if (isLoggedIn()) {
      setModalOpen(true);
    } else {
      openRegister(); // 🔹 open signup popup instead of tooltip
    }
  };

  // ✅ track word count
  const handleEditorChange = (state) => {
    setEditorState(state);
    const plainText = state.getCurrentContent().getPlainText("\u0001");
    const words = plainText.trim().split(/\s+/).filter((w) => w.length > 0);
    setWordCount(words.length);
  };

  const cleanContent = () => {
    const raw = convertToRaw(editorState.getCurrentContent());
    const dirtyHtml = draftToHtml(raw);

    // Clean the HTML → keep only minimal tags
    return DOMPurify.sanitize(dirtyHtml, { 
      ALLOWED_TAGS: ["p", "br", "ul", "ol", "li", "b", "i", "u"],
      ALLOWED_ATTR: [] // no inline styles allowed
    });
  };

  // ✅ Save Draft
  const handleSaveDraft = async () => {
    try {
      const content = cleanContent();
      const token = localStorage.getItem("token");

      if (editPost) {
        await api.put(
          `/posts/${editPost.id}`,
          { 
            content,               // ✅ required
            topic_id: selectedTopics,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Draft Updated",
          text: "Your draft was updated successfully!",
          confirmButtonText: "OK"
        });
      } else {
        await api.post(
          "/posts/submit",
          { content, topic_id: selectedTopics, status: "published" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Draft Saved",
          text: "Your draft was saved successfully!",
          confirmButtonText: "OK"
        });
      }

      setEditorState(EditorState.createEmpty());
      setSelectedTopics(topics.length > 0 ? [topics[0].id] : []);
      setModalOpen(false);
      onClose?.();
    } catch (err) {
      Swal.fire('Error!', 'Failed to save draft', 'error');
    }
  };

  // ✅ Publish Post
  const handlePublish = async () => {
    try {
      const content = cleanContent();  // ✅ cleaned HTML (like your example)

      const token = localStorage.getItem("token");

      if (editPost) {
        await api.put(
          `/posts/${editPost.id}`,
          { 
            content,               // ✅ backend requires this
            topic_id: selectedTopics, // ✅ must be an array
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Post Published",
          text: "Your draft has been updated and sent for admin approval.",
          confirmButtonText: "OK"
        });
      } else {
        await api.post(
          "/posts/submit",
          { content, topic_id: selectedTopics, status: "draft" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Published",
          text: "Your post has been published successfully.",
          confirmButtonText: "OK"
        }).then(() => {
          // 🔹 reload optional — remove if not needed
          window.location.reload();
        });
      }

      localStorage.removeItem("postDraft");
      setSelectedTopics(topics.length > 0 ? [topics[0].id] : []);
      setEditorState(EditorState.createEmpty());
      setModalOpen(false);
      onClose?.();
    } catch (err) {
      Swal.fire("Error!", "Failed to publish post", "error");
    }
  };

  // ✅ Validation checks for bottom messages
  const isTopicValid = selectedTopics.length > 0;
  
  // Separate validations: Save Draft allows 1+ words, Publish requires 45-500
  const isSaveDraftValid = wordCount > 0 && wordCount <= MAX_WORDS && isTopicValid;
  const isPublishValid = wordCount >= MIN_WORDS && wordCount <= MAX_WORDS && isTopicValid;

  return (
    <>
      {!editPost && (
        <div className="fe-edit">
          <div className="fab-wrapper">
            <button
              className={`fab-pen-animate ${!isLoggedIn() ? "disabled" : ""}`}
              onClick={handleClick}
              aria-label="Edit Section"
            >
              <img src="/images/writing.png" alt="Edit Icon" />
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
          onClose?.();
        }}
        shouldCloseOnOverlayClick={true}
        className="modal-animate modal-set-up"
        style={{
          overlay: { backgroundColor: "rgba(42,48,58,0.11)", zIndex: 1201 },
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-">
          <div className="modal-label mb-0">
            {selectedTopics.length > 0
              ? topics.find((t) => t.id === selectedTopics[0])?.name ||
                "Topics Name"
              : "Topics Name"}
          </div>
          <button
            className="modal-close-btn position-relative top-0 end-0"
            aria-label="Close"
            onClick={() => {
              setModalOpen(false);
              onClose?.();
            }}
          >
            ×
          </button>
        </div>

        {/* Editor */}
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange} // ✅ track words
          toolbarClassName="editor-toolbar"
          wrapperClassName="editor-wrapper"
          editorClassName="editor-textarea"
          toolbar={{
            options: ["blockType", "inline", "list"],
            inline: { options: ["bold", "italic"] },
            blockType: {
              inDropdown: true,
              options: ["Normal", "H1", "H2", "H3", "Blockquote"],
            },
          }}
          placeholder="Write yours..."
        />

        {/* ✅ Word Counter + Field Validations + Warnings (Bottom of Form Only) */}
        <div className="wordCountSection">
          <div style={{ textAlign: "left" }}>
            {/* Word Count Validation Message */}
            <div
              style={{
                fontSize: "12px",
                color:
                  wordCount < MIN_WORDS || wordCount > MAX_WORDS ? "red" : "gray",
              }}
            >
              Word count: {wordCount} / {MAX_WORDS}
            </div>
            {wordCount === 0 && (
              <div style={{ color: "red", fontSize: "12px" }}>
                Please add some content to save draft
              </div>
            )}
            {wordCount > 0 && wordCount < MIN_WORDS && (
              <div style={{ color: "red", fontSize: "12px" }}>
                Minimum {MIN_WORDS} words required to publish (drafts can be shorter)
              </div>
            )}
            {wordCount > MAX_WORDS && (
              <div style={{ color: "red", fontSize: "12px" }}>
                Word limit exceeded! Maximum {MAX_WORDS} words allowed
              </div>
            )}

            {/* Topic Selection Validation Message */}
            {!isTopicValid && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                Please select a topic to continue
              </div>
            )}

            {/* Overall Form Validation Message (if needed, but buttons handle disable) */}
            {/* {!isSaveDraftValid && !isPublishValid && (
              <div style={{ color: "orange", fontSize: "12px", marginTop: "4px" }}>
                Fix the above issues to enable buttons
              </div>
            )} */}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {!editPost && (
              <button
                className="modal-btn modal-btn-light"
                onClick={handleSaveDraft}
                disabled={!isSaveDraftValid}  // ✅ Allows 1+ words + topic, disables on empty or >500 or no topic
              >
                Save Draft
              </button>
            )}
            <button
              className="modal-btn modal-btn-custom"
              onClick={handlePublish}
              disabled={!isPublishValid}  // ✅ Strict: 45-500 words + topic
            >
              {editPost ? "Publish" : "Publish"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
