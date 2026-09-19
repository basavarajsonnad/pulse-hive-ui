import type { ReactNode } from "react";
import type { TableProps } from "antd";

export const TENANT_TIERS = ["Basic", "Intermediate", "Advanced"] as const;

export type TenantTier = (typeof TENANT_TIERS)[number];
export type TenantStatus = "active" | "disabled";

export interface ITenant {
  id: string;
  customer: string;
  tier: TenantTier;
  login: string;
  customerGroup: string;
  status: TenantStatus;
  users: number;
  incidents: number;
  createdAt: string;
}

export type TenantInput = Pick<ITenant, "customer" | "login">;

export type TenantChanges = Partial<
  Pick<ITenant, "customer" | "login" | "tier" | "customerGroup">
>;

export type DateRange = "30d" | null;

export type ColumnFilters = Parameters<
  NonNullable<TableProps<ITenant>["onChange"]>
>[1];

export interface ITenantsTableProps {
  onEdit: (tenant: ITenant) => void;
}

export interface ITenantColumnsParams {
  columnFilters: ColumnFilters;
  customerGroups: string[];
  onEdit: (tenant: ITenant) => void;
  onUpdate: (id: string, changes: TenantChanges) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export interface IEditableCellProps {
  value: string;
  label: string;
  onSave: (value: string) => void;
  options?: readonly string[];
  children: ReactNode;
}

export interface ITenantFormValues {
  customer: string;
  tenantName: string;
}

export interface ITenantFormProps {
  tenant?: ITenant;
  onClose: () => void;
}

export interface IDrawerState {
  open: boolean;
  tenant?: ITenant;
}
