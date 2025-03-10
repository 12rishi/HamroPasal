import express, { NextFunction, Request, Response, Router } from "express";
import userController from "../controller/userController";
import productController from "../controller/productController";
import AuthMiddleware from "../Middleware/AuthMiddleware";
import { AuthRequest, Role } from "../types";
import handleError from "../services/handleError";
import multer from "multer";
import storage from "../Middleware/multerMiddleware";
const upload = multer({ storage: storage });
const router: Router = express.Router();
router
  .route("/product")
  .post(
    (req: Request, res: Response, next: NextFunction) => {
      AuthMiddleware.validateUser(req as AuthRequest, res, next);
      AuthMiddleware.restrictUser(Role.Admin);
    },
    upload.array("productImage"),
    (req: Request, res: Response) => {
      productController.addProduct(req as AuthRequest, res);
    }
  )
  .get(handleError(productController.getProduct));

export default router;
