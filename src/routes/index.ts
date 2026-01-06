import { Router } from "express";
import { PostgresStorageRepo } from "../postgresRepo/repo";
import authRoutes from "./authroutes";
import cityRoutes from "./cityroutes";
import availabilityRoutes from "./availabilityroutes";
import serviceRoutes from "./serviceRoutes";

export const routes = (repo: PostgresStorageRepo) => {
  const router = Router();

  // authentication routes
  router.use("/auth", authRoutes(repo));
  router.use("/", cityRoutes(repo));
  router.use("/", availabilityRoutes(repo));
    router.use("/", serviceRoutes(repo));


  return router;
};
