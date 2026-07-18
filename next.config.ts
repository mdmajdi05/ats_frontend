import type { NextConfig } from 'next';

let nextConfig: NextConfig = {
  experimental: {
    // Heavy libs ke imports ko per-module resolve karta hai — module-graph aur build memory dono kam
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Next 16: build ke dauran peak memory usage kam karta hai
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  generateBuildId: () => {
    // Use GIT_COMMIT from env (Hostinger/CI sets this) or fallback to timestamp
    return process.env.GIT_COMMIT || `build-${Date.now()}`;
  },
  async headers() {
    return [
      // ── HTML pages: prevent CDN caching (so new deploy → fresh content instantly) ──
      {
        source: '/:path((?!_next|favicon|images|og-image|logo).*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',  value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          // CDN ko HTML cache karne se roke — har request fresh build se serve ho
          { key: 'Cache-Control',              value: 'private, no-cache, no-store, must-revalidate, max-age=0' },
          { key: 'Pragma',                     value: 'no-cache' },
          { key: 'Expires',                    value: '0' },
          // Auth cookie ke hisaab se different cache (logged in vs anonymous)
          { key: 'Vary',                       value: 'Cookie, Accept-Encoding' },
        ],
      },
      // ── Static assets (hashed filenames → safe to cache long) ──
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

// Bundle analyzer (optional, enabled via ANALYZE=true)
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

// Dev: allow external origins via env (ALLOWED_DEV_ORIGINS comma-separated)
if (process.env.ALLOWED_DEV_ORIGINS) {
  nextConfig.allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS.split(',').map(s => s.trim());
}

export default nextConfig;
