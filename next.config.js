// @ts-check

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
  // Pages that moved; old links and bookmarks keep working (permanent, so
  // search engines move to the new address)
  async redirects() {
    return [
      { source: '/services', destination: '/demo', permanent: true },
      { source: '/nodes', destination: '/demo', permanent: true },
    ];
  },
};

module.exports = nextConfig;
