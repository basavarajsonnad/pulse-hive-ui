import { isAxiosError } from "axios";
import { getStore } from "@/redux/storeAccessor";
import axiosInstance from "@/axiosconfig/axiosInstance";
import { resetLoginReducer } from "@/features/Login/slice";
import { redirectToLogin } from "@/features/Login/utils";
import { setNotification } from "@/shared/Notification/slice";
import type { IApiErrorBody } from "./types";

import { API_STATUS } from "@/utils/constants/apiConstants";
import { ERROR } from "@/utils/constants/appConstants";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError<IApiErrorBody>(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === API_STATUS.UNAUTHORIZED) {
        getStore().dispatch(resetLoginReducer());
        redirectToLogin();
      } else if (status && status >= 400 && status < 500 && message) {
        getStore().dispatch(setNotification({ type: ERROR, message }));
      }
    }

    return Promise.reject(error);
  },
);
