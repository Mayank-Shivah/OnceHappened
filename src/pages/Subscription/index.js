import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../components/ThemeProvider";
import SidebarRight from "../../components/SidebarRight";
import { useNavigate } from "react-router-dom";
import { loggedUser  } from "../../services/authService";
import axios from "axios";
import api from "../../api";
import "./style.scss";

export default function Subscription() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const user = loggedUser ();

  const [plans, setPlans] = useState([]);
  const [activeSub, setActiveSub] = useState(null);

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

  // ✅ Fetch user’s active subscription
  useEffect(() => {
    const fetchActiveSub = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/user-subscription/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "application/json",
            },
          }
        );
        setActiveSub(res.data.subscription || null);
      } catch (error) {
        console.error("Error fetching active subscription:", error);
      }
    };
    fetchActiveSub();
  }, [user]);

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
          {plan.name}: ${plan.price} for a day.
          <span>for {durationText}</span>
        </>
      );
    } else {
      return (
        <>
          ${plan.price}
          <span>for {durationText}</span>
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
                <h2>
                  <span className="color-red">S</span>ubscribe to
                </h2>
                <p>
                  <strong>
                    Unlock every post and Remove all ads in just few bucks.
                  </strong>
                </p>
                <div className="price-list">
                  <div className="price-item  mb-2 ">
                    <button 
                      className="price-tab  one-step" 
                      onClick={() => handleCheckout(monthlyPlan)}
                    >
                      {getPriceListButtonContent(monthlyPlan)}
                    </button>
                  </div>
                  <div className="price-item  mb-2 ">
                    <button 
                      className="price-tab  two-step" 
                      onClick={() => handleCheckout(sixMonthPlan)}
                    >
                      {getPriceListButtonContent(sixMonthPlan)}
                    </button>
                  </div>
                  <div className="price-item  mb-2 deal-tab-sec">
                    <button 
                      className="price-tab border-0 p-0" 
                      onClick={() => handleCheckout(yearlyPlan)}
                    >
                      {getPriceListButtonContent(yearlyPlan)}
                    </button>
                    <span className="d-block">★ {yearlyPlan?.tagline || "Deal of the day"}</span>
                  </div>
                  <div className="note">
                    (only ${yearlyPlan?.price || 65.99} for entire year, about  0.18 per day)
                  </div>
                </div>
                <hr />
                <hr />
                <div className="special-offer">
                  <strong className="mb-1">
                    <span className="color-green fw-600">
                      {user?.name || "Guest"}
                    </span>
                    , lets try for only a month & read all at once
                  </strong>

                  <div className="price-item highlight mb-2">
                    <button 
                      className="price-tab" 
                      onClick={() => handleCheckout(dayPlan)}
                    >
                      {dayPlan?.name || "Day pass"} – ${dayPlan?.price || 2.5} for a day
                    </button>
                    <span> Or </span>
                    <button 
                      className="price-tab" 
                      onClick={() => handleCheckout(monthlyPlan)}
                    >
                      {monthlyPlan?.name || "Monthly package"} – ${monthlyPlan?.price || 7.5} per month
                    </button>
                  </div>
                </div>
              </div>

              {/* right-section */}
              <div className="subscribe-box ">
                <h2>
                  <span className="color-red">S</span>ubscribe to
                </h2>
                <p>
                  <strong>
                    Unlock every post and Remove all ads in just few bucks.
                  </strong>
                </p>

                <div className="price-list">
                  <div className="price-item  mb-2 ">
                    <button 
                      className="price-tab  one-step" 
                      onClick={() => handleCheckout(dayPlan)}
                    >
                      {getPriceListButtonContent(dayPlan)}
                    </button>
                  </div>
                  <div className="price-item  mb-2 ">
                    <button 
                      className="price-tab  two-step" 
                      onClick={() => handleCheckout(sixMonthPlan)}
                    >
                      {getPriceListButtonContent(sixMonthPlan)}
                    </button>
                  </div>
                  <div className="price-item  mb-2 deal-tab-sec">
                    <button 
                      className="price-tab border-0 p-0" 
                      onClick={() => handleCheckout(yearlyPlan)}
                    >
                      {getPriceListButtonContent(yearlyPlan)}
                    </button>
                    <span className="d-block">★ {yearlyPlan?.tagline || "Deal of the day"}</span>
                  </div>
                  <div className="note">
                    (only ${yearlyPlan?.price || 65.99} for entire year, about 0.18 cents per day)
                  </div>
                </div>
                <hr /> <hr />
                <div className="special-offer">
                  <strong className="mb-1">
                    <span className="color-green fw-600">
                      {user?.name || "Guest"}
                    </span>
                    , lets try for only a month & read all at once
                  </strong>
                  {plans.length > 0 && (
                    <div className="price-item highlight mb-2">
                      <button
                        className="price-tab"
                        onClick={() => handleCheckout(plans[0])}
                      >
                        {plans[0].name} – ${plans[0].price}
                      </button>
                      {plans[1] && (
                        <>
                          <span> Or </span>
                          <button
                            className="price-tab"
                            onClick={() => handleCheckout(plans[1])}
                          >
                            {plans[1].name} – ${plans[1].price}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ✅ Active Subscription */}
            <div className="policy-page">
              <div className="subscribe-box border-0 w-100">
                <h2>Your ongoing subscription:</h2>

                {!activeSub ? (
                  <>
                    <p>
                      You currently don’t have any, lets get and see how its like
                    </p>
                    <h6>
                      <strong>write this if any</strong>
                    </h6>
                  </>
                ) : (
                  <div className="price-list">
                    <div className="price-item">
                      Your current subscription: ${activeSub.amount}{" "}
                      <span>per {activeSub.subscription?.duration_type}</span>
                    </div>
                    <div className="price-item">
                      Your subscription expiring on:{" "}
                      {new Date(activeSub.end_date).toLocaleString()}
                    </div>
                    <div className="price-item ">
                      <button
                        className="price-tab"
                        onClick={() =>
                          handleCheckout(activeSub.subscription)
                        }
                      >
                        extend 1 more {activeSub.subscription?.duration_type}
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
