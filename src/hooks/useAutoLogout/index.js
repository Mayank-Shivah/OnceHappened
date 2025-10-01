// src/hooks/useAutoLogout.js
import { useEffect, useRef } from "react";

const useAutoLogout = (onLogout, timeout = 30 * 60 * 1000) => {
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      if (typeof onLogout === "function") {
        onLogout(); // 🔹 callback handles navigation
      }
    }, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // start timer on mount

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeout]);

  return null;
};

export default useAutoLogout;
