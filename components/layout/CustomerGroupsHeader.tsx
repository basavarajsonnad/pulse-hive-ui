"use client";

import { useState } from "react";
import { Tag } from "antd";
import TabNav, { type ITabNavItem } from "./TabNav";
import styles from "./styles/TenantSetupHeader.module.scss";

const CUSTOMER_GROUPS_TABS: ITabNavItem[] = [
  {
    key: "group-management",
    label: "Group Management",
    href: "/customers/customer-groups/group-management",
  },
];

const DEFAULT_FILTERS = ["Last 24 hours", "Last 7 days"];

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
        <span className={styles.filtersLabel}>FILTERS:</span>
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
          <span className={styles.none}>None</span>
        )}
      </div>
    </div>
  );
}
