// components/AdSpace.jsx
import { useEffect, useRef } from "react";
import "./style.scss";

const ENV_CLIENT =
  process.env.REACT_APP_ADSENSE_CLIENT || import.meta?.env?.VITE_ADSENSE_CLIENT;
const ENV_SLOT =
  process.env.REACT_APP_ADSENSE_SLOT || import.meta?.env?.VITE_ADSENSE_SLOT;

export default function AdSpace({
  // You can set these later via env or window.AD_CONFIG in index.html; props override env
  client,
  slot,
  height = 250,     // reserve height to avoid CLS
  label = "Ad space",
  className = "",
  format = "fluid",
  fullWidth = true,
}) {
  const ref = useRef(null);

  // Priority: props > window.AD_CONFIG > env
  const resolvedClient = client || window?.AD_CONFIG?.client || ENV_CLIENT;
  const resolvedSlot   = slot   || window?.AD_CONFIG?.slot   || ENV_SLOT;
  const isAdsenseReady = Boolean(resolvedClient && resolvedSlot);

  useEffect(() => {
    if (!isAdsenseReady) return;
    try {
      if (ref.current && !ref.current.dataset.adFilled) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        ref.current.dataset.adFilled = "true";
      }
    } catch {}
  }, [isAdsenseReady]);

  if (!isAdsenseReady) {
    // Placeholder until AdSense IDs are present
    return (
      <div
        className={`adspace ${className}`}
        aria-label={label}
        role="complementary"
        style={{
          width: "100%",
          minHeight: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed rgba(0,0,0,0.2)",
          borderRadius: 8,
          background: "rgba(0,0,0,0.02)",
          color: "#888",
          fontSize: 12,
          margin: "16px 0",
        }}
      >
        {label}
      </div>
    );
  }

  // Live AdSense unit (same slot can be reused multiple times)
  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", minHeight: height, width: "100%", margin: "16px 0" }}
      data-ad-client={resolvedClient}
      data-ad-slot={resolvedSlot}
      data-ad-format={format}
      data-full-width-responsive={fullWidth ? "true" : "false"}
      ref={ref}
    />
  );
}
