import RedirectToTenants from "@/shared/RedirectToTenants";

// `/customers/tenant-setup` -> tenants. Replaces the next.config.ts redirect.
export default function TenantSetupPage() {
  return <RedirectToTenants />;
}
