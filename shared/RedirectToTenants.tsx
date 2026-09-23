"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

// Landing path for the app. In the server build this was a next.config.ts
// redirect; the static export has no server, so the redirect runs client-side.
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
