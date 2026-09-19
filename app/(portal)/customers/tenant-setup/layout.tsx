import TenantSetupHeader from "@/components/layout/TenantSetupHeader";
import styles from "./layout.module.scss";

export default function TenantSetupLayout({
  children,
}: LayoutProps<"/customers/tenant-setup">) {
  return (
    <>
      <TenantSetupHeader />
      <div className={styles.content}>{children}</div>
    </>
  );
}
