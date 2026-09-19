"use client";

import { Badge, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useDateRangeFilter } from "@/features/Tenants/useDateRangeFilter";
import TabNav, { type ITabNavItem } from "./TabNav";
import styles from "./styles/CustomersTopBar.module.scss";

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
  const { activeFilterCount } = useDateRangeFilter();

  return (
    <header className={styles.bar}>
      <span className={styles.section}>CUSTOMERS</span>
      <div className={styles.tabs}>
        <TabNav items={CUSTOMER_TABS} />
      </div>
      <Badge count={activeFilterCount} size="small">
        <Button icon={<FilterOutlined />} aria-label="Filters" />
      </Badge>
    </header>
  );
}
