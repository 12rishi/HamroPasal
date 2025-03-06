import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import * as dotenv from "dotenv";
import hpp from "hpp";
import userRoute from "./router/userRoute";
import "./database/connection";
import cluster from "cluster";
import os from "os";
import cookieParser from "cookie-parser";
import redisClient from "./services/redisService";
import { adminSeeder } from "./adminSeeder";
import productRoute from "./router/productRouter";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;
const ENV: string = process.env.NODE_ENV || "development"; // Optional environment fallback

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cluster setup for handling multi-core systems
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers based on available CPU cores
  const numWorkers = os.cpus().length;
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Fork a new worker to replace the one that died
  });
} else {
  app.use(
    cors({
      origin: "*",
      methods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true, // To support cookies
    })
  );

  app.use(cookieParser());

  // Helmet security configuration
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "script-src": ["'self'", "http://localhost:5173"],
          "style-src": ["'self'", "'unsafe-inline'", "http://localhost:5173"],
          "img-src": ["'self'", "http://localhost:5173", "data:"],
          "font-src": ["'self'", "data:"],
          "connect-src": ["'self'", "http://localhost:5173"],
          "frame-ancestors": ["'none'"],
          "object-src": ["'none'"],
        },
      },
      referrerPolicy: { policy: "no-referrer" },
      hsts: false,
      frameguard: { action: "deny" },
      noSniff: true,
    })
  );

  app.use(hpp()); // Prevent HTTP Parameter Pollution

  // Route handler
  app.use("/", userRoute);
  app.use("/", productRoute);

  // 404 handler for undefined routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      message: "No Content",
    });
  });

  // Connect Redis before starting the server
  redisClient
    .connect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server has started at port no ${PORT} in ${ENV} mode`);
        adminSeeder();
      });
    })
    .catch((error) => {
      console.error("Error connecting to Redis:", error);
    });
}
