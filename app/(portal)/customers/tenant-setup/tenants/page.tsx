"use client";

import { useState } from "react";
import { Button, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TenantDetails from "@/features/Tenants/TenantDetails";
import TenantForm from "@/features/Tenants/TenantForm";
import TenantsTable from "@/features/Tenants/TenantsTable";
import type { ITenant } from "@/features/Tenants/types";
import { EMPTY_TENANTS, getTenantCounts } from "@/features/Tenants/utils";
import { useListTenantsQuery } from "@/features/Tenants/api";
import styles from "./page.module.scss";

export default function TenantsPage() {
  const { data } = useListTenantsQuery();
  const { active, inProgress, failed } = getTenantCounts(
    data?.jobs ?? EMPTY_TENANTS,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const selectedTenant = data?.jobs.find((t) => t.jobId === selectedId);

  const handleOnAdd = () => setDrawerOpen(true);

  const handleOnCloseDrawer = () => setDrawerOpen(false);

  const handleOnRowClick = (tenant: ITenant) => {
    setSelectedId(tenant.jobId);
    setDetailsOpen(true);
  };

  const handleOnCloseDetails = () => setDetailsOpen(false);

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tenants</h1>
          <p className={styles.subtitle}>
            All customer groups · {active} active · {inProgress} in progress ·{" "}
            {failed} failed
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOnAdd}>
          Add customer
        </Button>
      </div>

      <TenantsTable onRowClick={handleOnRowClick} />

      <Drawer
        open={drawerOpen}
        onClose={handleOnCloseDrawer}
        title="Add customer (single)"
        size={450}
        closable={{ placement: "end" }}
        destroyOnHidden
      >
        <TenantForm onClose={handleOnCloseDrawer} />
      </Drawer>

      <Drawer
        open={detailsOpen}
        onClose={handleOnCloseDetails}
        title={selectedTenant?.customerName}
        size={450}
        closable={{ placement: "end" }}
        destroyOnHidden
      >
        {selectedTenant && <TenantDetails tenant={selectedTenant} />}
      </Drawer>
    </>
  );
}
