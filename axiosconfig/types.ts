import type { Method, ResponseType } from "axios";

export interface IAxiosBaseQueryArgs {
  url: string;
  method: Method;
  data?: unknown;
  showSuccessNotification?: boolean;
  responseType?: ResponseType;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IApiErrorBody {
  code: string;
  message: string;
}

export interface IApiError {
  status?: number;
  data?: unknown;
}
