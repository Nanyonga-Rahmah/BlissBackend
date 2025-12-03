import { Router } from "express";
import { PostgresStorageRepo } from "../postgresRepo/repo";
import authRoutes from "./authroutes";


export const routes = (repo: PostgresStorageRepo) => {
  const router = Router();

  // authentication routes
  router.use("/auth", authRoutes(repo));

  return router;
};
