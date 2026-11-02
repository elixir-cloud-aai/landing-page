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
};

module.exports = nextConfig;
