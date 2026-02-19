import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaFacebook, FaInstagram, } from "react-icons/fa";
import "./style.scss";
import QuestionCard from "../../components/QuestionCard";
import SidebarSearch from "../../components/SidebarSearch";
import FloatingEditModal from "../../components/FloatingEditModal";
import api from "../../api"; // axios instance
import { loggedUser } from "../../services/authService";
import NoPost from "../NoPost";
import Swal from "sweetalert2"; // ✅ Added SweetAlert import

const Profile = () => {
  const TABS = {
    EDIT: "edit",
    PASSWORD: "password",
    LIKED: "liked",
    DRAFTS: "drafts",
    MY_POSTS: "myPosts",
    BOOKMARK: "bookmark",
  };
  const [activeTab, setActiveTab] = useState(TABS.EDIT);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);





  const [likedPosts, setLikedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]); // ✅ new state
  const [loading, setLoading] = useState(false);

  const [editingDraft, setEditingDraft] = useState(null);
  const [wasEditing, setWasEditing] = useState(false); // ✅ New: Track if modal was opened for edit (to trigger refetch on close)

  const postsPerPage = 5;
  const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("user")) || {}
);

  // ✅ Extracted fetchPosts as standalone function (fixes ESLint "not defined" error)
  const fetchPosts = async () => {
useEffect(() => {
  if (user?.id) {
    fetchPosts();
  }
}, [user?.id]);    try {
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
      // ✅ my posts: Show only "draft" and "approved"
      // ✅ My Posts: include both "draft" and "published" as "Pending", plus "approved" and "unapproved"
      const mine = posts
        .filter(
          (p) =>
            String(p.user_id) === String(user.id) &&
            (p.status === "draft" || p.status === "approved" || p.status === "un-approved")
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
    if (user?.id) {
      fetchPosts();
    }
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
    activeTab === TABS.LIKED
      ? filteredLikedPosts
      : activeTab === TABS.DRAFTS
        ? filteredDraftPosts
        : activeTab === TABS.MY_POSTS
          ? filteredMyPosts
          : [];// ✅ handle My Posts

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

  // handle toggle like
  const handleToggleLike = async (postId) => {
    try {
      // Call backend API to toggle like
      await api.post(`/posts/${postId}/toggle-like`);

      // Optimistically update UI: remove post from likedPosts immediately
      setLikedPosts((prev) => prev.filter((p) => p.id !== postId));

      // Optional: if you want to also update MyPosts/Drafts counts, you can sync there too
    } catch (err) {
      Swal.fire("Error!", "Failed to update like", "error");
    }
  };



  return (
    <>
      {/*  */}
      <div className="container-fluids">
        {/*  */}
        <div className="row">
          {/*  */}
          <div className="col-lg-3 col-md-4 col-sm-8 mx-auto">
            {/* LEFT PROFILE CARD */}
            <div className="profile-card">
              <div className="avatar-wrap">
                <span className="lang-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>

              </div>

              <h3>{user?.name}</h3>
              

              <div className="social-icons">
                <a href="https://www.facebook.com/people/oncehappened/61582009471567/?rdid=XspTKOOIXTqkEbzQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BLWoK8zGE%2F" target="_blank" rel="noreferrer" className="fac"><FaFacebook /></a>

                <a href="https://www.instagram.com/once.happened" target="_blank" rel="noreferrer" className="ins"><FaInstagram /></a>

              </div>

              <hr />

              <h4>Information</h4>
              <ul className="info-list">
                <li>
                  <span>Phone No</span>
                  <span>{user?.phone || "N/A"}</span>
                </li>

                <li>
                  <span>Birth of Date</span>
                  <span>{user?.dob || "N/A"}</span>
                </li>

                <li>
                  <span>Email</span>
                  <span>{user?.email}</span>
                </li>

                <li>
                  <span>City</span>
                  <span>{user?.city || "N/A"}</span>
                </li>

                <li>
                  <span>Country</span>
                  <span>{user?.country || "N/A"}</span>
                </li>

                <li>
                  <span>Joining Date</span>
                  <span>
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </li>

                <li>
                  <button
                    className="btn btn-dangers"
                    style={{ margin: 0, marginLeft: "auto" }}
                  >
                    Delete My Account
                  </button>
                </li>
              </ul>

            </div>
          </div>
          {/*  */}

          <div className="col-lg-9 col-md-8 col-sm-8 mx-auto">

            {/*  */}
            <div class="tab-custom-profile">
              {/* Tabs */}
              <div className="support-header">
                
                <button
                  className={`outline-btn ${activeTab === TABS.EDIT ? "active" : ""}`}
                  onClick={() => setActiveTab(TABS.EDIT)}
                >
                  Edit Profile
                </button>

                <button
                  className={`outline-btn ${activeTab === TABS.PASSWORD ? "active" : ""}`}
                  onClick={() => setActiveTab(TABS.PASSWORD)}
                >
                  Change Password
                </button>

                <button
                  className={`outline-btn ${activeTab === TABS.LIKED ? "active" : ""}`}
                  onClick={() => setActiveTab(TABS.LIKED)}
                >
                  Liked
                </button>

                <button
                  className={`outline-btn ${activeTab === TABS.DRAFTS ? "active" : ""}`}
                  onClick={() => setActiveTab(TABS.DRAFTS)}
                >
                  Drafts
                </button>

                <button
                  className={`outline-btn ${activeTab === TABS.MY_POSTS ? "active" : ""}`}
                  onClick={() => setActiveTab(TABS.MY_POSTS)}
                >
                  My Posts
                </button>

                <button
                  className={`outline-btn ${activeTab === TABS.BOOKMARK ? "active" : ""}`}
                  onClick={() => setActiveTab(TABS.BOOKMARK)}
                >
                  Bookmark
                </button>
              </div>
              <div className="profile-tab-content">

                

                {/* EDIT PROFILE */}
                {activeTab === TABS.EDIT && (
                  <div className="tab-content grid">
                    <div>
                      <label>First Name *</label>
                      <input defaultValue={user?.name?.split(" ")[0] || ""} />
                    </div>
                    <div>
                      <label>Last Name *</label>
                      <input defaultValue={user?.name?.split(" ")[1] || ""} />
                    </div>
                    <div>
                      <label>Phone Number *</label>
                      <input defaultValue={user?.phone || ""} />

                    </div>
                    <div>
                      <label>Email *</label>
                      <input defaultValue={user?.email || ""} />

                    </div>
                    <div>
                      <label>Birth of Date *</label>
                      <input
                          type="date"
                          defaultValue={
                            user?.dob
                              ? new Date(user.dob).toISOString().split("T")[0]
                              : ""
                          }
                        />

                    </div>
                    <div>
                      <label>Gender *</label>
                      <select defaultValue={user?.gender || ""}>
                        <option value="">Select option</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>

                      </select>
                    </div>
                    <div>
                      <label>Location *</label>
                      <input defaultValue={user?.city || ""} />
                    </div>
                    <div>
                      <label>Zip Code *</label>
                      <input defaultValue={user?.zip || ""} />
                    </div>


                    <div className="actions">
                      <button className="btn-save">Update</button>
                      <button className="btn-cancel">Cancel</button>
                    </div>
                  </div>
                )}


                {/* CHANGE PASSWORD */}
                {activeTab === TABS.PASSWORD && (
                  <div className="tab-content grid">
                    <div>
                      <label>Old Password *</label>
                      <input type="password" placeholder="Enter your old password" />
                    </div>
                    <div>
                      <label>New Password *</label>
                      <input type="password" placeholder="Enter your new password" />
                    </div>
                    <div className="full">
                      <label>Confirm Password *</label>
                      <input type="password" placeholder="Confirm your new password" />
                    </div>

                    <div className="actions">
                      <button className="btn-save">Change Password</button>
                      <button className="btn-cancel">Cancel</button>
                    </div>
                  </div>
                )}
                {/* Search */}
                <SidebarSearch
                  searchTerm={searchTerm}
                  onSearchChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Posts */}
                <div className="main-section-profiles">
                  {loading && <p>Loading posts...</p>}

                  {!loading &&
                    currentPosts.map((q) => (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        showActions={activeTab === TABS.LIKED}
                        isLiked={activeTab === TABS.LIKED}
                        onUnlike={(id) =>
                          setLikedPosts((prev) => prev.filter((p) => p.id !== id))
                        }
                        showDelete={activeTab === TABS.DRAFTS}
                        showEdit={activeTab === TABS.DRAFTS}
                        showCounts={activeTab === TABS.MY_POSTS}
                        status={activeTab === TABS.MY_POSTS ? q.status : null}
                        onEdit={() => handleEditDraft(q)}
                        onDelete={() => handleDeleteDraft(q.id)}
                      />
                    ))}

                  {/* No Posts */}
                  {!loading && currentList.length === 0 && (
                    <NoPost
                      message={
                        activeTab === TABS.LIKED
                          ? "No post available"
                          : activeTab === TABS.DRAFTS
                            ? "No posts yet"
                            : "You haven't created any posts yet"
                      }
                      subMessage={
                        activeTab === TABS.LIKED
                          ? "Try liking/saving a post, thanks!"
                          : activeTab === TABS.DRAFTS
                            ? "Try writing a new post, thanks!"
                            : "Start creating content and it will show here!"
                      }
                      onAddNew={
                        activeTab === TABS.DRAFTS
                          ? () => {
                            setEditingDraft({});
                          }
                          : null
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
                  onClose={handleCloseModal} // ✅ Updated: Custom close handler with refetch logic
                />
              )}
            </div>
          </div>
          {/*  */}
        </div>
        {/*  */}
      </div>
      {/*  */}
      <div class="tab-custom-profile d-none">
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
          <button
            className={`outline-btn ${activeTab === "BookMark" ? "active" : ""}`}
            onClick={() => setActiveTab("BookMark")}
          >
            Bookmark
          </button>
        </div>

        {/* Search */}
        <SidebarSearch
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Posts */}
        <div className="main-section-profiles">
          {loading && <p>Loading posts...</p>}

          {!loading &&
            currentPosts.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                showActions={activeTab === "Liked"}
                isLiked={activeTab === "Liked"}
                onUnlike={(id) =>
                  setLikedPosts((prev) => prev.filter((p) => p.id !== id))
                }
                showDelete={activeTab === TABS.DRAFTS}

                showEdit={activeTab === TABS.DRAFTS}
                showCounts={activeTab === TABS.MY_POSTS}
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
    </>
  );
};

export default Profile;
