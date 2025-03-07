import express, { NextFunction, Request, Response, Router } from "express";
import handleError from "../services/handleError";
import cartController from "../controller/cartController";
import AuthMiddleware from "../Middleware/AuthMiddleware";
import { AuthRequest, Role } from "../types";

const router: Router = express.Router();
router
  .route("/cart")
  .post((req: Request, res: Response, next: NextFunction) => {
    AuthMiddleware.validateUser(req as AuthRequest, res, next),
      AuthMiddleware.restrictUser(Role.Customer);
  }, handleError(cartController.addCart))
  .get((req: Request, res: Response, next: NextFunction) => {
    AuthMiddleware.validateUser(req as AuthRequest, res, next),
      AuthMiddleware.restrictUser(Role.Customer);
  }, handleError(cartController.getCart));
export default router;
