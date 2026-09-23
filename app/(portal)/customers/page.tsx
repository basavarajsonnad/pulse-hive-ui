import RedirectToTenants from "@/shared/RedirectToTenants";

// `/customers` -> tenants. Replaces the next.config.ts redirect.
export default function CustomersPage() {
  return <RedirectToTenants />;
}
