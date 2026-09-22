import type { TableProps } from "antd";

export const LICENSE_TIERS = ["basic", "intermediate", "advanced"] as const;

export interface ILicenseMix {
  basic: number;
  intermediate: number;
  advanced: number;
}

export interface ICustomerGroup {
  customerGroup: string;
  ownerEmail: string;
  customers: number;
  licenseMix: ILicenseMix;
  users: number;
  incidents: number;
}

export type ColumnFilters = Parameters<
  NonNullable<TableProps<ICustomerGroup>["onChange"]>
>[1];

// POST /api/v1/customer-groups
export interface ICreateCustomerGroupRequest {
  customerGroup: string;
}

export interface ICustomerGroupFormProps {
  onClose: () => void;
  onCreate: (customerGroup: string) => void;
}

export interface ICustomerGroupsTableProps {
  customerGroups: ICustomerGroup[];
  isLoading: boolean;
}
