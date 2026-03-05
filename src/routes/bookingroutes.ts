import { Router } from "express";

import { PostgresStorageRepo } from "../postgresRepo/repo";
import { UserController } from "../controllers/userController";
import { IBooking, IService, IVariant } from "../interfaces/interfaces";
import { ServiceController } from "../controllers/serviceController";
import { upload } from "../middlewares/upload";
import { uploadImageToDropbox } from "../utils/UploadToDropBox";
import { BookingController } from "../controllers/bookingController";

export default function bookingroutes(repo: PostgresStorageRepo) {
  const router = Router();
  const userController = new UserController(repo);
  const serviceController = new ServiceController(repo);
  const bookingController = new BookingController(repo);

  // --- createBooking ---

  router.post("/createBooking", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization token is missing" });
      }

      const token = authHeader.split(" ")[1];

      let tokenVerificationResult;
      try {
        tokenVerificationResult = await userController.verifyToken(token ?? "");
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Token verification failed", error });
      }

      const {
        serviceName,
        bookingDay,
        status,
        userId,
        bookingTime,
        amount,
        travelfee,
        servicefee,
        size,
        length,
        city,
      } = req.body;
      if (!serviceName || !bookingDay || !userId) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const booking: IBooking = {
        serviceName,
        bookingDay,
        bookingTime,
        isCanceled: false,
        status,
        userId: Number(userId),
        amount: amount,
        travelfee: travelfee,
        servicefee: servicefee,
        city: city,
        size: size ?? "",
        length: length ?? "",
        createdAt: new Date(),
      };

      const newBooking = await bookingController.createBooking(booking);

      res.status(201).json({
        message: "Booking created successfully",
        booking: newBooking,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post("/createVariant", async (req, res) => {
    try {
      const variant = req.body as IVariant;

      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization token is missing" });
      }

      const token = authHeader.split(" ")[1];

      let tokenVerificationResult;
      try {
        tokenVerificationResult = await userController.verifyToken(token ?? "");
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Token verification failed", error });
      }
      if (!variant.name || !variant.price || !variant.serviceId) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newVariant = await serviceController.createVariant(variant);

      res.status(201).json({
        message: "Variant created successfully",
        variant: newVariant,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // --- getAllCities ---
  router.get("/bookings", async (req, res) => {
    try {
      // const authHeader = req.headers.authorization;

      // if (!authHeader) {
      //   return res
      //     .status(401)
      //     .json({ message: "Authorization token is missing" });
      // }

      // const token = authHeader.split(" ")[1];

      // let tokenVerificationResult;
      // try {
      //   tokenVerificationResult = await userController.verifyToken(token ?? "");
      // } catch (error) {
      //   return res
      //     .status(401)
      //     .json({ message: "Token verification failed", error });
      // }

      const allBookings = await bookingController.getAllBookings();

      res.status(200).json({
        message: "Bookings retrieved successfully",
        bookings: allBookings,
      });
    } catch (err: any) {
      res.status(500).json({ message: "failure" });
    }
  });

  router.get("/bookings/:id", async (req, res) => {
    try {
      const bookingId = Number(req.params.id);

      if (isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid booking id" });
      }

      const retrievedBooking =
        await bookingController.getBookingById(bookingId);

      res.status(200).json({
        message: "Booking retrieved successfully",
        booking: retrievedBooking,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get("/bookings/user/:id", async (req, res) => {
    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      const retrievedBookings = await bookingController.getUserBookings(userId);

      res.status(200).json({
        message: "User bookings retrieved successfully",
        bookings: retrievedBookings,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });   

  router.put("/cancel-booking/:id", async (req, res) => {
    const bookingId = Number(req.params.id);
    const { cancelationReason } = req.body;

    if (isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    try {
      const canceledBooking = await bookingController.CancelBooking(
        bookingId,
        cancelationReason
      );

      res.status(200).json({
        message: "Booking canceled successfully",
        booking: canceledBooking,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  //   router.post("/resend-link", async (req, res) => {
  //     try {
  //       const { email } = req.body;

  //       if (!email) {
  //         return res.status(400).json({ message: "Email  is required" });
  //       }

  //       const token = await userController.SendSignupLink(email);

  //       res.status(200).json({
  //         message: "successful",
  //       });
  //     } catch (err: any) {
  //       res.status(500).json({ message: "failure" });
  //     }
  //   });

  return router;
}
