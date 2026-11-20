/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://elixir-on.cloud',
  generateRobotsTxt: true,
  // Parked pages: still online, but out of the navigation and the sitemap
  exclude: ['/projects', '/news'],
};
