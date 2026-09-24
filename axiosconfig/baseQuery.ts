import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { isAxiosError, type AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

import axiosInstance from "@/axiosconfig/axiosInstance";
import "@/axiosconfig/interceptor";
import { setNotification } from "@/shared/Notification/slice";
import {
  resetLoginReducer,
  setLoggedInUserDetails,
} from "@/features/Login/slice";
import type { ILoginUserDetails } from "@/features/Login/types";
import type { AppDispatch, RootState } from "@/redux/store";

import { GET, REFRESH_THRESHOLD } from "@/utils/constants/apiConstants";
import { ERROR, SUCCESS } from "@/utils/constants/appConstants";
import { LOGIN_API } from "@/utils/constants/urlConstants";
import type { IApiError, IApiErrorBody, IAxiosBaseQueryArgs } from "./types";

let refreshPromise: Promise<string> | null = null;

// Concurrent callers (e.g. AuthGuard's mount + an in-flight API call, or
// React Strict Mode's double effect invocation) share this single request
// instead of racing multiple /auth/refresh calls against each other.
export const refreshAccessToken = (dispatch: AppDispatch) => {
  refreshPromise ??= performRefresh(dispatch).finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

const performRefresh = async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(LOGIN_API.REFRESH_TOKEN, null, {
      withCredentials: true,
    });

    if (response.data?.success) {
      const userDetails: ILoginUserDetails = response.data.data;
      dispatch(setLoggedInUserDetails(userDetails));
      return userDetails.access_token;
    }

    throw new Error("Failed to refresh token");
  } catch (error) {
    dispatch(resetLoginReducer());
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

const axiosBaseQuery =
  (): BaseQueryFn<IAxiosBaseQueryArgs, unknown, IApiError> =>
  async (
    {
      url,
      method,
      data,
      showSuccessNotification = false,
      requiresAuth = true,
      responseType,
    },
    { dispatch, getState },
  ) => {
    const headers: Record<string, string> = {};

    if (requiresAuth) {
      let authToken = (getState() as RootState).login.authToken;

      if (!authToken) {
        throw new Error("User is not authenticated");
      }

      if (isTokenExpired(authToken)) {
        authToken = await refreshAccessToken(dispatch);
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
        dispatch(
          setNotification({ type: SUCCESS, message: result.data?.message }),
        );
      }

      return { data: result.data };
    } catch (error) {
      if (isAxiosError<IApiErrorBody>(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status && status >= 400 && status < 500 && message) {
          dispatch(setNotification({ type: ERROR, message }));
        }

        return { error: { status, data: error.response?.data } };
      }
      throw error;
    }
  };

export default axiosBaseQuery;
