import express from "express";
import { stripe } from "../middlewares/stripe";
import { PostgresStorageRepo } from "../postgresRepo/repo";

export default function paymentRputes(repo: PostgresStorageRepo) {
  const router = express.Router();

  router.post("/payments/charge", async (req, res) => {
    const { paymentMethodId, amount } = req.body;

    if (!paymentMethodId || !amount) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, 
        currency: "sek",
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });

      res.json({
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

  return router;
}
