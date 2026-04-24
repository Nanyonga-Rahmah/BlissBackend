import { Router } from "express";
import { PostgresStorageRepo } from "../postgresRepo/repo";
import authRoutes from "./authroutes";
import cityRoutes from "./cityroutes";
import availabilityRoutes from "./availabilityroutes";
import serviceRoutes from "./serviceRoutes";
import bookingroutes from "./bookingroutes";
import paymentroute from "./paymentroute";
import userRoutes from "./userroutes";

export const routes = (repo: PostgresStorageRepo) => {
  const router = Router();

  // authentication routes
  router.use("/auth", authRoutes(repo));
  router.use("/", cityRoutes(repo));
  router.use("/", availabilityRoutes(repo));
  router.use("/", serviceRoutes(repo));
  router.use("/", bookingroutes(repo));
  router.use("/", paymentroute(repo));
  router.use("/", userRoutes(repo));

  return router;
};
