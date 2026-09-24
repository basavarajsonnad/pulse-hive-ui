"use client";

import { useEffect, useState } from "react";
import { Spin } from "antd";
import { refreshAccessToken } from "@/axiosconfig/baseQuery";
import { redirectToLogin } from "@/features/Login/utils";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    refreshAccessToken()
      .then(() => {
        if (!cancelled) setIsAuthorized(true);
      })
      .catch(() => {
        if (!cancelled) redirectToLogin();
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isAuthorized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}
