import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // Phaser is handled via dynamic import (browser-only)
  // Turbopack handles SSR exclusion automatically
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
