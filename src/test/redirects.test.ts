import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config.js';

describe('redirects', () => {
  it('sends the old Services and Nodes pages to the Demo page', async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toEqual(
      expect.arrayContaining([
        { source: '/services', destination: '/demo', permanent: true },
        { source: '/nodes', destination: '/demo', permanent: true },
      ]),
    );
  });

  it('only redirects to pages that exist', async () => {
    const pages = Object.keys(import.meta.glob('../app/**/page.tsx')).map(
      (file) =>
        file.replace(/^\.\.\/app/, '').replace(/\/?page\.tsx$/, '') || '/',
    );
    const redirects = (await nextConfig.redirects?.()) ?? [];
    redirects.forEach(({ source, destination }) => {
      expect(pages, source).toContain(destination);
      expect(pages, source).not.toContain(source);
    });
  });
});
