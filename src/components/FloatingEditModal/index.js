import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { Editor } from "react-draft-wysiwyg";
import DOMPurify from "dompurify";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { isLoggedIn, loggedUser } from "../../services/authService";
import Swal from "sweetalert2";
import api from "../../api";
import { usePopup } from "../PopupManager"; // Popup context
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
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef();
  const user = loggedUser();

  const { openRegister } = usePopup();

  // Open modal if editing existing post and populate editor & selected topic
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
          const initialEditorState = EditorState.createWithContent(contentState);
          setEditorState(initialEditorState);
          setWordCount(getWordsFromEditorState(initialEditorState));
        }
      }

      if (editPost.topics?.length > 0) {
        setSelectedTopics([editPost.topics[0].id]);
      }
    }
  }, [editPost]);

  // Fetch topics from API and set default topic selection
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
        Swal.fire("Error!", "Failed to load topics", "error");
      }
    };
    fetchTopics();
  }, [defaultCategory, editPost]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Change selected topic (single select)
  const toggleTopic = (topicId) => {
    setSelectedTopics([topicId]);
  };

  // Calculate word count from EditorState content
  const getWordsFromEditorState = (state) => {
    try {
      const plainText = state.getCurrentContent().getPlainText("\u0001");
      const words = plainText.trim().split(/\s+/).filter((w) => w.length > 0);
      return words.length;
    } catch {
      return 0;
    }
  };

  // Open modal on floating edit button click or show register popup
  const handleClick = () => {
    if (isLoggedIn()) {
      setEditorState(EditorState.createEmpty());
      setWordCount(0);
      setModalOpen(true);
    } else {
      openRegister();
    }
  };

  // Track editor text changes and update word count
  const handleEditorChange = (state) => {
    setEditorState(state);
    setWordCount(getWordsFromEditorState(state));
  };

  // Sanitize and clean editor HTML content
  const cleanContent = () => {
    const raw = convertToRaw(editorState.getCurrentContent());
    const dirtyHtml = draftToHtml(raw);
    return DOMPurify.sanitize(dirtyHtml, {
      ALLOWED_TAGS: ["p", "br", "ul", "ol", "li", "b", "i", "u"],
      ALLOWED_ATTR: [],
    });
  };

  // Save draft to backend
  const handleSaveDraft = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const content = cleanContent();
      const token = localStorage.getItem("token");

      if (editPost) {
        await api.put(
          `/posts/${editPost.id}`,
          { content, topic_id: selectedTopics },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Draft Updated",
          text: "Your draft was updated successfully!",
          confirmButtonText: "OK",
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
          confirmButtonText: "OK",
        });
      }

      setModalOpen(false);
      setEditorState(EditorState.createEmpty());
      setWordCount(0);
      setSelectedTopics(topics.length > 0 ? [topics[0].id] : []);
      onClose?.();
    } catch (err) {
      Swal.fire("Error!", "Failed to save draft", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Publish post to backend
  const handlePublish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const content = cleanContent();
      const token = localStorage.getItem("token");

      if (editPost) {
        await api.put(
          `/posts/${editPost.id}`,
          { content, topic_id: selectedTopics },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Post Published",
          text: "Your draft has been updated and sent for review",
          confirmButtonText: "OK",
        });
      } else {
        await api.post(
          "/posts/submit",
          { content, topic_id: selectedTopics, status: "draft" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Send for reviewing",
          text: "Will be published shortly.",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload();
        });
      }

      localStorage.removeItem("postDraft");
      setSelectedTopics(topics.length > 0 ? [topics[0].id] : []);
      setEditorState(EditorState.createEmpty());
      setWordCount(0);
      setModalOpen(false);
      onClose?.();
    } catch (err) {
      Swal.fire("Error!", "Failed to publish post", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation flags
  const isTopicValid = selectedTopics.length > 0;
  const isSaveDraftValid = wordCount > 0 && wordCount <= MAX_WORDS && isTopicValid;
  const isPublishValid =
    wordCount >= MIN_WORDS && wordCount <= MAX_WORDS && isTopicValid;

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
              ? topics.find((t) => t.id === selectedTopics[0])?.name || "Topics Name"
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

        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
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
          placeholder=""
        />

        <div className="wordCountSection">
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: "12px",
                color: wordCount < MIN_WORDS || wordCount > MAX_WORDS ? "red" : "gray",
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
            {!isTopicValid && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                Please select a topic to continue
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {!editPost && (
              <button
                className="modal-btn modal-btn-light"
                onClick={handleSaveDraft}
                disabled={!isSaveDraftValid || isSubmitting}
              >
                Save Draft
              </button>
            )}
            <button
              className="modal-btn modal-btn-custom"
              onClick={handlePublish}
              disabled={!isPublishValid || isSubmitting}
            >
              {editPost ? "Publish" : "Publish"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
