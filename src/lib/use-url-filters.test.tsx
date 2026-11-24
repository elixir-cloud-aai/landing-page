import { act, render, screen, within } from '@testing-library/react';
import { memo } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductCatalog } from '@/components/catalog/product-catalog';
import type { Product } from '@/components/catalog/types';
import productsData from '@/data/product.json';
import { sortProducts } from './products';
import { FilterUrlSync } from './use-url-filters';

// Stands in for Next.js's router: tests set the search params it reports
let searchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParams,
}));

// In the order of the listing
const products = sortProducts(productsData.products as Product[]);

// In the app, a navigation doesn't necessarily re-render the listing (its
// props don't change); memo() makes sure it doesn't here either.
const Catalog = memo(ProductCatalog);

afterEach(() => {
  searchParams = new URLSearchParams();
  window.history.replaceState(null, '', '/');
});

const cardTitles = () =>
  screen
    .getAllByRole('article')
    .map((card) =>
      within(card).getByRole('heading', { level: 3 }).textContent?.trim(),
    );

// What a Next.js <Link> to another query on the same page does: it changes
// the URL with history.pushState (no browser event) and re-renders the
// router state that useSearchParams() reads.
function navigateWithinPage(url: string, rerender: () => void) {
  act(() => {
    window.history.pushState(null, '', url);
    searchParams = new URL(url, window.location.href).searchParams;
    rerender();
  });
}

describe('FilterUrlSync', () => {
  it('updates a listing when Next.js changes the URL on the same page', () => {
    const page = () => (
      <>
        <Catalog products={products} />
        <FilterUrlSync />
      </>
    );
    const { rerender } = render(page());
    expect(cardTitles()).toHaveLength(products.length);

    navigateWithinPage('/products?filter=ga4gh-wes', () => rerender(page()));
    expect(cardTitles()).toEqual(
      products
        .filter((product) => product.standards.includes('GA4GH WES'))
        .map((product) => product.name),
    );

    navigateWithinPage('/products', () => rerender(page()));
    expect(cardTitles()).toHaveLength(products.length);
  });

  it('is needed: without it, such a navigation leaves the listing stale', () => {
    const page = () => <Catalog products={products} />;
    const { rerender } = render(page());

    navigateWithinPage('/products?filter=ga4gh-wes', () => rerender(page()));
    expect(cardTitles()).toHaveLength(products.length);
  });
});
