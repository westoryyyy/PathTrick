import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phaser is handled via dynamic import (browser-only)
  // Turbopack handles SSR exclusion automatically
  turbopack: {},
};

export default nextConfig;
