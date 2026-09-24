"use client";

import { useEffect, useState } from "react";
import { Spin } from "antd";
import { refreshAccessToken } from "@/axiosconfig/baseQuery";
import { redirectToLogin } from "@/features/Login/utils";
import { useAppDispatch } from "@/redux/hooks";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    refreshAccessToken(dispatch)
      .then(() => {
        if (!cancelled) setIsAuthorized(true);
      })
      .catch(() => {
        if (!cancelled) redirectToLogin();
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

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
