// Static export has no server-side proxy, so the browser talks to the Hive
// backend directly. The base URL must be inlined at build time, hence the
// NEXT_PUBLIC_ prefix. (Previously the same-origin /api BFF used server-only
// BASE_URL / HIVE_API_BASE_URL.)
export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
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
} as const;
