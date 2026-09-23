"use client";

import { Tag } from "antd";
import { useDateRangeFilter } from "@/shared/hooks/useDateRangeFilter";
import translator from "@/i18n/translator";
import TabNav, { type ITabNavItem } from "./TabNav";
import styles from "./styles/TenantSetupHeader.module.scss";

const TENANT_SETUP_TABS: ITabNavItem[] = [
  {
    key: "tenants",
    label: translator("layout.tenantSetupHeader.tabs.tenants"),
    href: "/customers/tenant-setup/tenants",
  },
];

const DATE_RANGE_LABELS = {
  "30d": translator("common.dateRanges.last30Days"),
} as const;

export default function TenantSetupHeader() {
  const { dateRange, clearDateRange } = useDateRangeFilter();

  return (
    <div className={styles.header}>
      <div className={styles.tabs}>
        <TabNav items={TENANT_SETUP_TABS} variant="secondary" />
      </div>
      <div className={styles.filters}>
        <span className={styles.filtersLabel}>
          {translator("common.filtersLabel")}
        </span>
        {dateRange ? (
          <Tag closable onClose={clearDateRange}>
            {DATE_RANGE_LABELS[dateRange]}
          </Tag>
        ) : (
          <span className={styles.none}>{translator("common.none")}</span>
        )}
      </div>
    </div>
  );
}
