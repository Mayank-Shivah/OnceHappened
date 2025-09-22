import React, { useState, useEffect } from "react";
import api from "../../api"; // axios instance

export default function BottomAd() {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get("/add-banners");
        const advisements = res.data?.data?.Advisement || [];

        // 🔹 filter bottom-left ads that are active
        const bottomLeftAds = advisements.filter(
          (ad) => ad.position === "Bottom Left" && ad.show === "1"
        );

        // 🔹 sort by created_at (latest first)
        bottomLeftAds.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        // 🔹 take the latest one
        if (bottomLeftAds.length > 0) {
          setAd(bottomLeftAds[0]);
        }
      } catch (err) {
        console.error("Failed to load ads:", err);
      }
    };

    fetchAd();
  }, []);

  if (!ad) return null; // nothing to render if no ad found

  return (
    <aside className="bottom-add">
      <div className="ad-section">
        <div className="ad-card d-block">
          <a href={ad.url} target="_blank" rel="noopener noreferrer">
            <img
              alt="Advertisement"
              className="ad-image mb-0"
              src={ad.image_video}
            />
          </a>
        </div>
      </div>
    </aside>
  );
}
