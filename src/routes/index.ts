import { Router } from "express";
import { PostgresStorageRepo } from "../postgresRepo/repo";
import authRoutes from "./authroutes";
import cityRoutes from "./cityroutes";


export const routes = (repo: PostgresStorageRepo) => {
  const router = Router();

  // authentication routes
  router.use("/auth", authRoutes(repo));
  router.use("/",cityRoutes(repo))

  return router;
};
