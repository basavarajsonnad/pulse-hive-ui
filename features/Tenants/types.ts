import type { TableProps } from "antd";

export const TENANT_TIERS = ["Basic", "Intermediate", "Advanced"] as const;

export type TenantStatus = "in_progress" | "active" | "failed";

export interface ITenant {
  customerName: string;
  tenantName: string | null;
  liscencePackage: string;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ITenantsResponse {
  customers: ITenant[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ITenantsQuery {
  page: number;
  size: number;
}

export type DateRange = "30d" | null;

export type ColumnFilters = Parameters<
  NonNullable<TableProps<ITenant>["onChange"]>
>[1];

// POST /api/v1/tenants
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
  tenants: ITenant[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  page: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number, pageSize: number) => void;
  onRowClick: (tenant: ITenant) => void;
}

export interface ITenantFormProps {
  onClose: () => void;
}
