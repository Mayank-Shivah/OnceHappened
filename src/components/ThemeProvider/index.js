// src/components/ThemeProvider.jsx
import React, { createContext, useState, useLayoutEffect } from "react";

export const ThemeContext = createContext();

function ThemeProvider({ children }) {
  // Use useLayoutEffect for synchronous execution before paint
  const getInitialTheme = () => localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    // Always immediately set correct class before render
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === "light" ? "dark" : "light");
    // localStorage updated in effect above
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
