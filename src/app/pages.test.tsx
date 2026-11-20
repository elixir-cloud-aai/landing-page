import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Footer from '@/components/footer';
import NavBar from '@/components/navbar';
import { DOCS_HUB_URL } from '@/lib/site';
import FundingPage from './funding/page';
import PrivacyPage from './privacy/page';
import ProductsPage from './products/page';
import ProjectsPage from './projects/page';

vi.mock('next/navigation', () => ({ usePathname: () => '/demo' }));

// Smoke tests: every page renders without crashing and shows its heading.
describe.each([
  ['Products', ProductsPage, /Software for/],
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

  const navLabels = () =>
    within(screen.getByRole('navigation', { name: 'Main' }))
      .getAllByRole('link')
      .map((link) => link.textContent?.trim());

  it('shows only Demo, Products and Docs, in that order', () => {
    renderNavBar();
    expect(navLabels()).toEqual(['Demo', 'Products', 'Docs']);
  });

  it('links the docs and marks the current page', () => {
    renderNavBar();
    const nav = within(screen.getByRole('navigation', { name: 'Main' }));
    expect(nav.getByRole('link', { name: /Docs/ })).toHaveAttribute(
      'href',
      DOCS_HUB_URL,
    );
    expect(nav.getByRole('link', { name: 'Demo' })).toHaveAttribute(
      'href',
      '/demo',
    );
    expect(nav.getByRole('link', { name: 'Demo' })).toHaveClass('text-primary');
  });
});

describe('Footer', () => {
  const column = (name: string) =>
    within(screen.getByRole('navigation', { name }))
      .getAllByRole('link')
      .map((link) => link.textContent?.trim());

  it('aligns Explore with the header and leaves out News', () => {
    render(<Footer />);
    expect(column('Explore')).toEqual(['Demo', 'Products', 'Documentation']);
    expect(column('Community')).toEqual(['Contributors', 'Funding']);
  });

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
