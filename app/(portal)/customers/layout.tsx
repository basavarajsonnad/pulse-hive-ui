import CustomersTopBar from "@/components/layout/CustomersTopBar";

export default function CustomersLayout({
  children,
}: LayoutProps<"/customers">) {
  return (
    <>
      <CustomersTopBar />
      {children}
    </>
  );
}
