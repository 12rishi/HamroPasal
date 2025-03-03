import express, { Router } from "express";
import userController from "../controller/userController";

const router: Router = express.Router();
router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.loginUser);
export default router;
