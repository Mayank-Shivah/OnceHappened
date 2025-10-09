import React, { useContext, useEffect } from "react";
import Header from "../../components/Header";
import SidebarLeft from "../../components/SidebarLeft";
import SidebarRight from "../../components/SidebarRight";
import Footer from "../../components/Footer";
import QuestionCard from "../../components/QuestionCard";
import SingleBlogPost from "../../components/SingleBlogPost"; // Import SingleBlogPost
import { ThemeContext } from "../../components/ThemeProvider";


const questions = [
  {
    author: "Emma Deen",
    badge: "Professional",
    profilePic: "images/340x215-12.jpg",
    askedDate: "January 12, 2023",
    topic: "Education",
    title: "Can I take a community college course during the second semester of high school?",
    descriptionLines: [
      "if my high school has an agreement with the local community college. Can I take a community college course during the second semester of high school?"
    ],
    tags: ["Education"],
    upvotes: 303,
    comments: 18,
    stars: 6,
    shareUrl: "images/340x215-12.jpg"
  },
  // add more questions here
];

function Blog() {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]');

    if (!metaTag) {
      // Create it if it doesn’t exist
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "robots");
      document.head.appendChild(metaTag);
    }

    // Set the desired content
    metaTag.setAttribute("content", "noindex, nofollow");

    // Optional cleanup (restore or remove when leaving page)
    return () => {
      metaTag.setAttribute("content", "noindex, nofollow");
    };
  }, []);
  return (
    <div className={`main-layout ${theme}-theme`}>
 
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
          <SidebarLeft />
          <main className="main-section-parent" >
            <SingleBlogPost /> 
          </main>
          <SidebarRight />
        </div>
      </div>
 
    </div>
  );
}

export default Blog;
