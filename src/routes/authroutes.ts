import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PostgresStorageRepo } from "../postgresRepo/repo.js";
import { UserController } from "../controllers/userController.js";
import { IUser } from "../interfaces/interfaces.js";

export default function authRoutes(repo: PostgresStorageRepo) {
  const router = Router();
  const userController = new UserController(repo);

  // --- REGISTER ---
  router.post("/register", async (req, res) => {
    try {
      const user = req.body as IUser;

      if (!user.email || !user.password || !user.firstName) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newUser = await userController.createUser(user);

      res.status(201).json({
        message: "User registered successfully",
        user: newUser,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // --- LOGIN ---
  router.post("/verify", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email  is required" });
      }

      const token = await userController.onClickVerify(email);

      res.status(200).json({
        message: "successful",
      });
    } catch (err: any) {
      res.status(500).json({ message: "failure" });
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

      const authResponse = await userController.authenticate(user)


      res.status(200).json({
        message: "Login successful",
        authResponse:authResponse,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
}
