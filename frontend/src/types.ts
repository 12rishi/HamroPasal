import { Product } from "./store/productSlice";

export interface CartData {
  id?: string | number;
  productId: string | null;
  quantity: number;
  Product?: Product;
}
export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData extends LoginData {
  userName: string;
  confirmPassword: string;
}
export interface User {
  id: string | null;
  userName: string | null;
  email: string | null;
}
export interface UserInitialStateI {
  user: User | null;
  status: string;
  errorMessage: string | null;
  token: string | null;
}
export interface RegisterResponse {
  data: User;
  message: string;
}
export enum STATUS {
  SUCCESS = "success",
  LOADING = "loading",
  CLIENTERROR = "clientError",
  SERVERERROR = "serverError",
}
