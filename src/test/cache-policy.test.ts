import { readdirSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { buildCustomRoute } from 'next/dist/lib/build-custom-route';
import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config.js';

type Header = { key: string; value: string };
type HeaderRoute = { source: string; headers: Header[] };

const publicDir = resolve(__dirname, '../../public');

const listFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? listFiles(resolve(dir, entry.name))
      : [resolve(dir, entry.name)],
  );

// The `Cache-Control` header that the rules of `next.config.js` give a path,
// matched the way Next.js matches them: the last matching rule wins.
const cacheControlFor = async (path: string): Promise<string | undefined> => {
  const routes = ((await nextConfig.headers?.()) ?? []) as HeaderRoute[];
  let value: string | undefined;
  for (const route of routes) {
    const { regex } = buildCustomRoute('header', route);
    if (new RegExp(regex, 'i').test(path)) {
      const header = route.headers.find(
        ({ key }) => key.toLowerCase() === 'cache-control',
      );
      value = header?.value ?? value;
    }
  }
  return value;
};

const PAGE = 'public, max-age=0, must-revalidate';
const ASSET = 'public, max-age=86400, stale-while-revalidate=604800';
const CRAWLER = 'public, max-age=3600';
const WORKER = 'no-cache, no-store, must-revalidate';

describe('cache policy in next.config.js', () => {
  it.each(['/', '/products', '/contributors', '/privacy', '/nodes/'])(
    'makes caches revalidate the page %s on every request',
    async (path) => {
      expect(await cacheControlFor(path)).toBe(PAGE);
    },
  );

  it.each([
    '/elixir.png',
    '/favicon.ico',
    '/flags/de.svg',
    '/contributors/alex_kanitz.jpg',
    '/ELIXIR%20On-Cloud%20Logo%20Pack/On-Cloud_MONO.svg',
  ])('caches the file %s for a day', async (path) => {
    expect(await cacheControlFor(path)).toBe(ASSET);
  });

  it.each(['/robots.txt', '/sitemap.xml', '/sitemap-0.xml'])(
    'caches %s for crawlers for an hour',
    async (path) => {
      expect(await cacheControlFor(path)).toBe(CRAWLER);
    },
  );

  it('never caches the service worker', async () => {
    expect(await cacheControlFor('/sw.js')).toBe(WORKER);
  });

  it.each([
    '/_next/static/chunks/main.js',
    '/_next/static/media/font.woff2',
    '/_next/image',
  ])('leaves %s to Next.js', async (path) => {
    expect(await cacheControlFor(path)).toBeUndefined();
  });

  it('gives every file in public/ a policy for files', async () => {
    const files = listFiles(publicDir).map(
      (file) =>
        '/' +
        relative(publicDir, file)
          .split(sep)
          .map((part) => encodeURIComponent(part))
          .join('/'),
    );
    expect(files.length).toBeGreaterThan(0);
    for (const path of files) {
      expect([ASSET, CRAWLER, WORKER], path).toContain(
        await cacheControlFor(path),
      );
    }
  });
});
