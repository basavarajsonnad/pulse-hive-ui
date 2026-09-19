import type { ApiError, CreateTenantRequest, CreateTenantResponse } from "@/types/tenant";
import { VALIDATION_FAILED } from "@/types/tenant";

export class HiveClientError extends Error {
  readonly status = 400;
  readonly code = VALIDATION_FAILED;

  constructor(message: string) {
    super(message);
    this.name = "HiveClientError";
  }
}

function hiveBaseUrl(): string {
  const configured = process.env.HIVE_API_BASE_URL?.trim();
  if (!configured) {
    throw new HiveClientError("HIVE_API_BASE_URL is not configured");
  }

  return configured.replace(/\/$/, "");
}

function asApiError(body: unknown): ApiError | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  if (typeof record.message !== "string") {
    return null;
  }

  return { code: VALIDATION_FAILED, message: record.message };
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

export async function createTenant(
  payload: CreateTenantRequest,
): Promise<CreateTenantResponse> {
  const baseUrl = hiveBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/v1/tenants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    throw new HiveClientError("Unable to create tenant");
  }

  const body = await parseJson(response);

  if (response.status === 202) {
    const created = body as CreateTenantResponse | null;
    if (
      created &&
      typeof created.jobId === "string" &&
      typeof created.customerName === "string" &&
      typeof created.status === "string"
    ) {
      return created;
    }

    throw new HiveClientError("Unable to create tenant");
  }

  const apiError = asApiError(body);
  throw new HiveClientError(apiError?.message ?? "Unable to create tenant");
}
