import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ILoginState, ILoginUserDetails } from "./types";

const initialState: ILoginState = {
  authToken: null,
  userDetails: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoggedInUserDetails: (
      state,
      action: PayloadAction<ILoginUserDetails>,
    ) => {
      state.authToken = action.payload.access_token;
      state.userDetails = action.payload;
    },
    resetLoginReducer: () => initialState,
  },
});

export const { setLoggedInUserDetails, resetLoginReducer } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
