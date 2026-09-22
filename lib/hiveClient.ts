import { VALIDATION_FAILED, type ApiError } from "@/types/tenant";

export class HiveClientError extends Error {
  readonly status: number;
  readonly code: ApiError["code"];

  constructor(status: number, code: ApiError["code"], message: string) {
    super(message);
    this.name = "HiveClientError";
    this.status = status;
    this.code = code;
  }
}

function hiveBaseUrl(): string {
  const configured = process.env.HIVE_API_BASE_URL?.trim();
  if (!configured) {
    throw new HiveClientError(
      400,
      VALIDATION_FAILED,
      "HIVE_API_BASE_URL is not configured",
    );
  }

  return configured.replace(/\/$/, "");
}

function hiveError(status: number, body: unknown): HiveClientError {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  const message =
    typeof record?.message === "string" ? record.message : "Unable to complete request";
  const httpStatus = status === 404 ? 404 : 400;

  return new HiveClientError(httpStatus, VALIDATION_FAILED, message);
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function hiveFetch(path: string, init?: RequestInit): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(`${hiveBaseUrl()}${path}`, {
      ...init,
      cache: "no-store",
    });
  } catch {
    throw new HiveClientError(400, VALIDATION_FAILED, "Unable to reach Hive");
  }

  const body = await parseJson(response);

  if (response.ok) {
    return body;
  }

  throw hiveError(response.status, body);
}

export async function createTenant(rawBody: string): Promise<unknown> {
  return hiveFetch("/api/v1/tenants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: rawBody,
  });
}

export async function listTenants(search = ""): Promise<unknown> {
  const query = search.startsWith("?") ? search : search ? `?${search}` : "";
  return hiveFetch(`/api/v1/tenants${query}`, {
    method: "GET",
  });
}

export async function getSigninRegistration(customerId: string): Promise<unknown> {
  return hiveFetch(`/api/v1/tenants/${encodeURIComponent(customerId)}`, {
    method: "GET",
  });
}


