import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { isAxiosError, type AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

import axiosInstance from "@/axiosconfig/axiosInstance";
import "@/axiosconfig/interceptor";
import store from "@/redux/store";
import { setNotification } from "@/shared/Notification/slice";
import {
  resetLoginReducer,
  setLoggedInUserDetails,
} from "@/features/Login/slice";
import type { ILoginUserDetails } from "@/features/Login/types";

import { GET, REFRESH_THRESHOLD } from "@/utils/constants/apiConstants";
import { SUCCESS } from "@/utils/constants/appConstants";
import { LOGIN_API } from "@/utils/constants/urlConstants";
import type { IApiError, IAxiosBaseQueryArgs } from "./types";

const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post(LOGIN_API.REFRESH_TOKEN, null, {
      withCredentials: true,
    });

    if (response.data?.success) {
      const userDetails: ILoginUserDetails = response.data.data;
      store.dispatch(setLoggedInUserDetails(userDetails));
      return userDetails.access_token;
    }

    throw new Error("Failed to refresh token");
  } catch (error) {
    store.dispatch(resetLoginReducer());
    throw error;
  }
};

const isTokenExpired = (token: string) => {
  try {
    const { exp } = jwtDecode(token);
    return !exp || exp < Date.now() / 1000 + REFRESH_THRESHOLD;
  } catch {
    return true;
  }
};

// The explicit return type stops TS inferring it through `store`
// (store -> rootReducer -> api -> baseQuery), which would be circular.
const axiosBaseQuery =
  (): BaseQueryFn<IAxiosBaseQueryArgs, unknown, IApiError> =>
  async ({
    url,
    method,
    data,
    showSuccessNotification = false,
    requiresAuth = true,
    responseType,
  }) => {
    const headers: Record<string, string> = {};

    if (requiresAuth) {
      let authToken = store.getState().login.authToken;

      if (!authToken) {
        throw new Error("User is not authenticated");
      }

      if (isTokenExpired(authToken)) {
        authToken = await refreshAccessToken();
      }

      headers.Authorization = `Bearer ${authToken}`;
    }

    const requestConfig: AxiosRequestConfig = {
      url,
      method,
      headers,
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
            data: error.response?.data?.errors,
          },
        };
      }
      throw error;
    }
  };

export default axiosBaseQuery;
