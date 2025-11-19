import { Router } from "express";
import { PostgresStorageRepo } from "../postgresRepo/repo.js";
import authRoutes from "./authroutes.js";


export const routes = (repo: PostgresStorageRepo) => {
  const router = Router();

  // authentication routes
  router.use("/auth", authRoutes(repo));

  return router;
};
