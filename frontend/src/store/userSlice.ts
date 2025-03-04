import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LoginData,
  RegisterData,
  RegisterResponse,
  STATUS,
  User,
  UserInitialStateI,
} from "../types";
import { AppDispatch } from "./store";
import { API } from "../services/api";

const initialState: UserInitialStateI = {
  user: null,
  status: STATUS.LOADING,
  errorMessage: null,
  token: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state: UserInitialStateI, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setStatus(state: UserInitialStateI, action: PayloadAction<STATUS>) {
      state.status = action.payload;
    },
    setErrorMessage(state: UserInitialStateI, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    setToken(state: UserInitialStateI, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
});
export const { setUser, setStatus, setErrorMessage, setToken } =
  userSlice.actions;
export default userSlice.reducer;
export function registerUser(data: RegisterData) {
  return async function registerUSerThunk(dispatch: AppDispatch) {
    const response = await API.post<RegisterResponse>("register", data);
    try {
      if (response.status == 200) {
        dispatch(setUser(response?.data.data));
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.CLIENTERROR));
        dispatch(setErrorMessage(response.data.message));
      }
    } catch (error) {
      dispatch(setStatus(STATUS.SERVERERROR));
      dispatch(setErrorMessage(response.data.message));
    }
  };
}
export function loginUser(data: LoginData) {
  return async function registerUSerThunk(dispatch: AppDispatch) {
    const response = await API.post<any>("login", data, {
      withCredentials: true,
    });
    try {
      if (response.status == 200) {
        dispatch(setStatus(STATUS.SUCCESS));
        dispatch(setToken(response.data.token));
      } else {
        dispatch(setStatus(STATUS.CLIENTERROR));
        dispatch(setErrorMessage(response.data.message));
      }
    } catch (error) {
      dispatch(setStatus(STATUS.SERVERERROR));
      dispatch(setErrorMessage(response.data.message));
    }
  };
}
