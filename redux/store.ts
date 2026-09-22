import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import rootReducer from "@/redux/rootReducer";
import tenantsApi from "@/features/Tenants/api";
import customerGroupsApi from "@/features/CustomerGroups/api";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      tenantsApi.middleware,
      customerGroupsApi.middleware,
    ]),
  devTools: true,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
