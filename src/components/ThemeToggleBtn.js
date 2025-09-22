import React, { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggleBtn() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className={`toggle-switch ${theme}`} onClick={toggleTheme} aria-label="Toggle theme">
      <span className="toggle-label">
        {theme === "light" ? "LIGHT MODE" : ""}
      </span>
      <span className="toggle-thumb">
        {theme === "light" ? <FaSun /> : <FaMoon />}
      </span>
      <span className="toggle-label">
        {theme === "dark" ? "DARK MODE" : ""}
      </span>
    </button>
  );
}
