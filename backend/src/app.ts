import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import * as dotenv from "dotenv";
import hpp from "hpp";
import userRoute from "./router/userRoute";
import "./database/connection";
import cluster from "cluster";
import os from "os";

dotenv.config();
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`${worker.process.pid} has died`);
    cluster.fork();
  });
} else {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    })
  );

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
  app.use("/", userRoute);

  // 404 Middleware
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      message: "No Content",
    });
  });

  // ✅ Corrected: Start the server in all worker processes
  app.listen(PORT, () => {
    console.log(`Server has started at port no ${PORT}`);
  });
}
