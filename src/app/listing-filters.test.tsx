import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import contributors from '@/data/contributor.json';
import funding from '@/data/funding.json';
import ContributorsPage from './contributors/page';
import FundingPage from './funding/page';

// The globe needs WebGL, which jsdom lacks
vi.mock('@/components/ui/globe-lazy', () => ({ default: () => null }));

// Filters live in the URL; start every test unfiltered
afterEach(() => {
  window.history.replaceState(null, '', '/');
});

const filterButton = (name: RegExp) => screen.getByRole('button', { name });
const removeFilters = () =>
  screen.queryByRole('button', { name: 'Remove filters' });

describe('Funding page filters', () => {
  const count = (...categories: string[]) =>
    funding.filter((grant) => categories.includes(grant.category)).length;
  const shown = () =>
    screen.getByText(/^Showing \d+ of \d+ project grants\.$/).textContent;

  it('lists grants of any selected category', async () => {
    const user = userEvent.setup();
    render(<FundingPage />);
    expect(removeFilters()).toBeNull();

    await user.click(filterButton(/^ELIXIR Services/));
    expect(shown()).toBe(
      `Showing ${count('ELIXIR Services')} of ${funding.length} project grants.`,
    );

    await user.click(filterButton(/^ELIXIR Platform Tasks/));
    expect(shown()).toBe(
      `Showing ${count('ELIXIR Services', 'ELIXIR Platform Tasks')} of ${funding.length} project grants.`,
    );

    await user.click(removeFilters()!);
    expect(shown()).toBe(
      `Showing ${funding.length} of ${funding.length} project grants.`,
    );
  });

  it('starts with the filters given in the URL', () => {
    window.history.replaceState(null, '', '/funding?filter=elixir-services');
    render(<FundingPage />);
    expect(shown()).toBe(
      `Showing ${count('ELIXIR Services')} of ${funding.length} project grants.`,
    );
    expect(filterButton(/^ELIXIR Services/)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

describe('Contributors page filters', () => {
  const has = (person: { roles?: string[] }, text: string) =>
    (person.roles ?? []).some((role) => role.toLowerCase().includes(text));
  const matching = (...texts: string[]) =>
    contributors.filter((person) => texts.some((text) => has(person, text)))
      .length;
  const shown = () =>
    screen.getByText(/^Showing \d+ of/).textContent?.replace(/\s+/g, ' ');

  it('lists contributors matching any selected filter', async () => {
    const user = userEvent.setup();
    render(<ContributorsPage />);

    await user.click(filterButton(/^GSoC/));
    expect(shown()).toContain(`of ${matching('gsoc')} people`);

    await user.click(filterButton(/^OSS/));
    const both = matching('gsoc', 'oss contributor');
    // More than GSoC alone, so the filters really are combined
    expect(both).toBeGreaterThan(matching('gsoc'));
    expect(shown()).toContain(`of ${both} people`);

    await user.click(removeFilters()!);
    expect(shown()).toContain(`of ${contributors.length} people`);
  });

  it('starts with the filters given in the URL', () => {
    window.history.replaceState(null, '', '/contributors?filter=gsoc');
    render(<ContributorsPage />);
    expect(shown()).toContain(`of ${matching('gsoc')} people`);
  });
});
