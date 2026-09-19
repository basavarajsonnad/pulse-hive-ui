import type { Method, ResponseType } from "axios";

export interface IAxiosBaseQueryArgs {
  url: string;
  method: Method;
  data?: unknown;
  showSuccessNotification?: boolean;
  requiresAuth?: boolean;
  responseType?: ResponseType;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IApiError {
  status?: number;
  data?: unknown;
}
