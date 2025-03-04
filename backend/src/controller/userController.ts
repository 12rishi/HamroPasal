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
  async loginUser(req: Request, res: Response): Promise<any> {
    const cleanedData = sanitizeMe(req.body);
    const { email, password } = cleanedData;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all the credentials",
      });
    }

    const user = await User.findOne(email);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized, please provide your valid credentials",
      });
    }
    //comparing plain password with hashed password
    const checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) {
      return res.status(401).json({
        message: "Unauthorized, please provide your valid credentials",
      });
    }
    // private key for RSA256 algo
    const privateKey = fs.readFileSync(
      process.env.PRIVATE_KEY as string,
      "utf8"
    );
    const token = jwt.sign({ id: user.id }, privateKey, {
      algorithm: process.env.ALGO as string | any,
    });

    // Set the cookie
    res.cookie("token", token, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Successfully logged in",
      token: token,
    });
  }
}
export default new UserController();
