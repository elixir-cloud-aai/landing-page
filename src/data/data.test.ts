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
import nodesData from './nodes.json';
import productsData from './product.json';
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
  if (url != null) expect(url).toMatch(/^https:\/\//);
};

const expectImageExists = (owner: Owner | null) => {
  if (owner?.image) expect(publicFile(owner.image), owner.image).toBe(true);
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
      if (service.deploymentUrl) expect(service.status).toBe('Live');
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
      if (node.logo) expect(publicFile(node.logo), node.logo).toBe(true);
      expectHttpsOrNull(node.website);
      expectHttpsOrNull(node.contact?.url);
      expectImageExists(node.liaison);
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
});
