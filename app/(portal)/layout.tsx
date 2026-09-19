import Sidebar from "@/components/layout/Sidebar";
import styles from "./layout.module.scss";

export default function PortalLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
