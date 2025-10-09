import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../components/ThemeProvider";
import SidebarRight from "../../components/SidebarRight";
function About() {
    const { theme } = useContext(ThemeContext);

     useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]');

    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "robots");
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute("content", "index, follow");

    return () => {
      // Optional: restore default behavior when leaving About page
      metaTag.setAttribute("content", "noindex, nofollow");
    };
  }, []);


    return (
        <div className={`main-layout ${theme}-theme`}>

            <div className="container">
                <div className="content-wrapper" style={{ display: "flex" }}>

                    <main className="main-section-parent prive-main-sec">
                        {/* <div className="privacy-card">
                            <h1 >Privacy Policy <span> (Update Date:- 10/08/2025)</span></h1>
                        </div> */}
                        <div className="policy-page" >
                            <p>
                                We are a personal experiences sharing platform where people post what they have read somewhere, remember about, have personally experienced, or somebody they know experienced, so that all readers learn a thing or two from it and enrich their wisdom which can help them in future interactions with the world.
                            </p>
                               <p>
                               
                                As the wise say, <em>
                                    "sharing is caring." </em>  
                                    If you share your wisdom with others, you receive twice, even thrice, of what you have shared. Our platform works on this principle, as it is evident: you share one story, and you get to learn from thousands of stories written once or twice by thousands of readers. Thus, increasing your knowledge and day-to-day "deep" awareness about society twice or thrice of what you currently have via real-life stories.

                             
                            </p>
                               <p>
                               

                                We bring the best content from all around the internet and the world right in front of you in the form of real-life stories, so that you deeply understand and learn a thing or two from it, and can put it to use easily in your day-to-day life. Get more wise and make informed and important decisions in your life.

                            </p>
                              <p>
                               Live, laugh, love, peace, and knowledge is our <strong> motto</strong>.
                            </p>
                            <p>
                                Thanks,
                                <br />
                                – Team,
                                <br />
                                oncehappened

                            </p>
                        </div>
                    </main>
                    <div className="d-block d-md-none">
                        <SidebarRight />
                    </div>
                </div>
            </div>

        </div>

    );
}

export default About;
