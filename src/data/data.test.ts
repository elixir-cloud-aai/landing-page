import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type {
  ElixirNode,
  Owner,
  Product,
  Service,
} from '@/components/catalog/types';
import contributors from './contributor.json';
import { PROGRAMMES } from '@/lib/funding';
import funding from './funding.json';
import nodesData from './nodes.json';
import productsData from './product.json';
import { hasAffiliation, LEADS, NODE_FLAGS } from '@/lib/contributors';
import { GA4GH_DRIVER_PROJECT_URL } from '@/lib/site';
import projects from './project.json';
import servicesData from './services.json';

// Most changes to the site are edits to these files. These tests catch broken
// references and missing assets before they reach the live site.

const products = productsData.products as Product[];
const services = servicesData.services as Service[];
const nodes = nodesData.nodes as ElixirNode[];

const publicFile = (path: string) =>
  existsSync(join(process.cwd(), 'public', path));

const duplicates = (values: string[]) =>
  values.filter((value, index) => values.indexOf(value) !== index);

const expectHttpsOrNull = (url: string | null | undefined) => {
  if (url == null) {
    return;
  }
  // Throws for malformed values, e.g. "https://" without a host.
  const parsed = new URL(url);
  expect(parsed.protocol, url).toBe('https:');
  expect(parsed.hostname, url).toMatch(/^[^.]+(\.[^.]+)+$/);
};

const expectImageExists = (owner: Owner | null) => {
  if (owner?.image) {
    expect(publicFile(owner.image), owner.image).toBe(true);
  }
};

describe('product.json', () => {
  it('has unique ids', () => {
    expect(duplicates(products.map((p) => p.id))).toEqual([]);
  });

  it.each(products.map((p) => [p.id, p] as const))(
    '%s has the required fields and valid links',
    (_, product) => {
      expect(product.name).toBeTruthy();
      expect(product.tagline).toBeTruthy();
      expect(product.blurb).toBeTruthy();
      expectHttpsOrNull(product.repoUrl);
      expectHttpsOrNull(product.docsUrl);
      product.relatedRepos?.forEach((repo) => expectHttpsOrNull(repo.url));
      expectImageExists(product.owner);
      expect(typeof product.partner).toBe('boolean');
      expect(typeof product.cloudNative).toBe('boolean');
      // Maintaining partner products isn't ours to decide
      if (product.partner) {
        expect(product.owner).toBeNull();
      }
    },
  );
});

describe('services.json', () => {
  const productIds = new Set(products.map((p) => p.id));
  const nodeCodes = new Set(nodes.map((n) => n.code));

  it('has unique ids', () => {
    expect(duplicates(services.map((s) => s.id))).toEqual([]);
  });

  it.each(services.map((s) => [s.id, s] as const))(
    '%s is consistent',
    (_, service) => {
      expect(service.name).toBeTruthy();
      expect([null, 'Live', 'Onboarding']).toContain(service.status);
      expectHttpsOrNull(service.deploymentUrl);
      expectHttpsOrNull(service.docsUrl);
      expectHttpsOrNull(service.repoUrl);
      expectHttpsOrNull(service.trackingUrl);
      // A public endpoint means the service is live.
      if (service.deploymentUrl) {
        expect(service.status).toBe('Live');
      }
      if (service.relatedProductId) {
        expect(productIds).toContain(service.relatedProductId);
      }
      service.nodes.forEach((node) => {
        expect(nodeCodes, `unknown Node ${node.code}`).toContain(node.code);
        expect(['live', 'onboarding']).toContain(node.status);
      });
      service.owners.forEach(expectImageExists);
    },
  );
});

// Removed products, which no text should still point to
const REMOVED_PRODUCTS = ['TES Dashboard', 'GA4GH I/O Schema'];

it.each(REMOVED_PRODUCTS)(
  'no product or service text mentions the %s',
  (name) => {
    const texts = JSON.stringify([productsData, servicesData]);
    expect(texts).not.toContain(name);
  },
);

describe('nodes.json', () => {
  it('has unique country codes', () => {
    expect(duplicates(nodes.map((n) => n.code))).toEqual([]);
  });

  it.each(nodes.map((n) => [n.code, n] as const))(
    '%s has its assets and valid links',
    (_, node) => {
      expect(node.name).toBeTruthy();
      expect(['live', 'onboarding']).toContain(node.status);
      expect(publicFile(`flags/${node.code.toLowerCase()}.svg`)).toBe(true);
      if (node.logo) {
        expect(publicFile(node.logo), node.logo).toBe(true);
      }
      expectHttpsOrNull(node.website);
      expectHttpsOrNull(node.contact?.url);
      expectImageExists(node.liaison);
    },
  );
});

describe('funding.json', () => {
  it.each(PROGRAMMES.map(({ name, logo }) => [name, logo]))(
    'has the logo of %s',
    (_, logo) => {
      expect(publicFile(logo), logo).toBe(true);
    },
  );

  it.each(PROGRAMMES.map(({ name }) => [name]))('has grants of %s', (name) => {
    expect(funding.some((grant) => grant.category === name)).toBe(true);
  });

  it('has unique ids', () => {
    expect(duplicates(funding.map((grant) => grant.id))).toEqual([]);
  });

  it.each(funding.map((grant) => [grant.project, grant] as const))(
    '%s names its programme and dates',
    (_, grant) => {
      // The programme is the card's title, filter and logo
      expect(PROGRAMMES.map(({ name }) => name)).toContain(grant.category);
      expect(grant.funder.startsWith(grant.category)).toBe(true);
      // ISO dates, as the listing sorts them as text
      expect(grant.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(grant.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(grant.startDate <= grant.endDate).toBe(true);
      expect(grant.project).toBeTruthy();
      expect(grant.recipients.length).toBeGreaterThan(0);
      expect(grant.formattedDuration).toBeTruthy();
    },
  );
});

describe('contributor.json', () => {
  it('only references images that exist', () => {
    const missing = contributors
      .map((c) => c.image)
      .filter((image): image is string => !!image && !publicFile(image));
    expect(missing).toEqual([]);
  });

  // A Node spelt with other capitals would show as a role, not a subtitle
  it('spells ELIXIR Nodes exactly', () => {
    const nodes = new Map(
      Object.keys(NODE_FLAGS).map((node) => [node.toLowerCase(), node]),
    );
    const misspelt = contributors
      .flatMap((c) => c.roles ?? [])
      .filter((role) => {
        const node = nodes.get(role.trim().toLowerCase());
        return node !== undefined && node !== role;
      });
    expect(misspelt).toEqual([]);
  });

  // A Node affiliation without a flag would show as a role, not a subtitle
  it('names only ELIXIR Nodes that have a flag', () => {
    const nodeLike = /^ELIXIR [A-Z][a-z]+( [A-Z][a-z]+)*$|^EMBL-EBI$/;
    const unknown = contributors
      .flatMap((c) => c.roles ?? [])
      .filter(
        (role) => nodeLike.test(role) && !Object.hasOwn(NODE_FLAGS, role),
      );
    expect(unknown).toEqual([]);
    Object.values(NODE_FLAGS).forEach((code) => {
      expect(publicFile(`flags/${code}.svg`), code).toBe(true);
    });
  });

  // Without one, a typo in a Node name would make the person "External"
  it('gives everyone an affiliation', () => {
    const without = contributors
      .filter((c) => !hasAffiliation(c))
      .map((c) => c.name);
    expect(without).toEqual([]);
  });

  it('lists every lead', () => {
    const names = contributors.map((c) => c.name);
    LEADS.forEach((lead) => expect(names).toContain(lead));
  });
});

describe('project.json', () => {
  // The home page links the same GA4GH Driver Project page
  it('links the GA4GH Driver Project the home page links', () => {
    const project = projects.find((p) => p.slug === 'elixir-cloud-aai')!;
    expect([project.url, project.links.live, project.links.website]).toEqual(
      Array(3).fill(GA4GH_DRIVER_PROJECT_URL),
    );
  });
});
