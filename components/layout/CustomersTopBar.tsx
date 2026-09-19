"use client";

import { Badge, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/store/hooks";
import { selectActiveFilterCount } from "@/store/slices/tenantsSlice";
import TabNav, { type ITabNavItem } from "./TabNav";
import styles from "./CustomersTopBar.module.scss";

const CUSTOMER_TABS: ITabNavItem[] = [
  {
    key: "tenant-setup",
    label: "Tenant Setup",
    href: "/customers/tenant-setup/tenants",
    match: "/customers/tenant-setup",
  },
  { key: "customer-groups", label: "Customer Groups" },
  { key: "audit-logs", label: "Audit Logs" },
];

export default function CustomersTopBar() {
  const activeFilters = useAppSelector(selectActiveFilterCount);

  return (
    <header className={styles.bar}>
      <span className={styles.section}>CUSTOMERS</span>
      <div className={styles.tabs}>
        <TabNav items={CUSTOMER_TABS} />
      </div>
      <Badge count={activeFilters} size="small">
        <Button icon={<FilterOutlined />} aria-label="Filters" />
      </Badge>
    </header>
  );
}
