import {
  STATUS_FILTER_OPTIONS,
  TIER_FILTER_OPTIONS,
} from "@/features/Tenants/utils";
import { CUSTOMER_GROUPS_MOCK } from "@/features/CustomerGroups/utils";
import translator from "@/i18n/translator";
import type { FilterSectionKey, IFilterOption, SelectedFilters } from "./types";

export const EMPTY_SELECTED_FILTERS: SelectedFilters = {
  dateRange: [],
  customerGroup: [],
  licensePackage: [],
  tenantStatus: [],
};

const DATE_RANGE_OPTIONS: IFilterOption[] = [
  { label: translator("common.dateRanges.last24Hours"), value: "24h" },
  { label: translator("common.dateRanges.last7Days"), value: "7d" },
  { label: translator("common.dateRanges.last30Days"), value: "30d" },
  { label: translator("common.dateRanges.lastQuarter"), value: "quarter" },
  { label: translator("common.dateRanges.custom"), value: "custom" },
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
  {
    key: "dateRange",
    title: translator("filtersDrawer.sections.dateRange"),
    options: DATE_RANGE_OPTIONS,
  },
  {
    key: "customerGroup",
    title: translator("filtersDrawer.sections.customerGroup"),
    options: CUSTOMER_GROUP_OPTIONS,
  },
  {
    key: "licensePackage",
    title: translator("filtersDrawer.sections.licensePackage"),
    options: LICENSE_PACKAGE_OPTIONS,
  },
  {
    key: "tenantStatus",
    title: translator("filtersDrawer.sections.tenantStatus"),
    options: TENANT_STATUS_OPTIONS,
  },
];
