"use client";

import { useState } from "react";
import { Button, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TenantForm from "@/features/Tenants/TenantForm";
import TenantsTable from "@/features/Tenants/TenantsTable";
import { EMPTY_TENANTS, getTenantCounts } from "@/features/Tenants/utils";
import type { IDrawerState, ITenant } from "@/features/Tenants/types";
import { useListTenantsQuery } from "@/features/Tenants/api";
import styles from "./page.module.scss";

export default function TenantsPage() {
  const { data } = useListTenantsQuery();
  const { active, disabled } = getTenantCounts(data ?? EMPTY_TENANTS);
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
