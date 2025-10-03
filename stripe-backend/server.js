const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// ✅ Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  const {
    amount,
    interval,
    interval_count = 1,
    planName,
    planId, // 👈 Laravel package id
    userId = "",
  } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: planName },
            recurring: {
              interval: interval,
              interval_count: interval_count,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        subscriptionId: planId, // 👈 Laravel subscription id
        planName,
        interval,
        interval_count: String(interval_count),
        amount: String(amount / 100), // dollars
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Verify Session on Success Page
app.get("/verify-session", async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "Missing session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["subscription", "customer"],
    });

    const isPaid = session.payment_status === "paid" || session.status === "complete";

    res.json({
      isPaid,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      stripe_subscription_id: session.subscription?.id, // Stripe sub id
      customer_id: session.customer,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata, // contains subscriptionId, amount, etc.
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Stripe backend running on http://localhost:${PORT}`)
);
