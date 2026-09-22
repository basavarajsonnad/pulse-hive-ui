import type { NextConfig } from "next";

const TENANTS_PATH = "/customers/tenant-setup/tenants";
const CUSTOMER_GROUPS_PATH = "/customers/customer-groups/group-management";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: TENANTS_PATH, permanent: false },
      { source: "/customers", destination: TENANTS_PATH, permanent: false },
      {
        source: "/customers/tenant-setup",
        destination: TENANTS_PATH,
        permanent: false,
      },
      {
        source: "/customers/customer-groups",
        destination: CUSTOMER_GROUPS_PATH,
        permanent: false,
      },
    ];
  },

  async rewrites() {
    const { BASE_URL } = process.env;
    return BASE_URL
      ? [{ source: "/api/:path*", destination: `${BASE_URL}/api/:path*` }]
      : [];
  },
};

export default nextConfig;
