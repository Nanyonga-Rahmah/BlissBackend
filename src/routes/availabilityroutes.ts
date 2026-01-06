import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PostgresStorageRepo } from "../postgresRepo/repo";
import { UserController } from "../controllers/userController";
import { IAvailableDay, ICity, IUser } from "../interfaces/interfaces";
import { CityController } from "../controllers/cityController";
import { AvailabilityController } from "../controllers/availabilityController";

export default function availabilityRoutes(repo: PostgresStorageRepo) {
  const router = Router();
  const userController = new UserController(repo);
  const availabilityController = new AvailabilityController(repo);

  // --- createAvailability ---
  router.post("/createAvailability", async (req, res) => {
    try {
      const availableDay = req.body as IAvailableDay;

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
      if (
        !availableDay.status ||
        !availableDay.timeSlots ||
        !availableDay.day
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newAvailableDay =
        await availabilityController.createAvailability(availableDay);

      res.status(201).json({
        message: "Availability created successfully",
        availableDay: newAvailableDay,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get("/availableDays", async (req, res) => {
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

      const alldays = await availabilityController.getAllAvailableDays();

      res.status(200).json({
        message: "Available Days retrieved successfully",
        availableDays: alldays,
      });
    } catch (err: any) {
      res.status(500).json({ message: "failure" });
    }
  });

  return router;
}
