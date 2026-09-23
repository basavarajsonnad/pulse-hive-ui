import { combineReducers } from "@reduxjs/toolkit";

import { loginReducer } from "@/features/Login/slice";
import { notificationReducer } from "@/shared/Notification/slice";
import tenantsApi from "@/features/Tenants/api";

const rootReducer = combineReducers({
  login: loginReducer,
  notification: notificationReducer,
  [tenantsApi.reducerPath]: tenantsApi.reducer,
});

export default rootReducer;
