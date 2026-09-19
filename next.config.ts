import type { NextConfig } from "next";

const TENANTS_PATH = "/customers/tenant-setup/tenants";

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
    ];
  },
};

export default nextConfig;
