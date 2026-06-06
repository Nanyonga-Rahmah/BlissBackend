import express from "express";
import { stripe } from "../middlewares/stripe";
import { PostgresStorageRepo } from "../postgresRepo/repo";

export default function paymentRoutes(repo: PostgresStorageRepo) {
  const router = express.Router();

  // CHARGE PAYMENT
  router.post("/payments/charge", async (req, res) => {
    const { amount, customerName, city,paymentMethodId } = req.body;

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

      const year = new Date().getFullYear();

      const storedPayments = await repo.getAllPayments();
      const totalPayments = storedPayments.length;

      const customId = `TXN-${year}-${String(totalPayments + 1).padStart(3, "0")}`;

      // store payment in db
      await repo.storePayment({
        id: customId,
        customerName,
        city,
        status: paymentIntent.status,
        paymentMethod: "Card",
        paymentIntentId: paymentIntent.id,
        amount,
        createdAt: new Date(),
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
  // router.post("/payments/refund", async (req, res) => {
  //   const { paymentIntentId, amount } = req.body;

  //   try {
  //     const refundData: any = {
  //       payment_intent: paymentIntentId,
  //     };

  //     // partial refund if amount passed
  //     if (amount) {
  //       refundData.amount = amount * 100;
  //     }

  //     const refund = await stripe.refunds.create(refundData);

  //     // update payment in db
  //     await repo.paymentRepo.update(
  //       { paymentIntentId },
  //       {
  //         status:
  //           refund.status === "succeeded"
  //             ? amount
  //               ? "partially_refunded"
  //               : "refunded"
  //             : refund.status,
  //       }
  //     );

  //     res.json({
  //       success: true,
  //       refundId: refund.id,
  //       status: refund.status,
  //     });
  //   } catch (error: any) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // });
  return router;
}
