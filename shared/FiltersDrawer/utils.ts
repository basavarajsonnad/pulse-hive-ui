import {
  STATUS_FILTER_OPTIONS,
  TIER_FILTER_OPTIONS,
} from "@/features/Tenants/utils";
import { CUSTOMER_GROUPS_MOCK } from "@/features/CustomerGroups/utils";
import type { FilterSectionKey, IFilterOption, SelectedFilters } from "./types";

export const EMPTY_SELECTED_FILTERS: SelectedFilters = {
  dateRange: [],
  customerGroup: [],
  licensePackage: [],
  tenantStatus: [],
};

const DATE_RANGE_OPTIONS: IFilterOption[] = [
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last quarter", value: "quarter" },
  { label: "Custom", value: "custom" },
];

const CUSTOMER_GROUP_OPTIONS: IFilterOption[] = CUSTOMER_GROUPS_MOCK.map(
  (group) => ({ label: group.customerGroup, value: group.customerGroup }),
);

const LICENSE_PACKAGE_OPTIONS: IFilterOption[] = TIER_FILTER_OPTIONS.map(
  ({ text, value }) => ({ label: text, value }),
);

const TENANT_STATUS_OPTIONS: IFilterOption[] = STATUS_FILTER_OPTIONS.map(
  ({ text, value }) => ({ label: text, value }),
);

export const FILTER_SECTIONS: {
  key: FilterSectionKey;
  title: string;
  options: IFilterOption[];
}[] = [
  { key: "dateRange", title: "Date Range", options: DATE_RANGE_OPTIONS },
  {
    key: "customerGroup",
    title: "Customer Group",
    options: CUSTOMER_GROUP_OPTIONS,
  },
  {
    key: "licensePackage",
    title: "License Package",
    options: LICENSE_PACKAGE_OPTIONS,
  },
  {
    key: "tenantStatus",
    title: "Tenant Status",
    options: TENANT_STATUS_OPTIONS,
  },
];
