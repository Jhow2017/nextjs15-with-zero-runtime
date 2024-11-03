import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}, // Habilita o suporte a Server Components
  },
};

export default nextConfig;
