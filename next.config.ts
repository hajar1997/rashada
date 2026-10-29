import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 is the default; 90 keeps the small text on case-study boards crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
