import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Footer from '@/components/footer';
import NavBar from '@/components/navbar';
import servicesData from '@/data/services.json';
import { DOCS_HUB_URL } from '@/lib/site';
import FundingPage from './funding/page';
import PrivacyPage from './privacy/page';
import ProductsPage from './products/page';
import ProjectsPage from './projects/page';
import ServicesPage from './services/page';

vi.mock('next/navigation', () => ({ usePathname: () => '/services' }));

// Smoke tests: every page renders without crashing and shows its heading.
describe.each([
  ['Products', ProductsPage, /Software for/],
  ['Services', ServicesPage, /ELIXIR On-Cloud services/],
  ['Projects', ProjectsPage, /Explore the/],
  ['Funding', FundingPage, /Gratitude to our/],
  ['Privacy', PrivacyPage, /Privacy policy/],
])('%s page', (_, Page, heading) => {
  it('renders its main heading', () => {
    render(<Page />);
    expect(
      screen.getByRole('heading', { level: 1, name: heading }),
    ).toBeInTheDocument();
  });
});

describe('Services page', () => {
  it('links every Node in the coverage panel to its card', () => {
    render(<ServicesPage />);
    const panel = within(
      screen.getByRole('region', { name: 'Network coverage' }),
    );
    const hrefs = panel
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    const codes = new Set(
      servicesData.services.flatMap((s) => s.nodes.map((n) => n.code)),
    );
    codes.forEach((code) => {
      expect(hrefs, code).toContain(`/nodes#${code.toLowerCase()}`);
    });
  });
});

describe('NavBar', () => {
  const renderNavBar = () =>
    render(
      <NavBar
        mounted
        setShowBanner={() => {}}
        showBanner={false}
        theme="light"
        toggleDarkMode={() => {}}
      />,
    );

  // Issue #130: live services and the docs are reachable from one navigation.
  it('links the docs and every live service', () => {
    renderNavBar();
    const nav = within(screen.getByRole('navigation', { name: 'Main' }));
    expect(nav.getByRole('link', { name: /Docs/ })).toHaveAttribute(
      'href',
      DOCS_HUB_URL,
    );
    servicesData.services
      .filter((service) => service.deploymentUrl)
      .forEach((service) => {
        expect(
          nav
            .getAllByRole('link')
            .some(
              (link) => link.getAttribute('href') === service.deploymentUrl,
            ),
          service.name,
        ).toBe(true);
      });
  });

  it('marks the current page and orders Nodes before Docs', () => {
    renderNavBar();
    const nav = within(screen.getByRole('navigation', { name: 'Main' }));
    const labels = nav
      .getAllByRole('link')
      .map((link) => link.textContent?.trim())
      .filter((label) =>
        ['Projects', 'Products', 'Services', 'Nodes', 'Docs'].includes(
          label ?? '',
        ),
      );
    expect(labels).toEqual([
      'Projects',
      'Products',
      'Services',
      'Nodes',
      'Docs',
    ]);
    expect(nav.getByRole('link', { name: 'Services' })).toHaveClass(
      'text-primary',
    );
  });
});

describe('Footer', () => {
  it('links the privacy policy and offers cookie settings', () => {
    render(<Footer />);
    expect(
      screen.getByRole('link', { name: 'Privacy policy' }),
    ).toHaveAttribute('href', '/privacy');
    expect(
      screen.getByRole('button', { name: 'Cookie settings' }),
    ).toBeInTheDocument();
  });
});
