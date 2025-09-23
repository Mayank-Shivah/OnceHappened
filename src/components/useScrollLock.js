// src/hooks/useScrollLock.js
import { useEffect } from "react";

let lockCount = 0;          // how many modals are open
let savedScrollY = 0;       // where the page was when first locked
let savedStyles = {};       // to restore original styles

function applyLock() {
  // Save current scroll position only on first lock
  if (lockCount === 0) {
    savedScrollY = window.scrollY || window.pageYOffset || 0;

    // Save original styles (so we can restore them cleanly)
    savedStyles = {
      htmlOverflow: document.documentElement.style.overflow,
      bodyOverflow: document.body.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyWidth: document.body.style.width,
      bodyPaddingRight: document.body.style.paddingRight,
    };

    // Optional: compensate for scrollbar width (prevents content "jump")
    const scrollBarW = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarW > 0) {
      document.body.style.paddingRight = `${scrollBarW}px`;
    }

    // Lock both html and body
    document.documentElement.style.overflow = "hidden";

    // iOS-friendly lock: fix the body, keep width, and offset to keep view in place
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = "100%";
  }

  lockCount += 1;
}

function removeLock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return; // still have open modals → keep locked

  // Restore styles
  document.documentElement.style.overflow = savedStyles.htmlOverflow || "";
  document.body.style.overflow = savedStyles.bodyOverflow || "";
  document.body.style.position = savedStyles.bodyPosition || "";
  document.body.style.top = savedStyles.bodyTop || "";
  document.body.style.width = savedStyles.bodyWidth || "";
  document.body.style.paddingRight = savedStyles.bodyPaddingRight || "";

  // Restore scroll position
  window.scrollTo(0, savedScrollY);
}

export default function useScrollLock(isOpen) {
  useEffect(() => {
    if (isOpen) applyLock();
    return () => {
      if (isOpen) removeLock();
    };
  }, [isOpen]);
}
