import React, { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight
} from "react-icons/fa";
import "./style.scss";
import QuestionCard from "../../components/QuestionCard";
import SidebarSearch from "../../components/SidebarSearch";
const questions = [
  {
    title: "Can I take a community college course during the second semester of high school?",
    description:
      "If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).If my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school? If my high school ... (very long text here).",
    // ...other properties...
  }
];
const Profile = () => {
  const [activeTab, setActiveTab] = useState("Liked");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div>
      {/* Tab Buttons */}
      <div className="support-header">
        <button
          className={`outline-btn ${activeTab === "Liked" ? "active" : ""}`}
          onClick={() => setActiveTab("Liked")}

        >
          Liked
        </button>
        <button
          className={`outline-btn ${activeTab === "Drafts" ? "active" : ""}`}
          onClick={() => setActiveTab("Drafts")}
        >
          Drafts
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Liked" ? (
          <div className="pt-1">

            <SidebarSearch
              searchTerm={searchTerm}
              onSearchChange={e => setSearchTerm(e.target.value)}
            />
            <div className="pt-1">
              {questions.map((q, idx) => (
                <>
                  <QuestionCard question={q} key={idx} />
                </>
              ))}
              {/* Show data for page {page} */}
            </div>
          </div>
        ) : (
          <div className="pt-1">

            <SidebarSearch
              searchTerm={searchTerm}
              onSearchChange={e => setSearchTerm(e.target.value)}
            />
            <div className="pt-1">
              {questions.map((q, idx) => (
                <>
                  <QuestionCard question={q} key={idx} />
                </>
              ))}
              {/* Show data for page {page} */}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-div">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          <FaArrowLeft />
        </button>
        <span> Page {page} </span>
        <button onClick={() => setPage(page + 1)}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Profile;
