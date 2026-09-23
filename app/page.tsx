import RedirectToTenants from "@/shared/RedirectToTenants";

// `/` -> tenants. Replaces the next.config.ts redirect (unavailable in export).
export default function HomePage() {
  return <RedirectToTenants />;
}
