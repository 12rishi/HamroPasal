import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productImages: string[];
  productDescription: string;
  availableColor: string[];
  category: string;
}
interface InitialState {
  products: Product[];
  status: string;
  singleProduct: Product | null;
}

const initialState: InitialState = {
  products: [],
  status: "loading",
  singleProduct: null,
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setProduct(state: InitialState, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setStatus(state: InitialState, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    setSingleProduct(
      state: InitialState,
      action: PayloadAction<{ id: number }>
    ) {
      const singleProduct = state.products.find(
        (product) => product.productId == action.payload.id
      );
      if (singleProduct) {
        state.singleProduct = singleProduct;
      }
    },
  },
});
export const { setProduct, setStatus, setSingleProduct } = productSlice.actions;
export default productSlice.reducer;
export function fetchSingleProduct(id: number) {
  return async function fetchSingleProductThunk(dispatch: AppDispatch) {
    dispatch(setSingleProduct({ id }));
  };
}
