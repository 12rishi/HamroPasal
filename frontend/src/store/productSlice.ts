import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { STATUS } from "../types";
import { API } from "../services/api";
interface IimageType {
  data: string;
  contentType: string;
  public_id: string;
}
interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: IimageType[];
  productDescription: string;
  availableColors: string[];
  category: string;
}
interface InitialState {
  products: Product[];
  status: string;
  singleProduct: Product | null;
  pageNumber: number;
}

const initialState: InitialState = {
  products: [],
  status: "loading",
  singleProduct: null,
  pageNumber: 1,
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
    setPageNumber(state: InitialState, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
  },
});
export const { setProduct, setStatus, setSingleProduct, setPageNumber } =
  productSlice.actions;
export default productSlice.reducer;
export function fetchProduct(data: number) {
  return async function fetchProductThunk(dispatch: AppDispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await API.get<{
        data: {
          product: string[] | any;
          totalPage: number;
          currentPage: number;
        };
      }>(`/product?page=${data}`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      if (response.status === 200) {
        dispatch(setProduct(response.data.data.product));
        dispatch(setPageNumber(response.data.data.currentPage));
        console.log("response data is", response);
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.CLIENTERROR));
      }
    } catch (error) {
      dispatch(setStatus(STATUS.SERVERERROR));
    }
  };
}
export function fetchSingleProduct(id: number) {
  return async function fetchSingleProductThunk(dispatch: AppDispatch) {
    dispatch(setSingleProduct({ id }));
  };
}
