import { configureStore } from "@reduxjs/toolkit";
import tenantsReducer from "./slices/tenantsSlice";

// Per-request store factory (recommended for the Next.js App Router) —
// avoids sharing a single store instance across requests on the server.
export const makeStore = () =>
  configureStore({
    reducer: {
      tenants: tenantsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
