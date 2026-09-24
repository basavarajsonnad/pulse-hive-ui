"use client";

import { useEffect } from "react";
import { Spin } from "antd";
import { API_URL, API_VERSION } from "@/utils/constants/apiConstants";
import { LOGIN_API } from "@/utils/constants/urlConstants";

export default function RedirectToLogin() {
  useEffect(() => {
    window.location.href = `${API_URL}${API_VERSION}${LOGIN_API.LOGIN}`;
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
