// Rebuild triggered for Prisma sync
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
