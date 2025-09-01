import express from "express";
import bodyParser from "body-parser";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe("YOUR_STRIPE_SECRET_KEY");

app.use(bodyParser.json());
app.use(express.static("."));

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { name, email, phone, address, employer, income, movein } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Apartment Application Fee",
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html",
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
