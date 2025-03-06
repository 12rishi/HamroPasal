import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import User from "../database/models/userModel";
import { AuthRequest, Role, UserData } from "../types";
import fs from "fs";
dotenv.config();

class Authentication {
  async validateUser(req: AuthRequest, res: Response, next: NextFunction) {
    const publicKey = fs.readFileSync(process.env.PUBLICKEY as any, "utf-8");
    const token: any = req.headers.authorization;
    if (!token) {
      res.status(401).json({
        message: "unauthorized",
      });
    }
    jwt.verify(
      token,
      publicKey,
      { algorithms: [process.env.ALGO as any] },
      async (err: any, decoded: any): Promise<void> => {
        if (err) {
          res.status(403).json({
            message: "Forbidden",
            error: err.message,
          });
        }
        const decodedData = decoded.id;
        const userData: UserData | any = await User.findByPk(decodedData, {
          attributes: ["userName", "email", "id"],
        });
        if (!userData) {
          res.status(403).json({
            message: "Forbidden,user is not found",
          });
        }
        req.user = userData;
        next();
      }
    );
  }
  restrictUser(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      const role = req.user.role as Role;
      if (!roles.includes(role)) {
        return res.status(403).json({
          message: "permission not allowed",
        });
      }
      next();
    };
  }
}
export default new Authentication();
