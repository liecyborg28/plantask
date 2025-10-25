import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizeCss: false, // 🔧 matikan LightningCSS
  },
};

export default nextConfig;
