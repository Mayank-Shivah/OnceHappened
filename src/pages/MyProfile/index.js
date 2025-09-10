import React, { useContext } from "react";
import { ThemeContext } from "../../components/ThemeProvider";
import Profile from "../../components/Profile";
import SidebarRight from "../../components/SidebarRight";
function Profiles() {
  const { theme } = useContext(ThemeContext);
  const handleSubscribe = () => {
    window.open("/subscribe", "_blank");
  };
  return (
    <div className={`main-layout ${theme}-theme`}>
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
          <main className="main-section-parent">
            <Profile />

            
          </main>
          <SidebarRight />
        </div>
      </div>
    </div>
  );
}
export default Profiles;
