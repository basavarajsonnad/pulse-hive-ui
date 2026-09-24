"use client";

import { Suspense } from "react";
import { Provider } from "react-redux";
import AuthGuard from "@/features/Login/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import store from "@/redux/store";
import Notification from "@/shared/Notification";
import styles from "./layout.module.scss";

export default function PortalLayout({ children }: LayoutProps<"/">) {
  return (
    <Provider store={store}>
      <AuthGuard>
        <div className={styles.shell}>
          <Sidebar />
          <div className={styles.main}>
            <Suspense>{children}</Suspense>
          </div>
        </div>
      </AuthGuard>
      <Notification />
    </Provider>
  );
}
