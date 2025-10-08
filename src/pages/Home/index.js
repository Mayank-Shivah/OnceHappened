import React, { useState, useEffect, useContext } from "react";
import SidebarLeft from "../../components/SidebarLeft";   // ✅ keep your original import
import SidebarRight from "../../components/SidebarRight";
import QuestionCard from "../../components/QuestionCard";
import { ThemeContext } from "../../components/ThemeProvider";
import FloatingEditModal from "../../components/FloatingEditModal";
import { getFullUserData, getUser  , isLoggedIn } from "../../services/authService";
import AdSpace from "../../components/AdSpace";
import api from "../../api"; // axios instance
import Swal from "sweetalert2";
 import LockCard from "../../components/LockCard"; // ✅ Removed unused import
import Loader from "../../components/Loader"; // ✅ Added Loader import
import { useAuth } from "../../context/AuthContext";  // adjust path as needed


function Home() {
  const { theme } = useContext(ThemeContext);
  const [allPosts, setAllPosts] = useState([]);   // all posts
  const [questions, setQuestions] = useState([]); // filtered posts
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]); // 🔹 ads for center left/right
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [singlePostId, setSinglePostId] = useState(null);
  // const loggedInUser   = isLoggedIn() ? getUser  () : null;
  // const fullData = isLoggedIn() ? getFullUserData() : null;
  // const subscription = fullData?.subscription;

  // // ✅ Try to detect subscription properly
  // const hasActiveSubscription = (() => {
  //   if (!subscription || !subscription.is_active) return false;
  //   const endDate = new Date(subscription.end_date);
  //   return endDate > new Date();
  // })();
   const { user: loggedInUser, isAuth, fullUserData, hasActiveSubscription } = useAuth();

  

  useEffect(() => {
    // 🔹 Check URL for ?id=
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    if (idParam) {
      setSinglePostId(parseInt(idParam, 10));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 🔹 fetch posts
        const res = await api.get("/topics");
        // ✅ Removed console.log for clean console

        const posts = (res.data?.posts || [])
        .filter((p) => p.status === "approved")
        .filter((p) => {
          if (!loggedInUser  ) return true;      // show everything if not logged in
          return p.user_id !== loggedInUser  .id; // hide posts by current user
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setAllPosts(posts);

        if (res.data?.topics?.length > 0) {
          const firstCatId = res.data.topics[0].id;
          setSelectedCategory(firstCatId);

          const filtered = posts.filter((p) =>
            p.topics?.some((t) => t.id === firstCatId)
          );
          setQuestions(filtered);
        }

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
  }, []);

  const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  useEffect(() => {
    if (singlePostId) return;

    let filtered = allPosts;

    if (selectedCategory) {
      filtered = filtered.filter((p) =>
        p.topics?.some((t) => t.id === selectedCategory)
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) => {
        const textContent = stripHtml(p.description || "");
        const title = p.title || "";
        const combined = `${title} ${textContent}`.toLowerCase();
        return combined.includes(searchTerm.toLowerCase());
      });
    }

    setQuestions(filtered);
  }, [selectedCategory, allPosts, searchTerm, singlePostId]);

  return (
    <div className={`main-layout ${theme}-theme`}>
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
          <SidebarLeft
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
            onSearch={setSearchTerm}
          />

          <main className="main-section-parent">
            {loading && <Loader />} {/* ✅ Replaced <p>Loading questions...</p> with Loader */}

            {(!loading && singlePostId) ? (
              (() => {
                const post = allPosts.find((p) => p.id === singlePostId);
                if (post) {
                  return <QuestionCard key={post.id} question={post} />;
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
                    className="no-post-box"
                    style={{
                      textAlign: "center",
                      margin: "5px auto",
                      padding: "30px",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      maxWidth: "500px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h5>No posts in this topic yet</h5>
                    <p style={{ marginTop: "8px", color: "#666" }}>
                      Be the first to share something here!
                    </p>
                  </div>
                )}

                {(() => {
                  const elements = [];
                  let adIndex = 0; // which ad to show next

                  questions.forEach((q, i) => {
                    if (q.lock === 1 && !hasActiveSubscription) {
                      elements.push(<LockCard key={`lock-${q.id}`} post={q} />);
                    } else {
                      elements.push(<QuestionCard key={q.id} question={q} />);
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
                        <AdSpace key={`adslot-${i}`} label="Sponsored" height={260} />
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
