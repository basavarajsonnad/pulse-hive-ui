"use client";

import { Tabs } from "antd";
import type { ITenantProps } from "./types";
import { StatusPill, TenantLogin, TierTag, formatDate } from "./utils";
import translator from "@/i18n/translator";
import styles from "./styles/TenantDetails.module.scss";

export default function TenantDetails({ tenant }: ITenantProps) {
  return (
    <>
      <div className={styles.summary}>
        <TierTag tenant={tenant} />
        <StatusPill tenant={tenant} />
        <span className={styles.login}>
          <TenantLogin tenant={tenant} />
        </span>
      </div>

      <Tabs
        items={[
          {
            key: "general",
            label: translator("tenants.details.generalTab"),
            children: (
              <section>
                <h3 className={styles.heading}>
                  {translator("tenants.details.sectionHeading")}
                </h3>
                <dl className={styles.list}>
                  <div className={styles.row}>
                    <dt>{translator("tenants.details.nameLabel")}</dt>
                    <dd>{tenant?.tenantName}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt>{translator("tenants.details.createdLabel")}</dt>
                    <dd>{formatDate(tenant.createdAt)}</dd>
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
