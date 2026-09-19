"use client";

import { Tag } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearDateRange, selectDateRange } from "@/store/slices/tenantsSlice";
import TabNav, { type ITabNavItem } from "./TabNav";
import styles from "./TenantSetupHeader.module.scss";

const TENANT_SETUP_TABS: ITabNavItem[] = [
  {
    key: "tenants",
    label: "Tenants",
    href: "/customers/tenant-setup/tenants",
  },
  { key: "landscape", label: "Landscape" },
  { key: "search", label: "Search" },
  { key: "bulk-upload", label: "Bulk Upload" },
];

const DATE_RANGE_LABELS = { "30d": "Last 30 days" } as const;

export default function TenantSetupHeader() {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector(selectDateRange);

  const handleOnClearDateRange = () => dispatch(clearDateRange());

  return (
    <div className={styles.header}>
      <div className={styles.tabs}>
        <TabNav items={TENANT_SETUP_TABS} variant="secondary" />
      </div>
      <div className={styles.filters}>
        <span className={styles.filtersLabel}>FILTERS:</span>
        {dateRange ? (
          <Tag closable onClose={handleOnClearDateRange}>
            {DATE_RANGE_LABELS[dateRange]}
          </Tag>
        ) : (
          <span className={styles.none}>None</span>
        )}
      </div>
    </div>
  );
}
