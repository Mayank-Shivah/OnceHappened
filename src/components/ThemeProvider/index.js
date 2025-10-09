import React, { createContext, useState, useLayoutEffect } from "react";

export const ThemeContext = createContext();

function ThemeProvider({ children }) {
  // Always default to "light" unless LS value exists
  const getInitialTheme = () => localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    // Apply the saved theme before rendering content
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
    // Persist theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle and save to localStorage
  const toggleTheme = () => {
    setTheme(current => (current === "light" ? "dark" : "light"));
    // localStorage will automatically update in effect above
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
