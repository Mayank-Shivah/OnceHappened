import React, { useContext } from "react";
import TopicCard from "../../components/TopicCard"; // create this component or reuse existing card component if any
import { ThemeContext } from "../../components/ThemeProvider";

const topics = [
  {
    id: 1,
    title: "Education",
    description: "Explore all questions and articles related to Education.",
    imageUrl: "/images/topics/education.jpg" // add actual image url
  },
  {
    id: 2,
    title: "Science",
    description: "Discover latest discussions on Science topics.",
    imageUrl: "/images/topics/science.jpg"
  },
  // Add more topic items
]

function Topics() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`main-layout ${theme}-theme`}>
 <div id="galaxy">
                <div class="bg"></div>
                <div class="stars-back"></div>
                <div class="stars-middle"></div>
                <div class="stars-front"></div>
                <div class="bg center"></div>
            </div>
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
         
          <main className="main-section-parent">
            <h1 className="page-title">Topics</h1>
            <div className="topics-list">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </main>
       
        </div>
      </div>
  
    </div>
  );
}

export default Topics;
