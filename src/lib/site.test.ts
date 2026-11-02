import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contributorMarkers } from './contributor-markers';
import { DOCS_HUB_URL, DOCS_OPERATORS_URL } from './site';
import contributors from '@/data/contributor.json';

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|json)$/.test(entry) && !entry.includes('.test.')
      ? [path]
      : [];
  });

describe('docs links', () => {
  it('point to the ELIXIR On-Cloud docs', () => {
    expect(DOCS_HUB_URL).toBe('https://docs.elixir-on.cloud/');
    expect(DOCS_OPERATORS_URL.startsWith(DOCS_HUB_URL)).toBe(true);
  });

  // The old Documentation Hub is offline; keep it from creeping back in.
  it('never use the retired documentation hubs', () => {
    const offenders = sourceFiles(join(process.cwd(), 'src')).filter((file) =>
      /elixir-cloud-aai\.github\.io|elixir-on-cloud\.github\.io/.test(
        readFileSync(file, 'utf8'),
      ),
    );
    expect(offenders).toEqual([]);
  });
});

describe('contributorMarkers', () => {
  it('has one marker per contributor with a location and a photo', () => {
    const expected = contributors.filter(
      (c) => c.lat !== null && c.lng !== null && !!c.image,
    );
    expect(contributorMarkers).toHaveLength(expected.length);
    expect(contributorMarkers.map((m) => m.label)).toEqual(
      expected.map((c) => c.name),
    );
  });

  it('places every marker on the globe', () => {
    contributorMarkers.forEach((marker) => {
      expect(marker.lat).toBeGreaterThanOrEqual(-90);
      expect(marker.lat).toBeLessThanOrEqual(90);
      expect(marker.lng).toBeGreaterThanOrEqual(-180);
      expect(marker.lng).toBeLessThanOrEqual(180);
    });
  });
});
