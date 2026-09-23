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
import { DEFAULT_PAGE_SIZE } from "@/utils/constants/appConstants";
import styles from "./page.module.scss";

export default function TenantsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data, isLoading, isError, refetch } = useListTenantsQuery({
    page: page - 1,
    size: pageSize,
  });

  const tenants = data?.customers ?? EMPTY_TENANTS;
  const { active, running, failed } = getTenantCounts(tenants);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>();

  const selectedTenant = tenants.find(
    (t) => t.customerName === selectedCustomerName,
  );

  const handleOnAdd = () => setDrawerOpen(true);

  const handleOnCloseDrawer = () => setDrawerOpen(false);

  const handleOnRowClick = (tenant: ITenant) => {
    setSelectedCustomerName(tenant.customerName);
    setDetailsOpen(true);
  };

  const handleOnCloseDetails = () => setDetailsOpen(false);

  const handleOnPageChange = (nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  };

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tenants</h1>
          <p className={styles.subtitle}>
            {active} active · {running} in progress · {failed} failed on this
            page
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOnAdd}>
          Add customer
        </Button>
      </div>

      <TenantsTable
        tenants={tenants}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        page={page}
        pageSize={pageSize}
        totalElements={data?.totalElements ?? 0}
        onPageChange={handleOnPageChange}
        onRowClick={handleOnRowClick}
      />

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
