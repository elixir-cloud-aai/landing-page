import type { Metadata } from 'next';
import { describe, expect, it } from 'vitest';
import baseSeo from '@/seo/base-seo';
import * as contributors from './contributors/layout';
import * as funding from './funding/layout';
import * as home from './page';
import * as news from './news/page';
import * as nodes from './nodes/page';
import * as privacy from './privacy/page';
import * as products from './products/page';
import * as projects from './projects/page';
import * as services from './services/page';

// The metadata of every route, from its page or, for client-side pages, from
// the route's layout.
const routes: [string, Metadata][] = [
  ['/', home.metadata],
  ['/contributors', contributors.metadata],
  ['/funding', funding.metadata],
  ['/news', news.metadata],
  ['/nodes', nodes.metadata],
  ['/privacy', privacy.metadata],
  ['/products', products.metadata],
  ['/projects', projects.metadata],
  ['/services', services.metadata],
];

// Every route of the app, from its page.tsx files
const pageRoutes = Object.keys(import.meta.glob('./**/page.tsx')).map(
  (file) => file.replace(/^\.\/?/, '/').replace(/\/?page\.tsx$/, '') || '/',
);

const titleOf = (metadata: Metadata) =>
  typeof metadata.title === 'object' &&
  metadata.title !== null &&
  'absolute' in metadata.title
    ? metadata.title.absolute
    : metadata.title;

describe('Site metadata', () => {
  it('appends the site name to page titles', () => {
    expect(baseSeo.title).toEqual({
      default: 'ELIXIR On-Cloud',
      template: '%s | ELIXIR On-Cloud',
    });
  });

  it('lists every route', () => {
    expect(routes.map(([route]) => route).sort()).toEqual(pageRoutes.sort());
  });

  it('leaves the title, description and URL of link previews to the pages', () => {
    expect(baseSeo.openGraph).not.toHaveProperty('title');
    expect(baseSeo.openGraph).not.toHaveProperty('description');
    expect(baseSeo.openGraph).not.toHaveProperty('url');
  });

  it.each(routes)('gives %s a title and a description', (_, metadata) => {
    expect(titleOf(metadata)).toEqual(expect.any(String));
    expect(String(titleOf(metadata)).trim()).not.toBe('');
    expect(metadata.description).toEqual(expect.any(String));
    expect(String(metadata.description).trim()).not.toBe('');
    expect(metadata.description).not.toBe(baseSeo.description);
  });

  // Link previews take the title and description from the page metadata,
  // unless a route overrides them
  it.each(routes)(
    'lets the link previews of %s follow its title',
    (_, metadata) => {
      expect(metadata.openGraph?.title).toBeUndefined();
      expect(metadata.openGraph?.description).toBeUndefined();
      expect(metadata.twitter?.title).toBeUndefined();
      expect(metadata.twitter?.description).toBeUndefined();
    },
  );

  it('gives every route its own title and description', () => {
    const titles = routes.map(([, metadata]) => titleOf(metadata));
    const descriptions = routes.map(([, metadata]) => metadata.description);
    expect(new Set(titles).size).toBe(routes.length);
    expect(new Set(descriptions).size).toBe(routes.length);
  });

  it('shows the site name in the title of the home page', () => {
    expect(home.metadata.title).toEqual({
      absolute: expect.stringContaining('ELIXIR On-Cloud'),
    });
  });
});
