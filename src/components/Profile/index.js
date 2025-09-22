import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./style.scss";
import QuestionCard from "../../components/QuestionCard";
import SidebarSearch from "../../components/SidebarSearch";
import FloatingEditModal from "../../components/FloatingEditModal";
import api from "../../api"; // axios instance
import { loggedUser } from "../../services/authService";
import NoPost from "../NoPost";
import { toast } from "react-toastify";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Liked");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingDraft, setEditingDraft] = useState(null); // ✅ store draft being edited

  const postsPerPage = 5;
  const user = loggedUser();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await api.get("/topics");
        const posts = res.data?.posts || [];

        // liked posts (latest first)
        const userLiked = posts
          .filter(
            (p) =>
              p.likes?.some(
                (like) => like.user_id === user.id && like.is_like === 1
              )
          )
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setLikedPosts(userLiked);

        // drafts (status = published for this user) → latest first
        const userDrafts = posts
          .filter((p) => p.user_id === user.id && p.status === "published")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setDraftPosts(userDrafts);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]);

  // search filters
  const filteredLikedPosts = likedPosts.filter((q) => {
    const text = (q.title || q.description || "").toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const filteredDraftPosts = draftPosts.filter((q) => {
    const text = (q.title || q.description || "").toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const currentList =
    activeTab === "Liked" ? filteredLikedPosts : filteredDraftPosts;

  // pagination
  const totalPages = Math.ceil(currentList.length / postsPerPage) || 1;
  const startIndex = (page - 1) * postsPerPage;
  const currentPosts = currentList.slice(startIndex, startIndex + postsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, activeTab]);

  // 🔹 Confirm toast component
  const confirmToast = (message, onConfirm, onCancel) => {
    toast(
      ({ closeToast }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          <span>{message}</span>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "8px",
              width: "100%",
            }}
          >
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              style={{
                background: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "5px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                onCancel?.();
                closeToast();
              }}
              style={{
                background: "#6c757d",
                color: "#fff",
                border: "none",
                padding: "5px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // delete draft with confirm toast
  const handleDeleteDraft = (id) => {
    confirmToast(
      "Are you sure you want to delete this draft?",
      async () => {
        try {
          await api.delete(`/posts/${id}`);
          setDraftPosts((prev) => prev.filter((p) => p.id !== id));
          toast.success("Draft deleted successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (err) {
          console.error("Delete error:", err.response?.data || err.message);
          toast.error("Failed to delete draft");
        }
      },
      () => {
        toast.info("Delete canceled");
      }
    );
  };

  // open edit modal
  const handleEditDraft = (draft) => {
    setEditingDraft(draft);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="support-header">
        <button
          className={`outline-btn ${activeTab === "Liked" ? "active" : ""}`}
          onClick={() => setActiveTab("Liked")}
        >
          Liked
        </button>
        <button
          className={`outline-btn ${activeTab === "Drafts" ? "active" : ""}`}
          onClick={() => setActiveTab("Drafts")}
        >
          Drafts
        </button>
      </div>

      {/* Content */}
      <div className="pt-1">
        <SidebarSearch
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="pt-1">
          {loading && <p>Loading posts...</p>}

          {!loading &&
            currentPosts.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                showActions={activeTab === "Liked"}
                showDelete={activeTab === "Drafts"}
                showEdit={activeTab === "Drafts"}
                onEdit={() => handleEditDraft(q)} // ✅ pass draft
                onDelete={() => handleDeleteDraft(q.id)} // ✅ confirm + delete
              />
            ))}

         {!loading && currentList.length === 0 && (
  <NoPost 
    message={
      activeTab === "Liked"
        ? "No liked posts found."
        : "No drafts available."
    }
  />
)}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-div">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="page-btn"
          >
            <FaArrowLeft /> Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="page-btn"
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}

      {/* Edit Draft Modal */}
      {editingDraft && (
        <FloatingEditModal
          editPost={editingDraft}
          onClose={() => setEditingDraft(null)}
        />
      )}
    </div>
  );
};

export default Profile;
