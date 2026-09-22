export interface IFilterOption {
  label: string;
  value: string;
}

export interface IFiltersDrawerProps {
  open: boolean;
  onClose: () => void;
}

export type FilterSectionKey =
  "dateRange" | "customerGroup" | "licensePackage" | "tenantStatus";

export type SelectedFilters = Record<FilterSectionKey, string[]>;
