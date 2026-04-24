import { Router } from "express";

import { PostgresStorageRepo } from "../postgresRepo/repo";
import { UserController } from "../controllers/userController";
import { IService, IVariant } from "../interfaces/interfaces";
import { ServiceController } from "../controllers/serviceController";
import { upload } from "../middlewares/upload";
import { uploadImageToDropbox } from "../utils/UploadToDropBox";

export default function userRoutes(repo: PostgresStorageRepo) {
  const router = Router();
  const userController = new UserController(repo);

  // --- createCity ---

  // --- getAllCities ---
  router.get("/users", async (req, res) => {
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

      const allUsers = await userController.getAllUsers();

      res.status(200).json({
        message: "Users retrieved successfully",
        users: allUsers,
      });
    } catch (err: any) {
      res.status(500).json({ message: "failure" });
    }
  });

  router.get("/users/:id", async (req, res) => {
    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      const retrievedUser = await userController.getUserById(userId);

      if (!retrievedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User retrieved successfully",
        user: retrievedUser,
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
