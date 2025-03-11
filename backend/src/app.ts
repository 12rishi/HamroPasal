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
import cartRoute from "./router/cartRouter";
import { Server } from "socket.io";
import socketController from "./controller/socketController";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;
const ENV: string = process.env.NODE_ENV || "development"; // Optional

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
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true, // To support cookies
    })
  );

  app.use(cookieParser());
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
  app.use(hpp());
  // Route handler
  app.use("/", userRoute);
  app.use("/", productRoute);
  app.use("/", cartRoute);

  // 404 handler for undefined routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      message: "No Content",
    });
  });

  // Connect Redis before starting the server
  let server;
  redisClient
    .connect()
    .then(() => {
      return new Promise(async (resolve, reject) => {
        const server = app.listen(PORT, () => {
          console.log(`Server has started at port no ${PORT} in ${ENV} mode`);

          adminSeeder();
          resolve(server);
        });
      });
    })
    .then((server) => {
      server = server;
      //@ts-ignore
      const io = new Server(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
          credentials: true,
        },
      });
      socketController(io);
    })
    .catch((error) => {
      console.error("Error connecting to Redis:", error);
    });
}
