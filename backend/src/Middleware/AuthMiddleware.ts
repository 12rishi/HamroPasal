import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import User from "../database/models/userModel";
import { AuthRequest, UserData } from "../types";
dotenv.config();

class Authentication {
  async validateUser(req: AuthRequest, res: Response, next: NextFunction) {
    const { token }: any = req.headers.authorization;
    if (!token) {
      res.status(401).json({
        message: "unauthorized",
      });
    }
    jwt.verify(
      token,
      process.env.JWT_TOKEN as string,
      async (err: any, decoded: any): Promise<void> => {
        if (err) {
          res.status(403).json({
            message: "Forbidden",
          });
        }
        const decodedData = decoded.id;
        const userData: UserData | any = await User.findByPk(decodedData, {
          attributes: ["userName", "email", "id"],
        });
        if (!userData) {
          res.status(403).json({
            message: "Forbidden",
          });
        }
        req.user = userData;
        next();
      }
    );
  }
}
export default new Authentication();
