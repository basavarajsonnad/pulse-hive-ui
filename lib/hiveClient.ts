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
  const record =
    body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  const message =
    typeof record?.message === "string"
      ? record.message
      : "Unable to complete request";
  const httpStatus =
    status === 401 || status === 403 || status === 404 ? status : 400;

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

type HiveRequestOptions = {
  /** Browser Cookie header from the Next.js route (forwards HIVE_SESSION to Hive). */
  cookie?: string;
};

const HIVE_FETCH_TIMEOUT_MS = 15_000;

async function hiveFetch(
  path: string,
  init?: RequestInit,
  options?: HiveRequestOptions,
): Promise<unknown> {
  const headers = new Headers(init?.headers);
  const cookie = options?.cookie?.trim();

  if (cookie) {
    headers.set("Cookie", cookie);
  }

  let response: Response;

  try {
    response = await fetch(`${hiveBaseUrl()}${path}`, {
      ...init,
      headers,
      cache: "no-store",
      signal: init?.signal ?? AbortSignal.timeout(HIVE_FETCH_TIMEOUT_MS),
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

export async function createTenant(
  rawBody: string,
  options?: HiveRequestOptions,
): Promise<unknown> {
  let body = rawBody;
  try {
    const parsed = JSON.parse(rawBody) as Record<string, unknown>;
    const licensePackage = parsed.licensePackage ?? parsed.liscencePackage;
    body = JSON.stringify({
      customerName: parsed.customerName,
      licensePackage,
      sso: parsed.sso,
    });
  } catch {
    console.warn("createTenant: unable to parse request body", rawBody);
  }

  return hiveFetch(
    "/api/v1/tenants",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    },
    options,
  );
}

type HiveCustomer = {
  customerId?: string;
  mspId?: string;
  customerName?: string;
  tenantName?: string | null;
  licensePackage?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type HiveCustomerDetails = {
  customerId?: string;
  mspId?: string;
  customerName?: string;
  tenantName?: string | null;
  licensePackage?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  registrationOutput?: string | null;
};

type HiveCustomerList = {
  customers?: HiveCustomer[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
};

function mapHiveStatus(status: string | undefined): string {
  switch (status) {
    case "completed":
      return "active";
    case "failed":
    case "completed_with_errors":
      return "failed";
    case "queued":
    case "running":
    default:
      return "in_progress";
  }
}

/** Adapt Hive GET /api/v1/tenants into the UI ITenantsResponse shape. */
function toUiTenantsResponse(body: unknown) {
  const list = (body ?? {}) as HiveCustomerList;
  const customers = Array.isArray(list.customers) ? list.customers : [];

  return {
    customers: customers.map((c) => ({
      customerId: c.customerId || "",
      customerName: c.customerName || "",
      tenantName: c.tenantName ?? null,
      status: mapHiveStatus(c.status),
      createdAt: c.createdAt || "",
      updatedAt: c.updatedAt || "",
      liscencePackage: c.licensePackage || "basic",
    })),
    page: list.page ?? 0,
    size: list.size ?? customers.length,
    totalElements: list.totalElements ?? customers.length,
    totalPages: list.totalPages ?? 1,
  };
}

export async function listTenants(
  search = "",
  options?: HiveRequestOptions,
): Promise<unknown> {
  const query = search.startsWith("?") ? search : search ? `?${search}` : "";
  const body = await hiveFetch(
    `/api/v1/tenants${query}`,
    { method: "GET" },
    options,
  );
  return toUiTenantsResponse(body);
}

/** Adapt Hive GET /api/v1/tenants/{customerId} into the UI ITenantDetails shape. */
function toUiTenantDetails(body: unknown) {
  const details = (body ?? {}) as HiveCustomerDetails;

  return {
    customerId: details.customerId || "",
    mspId: details.mspId || "",
    customerName: details.customerName || "",
    tenantName: details.tenantName ?? null,
    liscencePackage: details.licensePackage || "basic",
    status: mapHiveStatus(details.status),
    createdAt: details.createdAt || "",
    updatedAt: details.updatedAt || "",
    registrationOutput: details.registrationOutput ?? null,
  };
}

export async function getTenantDetails(
  customerId: string,
  options?: HiveRequestOptions,
): Promise<unknown> {
  const body = await hiveFetch(
    `/api/v1/tenants/${encodeURIComponent(customerId)}`,
    { method: "GET" },
    options,
  );
  return toUiTenantDetails(body);
}
