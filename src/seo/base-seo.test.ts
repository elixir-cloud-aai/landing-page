import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import baseSeo from './base-seo';

describe('Favicon', () => {
  it('is the Cloud Registry UI mark, served from public/', () => {
    const icons = baseSeo.icons as { rel: string; url: string }[];
    const icon = icons.find((entry) => entry.rel === 'icon')!;
    expect(icon.url).toBe('/elixir-on-cloud-mark.svg');
    expect(existsSync(join(process.cwd(), 'public', icon.url))).toBe(true);
  });
});
