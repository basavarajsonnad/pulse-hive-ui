"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

const TENANTS_PATH = "/customers/tenant-setup/tenants";

export default function RedirectToTenants() {
  const router = useRouter();

  useEffect(() => {
    router.replace(TENANTS_PATH);
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Spin size="large" />
    </div>
  );
}
