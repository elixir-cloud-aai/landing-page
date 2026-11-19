import { describe, expect, it } from 'vitest';
import funding from '@/data/funding.json';
import productsData from '@/data/product.json';
import servicesData from '@/data/services.json';
import {
  checkFilterIds,
  filterId,
  matchesAny,
  parseFilters,
  withFilters,
} from './filters';

describe('checkFilterIds', () => {
  const option = (label: string) => ({ value: filterId(label), label });

  it('passes options with unique ids through', () => {
    const options = [option('GA4GH TES'), option('GA4GH WES')];
    expect(checkFilterIds(options)).toBe(options);
  });

  it('rejects labels that turn into the same id', () => {
    expect(() =>
      checkFilterIds([option('GA4GH TES'), option('GA4GH-TES')]),
    ).toThrow('The filters "GA4GH TES" and "GA4GH-TES" share the id');
  });

  it('rejects labels without letters or digits', () => {
    expect(() => checkFilterIds([option('—')])).toThrow('empty id');
  });

  // The listings build their filters from these labels
  it.each([
    [
      'product standards',
      productsData.products.flatMap((product) => product.standards),
    ],
    ['funding categories', funding.map((grant) => grant.category)],
    [
      'service statuses',
      servicesData.services.flatMap((service) =>
        service.status ? [service.status] : [],
      ),
    ],
  ])('gives the %s unique ids', (_, labels) => {
    expect(() =>
      checkFilterIds(Array.from(new Set(labels)).map(option)),
    ).not.toThrow();
  });
});

describe('filterId', () => {
  it('turns labels into URL-safe ids', () => {
    expect(filterId('GA4GH WES')).toBe('ga4gh-wes');
    expect(filterId('ELIXIR Implementation Studies')).toBe(
      'elixir-implementation-studies',
    );
    expect(filterId('  Cloud-native!  ')).toBe('cloud-native');
  });
});

describe('parseFilters', () => {
  const ids = ['ga4gh-tes', 'ga4gh-wes', 'ga4gh-trs'];

  it('reads the selected ids in the order of the listing', () => {
    expect(parseFilters('?filter=ga4gh-trs,ga4gh-tes', ids)).toEqual([
      'ga4gh-tes',
      'ga4gh-trs',
    ]);
  });

  it('drops unknown and repeated ids', () => {
    expect(parseFilters('?filter=nope,ga4gh-wes,ga4gh-wes', ids)).toEqual([
      'ga4gh-wes',
    ]);
  });

  it('selects nothing without the parameter or with an empty one', () => {
    expect(parseFilters('', ids)).toEqual([]);
    expect(parseFilters('?other=1', ids)).toEqual([]);
    expect(parseFilters('?filter=', ids)).toEqual([]);
  });

  it('reads another parameter if asked to', () => {
    expect(parseFilters('?standard=ga4gh-tes', ids, 'standard')).toEqual([
      'ga4gh-tes',
    ]);
  });
});

describe('withFilters', () => {
  it('sets the selection and keeps other parameters', () => {
    expect(withFilters('?tab=1', ['a', 'b'])).toBe('?tab=1&filter=a%2Cb');
  });

  it('removes the parameter when nothing is selected', () => {
    expect(withFilters('?filter=a&tab=1', [])).toBe('?tab=1');
    expect(withFilters('?filter=a', [])).toBe('');
  });

  it('round-trips through parseFilters', () => {
    expect(parseFilters(withFilters('', ['a', 'c']), ['a', 'b', 'c'])).toEqual([
      'a',
      'c',
    ]);
  });
});

describe('matchesAny', () => {
  it('lists every item when no filter is selected', () => {
    expect(matchesAny([], [])).toBe(true);
    expect(matchesAny([], ['a'])).toBe(true);
  });

  it('lists items matching any selected filter, not only all of them', () => {
    expect(matchesAny(['a', 'b'], ['b'])).toBe(true);
    expect(matchesAny(['a', 'b'], ['a', 'c'])).toBe(true);
    expect(matchesAny(['a', 'b'], ['c'])).toBe(false);
    expect(matchesAny(['a'], [])).toBe(false);
  });
});
