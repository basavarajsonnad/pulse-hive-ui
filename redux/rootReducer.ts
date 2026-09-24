import { combineReducers } from "@reduxjs/toolkit";

import { notificationReducer } from "@/shared/Notification/slice";
import tenantsApi from "@/features/Tenants/api";

const rootReducer = combineReducers({
  notification: notificationReducer,
  [tenantsApi.reducerPath]: tenantsApi.reducer,
});

export default rootReducer;
