"use client";

import { useState } from "react";
import { Tag } from "antd";
import translator from "@/i18n/translator";
import TabNav, { type ITabNavItem } from "./TabNav";
import styles from "./styles/TenantSetupHeader.module.scss";

const CUSTOMER_GROUPS_TABS: ITabNavItem[] = [
  {
    key: "group-management",
    label: translator("layout.customerGroupsHeader.tabs.groupManagement"),
    href: "/customers/customer-groups/group-management",
  },
];

const DEFAULT_FILTERS = [
  translator("common.dateRanges.last24Hours"),
  translator("common.dateRanges.last7Days"),
];

export default function CustomerGroupsHeader() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleOnRemoveFilter = (filter: string) =>
    setFilters((current) => current.filter((f) => f !== filter));

  return (
    <div className={styles.header}>
      <div className={styles.tabs}>
        <TabNav items={CUSTOMER_GROUPS_TABS} variant="secondary" />
      </div>
      <div className={styles.filters}>
        <span className={styles.filtersLabel}>
          {translator("common.filtersLabel")}
        </span>
        {filters.length ? (
          filters.map((filter) => (
            <Tag
              key={filter}
              closable
              onClose={() => handleOnRemoveFilter(filter)}
            >
              {filter}
            </Tag>
          ))
        ) : (
          <span className={styles.none}>{translator("common.none")}</span>
        )}
      </div>
    </div>
  );
}
