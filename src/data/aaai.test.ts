import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ElixirNode } from '@/components/catalog/types';
import aaaiData from './aaai.json';

// The AAAI providers of the Demo page, shown in the design of the Node cards
const providers = aaaiData.providers as ElixirNode[];

const publicFile = (path: string) =>
  existsSync(join(process.cwd(), 'public', path));

describe('aaai.json', () => {
  it('has unique codes', () => {
    const codes = providers.map((provider) => provider.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it.each(providers.map((p) => [p.institute, p] as const))(
    '%s is complete',
    (_, provider) => {
      expect(provider.name).toBeTruthy();
      expect(provider.institute).toBeTruthy();
      expect(['live', 'onboarding']).toContain(provider.status);
      expect(provider.liaison?.name).toBeTruthy();
      // The card shows the flag of the code and the logo
      expect(publicFile(`/flags/${provider.code.toLowerCase()}.svg`)).toBe(
        true,
      );
      expect(provider.logo && publicFile(provider.logo)).toBe(true);
      if (provider.website) {
        expect(new URL(provider.website).protocol).toBe('https:');
      }
    },
  );
});
