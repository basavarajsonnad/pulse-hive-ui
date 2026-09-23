import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: emit plain HTML/CSS/JS into `dist/` for S3 + CloudFront
  // hosting. There is no Node server at runtime, so `redirects()`,
  // `rewrites()` and route handlers (the old /api BFF) are not available:
  //   - the root redirects are handled client-side (see app/page.tsx and the
  //     RedirectToTenants pages under /customers)
  //   - the browser now calls the Hive backend directly via
  //     NEXT_PUBLIC_API_BASE_URL (see utils/constants/apiConstants.ts)
  output: "export",
  distDir: "dist",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
