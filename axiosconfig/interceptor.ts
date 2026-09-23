import { isAxiosError } from "axios";
import store from "@/redux/store";
import axiosInstance from "@/axiosconfig/axiosInstance";
import { resetLoginReducer } from "@/features/Login/slice";
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
        store.dispatch(resetLoginReducer());
      } else if (status && status >= 400 && status < 500 && message) {
        store.dispatch(setNotification({ type: ERROR, message }));
      }
    }

    return Promise.reject(error);
  },
);
