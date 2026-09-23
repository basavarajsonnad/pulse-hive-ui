"use client";

import { useState } from "react";
import { Button, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CustomerGroupForm from "@/features/CustomerGroups/CustomerGroupForm";
import CustomerGroupsTable from "@/features/CustomerGroups/CustomerGroupsTable";
import { CUSTOMER_GROUPS_MOCK } from "@/features/CustomerGroups/utils";
import translator from "@/i18n/translator";
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
          <h1 className={styles.title}>
            {translator("customerGroups.page.title")}
          </h1>
          <p className={styles.subtitle}>
            {translator("customerGroups.page.subtitle")}
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOnAdd}>
          {translator("customerGroups.page.addButton")}
        </Button>
      </div>

      <CustomerGroupsTable customerGroups={customerGroups} isLoading={false} />

      <Drawer
        open={drawerOpen}
        onClose={handleOnCloseDrawer}
        title={translator("customerGroups.page.addDrawerTitle")}
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
