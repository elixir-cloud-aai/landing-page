import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import productsData from '@/data/product.json';
import servicesData from '@/data/services.json';
import { filterId } from '@/lib/filters';
import { sortProducts } from '@/lib/products';
import { ProductCatalog } from './product-catalog';
import { ServiceCard } from './service-catalog';
import { FilterBar, isGitlabUrl, matchesQuery, Monogram } from './shared';
import type { Product, Service } from './types';

// In the order of the listing
const products = sortProducts(productsData.products as Product[]);
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

// Filters live in the URL; start every test unfiltered
afterEach(() => {
  window.history.replaceState(null, '', '/');
});

const filterButton = (name: RegExp) => screen.getByRole('button', { name });

describe('FilterBar', () => {
  const options = [
    { value: 'ga4gh-tes', label: 'GA4GH TES', count: 2 },
    { value: 'ga4gh-wes', label: 'GA4GH WES', count: 1 },
  ];

  it('reports searches, toggles and clearing', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const onToggle = vi.fn();
    const onClear = vi.fn();
    render(
      <FilterBar
        noun="products"
        onClear={onClear}
        onQueryChange={onQueryChange}
        onToggle={onToggle}
        options={options}
        placeholder="Search"
        query="tes"
        resultCount={1}
        selected={['ga4gh-tes', 'ga4gh-wes']}
      />,
    );

    expect(screen.getByText('1 product')).toBeInTheDocument();
    expect(filterButton(/GA4GH TES/)).toHaveAttribute('aria-pressed', 'true');
    expect(filterButton(/GA4GH WES/)).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('button', { name: /^All/ })).toBeNull();

    await user.click(filterButton(/GA4GH TES/));
    expect(onToggle).toHaveBeenCalledWith('ga4gh-tes');

    await user.click(screen.getByRole('button', { name: 'Remove filters' }));
    expect(onClear).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onQueryChange).toHaveBeenCalledWith('');
  });

  it('offers "Remove filters" only while a filter is selected', () => {
    render(
      <FilterBar
        noun="products"
        onClear={() => {}}
        onQueryChange={() => {}}
        onToggle={() => {}}
        options={options}
        placeholder="Search"
        query=""
        resultCount={3}
        selected={[]}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Remove filters' })).toBeNull();
  });
});

describe('ProductCatalog', () => {
  it('lists every product, sorted by name', () => {
    render(<ProductCatalog products={productsData.products as Product[]} />);
    expect(cardTitles()).toEqual([
      'Cloud Components',
      'Cloud Registry',
      'Conquest',
      'FOCA',
      'Funnel',
      'GA4GH SDK',
      'Krini',
      'Poiesis',
      'proTES',
      'Pubgrade',
      'TESK',
      'TRS-Filer',
    ]);
  });

  const withStandard = (...standards: string[]) =>
    products
      .filter((p) => p.standards.some((s) => standards.includes(s)))
      .map((p) => p.name);

  it('filters by standard', async () => {
    const user = userEvent.setup();
    render(<ProductCatalog products={products} />);
    await user.click(filterButton(/^GA4GH WES/));
    expect(cardTitles()).toEqual(withStandard('GA4GH WES'));
  });

  it('lists products matching any of several standards', async () => {
    const user = userEvent.setup();
    render(<ProductCatalog products={products} />);
    await user.click(filterButton(/^GA4GH WES/));
    await user.click(filterButton(/^GA4GH Service Registry/));

    const expected = withStandard('GA4GH WES', 'GA4GH Service Registry');
    // More than either filter alone, so the filters really are combined
    expect(expected.length).toBeGreaterThan(withStandard('GA4GH WES').length);
    expect(cardTitles()).toEqual(expected);
    // In the order of the filters on the page, whatever the click order
    const buttons = within(
      screen.getByRole('group', { name: 'Filter' }),
    ).getAllByRole('button');
    const position = (label: string) =>
      buttons.indexOf(filterButton(new RegExp(`^${label}`)));
    const ids = ['GA4GH WES', 'GA4GH Service Registry']
      .sort((a, b) => position(a) - position(b))
      .map(filterId);
    expect(window.location.search).toBe(
      `?filter=${encodeURIComponent(ids.join(','))}`,
    );

    await user.click(filterButton(/^GA4GH WES/));
    expect(cardTitles()).toEqual(withStandard('GA4GH Service Registry'));
  });

  it('removes all filters at once', async () => {
    const user = userEvent.setup();
    render(<ProductCatalog products={products} />);
    await user.click(filterButton(/^GA4GH WES/));
    await user.click(filterButton(/^GA4GH TES/));
    await user.click(screen.getByRole('button', { name: 'Remove filters' }));

    expect(cardTitles()).toEqual(products.map((p) => p.name));
    expect(window.location.search).toBe('');
    expect(screen.queryByRole('button', { name: 'Remove filters' })).toBeNull();
  });

  it('starts with the filters given in the URL', () => {
    window.history.replaceState(null, '', '/products?filter=ga4gh-wes,nope');
    render(<ProductCatalog products={products} />);
    expect(cardTitles()).toEqual(withStandard('GA4GH WES'));
    expect(filterButton(/^GA4GH WES/)).toHaveAttribute('aria-pressed', 'true');
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

describe('ServiceCard', () => {
  it.each(services.map((service) => [service.name, service] as const))(
    'links %s to its endpoint or deployment tracking',
    (_, service) => {
      render(<ServiceCard service={service} />);
      const card = screen.getByRole('article');
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
    },
  );
});

describe('isGitlabUrl', () => {
  it('accepts GitLab and its subdomains', () => {
    expect(
      isGitlabUrl('https://gitlab.com/one-touch-pipeline/weskit/api'),
    ).toBe(true);
    expect(isGitlabUrl('https://www.gitlab.com/group/project')).toBe(true);
  });

  it('rejects other hosts that merely contain the name', () => {
    expect(isGitlabUrl('https://example.org/gitlab.com/project')).toBe(false);
    expect(isGitlabUrl('https://gitlab.com.example.org/project')).toBe(false);
    expect(isGitlabUrl('https://notgitlab.com/project')).toBe(false);
    expect(isGitlabUrl('https://github.com/gitlab.com')).toBe(false);
  });

  it('treats a missing or malformed URL as not GitLab', () => {
    expect(isGitlabUrl(undefined)).toBe(false);
    expect(isGitlabUrl(null)).toBe(false);
    expect(isGitlabUrl('gitlab.com/project')).toBe(false);
  });
});
