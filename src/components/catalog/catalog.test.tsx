import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import productsData from '@/data/product.json';
import servicesData from '@/data/services.json';
import { ProductCatalog } from './product-catalog';
import { ServiceCatalog } from './service-catalog';
import { FilterBar, matchesQuery, Monogram } from './shared';
import type { Product, Service } from './types';

const products = productsData.products as Product[];
const services = servicesData.services as Service[];

const cardTitles = () =>
  screen
    .getAllByRole('article')
    .map((card) =>
      within(card).getByRole('heading', { level: 3 }).textContent?.trim(),
    );

describe('matchesQuery', () => {
  it('matches any field, ignoring case and surrounding spaces', () => {
    expect(matchesQuery('  tes ', ['proTES', null])).toBe(true);
    expect(matchesQuery('WES', [undefined, 'GA4GH wes'])).toBe(true);
  });

  it('treats an empty query as a match and misses unrelated text', () => {
    expect(matchesQuery('', ['anything'])).toBe(true);
    expect(matchesQuery('registry', ['TESK', null])).toBe(false);
  });
});

describe('Monogram', () => {
  it('shows the initials of the name', () => {
    const { container } = render(<Monogram name="Cloud Registry" />);
    expect(container).toHaveTextContent('CR');
  });
});

describe('FilterBar', () => {
  it('reports searches, selections and clearing', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <FilterBar
        query="tes"
        onQueryChange={onQueryChange}
        placeholder="Search"
        options={[
          { value: 'all', label: 'All', count: 3 },
          { value: 'GA4GH TES', label: 'GA4GH TES', count: 2 },
        ]}
        selected="all"
        onSelect={onSelect}
        resultCount={1}
        noun="products"
      />,
    );

    expect(screen.getByText('1 product')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: /GA4GH TES/ }));
    expect(onSelect).toHaveBeenCalledWith('GA4GH TES');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onQueryChange).toHaveBeenCalledWith('');
  });
});

describe('ProductCatalog', () => {
  it('lists every product', () => {
    render(<ProductCatalog products={products} />);
    expect(cardTitles()).toEqual(products.map((p) => p.name));
  });

  it('filters by standard', async () => {
    const user = userEvent.setup();
    render(<ProductCatalog products={products} />);
    await user.click(screen.getByRole('button', { name: /^GA4GH WES/ }));
    expect(cardTitles()).toEqual(
      products
        .filter((p) => p.standards.includes('GA4GH WES'))
        .map((p) => p.name),
    );
  });

  it('searches and offers a reset when nothing matches', async () => {
    const user = userEvent.setup();
    render(<ProductCatalog products={products} />);
    const search = screen.getByRole('searchbox');

    await user.type(search, 'poiesis');
    expect(cardTitles()).toEqual(['Poiesis']);

    await user.clear(search);
    await user.type(search, 'no such product');
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getAllByRole('article')).toHaveLength(products.length);
  });

  it('links each product to its code and docs', () => {
    render(<ProductCatalog products={products} />);
    products.forEach((product) => {
      const card = screen
        .getAllByRole('article')
        .find((c) => c.id === product.id)!;
      if (product.repoUrl) {
        expect(
          within(card).getByRole('link', {
            name: `${product.name} source code`,
          }),
        ).toHaveAttribute('href', product.repoUrl);
      }
      if (product.docsUrl) {
        expect(
          within(card).getByRole('link', {
            name: `${product.name} documentation`,
          }),
        ).toHaveAttribute('href', product.docsUrl);
      }
    });
  });
});

describe('ServiceCatalog', () => {
  it('filters by status', async () => {
    const user = userEvent.setup();
    render(<ServiceCatalog services={services} />);

    await user.click(screen.getByRole('button', { name: /^Onboarding/ }));
    expect(cardTitles()).toEqual(
      services.filter((s) => s.status === 'Onboarding').map((s) => s.name),
    );

    await user.click(screen.getByRole('button', { name: /^Live/ }));
    expect(cardTitles()).toEqual(
      services.filter((s) => s.status === 'Live').map((s) => s.name),
    );
  });

  it('links live endpoints and tracks deployments that are onboarding', () => {
    render(<ServiceCatalog services={services} />);
    services.forEach((service) => {
      const card = screen
        .getAllByRole('article')
        .find((c) => c.id === service.id)!;
      if (service.deploymentUrl) {
        expect(
          within(card).getByRole('link', { name: /Open service/ }),
        ).toHaveAttribute('href', service.deploymentUrl);
      } else if (service.trackingUrl) {
        expect(
          within(card).getByRole('link', { name: /Track deployment/ }),
        ).toHaveAttribute('href', service.trackingUrl);
      }
      if (service.relatedProductId) {
        expect(
          within(card).getByRole('link', { name: /About the software/ }),
        ).toHaveAttribute('href', `/products#${service.relatedProductId}`);
      }
    });
  });
});
