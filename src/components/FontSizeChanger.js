import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
 
const MIN_SIZE = 15;
const MAX_SIZE = 20;
const STORAGE_KEY = "app-font-size";
const USER_SET_KEY = "app-font-size-user-set";
 
export default function FontSizeChanger() {
  const initial =
    typeof window !== "undefined"
      ? Math.min(
          MAX_SIZE,
          Math.max(
            MIN_SIZE,
            parseInt(localStorage.getItem(STORAGE_KEY) || "", 10) || MIN_SIZE
          )
        )
      : MIN_SIZE;
 
  const [fontSize, setFontSize] = useState(initial);
  const [userSet, setUserSet] = useState(
    typeof window !== "undefined" ? localStorage.getItem(USER_SET_KEY) === "1" : false
  );
 
  const barRef = useRef(null);
 
  // Apply to <html> inline so it can't be removed by unmounting this component
  const applyFontToHtml = (size) => {
    const html = document.documentElement;
    html.style.fontSize = size + "px";           // direct override
    html.style.setProperty("--app-font-size", size + "px"); // keep var if you also use it elsewhere
  };
 
  useLayoutEffect(() => {
    applyFontToHtml(fontSize);
  }, [fontSize]);
 
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(fontSize));
  }, [fontSize]);
 
  useEffect(() => {
    localStorage.setItem(USER_SET_KEY, userSet ? "1" : "0");
  }, [userSet]);
 
  // Scroll-driven sizing (disabled after user uses the slider)
  useEffect(() => {
    const handleScroll = () => {
      if (userSet) return;
      const scrollTop = window.scrollY;
      const newSize = Math.min(
        MAX_SIZE,
        Math.max(MIN_SIZE, MIN_SIZE + Math.floor(scrollTop / 50))
      );
      setFontSize((prev) => (prev !== newSize ? newSize : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userSet]);
 
  const percent = (fontSize - MIN_SIZE) / (MAX_SIZE - MIN_SIZE);
 
  const setFromClientX = (clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
    const val = Math.round(MIN_SIZE + (x / rect.width) * (MAX_SIZE - MIN_SIZE));
    setUserSet(true);
    setFontSize(val);
  };
 
  const handleDrag = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setFromClientX(clientX);
  };
 
  const onThumbMouseDown = (e) => {
    e.preventDefault();
    setUserSet(true);
    const move = (e2) => handleDrag(e2);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };
 
  const onThumbTouchStart = () => {
    setUserSet(true);
    const move = (e2) => handleDrag(e2);
    const up = () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
    };
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    window.addEventListener("touchcancel", up);
  };
 
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault(); setUserSet(true);
      setFontSize((s) => Math.max(MIN_SIZE, s - 1));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault(); setUserSet(true);
      setFontSize((s) => Math.min(MAX_SIZE, s + 1));
    } else if (e.key === "Home") {
      e.preventDefault(); setUserSet(true); setFontSize(MIN_SIZE);
    } else if (e.key === "End") {
      e.preventDefault(); setUserSet(true); setFontSize(MAX_SIZE);
    }
  };
 
  return (
    <div>
      <div className="font-size-changer" style={{ display: "flex", alignItems: "center", gap: 12, 
  flexWrap: "wrap"  }}>
        <span className="font-label"><b>Font Size</b></span>
 
        <div
          className="font-bar-wrap"
          onClick={handleDrag}
          ref={barRef}
          style={{ width: 180, cursor: "pointer" }}
        >
          <div className="font-bar" style={{ position: "relative", height: 8, borderRadius: 999, background: "#eee" }}>
            <div className="font-bar-fill" style={{ position: "absolute", height: "100%", borderRadius: 999, width: `${percent * 100}%`, background: "#ffe066" }} />
            <div
              className="font-bar-thumb"
              style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", width: 26, height: 26, left: `calc(${percent * 100}% - 13px)` }}
              tabIndex={0}
              role="slider"
              aria-valuenow={fontSize}
              aria-valuemin={MIN_SIZE}
              aria-valuemax={MAX_SIZE}
              onMouseDown={onThumbMouseDown}
              onTouchStart={onThumbTouchStart}
              onKeyDown={onKeyDown}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" >
                <polygon points="13,2 24,8.5 24,19.5 13,26 2,19.5 2,8.5" fill="#fff" stroke="#bbb" strokeWidth="2" />
                <polygon points="13,4 22,9 22,19 13,24 4,19 4,9" fill="#ffe066" opacity="0.82" />
              </svg>
            </div>
          </div>
        </div>
 
        <span className="font-value" style={{ width: 48, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          {fontSize}px
        </span>
      </div>
    </div>
  );
}