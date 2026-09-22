"use client";

import { useState } from "react";
import { Button, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CustomerGroupForm from "@/features/CustomerGroups/CustomerGroupForm";
import CustomerGroupsTable from "@/features/CustomerGroups/CustomerGroupsTable";
import { CUSTOMER_GROUPS_MOCK } from "@/features/CustomerGroups/utils";
import styles from "./page.module.scss";

export default function GroupManagementPage() {
  const [customerGroups, setCustomerGroups] = useState(CUSTOMER_GROUPS_MOCK);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOnAdd = () => setDrawerOpen(true);

  const handleOnCloseDrawer = () => setDrawerOpen(false);

  const handleOnCreate = (customerGroup: string) =>
    setCustomerGroups((current) => [
      {
        customerGroup,
        ownerEmail: "",
        customers: 0,
        licenseMix: { basic: 0, intermediate: 0, advanced: 0 },
        users: 0,
        incidents: 0,
      },
      ...current,
    ]);

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Customer Groups</h1>
          <p className={styles.subtitle}>
            How Acme MSP organizes its customers — one or more Customer Success
            professionals service each group
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOnAdd}>
          Add customer group
        </Button>
      </div>

      <CustomerGroupsTable customerGroups={customerGroups} isLoading={false} />

      <Drawer
        open={drawerOpen}
        onClose={handleOnCloseDrawer}
        title="Add customer group"
        size={450}
        closable={{ placement: "end" }}
        destroyOnHidden
      >
        <CustomerGroupForm
          onClose={handleOnCloseDrawer}
          onCreate={handleOnCreate}
        />
      </Drawer>
    </>
  );
}
