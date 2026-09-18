import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";

// Per-request store factory (recommended for the Next.js App Router) —
// avoids sharing a single store instance across requests on the server.
export const makeStore = () =>
  configureStore({
    reducer: {
      counter: counterReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
