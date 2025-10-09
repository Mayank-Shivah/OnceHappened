import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../components/ThemeProvider";
import SidebarRight from "../components/SidebarRight";
import BackButton from "../components/BackButton";
function ReturnPolicy() {
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

          <main className="main-section-parent prive-main-sec">
            
              <div className="privacy-card d-flex align-items-center justify-content-between ">
                          <div class="d-flex align-items-center">
                            <BackButton />
                            <h1 >Return Policy</h1>
                          </div>
            
                          <h1 > <span> (Update Date:- 10/08/2025)</span></h1>
                        </div>
            <div className="policy-page">
              <p>
                We want you to be fully satisfied with your purchase. If you are not happy with your order, please review the return policy below.
              </p>
              <h2>Returns</h2>
              <p>
                Items can be returned within 30 days of receipt for a full refund or exchange. Items must be in original condition with tags attached.
              </p>
              <h2>Non-Returnable Items</h2>
              <p>
                Some items like personalized products and digital downloads are non-returnable.
              </p>
              <h2>How to Return</h2>
              <p>
                To initiate a return, contact our customer service team at <a href="mailto:info@oncehappened.com">info@oncehappened.com</a> with your order details.
              </p>
              <h2>Refunds</h2>
              <p>
                Refunds will be processed within 7-10 business days after we receive the returned item.
              </p>
              <h2>Contact Us</h2>
              <p>
                For any questions regarding returns, please email <a href="mailto:info@oncehappened.com">info@oncehappened.com</a>.
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

export default ReturnPolicy;
