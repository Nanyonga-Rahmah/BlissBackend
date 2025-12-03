import dotenv from "dotenv";
dotenv.config();


import cors from "cors";
import express, { Application, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import { PostgresStorageRepo } from "./postgresRepo/repo";
import { routes } from "./routes/index";

const app: Application = express();
const storage = new PostgresStorageRepo();


// Init database
storage.init().then(() => {
  console.log("Database connected.");
}).catch((err) => {
  console.error("Database connection failed:", err);
});

app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ limit: "1gb", extended: true }));

// Timeout
app.use((req, res, next) => {
  req.setTimeout(300000);
  res.setTimeout(300000);
  next();
});

// Basic CORS
app.use(cors());

// Headers
app.use((req, res, next) => {
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// Swagger configuration
const swaggerAPIDesc = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bliss API Documentation",
      version: "1.0.0",
    },
  },
  apis: ["src/api-spec.yml", "./src/models/*.ts"],
});

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerAPIDesc));

app.set("strict routing", true);
app.set("case sensitive routing", true);

// Register routes
app.use("/api/v1", routes(storage)); 

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running well. - production server",
  });
});

// 404 handler
// app.all((req: Request, res: Response) => {
//   res.status(404).json({
//     status: "ERROR",
//     message: `Route ${req.originalUrl} not found.`,
//   });
// });



export { app };
