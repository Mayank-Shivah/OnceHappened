import React, { useContext } from "react";
import { ThemeContext } from "../components/ThemeProvider";
import SidebarRight from "../components/SidebarRight";
function ReturnPolicy() {
  const { theme } = useContext(ThemeContext);


  return (
    <div className={`main-layout ${theme}-theme`}>

      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>

          <main className="main-section-parent p-0">
             <div className="privacy-card">
          <h1
            >Return Policy <span> (Update Date:- 10/08/2025)</span></h1>
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
                To initiate a return, contact our customer service team at <a href="mailto:cs@oncehappend.com">cs@oncehappend.com</a> with your order details.
              </p>
              <h2>Refunds</h2>
              <p>
                Refunds will be processed within 7-10 business days after we receive the returned item.
              </p>
              <h2>Contact Us</h2>
              <p>
                For any questions regarding returns, please email <a href="mailto:cs@oncehappend.com">cs@oncehappend.com</a>.
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
