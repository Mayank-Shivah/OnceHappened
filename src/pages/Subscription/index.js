import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../components/ThemeProvider";
import SidebarRight from "../../components/SidebarRight";
import { useNavigate } from "react-router-dom";
import { loggedUser } from "../../services/authService";
import axios from "axios";
import api from "../../api";
import "./style.scss";
import { useAuth } from "../../context/AuthContext";  // adjust path as needed


export default function Subscription() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const user = loggedUser();
  const { user: loggedInUser, isAuth, fullUserData } = useAuth()
  const [setFullUserData] = useState(null);;

  const hasActiveSubscription = (() => {
  if (!fullUserData?.subscription || !fullUserData.subscription.is_active)
    return false;
  const endDate = new Date(fullUserData.subscription.end_date);
  return endDate > new Date();
})();
  

  const [plans, setPlans] = useState([]);
  // const [activeSub, setActiveSub] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // ✅ Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/subscription");
        setPlans(res.data.subscription || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);



  // ✅ Stripe checkout handler (Laravel endpoint)
  const handleCheckout = async (plan) => {
    try {
      const payload = {
        planId: plan.id,
        amount: Math.round(parseFloat(plan.price) * 100),
        interval: plan.duration_type,
        interval_count: plan.duration,
        planName: plan.name,
        userId: user.id,
        userName: user.name,
      };

      const { data } = await api.post("/create-checkout-session", payload);
      window.location.href = data.url; // redirect to Stripe checkout page
    } catch (err) {
      console.error("Stripe checkout error:", err);
    }
  };

  // Helper to get button content for price-list buttons
  const getPriceListButtonContent = (plan) => {
    if (!plan) return null;
    const durationText = `${plan.duration} ${plan.duration_type}${plan.duration > 1 ? "s" : ""}`;
    if (plan.duration_type === "day") {
      return (
        <>
          ${plan.price}
        </>
      );
    } else {
      return (
        <>
          ${plan.price}
        </>
      );
    }
  };

  // Assume plans order: [0: day, 1: monthly, 2: 6mo, 3: yearly]
  const dayPlan = plans[0];
  const monthlyPlan = plans[1];
  const sixMonthPlan = plans[2];
  const yearlyPlan = plans[3];

  return (
    <div className={`main-layout ${theme}-theme`}>
      <div className="container">
        <div
          className="content-wrapper"
          style={{ display: "flex", marginTop: "2px" }}
        >
          <main className="main-section-parent p-0">
            {/* ✅ Subscription Packages */}
            <div className="policy-page mb-1 sub-parent-section">
              {/* left-section */}
              <div className="subscribe-box">
                <h2 className="text-start">
                  <span className="color-red">S</span>ubscribe to
                </h2>
                <p className="text-start">
                  <strong>
                    To unlock every post<br />and Remove all ads in just few bucks.
                  </strong>
                </p>
                <div className="price-list">
                  <div className="price-item  mb-2 ">
                    <button
                      className="price-tab  one-step"
                      onClick={() => handleCheckout(yearlyPlan)}
                    >
                      <span class="custom-price-label">
                        Day pass
                      </span>

                      {getPriceListButtonContent(yearlyPlan)} for a day
                    </button>
                  </div>
                  <div className="price-item  mb-2 ">
                    <button
                      className="price-tab one-step"
                      onClick={() => handleCheckout(dayPlan)}
                    >
                      <span class="custom-price-label">
                        Monthly
                      </span>
                      {getPriceListButtonContent(dayPlan)} per month
                    </button>
                  </div>
                  {/* <div className="price-item  mb-2 deal-tab-sec">
                    <button
                      className="price-tab border-0 p-0"
                      onClick={() => handleCheckout(yearlyPlan)}
                    >
                      {getPriceListButtonContent(yearlyPlan)}
                    </button>
                    <span className="d-block">★ {yearlyPlan?.tagline || "Deal of the day"}</span>
                  </div> */}
                  <div className="note">
                    That will be around <span class="border-price">
                      0.25 per day</span>, not much isn’t it?

                    {/* remove this line olny */}
                  
                  </div>
                </div>

                <div className="special-offer">
                  {/* <strong className="mb-1">
                    <span className="color-green fw-600">
                      {user?.name || "Guest"}
                    </span>
                    , lets try for only a month & read all at once
                  </strong> */}

                  <div className="price-item highlight mb-2">
                    <button
                      className="price-tab one-step"
                      onClick={() => handleCheckout(monthlyPlan)}
                    >
                      <span class="custom-price-label">
                        Half Yearly
                      </span>
                      ${monthlyPlan?.price || 2.5} for 6 months
                    </button>

                  </div>
                  <div className="price-item">

                    <button
                      className="price-tab one-step"
                      onClick={() => handleCheckout(sixMonthPlan)}
                    >
                      <span class="custom-price-label ">
                        Yearly
                      </span>
                      ${sixMonthPlan?.price || 7.5} per year
                    </button>
                  </div>
                  <p class="text-center">
               
                    Deal of the day, around <span class="border-price"> 0.18 cents per day,</span> it sounds good.
                    
                
                </p>

                </div>
              </div>

              {/* right-section */}
              <div className="subscribe-box ">
                <h2 class="text-start">
                  <span className="color-red"> {user?.name || "Guest"}</span>
                </h2>
                <p className="text-start">
                  <strong>
                    lets try for a <span class="border-price">day </span> or  <span class="border-price">a month
                    </span> <span class="border-price">&
                    </span>
                    <span class="border-price">  read
                    </span> all <br/>stories in one go.
                  </strong>
                </p>
                <p className="text-start">
                  <strong>Let’s begin with,
                  </strong>
                </p>
                <div className="price-list">
                  <div className="price-item  mb-2 ">
                    <button
                      className="price-tab  one-step"
                      onClick={() => handleCheckout(yearlyPlan)}
                    >
                      <span class="custom-price-label">
                        Day pass
                      </span>
                      {getPriceListButtonContent(yearlyPlan)} only for a day
                    </button>
                  </div>
                  <p>
                    That will be  <span className="border-price">
                      0.10 per hour.
                    </span>
                  </p>
                  <div className="price-item  mb-2 ">
                    <button
                      className="price-tab  one-step"
                      onClick={() => handleCheckout(dayPlan)}
                    >
                      <span class="custom-price-label">
                        Monthly
                      </span>
                      {getPriceListButtonContent(dayPlan)} per month
                    </button>
                  </div>
                  {/* <div className="price-item  mb-2 deal-tab-sec">
                    <button
                      className="price-tab border-0 p-0"
                      onClick={() => handleCheckout(yearlyPlan)}
                    >
                      {getPriceListButtonContent(yearlyPlan)}
                    </button>
                    <span className="d-block">★ {yearlyPlan?.tagline || "Deal of the day"}</span>
                  </div> */}
                  <div className="note">
                    That will be around <span class="border-price">0.25 per day</span>, not that much isn’t it?
                    
                  </div>
                   <div>
                  <h4 class="mt-1">
                    <strong>
                      Thanks.
                    </strong>
                    </h4>

                </div>
                </div>
               
                
                
              </div>
            </div>

            {/* ✅ Active Subscription */}
            <div className="policy-page">
              <div className="subscribe-box onging-sub border-0 w-100">
                <h2>Your ongoing subscription:</h2>
                {!fullUserData?.subscription ? (
                  <>
                    <p>
                      No active plan found. Subscribe today and enjoy the benefits!
                    </p>                    
                  </>
                ) : (
                  <div className="price-list">
                    <div className="price-item">
                      Your current subscription: ${fullUserData.subscription.amount}{" "}
                      <span>
                        per {fullUserData.subscription.subscription?.duration_type}
                      </span>
                    </div>
                    <div className="price-item">
                      Your subscription expiring on:{" "}
                      {new Date(fullUserData.subscription.end_date).toLocaleString()}
                    </div>
                    <div className="price-item ">
                      <button
                        className="price-tab"
                        onClick={() =>
                          handleCheckout(fullUserData.subscription.subscription)
                        }
                      >
                        extend 1 more {fullUserData.subscription.subscription?.duration_type}
                      </button>
                    </div>
                  </div>
                )}


                
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
