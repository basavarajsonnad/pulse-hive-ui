export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION ?? "";

export const GET = "GET";
export const POST = "POST";
export const PUT = "PUT";
export const PATCH = "PATCH";
export const DELETE = "DELETE";

export const API_STATUS = {
  UNAUTHORIZED: 401,
} as const;
