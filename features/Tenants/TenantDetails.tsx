"use client";

import { Alert, Skeleton, Tabs } from "antd";
import type { ITenantDetailsProps } from "./types";
import { useGetTenantDetailsQuery } from "./api";
import { StatusPill, TenantLogin, TierTag, formatDate } from "./utils";
import styles from "./styles/TenantDetails.module.scss";

export default function TenantDetails({ customerId }: ITenantDetailsProps) {
  const {
    data: tenant,
    isLoading,
    isError,
  } = useGetTenantDetailsQuery(customerId, { skip: !customerId });

  if (isLoading) return <Skeleton active />;

  if (isError || !tenant) {
    return <Alert type="error" showIcon title="Couldn't load tenant details" />;
  }

  return (
    <>
      <div className={styles.summary}>
        <TierTag tenant={tenant} />
        <StatusPill tenant={tenant} />
        <span className={styles.login}>
          <TenantLogin tenant={tenant} />
        </span>
      </div>

      {tenant.registrationOutput && (
        <Alert
          className={styles.registrationAlert}
          type="warning"
          showIcon
          title="Action needed to finish SSO registration"
          description={
            <span className={styles.registrationText}>
              {tenant.registrationOutput}
            </span>
          }
        />
      )}

      <Tabs
        items={[
          {
            key: "general",
            label: "General",
            children: (
              <section>
                <h3 className={styles.heading}>TENANT</h3>
                <dl className={styles.list}>
                  <div className={styles.row}>
                    <dt>Customer ID</dt>
                    <dd>{tenant.customerId}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt>MSP ID</dt>
                    <dd>{tenant.mspId}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt>Tenant name</dt>
                    <dd>{tenant?.tenantName}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt>Created</dt>
                    <dd>{formatDate(tenant.createdAt)}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt>Updated</dt>
                    <dd>{formatDate(tenant.updatedAt)}</dd>
                  </div>
                </dl>
              </section>
            ),
          },
        ]}
      />
    </>
  );
}
