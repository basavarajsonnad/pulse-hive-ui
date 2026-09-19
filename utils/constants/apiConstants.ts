export const API_URL = process.env.BASE_URL ?? "";
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION ?? "";

export const GET = "GET";
export const POST = "POST";
export const PUT = "PUT";
export const PATCH = "PATCH";
export const DELETE = "DELETE";

// Seconds before expiry at which the access token is refreshed.
export const REFRESH_THRESHOLD = 60;

export const API_STATUS = {
  UNAUTHORIZED: 401,
  UNPROCESSABLE_CONTENT: 422,
} as const;
