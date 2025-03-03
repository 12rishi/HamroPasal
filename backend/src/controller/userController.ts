import { Request, Response } from "express";
import { RegisterData } from "../types";
import { sanitizeMe } from "../services/sanitizeHtml";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import User from "../database/models/userModel";
import jwt from "jsonwebtoken";
import fs from "fs";

class UserController {
  async registerUser(req: Request, res: Response): Promise<void> {
    const data: RegisterData = sanitizeMe(req.body);
    const { userName, email, password, confirmPassword } = data;
    if (
      !userName ||
      !email ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      res.status(400).json({
        message: "please provide all the credential",
      });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_VAL)
    );
    const userData = await User.create({
      userName,
      email,
      password: hashedPassword,
    });
    res.status(200).json({
      message: "successfully registered",
      data: {
        userName: userData.userName,
        email: userData.email,
        id: userData.id,
      },
    });
  }
  async loginUser(req: Request, res: Response): Promise<void> {
    const cleanedData = sanitizeMe(req.body);
    const { email, password } = cleanedData;
    if (!email || !password) {
      res.status(400).json({
        message: "please provide all the credential",
      });
    }
    const user = await User.findOne(email);
    if (!user) {
      res.status(401).json({
        message: "unauthorized,please provide your valid credential ",
      });
    }
    const checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) {
      res.status(401).json({
        message: "unauthorized,please provide your valid credential",
      });
    }
    const privateKey = fs.readFileSync(
      process.env.PRIVATE_KEY as string,
      "utf8"
    );
    const token = jwt.sign({ id: user.id }, privateKey, {
      algorithm: process.env.ALGO as string | any,
    });
    res.cookie("token", token);
    res.status(200).json({
      message: "successfully login",
    });
  }
}
export default new UserController();
