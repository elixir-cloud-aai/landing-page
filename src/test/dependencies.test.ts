import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Manifest = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

const manifest = JSON.parse(
  readFileSync(resolve(__dirname, '../../package.json'), 'utf8'),
) as Manifest;

// Tools that only run during `npm run build` don't reach the site, so they
// are development dependencies: the `Audit` job (`npm audit --omit=dev`)
// then doesn't fail on advisories in them (see "Audit" in the README).
const buildOnly = ['next-sitemap'];

describe('package.json', () => {
  it.each(buildOnly)('lists the build tool %s as a dev dependency', (name) => {
    expect(manifest.devDependencies).toHaveProperty(name);
    expect(manifest.dependencies).not.toHaveProperty(name);
  });
});
