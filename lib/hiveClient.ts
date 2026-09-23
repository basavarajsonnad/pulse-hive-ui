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
  // Preserve auth failures so the UI can send the user back to login.
  const httpStatus = status === 401 || status === 403 || status === 404 ? status : 400;

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

type HiveFetchOptions = RequestInit & {
  /** Browser Cookie header from the Next.js route (forwards HIVE_SESSION to Hive). */
  cookie?: string | null;
};

async function hiveFetch(path: string, init: HiveFetchOptions = {}): Promise<unknown> {
  const { cookie, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);

  if (cookie) {
    headers.set("Cookie", cookie);
  }

  let response: Response;

  try {
    response = await fetch(`${hiveBaseUrl()}${path}`, {
      ...rest,
      headers,
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

export async function createTenant(
  rawBody: string,
  cookie?: string | null,
): Promise<unknown> {
  let body = rawBody;
  try {
    const parsed = JSON.parse(rawBody) as Record<string, unknown>;
    // Hive CreateTenantRequest only accepts customerName + sso.
    const { customerName, sso } = parsed;
    body = JSON.stringify({ customerName, sso });
  } catch {
    // leave rawBody; Hive will validate
  }

  return hiveFetch("/api/v1/tenants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cookie,
  });
}

type HiveCustomer = {
  customerName?: string;
  tenantName?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
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
      customerName: c.customerName || "",
      tenantName: c.tenantName ?? null,
      status: mapHiveStatus(c.status),
      createdAt: c.createdAt || "",
      updatedAt: c.updatedAt || "",
      // Not returned by Hive yet; UI still expects a tier label.
      liscencePackage: "basic",
    })),
    page: list.page ?? 0,
    size: list.size ?? customers.length,
    totalElements: list.totalElements ?? customers.length,
    totalPages: list.totalPages ?? 1,
  };
}

export async function listTenants(
  search = "",
  cookie?: string | null,
): Promise<unknown> {
  const query = search.startsWith("?") ? search : search ? `?${search}` : "";
  const body = await hiveFetch(`/api/v1/tenants${query}`, {
    method: "GET",
    cookie,
  });
  return toUiTenantsResponse(body);
}


