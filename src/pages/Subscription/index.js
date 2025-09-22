import React, { useContext, useState } from "react";
import { ThemeContext } from "../../components/ThemeProvider";
import SidebarRight from "../../components/SidebarRight";
import LoginModal from "../../components/LoginModal";
import "./style.scss";
export default function Subscription() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`main-layout ${theme}-theme`}>
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex" }}>
          <main className="main-section-parent p-0">
            <div className="policy-page mb-2">
              <div className="subscribe-box">
                <h2>
                  <span className="color-red">S</span>ubscribe to
                </h2>
                <p>
                  <strong>
                    Unlock every post and Remove all ads in just few bucks.
                  </strong>
                </p>
                <div className="price-list">
                  <div className="price-item mb-2">
                    <a
                      href="#"
                      className="price-tab"
                    >
                      $7.50 <span>per month</span>
                    </a>
                  </div>
                  <div className="price-item mb-2">
                    <a
                      href="#"
                      className="price-tab"
                   
                    >
                      $35.99 <span>for 6 months</span>
                    </a>
                  </div>
                  <div className="price-item mb-2">
                    <a
                 className="price-tab"
                      href="#"
                    >
                      $65.99 <span>for 12 months</span>
                    </a>
                    <span className="star">
                      <span> ★ </span>Deal of the day <span> ★ </span>
                    </span>
                  </div>
                  <div className="note">
                    (only $65.99 for entire year, about 0.18 cents per day)
                  </div>
                </div>
                <hr />
                <div className="special-offer">
                  <strong className="mb-1">
                    <span className="color-green fw-600">
                      Shanon
                    </span>
                    , lets try for only a month & read all at once
                  </strong>
                  <div className="price-item highlight mt-2 mb-2">
                    <a
                      href="#"
                      className="price-tab"
                      
                    >
                      $7.50 for a month
                    </a>
                  </div>
                  <div className="note">
                    (That will be around 0.25 cents per day, not much isn't it?)
                  </div>
                </div>
        

            
              </div>
            </div>
            <div className="policy-page">
              <div className="subscribe-box">
                <h2>Your ongoing subscription:</h2>
                <p>You currently don’t have any, let’s get & see once..</p>
                <h6>
                  <strong>write this if any</strong>
                </h6>
                <div className="price-list">
                  <div className="price-item">
                    Your current subscription: $7.50 <span>per month</span>
                  </div>
                  <div className="price-item">
                    Your subscription expiring on: 23 july 2023 7:17 PM
                  </div>
                  <div className="price-item ">
                    <a
                      href="#"
                      className="price-tab"
                      
                    >
                      $extend 1 more month
                    </a>
                  </div>
                </div>
              </div>
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
