"use client";

import { useState } from "react";
import { Button, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TenantForm from "@/components/tenants/TenantForm";
import TenantsTable from "@/components/tenants/TenantsTable";
import type { IDrawerState, ITenant } from "@/components/tenants/types";
import { useAppSelector } from "@/store/hooks";
import { selectTenantCounts } from "@/store/slices/tenantsSlice";
import styles from "./page.module.scss";

export default function TenantsPage() {
  const { active, disabled } = useAppSelector(selectTenantCounts);
  const [drawer, setDrawer] = useState<IDrawerState>({ open: false });

  const handleOnAdd = () => setDrawer({ open: true });

  const handleOnEdit = (tenant: ITenant) => setDrawer({ open: true, tenant });

  const handleOnCloseDrawer = () => setDrawer((d) => ({ ...d, open: false }));

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tenants</h1>
          <p className={styles.subtitle}>
            All customer groups · {active} active · {disabled} disabled · edit
            in place (pencil) · click a status pill to toggle
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOnAdd}
        >
          Add customer
        </Button>
      </div>

      <TenantsTable onEdit={handleOnEdit} />

      <Drawer
        open={drawer.open}
        onClose={handleOnCloseDrawer}
        title={drawer.tenant ? "Edit customer" : "Add customer (single)"}
        size={450}
        closable={{ placement: "end" }}
        destroyOnHidden
      >
        <TenantForm tenant={drawer.tenant} onClose={handleOnCloseDrawer} />
      </Drawer>
    </>
  );
}
