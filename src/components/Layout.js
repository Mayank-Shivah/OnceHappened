import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ThemeContext } from "./ThemeProvider";

export default function Layout() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`main-layout ${theme}-theme`}>
      <Header />
      {/* Use Outlet for page rendering */}
      <Outlet />
      <Footer />
    </div>
  );
}
