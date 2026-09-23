"use client";

import { useState } from "react";
import { Badge, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useDateRangeFilter } from "@/shared/hooks/useDateRangeFilter";
import FiltersDrawer from "@/shared/FiltersDrawer";
import TabNav, { type ITabNavItem } from "./TabNav";
import styles from "./styles/CustomersTopBar.module.scss";

const CUSTOMER_TABS: ITabNavItem[] = [
  {
    key: "tenant-setup",
    label: "Tenant Setup",
    href: "/customers/tenant-setup/tenants",
    match: "/customers/tenant-setup",
  },
  {
    key: "customer-groups",
    label: "Customer Groups",
    href: "/customers/customer-groups/group-management",
    match: "/customers/customer-groups",
  },
];

export default function CustomersTopBar() {
  const { activeFilterCount } = useDateRangeFilter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleOnOpenFilters = () => setFiltersOpen(true);

  const handleOnCloseFilters = () => setFiltersOpen(false);

  return (
    <header className={styles.bar}>
      <span className={styles.section}>CUSTOMERS</span>
      <div className={styles.tabs}>
        <TabNav items={CUSTOMER_TABS} />
      </div>
      <Badge count={activeFilterCount} size="small">
        <Button
          icon={<FilterOutlined />}
          aria-label="Filters"
          onClick={handleOnOpenFilters}
        />
      </Badge>

      <FiltersDrawer open={filtersOpen} onClose={handleOnCloseFilters} />
    </header>
  );
}
