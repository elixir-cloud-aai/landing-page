// @ts-check

// Cache policy (see "Caching" in the README). Next.js itself gives the hashed
// files under /_next/static/ `public, max-age=31536000, immutable`, which
// can't be overridden, and optimized images (/_next/image) the larger of
// `images.minimumCacheTTL` (4 hours) and the max-age of the source image.
// The rules below cover everything else; where several match a path, the
// last one wins. `src/test/cache-policy.test.ts` checks them.
/** @type {Awaited<ReturnType<NonNullable<import('next').NextConfig['headers']>>>} */
const cacheHeaders = [
  // Pages: caches must revalidate them on every request (cheap, by ETag).
  // Next.js would send `s-maxage=31536000` for prerendered pages, which would
  // let a shared cache (e.g., a reverse proxy) serve a page for a year after
  // a deploy, pointing at /_next/static/ files that the new image no longer
  // has.
  {
    source: '/:path((?!_next/).*)',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ],
  },
  // Files of public/ (images, flags, logos, favicon): their names have no
  // hash, so they are cached for a day only, and served stale for up to a
  // week while they are revalidated in the background.
  {
    source: '/:path((?!_next/).*\\.[A-Za-z0-9]+)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=86400, stale-while-revalidate=604800',
      },
    ],
  },
  // robots.txt and the sitemaps (written by next-sitemap on build)
  {
    source: '/:file(robots\\.txt|sitemap(?:-\\d+)?\\.xml)',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
  },
  // The service worker that removes the old one (public/sw.js) must always
  // be fetched fresh.
  {
    source: '/sw.js',
    headers: [
      { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
    ],
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't generate AGENTS.md in the repository on `next dev`
  agentRules: false,
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return cacheHeaders;
  },
};

module.exports = nextConfig;
