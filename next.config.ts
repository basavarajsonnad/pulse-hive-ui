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
  // Proxy /api/* to the backend so the browser stays same-origin (no CORS).
  async rewrites() {
    const { BASE_URL } = process.env;
    return BASE_URL
      ? [{ source: "/api/:path*", destination: `${BASE_URL}/api/:path*` }]
      : [];
  },
};

export default nextConfig;
