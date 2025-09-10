import React, { useContext } from "react";
import SidebarLeft from "../../components/SidebarLeft";
import SidebarRight from "../../components/SidebarRight";

import QuestionCard from "../../components/QuestionCard";
import { ThemeContext } from "../../components/ThemeProvider";
import SingleAd from "../../components/SidebarLeft/SingleAd";
import FloatingEditModal from "../../components/FloatingEditModal";
const questions = [
  {
    title: "Can I take a community college course during the second semester of high school?",
    description:
      "If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).",
    // ...other properties...
  }
];

function Home() {
  const { theme } = useContext(ThemeContext);

  const handleSubscribe = () => {
    window.open("/subscribe", "_blank");
  };


  return (
    <div className={`main-layout ${theme}-theme`}>

      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
          <SidebarLeft />
          <main className="main-section-parent">
           {questions.map((q, idx) => (
              <>
                <QuestionCard question={q} key={idx} />
              </>
            ))}
            <div className="single-components-ad">
              <SingleAd />
            </div>
            {questions.map((q, idx) => (
              <>
                <QuestionCard question={q} key={idx} />
              </>
            ))}
          </main>
          <SidebarRight />
           <FloatingEditModal />
        </div>
      </div>

    </div>
  );
}
export default Home;
