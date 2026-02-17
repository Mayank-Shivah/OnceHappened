import React, { useState, useEffect } from "react";
import "./style.scss";
import api from "../../api"; // axios instance
import Swal from "sweetalert2"; // ✅ Added SweetAlert import
import { useAuth } from "../../context/AuthContext";  // adjust path as needed
import { Link } from "react-router-dom";


export default function SidebarRight() {
  const [ads, setAds] = useState([]);
  const [trialEnded, setTrialEnded] = useState(false);
  const { user, isAuth, hasActiveSubscription } = useAuth();

  

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.get("/add-banners");

        const advisements = res.data?.data?.Advisement || [];

        // filter for Top Right ads only
        const topRightAds = advisements.filter(
          (ad) =>
            (ad.position === "Top Right" || ad.position === "Bottom Right") &&
            ad.show === "1"
        );

        // sort by created_at (newest first) and take 2 only
        const recentAds = [...topRightAds].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 2);

        setAds(recentAds);
      } catch (err) {
        // ✅ Replaced console.error with SweetAlert
        Swal.fire('Error!', 'Failed to load sidebar ads', 'error');
      }
    };

    fetchAds();
  }, []);

  return (
    <aside className={`sidebar-right ${hasActiveSubscription ? "hide-sidebar" : ""}`}>
      {!trialEnded ? (
        <div className="ad-section">
          {ads.length > 0 ? (
            ads.map((ad) => (
               !hasActiveSubscription && (
              <div key={ad.id} className="ad-card">
                <a href={ad.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={ad.image_video}
                    alt={ad.title || "Advertisement"}
                    className="ad-image img-fluid"
                  />
                </a>
              </div>
               )
            ))
          ) : (
            <p>Loading Ads...</p>
          )}

          {isAuth && !hasActiveSubscription && (
          <div className="ad-label d-none d-md-block">Go add-free?</div>
          )}
          {isAuth && !hasActiveSubscription && (
          <div className="trials-sece d-none d-md-block">
            <Link to="/subscription" className="trial-complete-btn">
              Subscribe Now
            </Link>
          </div>
          )}
          {hasActiveSubscription && (

           <div className="ad-label d-none d-md-block">Enjoy add-free content</div>
          )}
          {hasActiveSubscription && (
          <div className="trials-sece d-none d-md-block">
            <button
              onClick={() => setTrialEnded(true)}
              className="trial-complete-btn"
            >
              Subscription Status.
            </button>
          </div>
          )}


        </div>
      ) : (

        <div className="trial-ended-message d-none d-md-block">
          {hasActiveSubscription && (
          <strong>You have an active subscription.</strong>
          )}
          {!hasActiveSubscription && (
          <span>You don't have an active subscription</span>
          )}
        </div>
      )}
    </aside>
    
  );
}
