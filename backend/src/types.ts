import { Request } from "express";
export interface UserData {
  userName: string;
  email: string;
  id: string;
  role: string;
}
export interface AuthRequest extends Request {
  user: UserData;
}
export interface RegisterData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface ProductData {
  productName: string;
  productPrice: number;
  productPrevPrice: number;
  description: string;
  availableColors: string[];
  keyFeatures: string[];
  owner: string;
  productImage: any;
}
export enum Role {
  Admin = "admin",
  Customer = "customer",
}
export interface ICart {
  productId: number;
  quantity: number;
  userId?: number;
  Product?: ProductData;
}
export interface ISocketProductCartData {
  id: number | String;
  quantity?: number;
}
