import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'api-gw.propdata.net',
      'staging.api-gw.propdata.net',
      'manage.propdata.net',
      'd21tw07c6rnmp0.cloudfront.net'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.propdata.net',
      },
      {
        protocol: 'http',
        hostname: '*.propdata.net',
      },
      {
        protocol: 'https',
        hostname: 'propdata.net',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
    ],
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build
  typescript: {
    // !! WARN !!
    // This setting should only be used temporarily
    // Remove when all type errors are fixed
    ignoreBuildErrors: false, // Set to true to ignore TypeScript errors during build
  },
};

export default nextConfig;
