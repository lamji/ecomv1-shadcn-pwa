import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'cdn.mos.cms.futurecdn.net',
      'www.pricekeeda.com',
    ],
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Enable in development mode for testing
  disable: false,
});

export default pwaConfig(nextConfig);
