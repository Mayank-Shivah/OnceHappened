import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { isLoggedIn, loggedUser } from "../../services/authService";
import { toast } from "react-toastify";
import api from "../../api";
import "./style.scss";

Modal.setAppElement("#root");

export default function FloatingEditModal({ editPost = null, onClose, defaultCategory = null }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [selectedTopics, setSelectedTopics] = useState([]); // still array for compatibility
  const [topics, setTopics] = useState([]);

  const dropdownRef = useRef();
  const user = loggedUser();

  // open modal if editing
  useEffect(() => {
    if (editPost) {
      setModalOpen(true);

      // preload content
      if (editPost.description) {
        const blocksFromHtml = htmlToDraft(editPost.description);
        if (blocksFromHtml) {
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
          setEditorState(EditorState.createWithContent(contentState));
        }
      }

      // preload topics from draft (pick first one only for single select)
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

          // ✅ If adding a new post (not editing)
          if (!editPost) {
            if (defaultCategory) {
              setSelectedTopics([defaultCategory]);
            } else if (res.data.topics.length > 0 && selectedTopics.length === 0) {
              setSelectedTopics([res.data.topics[0].id]);
            }
          }
        }
      } catch (err) {
        toast.error("Failed to load topics");
      }
    };
    fetchTopics();
  }, [defaultCategory, editPost]);

  // close dropdown when clicking outside
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

  // 🔹 toggle topic (single select now → replaces whole array with one value)
  const toggleTopic = (topicId) => {
    setSelectedTopics([topicId]);
  };

  const handleClick = () => {
    if (isLoggedIn()) {
      setModalOpen(true);
    } else {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2500);
    }
  };

  // ✅ Save Draft
  const handleSaveDraft = async () => {
    try {
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      if (!content.trim() || selectedTopics.length === 0) {
        toast.error("Please select a topic and add some content");
        return;
      }
      const token = localStorage.getItem("token");

      if (editPost) {
        await api.put(
          `/posts/${editPost.id}`,
          { content, topic_id: selectedTopics, status: "published" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Draft updated successfully!");
      } else {
        await api.post(
          "/posts/submit",
          { content, topic_id: selectedTopics, status: "published" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Draft saved successfully!");
      }

      localStorage.setItem("postDraft", JSON.stringify({ selectedTopics, content }));
      setModalOpen(false);
      onClose?.();
    } catch (err) {
      toast.error("Failed to save draft");
    }
  };

  // ✅ Publish Post
  const handlePublish = async () => {
    try {
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      if (!content.trim() || selectedTopics.length === 0) {
        toast.error("Please select a topic and add some content");
        return;
      }
      const token = localStorage.getItem("token");

      if (editPost) {
        await api.put(
          `/posts/${editPost.id}`,
          { content, topic_id: selectedTopics, status: "draft" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Draft Published");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        await api.post(
          "/posts/submit",
          { content, topic_id: selectedTopics, status: "draft" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Published Successfully.");
      }

      localStorage.removeItem("postDraft");
      setSelectedTopics(topics.length > 0 ? [topics[0].id] : []);
      setEditorState(EditorState.createEmpty());
      setModalOpen(false);
      onClose?.();
    } catch (err) {
      toast.error("Failed to publish post");
    }
  };

  return (
    <>
      {!editPost && (
     <div class="fe-edit">
         <div className="fab-wrapper">
          <button
            className={`fab-pen-animate ${!isLoggedIn() ? "disabled" : ""}`}
            onClick={handleClick}
            aria-label="Edit Section"
          >
            <img src="/images/writing.png" alt="Edit Icon" />
          </button>
          {!isLoggedIn() && showTooltip && (
            <div className="fab-tooltip">Please login first to add your post</div>
          )}
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
        style={{ overlay: { backgroundColor: "rgba(42,48,58,0.11)", zIndex: 1201 } }}
      >
       
        {/* <h2 style={{ marginBottom: 14 }}>
          {editPost ? "Edit Draft" : "Add Post"}
        </h2> */}

        {/* Topics Dropdown */}
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
        <div className="multiselect-dropdown d-none" ref={dropdownRef} style={{ marginBottom: 15 }}>
          <button
            type="button"
            className="multiselect-control"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {selectedTopics.length
              ? topics
                  .filter((t) => selectedTopics.includes(t.id))
                  .map((t) => t.name)
                  .join(", ")
              : "Choose topic"}
          </button>
          {dropdownOpen && (
            <div className="multiselect-options">
              {topics.map((topic) => (
                <label key={topic.id}>
                  <input
                    className="input-custom"
                    type="radio"  // 🔹 changed from checkbox → radio
                    name="topic" // ensure single selection
                    checked={selectedTopics.includes(topic.id)}
                    onChange={() => toggleTopic(topic.id)}
                    style={{ marginRight: 7 }}
                  />
                  {topic.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Editor */}
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
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

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6,  }}>
          {!editPost && (
            <button className="modal-btn modal-btn-light" onClick={handleSaveDraft}>
              Save Draft
            </button>
          )}
          <button className="modal-btn modal-btn-custom" onClick={handlePublish}>
            {editPost ? "Publish" : "Publish"}
          </button>
        </div>
      </Modal>
    </>
  );
}
