import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../components/ThemeProvider";
import Profile from "../../components/Profile";
import SidebarRight from "../../components/SidebarRight";
import { loggedUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
function Profiles() {
  const { theme } = useContext(ThemeContext);
  const handleSubscribe = () => {
    window.open("/subscribe", "_blank");
  };
  const user = loggedUser();
  const navigate = useNavigate();
   useEffect(() => {
    if (!user) {
      navigate("/"); // or your login route
    }
  }, [user, navigate]);
  return (
    <div className={`main-layout ${theme}-theme`}>
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
          <main className="main-section-parent px-0">
            <Profile />

            
          </main>
   <div class="d-block d-md-none">
           <SidebarRight />
   </div>
        </div>
      </div>
    </div>
  );
}
export default Profiles;
