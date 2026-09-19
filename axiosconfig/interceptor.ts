import { isAxiosError } from "axios";
import store from "@/redux/store";
import axiosInstance from "@/axiosconfig/axiosInstance";
import { resetLoginReducer } from "@/features/Login/slice";
import { setNotification } from "@/shared/Notification/slice";

import { API_STATUS } from "@/utils/constants/apiConstants";
import { ERROR } from "@/utils/constants/appConstants";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const baseError = error.response?.data?.errors?.base;

      if (status === API_STATUS.UNAUTHORIZED) {
        store.dispatch(resetLoginReducer());
      } else if (status === API_STATUS.UNPROCESSABLE_CONTENT && baseError) {
        // Only base errors are notified here; field-level errors are shown by forms.
        store.dispatch(setNotification({ type: ERROR, message: baseError }));
      }
    }

    return Promise.reject(error);
  },
);
