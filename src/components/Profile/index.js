import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaFacebook, FaInstagram, } from "react-icons/fa";
import "./style.scss";
import QuestionCard from "../../components/QuestionCard";
import SidebarSearch from "../../components/SidebarSearch";
import FloatingEditModal from "../../components/FloatingEditModal";
import api from "../../api"; // axios instance
import { loggedUser, getFullUserData } from "../../services/authService";
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
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]); // ✅ Add bookmarked posts state
  const [loading, setLoading] = useState(false);

  const [editingDraft, setEditingDraft] = useState(null);
  const [wasEditing, setWasEditing] = useState(false); // ✅ New: Track if modal was opened for edit (to trigger refetch on close)

  const postsPerPage = 5;
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  // Controlled form state for profile update
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    gender: user?.gender || "",
    city: user?.city || "",
    country: user?.country || "",
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      gender: user?.gender || "",
      city: user?.city || "",
      country: user?.country || "",
    });
  }, [user]);
  // ✅ Extracted fetchPosts as standalone function (fixes ESLint "not defined" error)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      // ✅ Pass user_id to get bookmark/flag status from backend
      const res = await api.get("/topics", {
        params: {
          user_id: user.id
        }
      });
      const posts = res.data?.posts || [];

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

      const userDrafts = posts
        .filter((p) => String(p.user_id) === String(user.id) && p.status === "draft")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setDraftPosts(userDrafts);

      const mine = posts
        .filter(
          (p) =>
            String(p.user_id) === String(user.id) &&
            (p.status === "draft" ||
              p.status === "approved" ||
              p.status === "un-approved")
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setMyPosts(mine);

      // ✅ Filter bookmarked posts
      const userBookmarked = posts
        .filter((p) => p.is_bookmarked === true || p.is_bookmarked === "1" || p.is_bookmarked === 1)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setBookmarkedPosts(userBookmarked);

    } catch (err) {
      Swal.fire("Error!", "Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPosts();
    }
  }, [user?.id]);


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

  const filteredBookmarkedPosts = bookmarkedPosts.filter((q) => {
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
          : activeTab === TABS.BOOKMARK
            ? filteredBookmarkedPosts
            : [];// ✅ handle My Posts and Bookmarks

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


  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Delete account",
      text: "⚠️ Once you delete your account, all your data and posts will be permanently removed. This action cannot be undone. Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const full = getFullUserData();
      const token = (full && full.token) || localStorage.getItem("token");
      const userId = (user && user.id) || (full && full.user && full.user.id) || null;

      const response = await fetch("https://dashboard.oncehappened.com/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json().catch(() => ({}));
      Swal.close();

      if (response.ok) {
        await Swal.fire("Deleted", "Your account has been permanently deleted.", "success");
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      } else {
        Swal.fire("Error", data.message || "Failed to delete your account. Try again later.", "error");
      }
    } catch (err) {
      Swal.close();
      console.error(err);
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    const day = date.getDate();
    const year = date.getFullYear();

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const month = months[date.getMonth()];

    // Function to get ordinal suffix
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${day}${getOrdinal(day)} ${month} ${year}`;
  };

  return (
    <>
      {/*  */}
      <div className="container-fluids">
        {/*  */}
        <div className="row">
          {/*  */}
          <div className="col-lg-5 col-xl-4 col-md-12 col-sm-12 mx-auto">
            {/* LEFT PROFILE CARD */}
            <div className="profile-card">
              <div className="avatar-wrap">

                <span className="lang-avatar">
                  <img src="images/usericon.png" className="user-icon-img img-fluid" />
                  {/* {user?.name ? user.name.charAt(0).toUpperCase() : "U"} */}
                </span>

              </div>

              <h3>{user?.name}</h3>


              {/* <div className="social-icons">
                <a href="https://www.facebook.com/people/oncehappened/61582009471567/?rdid=XspTKOOIXTqkEbzQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BLWoK8zGE%2F" target="_blank" rel="noreferrer" className="fac"><FaFacebook /></a>

                <a href="https://www.instagram.com/once.happened" target="_blank" rel="noreferrer" className="ins"><FaInstagram /></a>

              </div> */}

              <hr />

              <h4>Information</h4>
              <ul className="info-list">
                <li>
                  <span>Birth of Date</span>
                  <span>{formatDate(user?.dob)}</span>
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
                  <span>{formatDate(user?.created_at)}</span>
                </li>

                <li>
                  <button
                    className="btn btn-dangers"
                    onClick={handleDeleteAccount}
                    style={{ margin: 0, marginLeft: "auto" }}
                  >
                    Delete My Account
                  </button>
                </li>
              </ul>

            </div>
          </div>
          {/*  */}

          <div className="col-lg-7 col-xl-8 col-md-12 col-sm-12 mx-auto">

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
                      <input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((s) => ({ ...s, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label>Email *</label>
                      <input
                        value={profileForm.email}
                        onChange={(e) => setProfileForm((s) => ({ ...s, email: e.target.value }))}
                      />

                    </div>
                    <div>
                      <label>Birth of Date *</label>
                      <input
                        type="date"
                        value={profileForm.dob}
                        onChange={(e) => setProfileForm((s) => ({ ...s, dob: e.target.value }))}
                      />

                    </div>
                    <div>
                      <label>Gender *</label>
                      <select
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm((s) => ({ ...s, gender: e.target.value }))}
                      >
                        <option value="">Select option</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>

                      </select>
                    </div>
                    <div>
                      <label>City *</label>
                      <input
                        value={profileForm.city}
                        onChange={(e) => setProfileForm((s) => ({ ...s, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Country *</label>
                      <input
                        value={profileForm.country}
                        onChange={(e) => setProfileForm((s) => ({ ...s, country: e.target.value }))}
                      />
                    </div>


                    <div className="actions">
                      <button type="button" className="btn-save" onClick={async () => {
                        const confirm = await Swal.fire({
                          title: 'Update profile',
                          text: 'Do you want to save the changes to your profile?',
                          icon: 'question',
                          showCancelButton: true,
                          confirmButtonText: 'Yes, save',
                        });

                        if (!confirm.isConfirmed) return;

                        try {
                          Swal.fire({ title: 'Saving...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                          const res = await api.put('/user/profile', profileForm);
                          Swal.close();
                          await Swal.fire('Saved', res.data.message || 'Profile updated', 'success');
                          // update local user and reload
                          if (res.data.user) {
                            localStorage.setItem('user', JSON.stringify(res.data.user));
                          }
                          window.location.reload();
                        } catch (err) {
                          Swal.close();
                          const msg = err?.response?.data?.message || 'Failed to update profile';
                          Swal.fire('Error', msg, 'error');
                        }
                      }}>Update</button>
                      <button type="button" className="btn-cancel" onClick={() => setProfileForm({
                        name: user?.name || '',
                        email: user?.email || '',
                        dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                        gender: user?.gender || '',
                        city: user?.city || '',
                        country: user?.country || '',
                      })}>Cancel</button>
                    </div>
                  </div>
                )}


                {/* CHANGE PASSWORD */}
                {activeTab === TABS.PASSWORD && (
                  <div className="tab-content grid">
                    <div>
                      <label>Old Password *</label>
                      <input type="password" placeholder="Enter your old password" value={passwordForm.old_password} onChange={(e) => setPasswordForm((s) => ({ ...s, old_password: e.target.value }))} />
                    </div>
                    <div>
                      <label>New Password *</label>
                      <input type="password" placeholder="Enter your new password" value={passwordForm.password} onChange={(e) => setPasswordForm((s) => ({ ...s, password: e.target.value }))} />
                    </div>
                    <div className="full">
                      <label>Confirm Password *</label>
                      <input type="password" placeholder="Confirm your new password" value={passwordForm.password_confirmation} onChange={(e) => setPasswordForm((s) => ({ ...s, password_confirmation: e.target.value }))} />
                    </div>

                    <div className="actions">
                      <button type="button" className="btn-save" onClick={async () => {
                        if (!passwordForm.old_password || !passwordForm.password) {
                          return Swal.fire('Error', 'Please fill all fields', 'error');
                        }
                        if (passwordForm.password !== passwordForm.password_confirmation) {
                          return Swal.fire('Error', 'Passwords do not match', 'error');
                        }

                        const confirm = await Swal.fire({
                          title: 'Change password',
                          text: 'Do you want to change your password?',
                          icon: 'question',
                          showCancelButton: true,
                          confirmButtonText: 'Yes, change',
                        });

                        if (!confirm.isConfirmed) return;

                        try {
                          Swal.fire({ title: 'Updating...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                          const res = await api.post('/user/change-password', passwordForm);
                          Swal.close();
                          await Swal.fire('Success', res.data.message || 'Password changed', 'success');
                          setPasswordForm({ old_password: '', password: '', password_confirmation: '' });
                        } catch (err) {
                          Swal.close();
                          const msg = err?.response?.data?.message || 'Failed to change password';
                          Swal.fire('Error', msg, 'error');
                        }
                      }}>Change Password</button>
                      <button type="button" className="btn-cancel" onClick={() => setPasswordForm({ old_password: '', password: '', password_confirmation: '' })}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Show Search and Posts only for post-related tabs */}
                {(activeTab === TABS.LIKED || activeTab === TABS.DRAFTS || activeTab === TABS.MY_POSTS || activeTab === TABS.BOOKMARK) && (
                  <>
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
                            showActions={activeTab === TABS.LIKED || activeTab === TABS.BOOKMARK}
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

                    {/* Pagination - only for post tabs */}
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
                  </>
                )}
              </div>

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
                showActions={activeTab === "Liked" || activeTab === "BookMark"}
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
