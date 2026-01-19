import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PostgresStorageRepo } from "../postgresRepo/repo";
import { UserController } from "../controllers/userController";
import { ICity, IUser } from "../interfaces/interfaces";
import { CityController } from "../controllers/cityController";

export default function cityRoutes(repo: PostgresStorageRepo) {
  const router = Router();
  const userController = new UserController(repo);
  const cityController = new CityController(repo);

  // --- createCity ---
  router.post("/createCity", async (req, res) => {
    try {
      const city = req.body as ICity;

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
      if (!city.name || !city.travelFee || !city.status) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newCity = await cityController.createCity(city);

      res.status(201).json({
        message: "City created successfully",
        city: newCity,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // --- getAllCities ---
  router.get("/cities", async (req, res) => {
    try {
     

      
      

      const allCities = await cityController.getAllCities();

      res.status(200).json({
        message: "Cities retrieved successfully",
        cities: allCities,
      });
    } catch (err: any) {
      res.status(500).json({ message: "failure" });
    }
  });

  router.patch("/cities/:id", async (req, res) => {

    try {
      const cityId = Number(req.params.id);
      const updates = req.body as Partial<ICity>;

      if (isNaN(cityId)) {
        return res.status(400).json({ message: "Invalid city id" });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization token missing" });
      }

      const token = authHeader.split(" ")[1];

      try {
        await userController.verifyToken(token ?? "");
      } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }

      const updatedCity = await cityController.updateCity(cityId, updates);

      res.status(200).json({
        message: "City updated successfully",
        city: updatedCity,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post("/resend-link", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email  is required" });
      }

      const token = await userController.SendSignupLink(email);

      res.status(200).json({
        message: "successful",
      });
    } catch (err: any) {
      res.status(500).json({ message: "failure" });
    }
  });

  // --- LOGIN ---
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email & password required" });
      }

      const user = await repo.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const authResponse = await userController.authenticate(user);

      res.status(200).json({
        message: "Login successful",
        authResponse: authResponse,
      });
    } catch (err: any) {
      res.status(500).json({ message: "User doesn´t exist" });
    }
  });

  return router;
}
