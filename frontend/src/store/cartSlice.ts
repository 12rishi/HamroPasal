import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartData } from "../types";

import { PrunePayload } from "vite";
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
    setCart(state: InitialState, action: PayloadAction<CartData>) {
      if (
        state.cartItem.find(
          (cart) => cart.productId == action.payload.productId
        )
      ) {
        const index = state.cartItem.findIndex(
          (cart) => cart.productId == action.payload.productId
        );
        state.cartItem[index].quantity += 1;
      } else {
        state.cartItem.push(action.payload);
      }
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
