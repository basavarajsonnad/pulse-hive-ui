"use client";

import { Tag } from "antd";
import { useDateRangeFilter } from "@/features/Tenants/useDateRangeFilter";
import TabNav, { type ITabNavItem } from "./TabNav";
import styles from "./styles/TenantSetupHeader.module.scss";

const TENANT_SETUP_TABS: ITabNavItem[] = [
  {
    key: "tenants",
    label: "Tenants",
    href: "/customers/tenant-setup/tenants",
  },
];

const DATE_RANGE_LABELS = { "30d": "Last 30 days" } as const;

export default function TenantSetupHeader() {
  const { dateRange, clearDateRange } = useDateRangeFilter();

  return (
    <div className={styles.header}>
      <div className={styles.tabs}>
        <TabNav items={TENANT_SETUP_TABS} variant="secondary" />
      </div>
      <div className={styles.filters}>
        <span className={styles.filtersLabel}>FILTERS:</span>
        {dateRange ? (
          <Tag closable onClose={clearDateRange}>
            {DATE_RANGE_LABELS[dateRange]}
          </Tag>
        ) : (
          <span className={styles.none}>None</span>
        )}
      </div>
    </div>
  );
}
