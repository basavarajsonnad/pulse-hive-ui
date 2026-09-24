"use client";

import { useEffect } from "react";
import { Spin } from "antd";
import { redirectToLogin } from "@/features/Login/utils";

export default function RedirectToLogin() {
  useEffect(() => {
    redirectToLogin();
  }, []);

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
