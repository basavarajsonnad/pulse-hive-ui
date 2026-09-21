import type { TableProps } from "antd";

export const TENANT_TIERS = ["Basic", "Intermediate", "Advanced"] as const;

export type TenantStatus = "in_progress" | "active" | "failed";

export type DateRange = "30d" | null;

export type ColumnFilters = Parameters<
  NonNullable<TableProps<ITenant>["onChange"]>
>[1];

// GET /api/tenants
export interface ITenant {
  jobId: string;
  customerName: string;
  status: TenantStatus;
  createdAt: string;
  liscencePackage: string;
}

export interface ITenantsResponse {
  jobs: ITenant[];
}

// POST /api/tenants
export interface ISsoConfig {
  metadataUrl: string;
  providerName: string;
  emailAttribute: string;
  groupsAttribute: string;
}

export interface ICreateTenantRequest {
  customerName: string;
  liscencePackage: string;
  sso: ISsoConfig;
}

export interface ITenantProps {
  tenant: ITenant;
}

export interface ITenantsTableProps {
  onRowClick: (tenant: ITenant) => void;
}

export interface ITenantFormProps {
  onClose: () => void;
}
