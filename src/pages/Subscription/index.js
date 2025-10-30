import React, { useContext, useEffect, useState, useRef } from "react";
import { ThemeContext } from "../../components/ThemeProvider";
import SidebarRight from "../../components/SidebarRight";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Loader from "../../components/Loader";
import "./style.scss";
import { useAuth } from "../../context/AuthContext";

export default function Subscription() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // ✅ store user & subscription
  const fetchedRef = useRef(false);
  const token = localStorage.getItem("token");

  // ✅ Redirect if no token (same as home)
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  // ✅ Fetch both user data & active subscription
  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found in localStorage");
          return;
        }

        // ✅ Use your new backend route that returns { user, subscription }
        const res = await api.get("/user-data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data); // contains user + active subscription
        localStorage.setItem("userData", JSON.stringify(res.data));
      } catch (err) {
        console.warn("⚠️ Could not fetch user data:", err);
        // fallback to cached user
        const local = localStorage.getItem("userData");
        if (local) setUserData(JSON.parse(local));
      }
    };

    fetchUserAndSubscription();
  }, []);


  // ✅ Fetch available plans only once
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        setLoading(true);
        const res = await api.get("/subscription");
        setPlans(res.data.subscription || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // ✅ Stripe checkout
  const handleCheckout = async (plan) => {
    if (!userData) return;
    try {
      const payload = {
        planId: plan.id,
        amount: Math.round(parseFloat(plan.price) * 100),
        interval: plan.duration_type,
        interval_count: plan.duration,
        planName: plan.name,
        userId: userData?.user?.id || userData?.id,
        userName: userData?.user?.name || userData?.name,
      };

      const { data } = await api.post("/create-checkout-session", payload);
      window.location.href = data.url;
    } catch (err) {
      console.error("Stripe checkout error:", err);
    }
  };

  // ✅ Safe helpers
  const getPriceListButtonContent = (plan) => (plan ? <>{`$${plan.price}`}</> : null);
  const dayPlan = plans.find((p) => p.name?.toLowerCase().includes("day")) || null;
  const monthlyPlan = plans.find((p) => p.name?.toLowerCase().includes("month")) || null;
  const sixMonthPlan =
    plans.find(
      (p) => p.name?.toLowerCase().includes("6 month") || p.name?.toLowerCase().includes("half year")
    ) || null;
  const yearlyPlan = plans.find((p) => p.name?.toLowerCase().includes("year")) || null;

  const activeSubscription = userData?.subscription || null; // ✅ your new API

  return (
    <div className={`main-layout ${theme}-theme`}>
      <div className="container">
        <div className="content-wrapper" style={{ display: "flex", marginTop: "2px" }}>
          <main className="main-section-parent sub-main-sec px-0">
            {loading ? (
              <Loader />
            ) : (
              <>
                {/* ===== Subscription Packages ===== */}
                <div className="policy-page mb-1 sub-parent-section">
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
                      {dayPlan && (
                        <div className="price-item mb-2">
                          <button className="price-tab one-step" onClick={() => handleCheckout(dayPlan)}>
                            <span className="custom-price-label">Day Pass</span>
                            {getPriceListButtonContent(dayPlan)} for a day
                          </button>
                        </div>
                      )}

                      {monthlyPlan && (
                        <div className="price-item mb-2">
                          <button className="price-tab one-step" onClick={() => handleCheckout(monthlyPlan)}>
                            <span className="custom-price-label">Monthly</span>
                            {getPriceListButtonContent(monthlyPlan)} per month
                          </button>
                        </div>
                      )}

                      <div className="note">
                        That will be around <span className="border-price">0.25 per day</span>, not much isn’t it?
                      </div>

                      {sixMonthPlan && (
                        <div className="price-item highlight mb-2">
                          <button className="price-tab one-step" onClick={() => handleCheckout(sixMonthPlan)}>
                            <span className="custom-price-label">Half Yearly</span>{" "}
                            {getPriceListButtonContent(sixMonthPlan)} for 6 months
                          </button>
                        </div>
                      )}

                      {yearlyPlan && (
                        <div className="price-item">
                          <button className="price-tab one-step" onClick={() => handleCheckout(yearlyPlan)}>
                            <span className="custom-price-label">Yearly</span>
                            {getPriceListButtonContent(yearlyPlan)} per year
                          </button>
                        </div>
                      )}

                      <p className="text-center">
                        Deal of the day, around <span className="border-price">0.18 cents per day,</span> it sounds good.
                      </p>
                    </div>
                  </div>

                  {/* ===== Right Section ===== */}
                  <div className="subscribe-box">
                    <h2 className="text-start">
                      <span className="color-red g-color">{userData?.user?.name || userData?.name || "Guest"},</span>
                    </h2>
                    <p className="text-start">
                      <strong>
                        Let's try for a <span className="border-price">day</span> or{" "}
                        <span className="border-price">a month</span> & read all stories in one go.
                      </strong>
                    </p>
                    <p className="text-start">
                      <strong>Let’s begin with,</strong>
                    </p>

                    <div className="price-list">
                      {dayPlan && (
                        <div className="price-item mb-2">
                          <button className="price-tab one-step" onClick={() => handleCheckout(dayPlan)}>
                            <span className="custom-price-label">Day pass</span>
                            {getPriceListButtonContent(dayPlan)} only for a day
                          </button>
                        </div>
                      )}

                      <p>
                        That will be <span className="border-price">0.10 per hour.</span>
                      </p>

                      {monthlyPlan && (
                        <div className="price-item mb-2">
                          <button className="price-tab one-step" onClick={() => handleCheckout(monthlyPlan)}>
                            <span className="custom-price-label">Monthly</span>
                            {getPriceListButtonContent(monthlyPlan)} per month
                          </button>
                        </div>
                      )}

                      <div className="note">
                        That will be around <span className="border-price">0.25 per day</span>, not that much isn’t it?
                      </div>

                      <div>
                        <h4 className="mt-1">
                          <strong>Thanks.</strong>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== Active Subscription ===== */}
                <div className="policy-page">
                  <div className="subscribe-box onging-sub border-0 w-100">
                    <h2>Your ongoing subscription:</h2>
                    {!activeSubscription ? (
                      <p>You currently don’t have any, let’s get and see how it’s like</p>
                    ) : (
                      <div className="price-list">
                        <div className="price-item">
                          Your current subscription: ${fullUserData.subscription?.amount || "0.00"} "
                          {fullUserData.subscription?.plan_name || "N/A"}"
                        </div>
                        <div className="price-item">
                          Your subscription expires on:{" "}
                          {new Date(activeSubscription.end_date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                        <div className="price-item">
                          <button className="price-tab" onClick={() => handleCheckout(monthlyPlan)}>
                            Extend 1 more month
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>

          <div className="d-block d-md-none">
            <SidebarRight />
          </div>
        </div>
      </div>
    </div>
  );
}
