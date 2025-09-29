import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./style.scss";
import QuestionCard from "../../components/QuestionCard";
import SidebarSearch from "../../components/SidebarSearch";
import FloatingEditModal from "../../components/FloatingEditModal";
import api from "../../api"; // axios instance
import { loggedUser           } from "../../services/authService";
import NoPost from "../NoPost";
import Swal from "sweetalert2"; // ✅ Added SweetAlert import

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Liked");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]); // ✅ new state
  const [loading, setLoading] = useState(false);

  const [editingDraft, setEditingDraft] = useState(null);
  const [wasEditing, setWasEditing] = useState(false); // ✅ New: Track if modal was opened for edit (to trigger refetch on close)

  const postsPerPage = 5;
  const user = loggedUser          ();
  
  // ✅ Extracted fetchPosts as standalone function (fixes ESLint "not defined" error)
  const fetchPosts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get("/topics");
      const posts = res.data?.posts || [];
      // ✅ Removed console.log for clean console

      // liked posts
      const userLiked = posts
        .filter(
          (p) =>
            Array.isArray(p.likes) &&
            p.likes.some(
              (like) =>
                String(like.user_id) === String(user.id) &&
                String(like.is_like) === "1"
            )
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setLikedPosts(userLiked);

      // drafts: Filter by status === "published" (drafts/pending admin approval, as clarified)
      const userDrafts = posts
        .filter((p) => p.user_id === user.id && p.status === "published")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setDraftPosts(userDrafts);

      // ✅ my posts: Show only "draft" (published/submitted), "approved", "unapproved" – exclude "published" (drafts) to avoid overlap
      const mine = posts
         .filter(
            (p) => 
              String(p.user_id) === String(user.id) && 
              (p.status === "draft" || p.status === "approved" || p.status === "unapproved")
          )
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setMyPosts(mine);
    } catch (err) {
      // ✅ Replaced console.error with SweetAlert for consistency
      Swal.fire('Error!', 'Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Initial load on mount
  useEffect(() => {
    fetchPosts();
  }, [user?.id]);

  // ✅ New: Refetch posts after editing modal closes (to sync new/updated content and status changes)
  const handleCloseModal = () => {
    if (wasEditing) {
      // Refetch to update UI with new content from server (e.g., after save/publish in modal)
      fetchPosts(); // ✅ Now accessible – no ESLint error
      setWasEditing(false); // Reset flag
    }
    setEditingDraft(null);
  };

  // search filters
  const filteredLikedPosts = likedPosts.filter((q) => {
    const text = (q.title || q.description || "").toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const filteredDraftPosts = draftPosts.filter((q) => {
    const text = (q.title || q.description || "").toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const filteredMyPosts = myPosts.filter((q) => {
    const text = (q.title || q.description || "").toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const currentList =
    activeTab === "Liked"
      ? filteredLikedPosts
      : activeTab === "Drafts"
      ? filteredDraftPosts
      : filteredMyPosts; // ✅ handle My Posts

  // pagination
  const totalPages = Math.ceil(currentList.length / postsPerPage) || 1;
  const startIndex = (page - 1) * postsPerPage;
  const currentPosts = currentList.slice(startIndex, startIndex + postsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, activeTab]);

  // ✅ confirm swal (replaced confirmToast with SweetAlert confirmation)
  const confirmSwal = (message, onConfirm, onCancel) => {
    Swal.fire({
      title: 'Confirm',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      reverseButtons: true, // Cancel on left, Delete on right
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        onCancel?.();
      }
    });
  };

  // delete draft
  const handleDeleteDraft = (id) => {
    confirmSwal(
      "Are you sure you want to delete this draft?",
      async () => {
        try {
          await api.delete(`/posts/${id}`);
          setDraftPosts((prev) => prev.filter((p) => p.id !== id));
          Swal.fire('Success!', 'Draft deleted successfully', 'success');
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete draft', 'error');
        }
      },
      () => {
        Swal.fire('Info', 'Delete canceled', 'info');
      }
    );
  };

  // open edit modal
  const handleEditDraft = (draft) => {
    setEditingDraft(draft);
    setWasEditing(true); // ✅ Set flag for refetch on close (only for edits, not new drafts)
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
        <button
          className={`outline-btn ${activeTab === "MyPosts" ? "active" : ""}`}
          onClick={() => setActiveTab("MyPosts")}
        >
          My Posts
        </button>
      </div>

      {/* Search */}
      <SidebarSearch
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Posts */}
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
              showCounts={activeTab === "MyPosts"}
              // ✅ Fix: Pass isLiked prop for "Liked" tab to ensure like icon is red/filled
              isLiked={activeTab === "Liked"}
              // ✅ New: Pass status for "My Posts" tab (render at right bottom, parallel to counts)
              // Note: In QuestionCard, handle "published" as "Draft" if needed for display (but excluded here)
              status={activeTab === "MyPosts" ? q.status : null}
              onEdit={() => handleEditDraft(q)}
              onDelete={() => handleDeleteDraft(q.id)}
            />
          ))}

        {/* No Posts */}
        {!loading && currentList.length === 0 && (
          <NoPost
            message={
              activeTab === "Liked"
                ? "No post available"
                : activeTab === "Drafts"
                ? "No posts yet"
                : "You haven't created any posts yet"
            }
            subMessage={
              activeTab === "Liked"
                ? "Try liking/saving a post, thanks!"
                : activeTab === "Drafts"
                ? "Try writing a new post, thanks!"
                : "Start creating content and it will show here!"
            }
            onAddNew={
              activeTab === "Drafts" ? () => {
                setEditingDraft({}); // New draft – no wasEditing flag
              } : null
            }
          />
        )}
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
          onClose={handleCloseModal} // ✅ Updated: Custom close handler with refetch logic
        />
      )}
    </div>
  );
};

export default Profile;
