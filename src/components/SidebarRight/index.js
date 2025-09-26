import React, { useState, useEffect } from "react";
import "./style.scss";
import api from "../../api"; // axios instance
import Swal from "sweetalert2"; // ✅ Added SweetAlert import

export default function SidebarRight() {
  const [ads, setAds] = useState([]);
  const [trialEnded, setTrialEnded] = useState(false);

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
    <aside className="sidebar-right d-none d-lg-block">
      {!trialEnded ? (
        <div className="ad-section">
          {ads.length > 0 ? (
            ads.map((ad) => (
              <div key={ad.id} className="ad-card">
                <a href={ad.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={ad.image_video}
                    alt={ad.title || "Advertisement"}
                    className="ad-image"
                  />
                </a>
              </div>
            ))
          ) : (
            <p>Loading Ads...</p>
          )}

          <div className="ad-label d-none d-md-block">Advertisement</div>

          {/* Demo trial complete button */}
          <div className="trials-sece d-none d-md-block">
            <button
              onClick={() => setTrialEnded(true)}
              className="trial-complete-btn"
            >
              Simulate Trial Complete
            </button>
          </div>
        </div>
      ) : (
        <div className="trial-ended-message d-none d-md-block">
          <strong>Your free trial has ended.</strong>
        </div>
      )}
    </aside>
  );
}
