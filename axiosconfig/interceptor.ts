import { isAxiosError } from "axios";
import axiosInstance from "@/axiosconfig/axiosInstance";
import { redirectToLogin } from "@/features/Login/utils";
import type { IApiErrorBody } from "./types";

import { API_STATUS } from "@/utils/constants/apiConstants";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      isAxiosError<IApiErrorBody>(error) &&
      error.response?.status === API_STATUS.UNAUTHORIZED
    ) {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);
