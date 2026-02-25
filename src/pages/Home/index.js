import React, { useState, useEffect, useContext } from "react";
import SidebarLeft from "../../components/SidebarLeft";   // ✅ keep your original import
import SidebarRight from "../../components/SidebarRight";
import QuestionCard from "../../components/QuestionCard";
import { ThemeContext } from "../../components/ThemeProvider";
import FloatingEditModal from "../../components/FloatingEditModal";
import { getFullUserData, getUser  , isLoggedIn } from "../../services/authService";
import api from "../../api"; // axios instance
import Swal from "sweetalert2";
import LockCard from "../../components/LockCard"; // ✅ Removed unused import
import Loader from "../../components/Loader"; // ✅ Added Loader import
import { useAuth } from "../../context/AuthContext";  // adjust path as needed
import { useSearch } from "../../context/SearchContext";


function Home() {
  const { theme } = useContext(ThemeContext);
  const [allPosts, setAllPosts] = useState([]);   // all posts
  const [questions, setQuestions] = useState([]); // filtered posts
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]); // 🔹 ads for center left/right
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [singlePostId, setSinglePostId] = useState(null);
  const [selectedHashtags, setSelectedHashtags] = useState([]); // ✅ Track selected hashtags
  const { user: loggedInUser, isAuth, fullUserData, hasActiveSubscription } = useAuth();
  const { searchTerm, updateSearch } = useSearch();

  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]');

    if (!metaTag) {
      // Create it if it doesn’t exist
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "robots");
      document.head.appendChild(metaTag);
    }

    // Set the desired content
    metaTag.setAttribute("content", "noindex, nofollow");

    // Optional cleanup (restore or remove when leaving page)
    return () => {
      metaTag.setAttribute("content", "noindex, nofollow");
    };
  }, []);

  useEffect(() => {
    // 🔹 Check URL for ?id=
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    if (idParam) {
      setSinglePostId(parseInt(idParam, 10));
    }
  }, []);

const userId = loggedInUser?.id;
console.log(userId);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 🔹 fetch posts
        const res = await api.get("/topics", {
          params: {
            user_id: userId
          }
        });
        // ✅ Removed console.log for clean console

        const posts = (res.data?.posts || [])
        .filter((p) => p.status === "approved")
        .filter((p) => {
          if (!loggedInUser  ) return true;      // show everything if not logged in
          return p.user_id !== loggedInUser  .id; // hide posts by current user
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // ✅ Fetch bookmark/flag status for logged-in user
        if (loggedInUser?.id) {
          try {
            const bookmarkRes = await api.get("/posts/bookmarks", {
              params: { user_id: loggedInUser.id }
            });
            const flagRes = await api.get("/posts/flags", {
              params: { user_id: loggedInUser.id }
            });

            const bookmarkedPostIds = new Set(bookmarkRes.data?.bookmarked_post_ids || []);
            const flaggedPosts = flagRes.data?.flagged_posts || {};

            posts.forEach((post) => {
              post.is_bookmarked = bookmarkedPostIds.has(post.id);
              post.is_flagged = !!flaggedPosts[post.id];
              post.flag_reason = flaggedPosts[post.id]?.reason || null;
            });
          } catch (err) {
            console.error("Error fetching bookmark/flag status:", err);
          }
        }

        setAllPosts(posts);

        // ✅ Default to Discover (null) instead of first category
        setSelectedCategory(null);

        // 🔹 fetch ads for Center Left/Right
        const adsRes = await api.get("/add-banners");
        const advisements = adsRes.data?.data?.Advisement || [];
        const centerAds = advisements.filter(
          (ad) =>
            (ad.position === "Center Left" || ad.position === "Center Right") &&
            ad.show === "1"
        );

        // sort by newest first
        const sortedAds = [...centerAds].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setAds(sortedAds);
      } catch (err) {
        // ✅ Replaced console.error with SweetAlert
        Swal.fire('Error!', 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // ✅ Handle hashtag selection
  const handleHashtagSelect = (hashtag) => {
    setSelectedHashtags((prev) => {
      if (prev.includes(hashtag)) {
        return prev; // Don't add if already selected
      }
      return [...prev, hashtag];
    });
  };

  // ✅ Handle hashtag removal
  const handleHashtagRemove = (hashtag) => {
    setSelectedHashtags((prev) => prev.filter((tag) => tag !== hashtag));
  };

  // ✅ Helper function to shuffle array
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (singlePostId) return;

    let filtered = allPosts;

    // ✅ NEW: Filter by selected hashtags first
    if (selectedHashtags.length > 0) {
      // Posts that match any of the selected hashtags
      const hashtagMatches = allPosts.filter((post) => {
        const postTags = (post.slug || "").split(",").map((tag) => tag.trim().toLowerCase().replace("#", ""));
        return selectedHashtags.some((hashtag) =>
          postTags.includes(hashtag.toLowerCase())
        );
      });

      // Posts that don't match (remaining)
      const hashtagMismatches = allPosts.filter((post) => {
        const postTags = (post.slug || "").split(",").map((tag) => tag.trim().toLowerCase().replace("#", ""));
        return !selectedHashtags.some((hashtag) =>
          postTags.includes(hashtag.toLowerCase())
        );
      });

      // Combine: matching posts on top + remaining posts
      filtered = [...hashtagMatches, ...hashtagMismatches];
    } else if (selectedCategory === null) {
      // ✅ Handle Discover category (selectedCategory === null)
      // Get top 5 recently added
      const topRecent = [...allPosts].slice(0, 5);
      
      // Get top 5 by likes count
      const topLiked = [...allPosts]
        .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
        .slice(0, 5);
      
      // Get all post IDs from top recent and top liked
      const topPostIds = new Set([
        ...topRecent.map(p => p.id),
        ...topLiked.map(p => p.id)
      ]);
      
      // Get remaining posts (those not in top recent or top liked)
      const remainingPosts = allPosts.filter(p => !topPostIds.has(p.id));
      
      // Combine: top recent + top liked + remaining posts
      const combined = [...topRecent, ...topLiked, ...remainingPosts];
      
      // Deduplicate by ID (keep first occurrence)
      const uniqueIds = new Set();
      filtered = combined.filter((p) => {
        if (uniqueIds.has(p.id)) return false;
        uniqueIds.add(p.id);
        return true;
      });
      
      // ✅ Shuffle the filtered list for mixed display
      filtered = shuffleArray(filtered);
    } else {
      // Filter by selected category
      filtered = filtered.filter((p) =>
        p.topics?.some((t) => t.id === selectedCategory)
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) => {
        const textContent = stripHtml(p.description || "");
        const title = p.title || "";
        
        // Include topics/tags in search
        const tags = (p.topics || []).map(t => t.name || t.slug || "").join(" ");
        
        // Handle hashtag search (with or without #)
        let searchQuery = searchTerm.toLowerCase();
        if (!searchQuery.startsWith("#")) {
          searchQuery = searchQuery.replace(/^#+/, ""); // Remove # if user added it
        } else {
          searchQuery = searchQuery.substring(1); // Remove # for matching
        }
        
        const combined = `${title} ${textContent} ${tags}`.toLowerCase();
        return combined.includes(searchQuery);
      });
    }

    setQuestions(filtered);
  }, [selectedCategory, allPosts, searchTerm, singlePostId, selectedHashtags]);

  return (
    <div className={`main-layout ${theme}-theme`}>
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
          <SidebarLeft
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
            onSearch={updateSearch}
          />

          <main className="main-section-parent">
           <div className="top-bar-wrapper">
              <SidebarLeft
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
            onSearch={updateSearch}
          />
           </div>
            {loading && <Loader />} {/* ✅ Replaced <p>Loading questions...</p> with Loader */}

            {/* ✅ NEW: Display Selected Hashtags as Tabs */}
            {selectedHashtags.length > 0 && (
              <div className="hashtag-filter-tabs" >
                {selectedHashtags.map((hashtag) => (
                  <div
                    key={hashtag}
                    className="hashtag-tab"
                   
                  >
                    <span>#{hashtag}</span>
                    <button
                      onClick={() => handleHashtagRemove(hashtag)}
                    
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(!loading && singlePostId) ? (
              (() => {
                const post = allPosts.find((p) => p.id === singlePostId);
                if (post) {
                   return (
                    <div className="single-post-view">
                      <QuestionCard key={post.id} question={post} onHashtagSelect={handleHashtagSelect} />

                      {/* 🔹 View More Button */}
                      <div className="text-center mt-4">
                        <button
                          className="view-more-btn"
                          onClick={() => {
                            // remove ?id= from URL and reload posts
                            window.history.replaceState({}, "", "/");
                            setSinglePostId(null);
                            window.scrollTo({ top: 0, behavior: "smooth" }); // optional smooth scroll
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "rgb(229, 57, 53)",
                            fontSize: "1rem",
                            color: "var(--category-text, #34495e)",
                            cursor: "pointer",
                            textDecoration: "none",
                            padding: "0px",
                            backgroundColor: "rgba(255, 255, 255, 0)",
                            borderRadius: "0px",
                            fontWeight: 600,
                            marginTop: "10px",
                            borderBottom: "2px solid yellow"
                          }}  
                        >
                          View More Posts
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="no-post-box">
                      <p>Post Unavailable.</p>
                    </div>
                  );
                }
              })()
            ) : (
              <>
                {!loading && questions.length === 0 && (
                  <div
                    className="no-post-box custom-no-post"
                   
                  >
                    <h5>No posts in this topic yet</h5>
                    <p >
                      Be the first to share something here!
                    </p>
                  </div>
                )}

                {(() => {
                  const elements = [];
                  let adIndex = 0; // which ad to show next

                  questions.forEach((q, i) => {
                    if (q.lock === 1 && !hasActiveSubscription) {
                      elements.push(<LockCard key={`lock-${q.id}`} post={q} onHashtagSelect={handleHashtagSelect} />);
                    } else {
                      elements.push(<QuestionCard key={q.id} question={q} onHashtagSelect={handleHashtagSelect} />);
                    }

                    // ads after every 3 posts (unchanged)
                     if (!hasActiveSubscription) {
                    if ((i + 1) % 3 === 0) {
                      if (ads.length > 0) {
                        const ad = ads[adIndex % ads.length];
                        elements.push(
                          <div className="single-components-ad" key={`ad-${i}-${ad.id}`}>
                            <a href={ad.url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={ad.image_video}
                                alt="Advertisement"
                                className="ad-image"
                                style={{ width: "100%", height: "auto" }}
                              />
                            </a>
                          </div>
                        );
                        adIndex++;
                      }
                      elements.push(
                        // <AdSpace key={`adslot-${i}`} label="Sponsored" height={260} />
                        // <AdSpace adId={111} label="Mid Content Ad" />

                        
                      );
                    }
                  }
                  });




                  return elements;
                })()}

              </>
            )}
          </main>

          <SidebarRight />
          <FloatingEditModal defaultCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
}

export default Home;
