import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

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
      'localhost',
    ],
    unoptimized: true,
  },

  /**
   * ✅ SECURITY HEADERS (SAFE FOR RSC)
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // ⚠️ CSP tuned for Next.js + RSC
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.onesignal.com https://onesignal.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https: wss: ws://localhost:5000 http://localhost:5000 https://onesignal.com https://api.onesignal.com https://site--crud-handler--rrh2m28k5ljg.code.run wss://site--crud-handler--rrh2m28k5ljg.code.run",
              "frame-ancestors 'none'",
            ].join('; '),
          },

          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ];
  },
};

/**
 * ✅ PWA CONFIG (SAFE)
 */
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,

  // 🔥 CRITICAL FIX
  disable: !isProd,
});

export default pwaConfig(nextConfig);
