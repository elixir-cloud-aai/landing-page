import { describe, expect, it } from 'vitest';
import { parseFilters } from './filters';
import {
  CLOUD_NATIVE,
  OWN_PRODUCTS,
  PARTNER_PRODUCTS,
  productFilters,
  productsUrl,
  sortProducts,
} from './products';

describe('sortProducts', () => {
  it('sorts by name, ignoring case and counting numbers', () => {
    const names = ['proTES', 'Pubgrade', 'FOCA', 'Funnel', 'App 10', 'App 9'];
    expect(
      sortProducts(names.map((name) => ({ name }))).map((p) => p.name),
    ).toEqual(['App 9', 'App 10', 'FOCA', 'Funnel', 'proTES', 'Pubgrade']);
  });

  it('leaves the input as it is', () => {
    const products = [{ name: 'b' }, { name: 'a' }];
    sortProducts(products);
    expect(products).toEqual([{ name: 'b' }, { name: 'a' }]);
  });
});

describe('productFilters', () => {
  it('lists an own product under ELIXIR On-Cloud products', () => {
    expect(
      productFilters({
        partner: false,
        cloudNative: true,
        standards: ['GA4GH TES'],
      }),
    ).toEqual([OWN_PRODUCTS, CLOUD_NATIVE, 'GA4GH TES']);
  });

  it('lists a partner product under Partner products only', () => {
    expect(
      productFilters({ partner: true, cloudNative: false, standards: [] }),
    ).toEqual([PARTNER_PRODUCTS]);
  });
});

describe('productsUrl', () => {
  it('opens the listing with the filters set', () => {
    const url = productsUrl([PARTNER_PRODUCTS, 'GA4GH WES']);
    expect(url).toBe('/products?filter=partner-products,ga4gh-wes#catalog');
    // The listing reads the same ids back
    const search = new URL(url, 'https://example.org').search;
    expect(
      parseFilters(search, ['ga4gh-wes', 'partner-products', 'other']),
    ).toEqual(['ga4gh-wes', 'partner-products']);
  });
});
