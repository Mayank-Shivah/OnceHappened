import React, { useEffect, useState } from "react";
import "./style.scss";
import api from "../../api"; // ✅ axios instance

export default function SingleAd() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await api.get("/add-banners");
        console.log("Banners API response:", res.data);

        const advisements = res.data?.data?.Advisement || [];

        if (advisements.length > 0) {
          // 🔹 filter only "Top Left" position
          const filtered = advisements.filter(
            (ad) => ad.position === "Top Left" && ad.show === "1"
          );

          if (filtered.length > 0) {
            // sort by created_at (newest first)
            const sorted = [...filtered].sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setBanner(sorted[0]); // take the latest "Top Left"
          }
        }
      } catch (err) {
        console.error(
          "Failed to load banners:",
          err.response?.data || err.message
        );
      }
    };

    fetchBanner();
  }, []);

  if (!banner) {
    return (
      <div className="ad-card">
        <p>Loading Ad...</p>
      </div>
    );
  }

  return (
    <div className="ad-card">
      <a href={banner.url} target="_blank" rel="noopener noreferrer">
        <img
          src={banner.image_video}
          alt="Advertisement"
          className="ad-image img-fluid"
        />
        <img  alt="Advertisement" className="ad-image" src="https://dashboard.oncehappened.com/storage/advisements/1762231061_1280w-64pPx_AmmQw.webp" />
      </a>
    </div>

  );
}
