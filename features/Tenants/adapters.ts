// Adapters that translate the raw Hive backend shapes into the UI shapes the
// app consumes. This logic previously lived in the server-side BFF
// (lib/hiveClient.ts). With the static export there is no server, so the
// browser calls Hive directly and applies these transforms via RTK Query's
// `transformResponse` / request builders.

import type {
  ICreateTenantRequest,
  ITenantDetails,
  ITenantsResponse,
} from "@/features/Tenants/types";

interface IHiveCustomer {
  customerId?: string;
  mspId?: string;
  customerName?: string;
  tenantName?: string | null;
  licensePackage?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  registrationOutput?: string | null;
}

interface IHiveCustomerList {
  customers?: IHiveCustomer[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

/** Map Hive's job status onto the three UI states. */
export function mapHiveStatus(status: string | undefined) {
  switch (status) {
    case "completed":
      return "active" as const;
    case "failed":
    case "completed_with_errors":
      return "failed" as const;
    case "queued":
    case "running":
    default:
      return "in_progress" as const;
  }
}

/** Adapt Hive GET /api/v1/tenants into the UI ITenantsResponse shape. */
export function toUiTenantsResponse(body: unknown): ITenantsResponse {
  const list = (body ?? {}) as IHiveCustomerList;
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

/** Adapt Hive GET /api/v1/tenants/{customerId} into the UI ITenantDetails shape. */
export function toUiTenantDetails(body: unknown): ITenantDetails {
  const details = (body ?? {}) as IHiveCustomer;

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

/** Reshape the UI create-tenant request into the body Hive expects. */
export function toHiveCreateTenant(request: ICreateTenantRequest) {
  return {
    customerName: request.customerName,
    licensePackage: request.liscencePackage,
    sso: request.sso,
  };
}
