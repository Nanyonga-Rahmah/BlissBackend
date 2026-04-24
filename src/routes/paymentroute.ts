import express from "express";
import { stripe } from "../middlewares/stripe";
import { PostgresStorageRepo } from "../postgresRepo/repo";

export default function paymentRoutes(repo: PostgresStorageRepo) {
  const router = express.Router();

  // CHARGE PAYMENT
  router.post("/payments/charge", async (req, res) => {
    const { paymentMethodId, amount } = req.body;

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

  // REFUND PAYMENT
  router.post("/payments/refund", async (req, res) => {
    const { paymentIntentId, amount } = req.body;

    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = amount * 100;
      }
      const refund = await stripe.refunds.create(refundData);

      res.json({
        success: true,
        refundId: refund.id,
        status: refund.status,
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
