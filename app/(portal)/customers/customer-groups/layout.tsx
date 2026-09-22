import CustomerGroupsHeader from "@/components/layout/CustomerGroupsHeader";
import styles from "./layout.module.scss";

export default function CustomerGroupsLayout({
  children,
}: LayoutProps<"/customers/customer-groups">) {
  return (
    <>
      <CustomerGroupsHeader />
      <div className={styles.content}>{children}</div>
    </>
  );
}
