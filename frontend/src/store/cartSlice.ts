import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartData, STATUS } from "../types";

import { AppDispatch } from "./store";
import { API } from "../services/api";
interface InitialState {
  cartItem: CartData[];
  status: string;
}
interface DeleteCartI {
  id: string;
}
interface UpdateI extends DeleteCartI {
  quantity: number;
}
const initialState: InitialState = {
  cartItem: [],
  status: "loading",
};
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setCart(state: InitialState, action: PayloadAction<CartData[]>) {
      state.cartItem = action.payload;
    },
    setStatus(state: InitialState, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    updateCart(state: InitialState, action: PayloadAction<UpdateI>) {},
    deleteCart(state: InitialState, action: PayloadAction<UpdateI>) {},
  },
});
export const { setCart, setStatus, updateCart } = cartSlice.actions;
export default cartSlice.reducer;
export function addToCart(data: { id: string; quantity: number }) {
  return async function addTocartThunk(dispatch: AppDispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await API.post<any>(
        "/cart",
        { productId: data.id, quantity: data.quantity },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        dispatch(setStatus(STATUS.SUCCESS));
        dispatch(setCart(response.data.data));
      } else {
        dispatch(setStatus(STATUS.CLIENTERROR));
      }
    } catch (error) {
      dispatch(setStatus(STATUS.SERVERERROR));
    }
  };
}
export function getCart() {
  return async function getCartThunk(dispatch: AppDispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await API.get<any>("/cart", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        dispatch(setStatus(STATUS.SUCCESS));
        dispatch(setCart(response.data.data));
      } else {
        dispatch(setStatus(STATUS.CLIENTERROR));
      }
    } catch (error) {
      dispatch(setStatus(STATUS.SERVERERROR));
    }
  };
}
