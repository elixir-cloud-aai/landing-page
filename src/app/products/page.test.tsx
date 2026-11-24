import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Product } from '@/components/catalog/types';
import productsData from '@/data/product.json';
import { filterId, parseFilters } from '@/lib/filters';
import ProductsPage, { metadata } from './page';

const products = productsData.products as Product[];

const DESCRIPTION =
  'Clients, services and tools for federating research infrastructures. Use them all at once, or pick the ones that fill your gaps.';

// Filters live in the URL; start every test unfiltered
afterEach(() => {
  window.history.replaceState(null, '', '/');
});

// Each stat is a <dd> value after its <dt> label (shown in reverse)
const stats = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('dl > div')).map((stat) => ({
    label: stat.querySelector('dt')!.textContent,
    value: stat.querySelector('dd')!.textContent,
    href: stat.querySelector('dd a')?.getAttribute('href'),
  }));

// The filter ids that a stat's link sets
const filtersOf = (href: string) =>
  parseFilters(new URL(href, 'https://example.org').search, [
    'elixir-on-cloud-products',
    'partner-products',
    'cloud-native',
    ...new Set(products.flatMap((p) => p.standards.map(filterId))),
  ]);

describe('Products page', () => {
  it('shows the title and description', () => {
    render(<ProductsPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Software for infrastructure federation',
    );
    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
    expect(metadata.description).toBe(DESCRIPTION);
  });

  it('keeps only the "Browse products" button', () => {
    render(<ProductsPage />);
    expect(
      screen.getByRole('link', { name: /Browse products/ }),
    ).toHaveAttribute('href', '#catalog');
    // The header of the site links the docs
    expect(
      screen.queryByRole('link', { name: /ELIXIR On-Cloud docs/ }),
    ).toBeNull();
  });

  it('counts the products of each filter', () => {
    const { container } = render(<ProductsPage />);
    expect(stats(container).map(({ label, value }) => [label, value])).toEqual([
      ['ELIXIR On-Cloud products', '8'],
      ['Partner products', '4'],
      ['GA4GH standards', '5'],
      ['Cloud native', '6'],
    ]);
  });

  it('opens the listing with the filters of each stat', () => {
    const { container } = render(<ProductsPage />);
    const [own, partner, ga4gh, cloudNative] = stats(container);
    expect(filtersOf(own.href!)).toEqual(['elixir-on-cloud-products']);
    expect(filtersOf(partner.href!)).toEqual(['partner-products']);
    expect(filtersOf(cloudNative.href!)).toEqual(['cloud-native']);
    // All GA4GH filters, and nothing else
    expect(filtersOf(ga4gh.href!).sort()).toEqual(
      [...new Set(products.flatMap((p) => p.standards))].map(filterId).sort(),
    );
    expect(filtersOf(ga4gh.href!).every((id) => id.startsWith('ga4gh-'))).toBe(
      true,
    );
    [own, partner, ga4gh, cloudNative].forEach(({ href }) =>
      expect(href).toMatch(/^\/products\?filter=[a-z0-9,-]+#catalog$/),
    );
  });

  it('lists only the products of a stat when its link is opened', () => {
    const { container } = render(<ProductsPage />);
    const partner = stats(container)[1];
    window.history.replaceState(null, '', partner.href!);
    const { container: opened } = render(<ProductsPage />);
    expect(
      Array.from(opened.querySelectorAll('article h3')).map(
        (title) => title.textContent,
      ),
    ).toEqual(['Conquest', 'Funnel', 'GA4GH SDK', 'Poiesis']);
  });

  it('names each stat link with its value and label', () => {
    render(<ProductsPage />);
    expect(
      screen.getByRole('link', { name: '4 Partner products' }),
    ).toBeInTheDocument();
  });
});
