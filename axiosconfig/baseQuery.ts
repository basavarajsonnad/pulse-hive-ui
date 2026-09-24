import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { isAxiosError, type AxiosRequestConfig } from "axios";

import axiosInstance from "@/axiosconfig/axiosInstance";
import "@/axiosconfig/interceptor";
import store from "@/redux/store";
import { setNotification } from "@/shared/Notification/slice";

import { GET } from "@/utils/constants/apiConstants";
import { SUCCESS } from "@/utils/constants/appConstants";
import type { IApiError, IAxiosBaseQueryArgs } from "./types";

// The explicit return type stops TS inferring it through `store`
// (store -> rootReducer -> api -> baseQuery), which would be circular.
const axiosBaseQuery =
  (): BaseQueryFn<IAxiosBaseQueryArgs, unknown, IApiError> =>
  async ({
    url,
    method,
    data,
    showSuccessNotification = false,
    responseType,
  }) => {
    const requestConfig: AxiosRequestConfig = {
      url,
      method,
      withCredentials: true,
      ...(responseType ? { responseType } : {}),
      ...(method === GET ? { params: data } : { data }),
    };

    try {
      const result = await axiosInstance(requestConfig);

      if (showSuccessNotification) {
        store.dispatch(
          setNotification({ type: SUCCESS, message: result.data?.message }),
        );
      }

      return { data: result.data };
    } catch (error) {
      if (isAxiosError(error)) {
        return {
          error: {
            status: error.response?.status,
            data: error.response?.data,
          },
        };
      }
      throw error;
    }
  };

export default axiosBaseQuery;
