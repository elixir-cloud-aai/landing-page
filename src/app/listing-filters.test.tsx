import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contributors, isExternal, isLead } from '@/lib/contributors';
import funding from '@/data/funding.json';
import { sortGrants } from '@/lib/funding';
import ContributorsPage from './contributors/page';
import FundingPage from './funding/page';

// The globe needs WebGL, which jsdom lacks
vi.mock('@/components/ui/globe-lazy', () => ({ default: () => null }));

// Filters live in the URL; start every test unfiltered
afterEach(() => {
  window.history.replaceState(null, '', '/');
});

const filterButton = (name: RegExp) => screen.getByRole('button', { name });

// The titles of the listed cards (level-3 headings that name an item)
const listed = (names: string[]) => {
  const known = new Set(names);
  return screen
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent?.trim() ?? '')
    .filter((text) => known.has(text));
};
const removeFilters = () =>
  screen.queryByRole('button', { name: 'Remove filters' });

describe('Funding page filters', () => {
  // Grants in display order
  const sorted = sortGrants(funding);
  const inCategories = (...categories: string[]) =>
    sorted
      .filter((grant) => categories.includes(grant.category))
      .map((grant) => grant.project);
  const count = (...categories: string[]) => inCategories(...categories).length;
  const listedGrants = () => listed(funding.map((grant) => grant.project));
  const shown = () =>
    screen.getByText(/^Showing \d+ of \d+ project grants\.$/).textContent;

  it('lists grants of any selected programme', async () => {
    const user = userEvent.setup();
    render(<FundingPage />);
    expect(removeFilters()).toBeNull();

    await user.click(filterButton(/^ELIXIR/));
    expect(shown()).toBe(
      `Showing ${count('ELIXIR')} of ${funding.length} project grants.`,
    );
    expect(listedGrants()).toEqual(inCategories('ELIXIR'));

    await user.click(filterButton(/^Google Summer of Code/));
    expect(shown()).toBe(
      `Showing ${funding.length} of ${funding.length} project grants.`,
    );
    expect(listedGrants()).toEqual(
      inCategories('ELIXIR', 'Google Summer of Code'),
    );

    await user.click(removeFilters()!);
    expect(shown()).toBe(
      `Showing ${funding.length} of ${funding.length} project grants.`,
    );
  });

  it('starts with the filters given in the URL', () => {
    window.history.replaceState(null, '', '/funding?filter=elixir');
    render(<FundingPage />);
    expect(shown()).toBe(
      `Showing ${count('ELIXIR')} of ${funding.length} project grants.`,
    );
    expect(listedGrants()).toEqual(inCategories('ELIXIR'));
    expect(filterButton(/^ELIXIR/)).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('Contributors page filters', () => {
  const has = (person: { roles?: string[] }, text: string) =>
    (person.roles ?? []).some((role) => role.toLowerCase().includes(text));
  const matchingNames = (...texts: string[]) =>
    contributors
      .filter((person) => texts.some((text) => has(person, text)))
      .map((person) => person.name);
  const matching = (...texts: string[]) => matchingNames(...texts).length;
  // The page shows the first 20 matches until "Load more"
  const firstPage = (names: string[]) => names.slice(0, 20);
  const listedPeople = () => listed(contributors.map((person) => person.name));
  const shown = () =>
    screen.getByText(/^Showing \d+ of/).textContent?.replace(/\s+/g, ' ');

  it('lists contributors matching any selected filter', async () => {
    const user = userEvent.setup();
    render(<ContributorsPage />);

    await user.click(filterButton(/^GSoC/));
    expect(shown()).toContain(`of ${matching('gsoc')} people`);
    expect(listedPeople()).toEqual(firstPage(matchingNames('gsoc')));

    await user.click(filterButton(/^OSS/));
    const both = matching('gsoc', 'oss contributor');
    // More than GSoC alone, so the filters really are combined
    expect(both).toBeGreaterThan(matching('gsoc'));
    expect(shown()).toContain(`of ${both} people`);
    expect(listedPeople()).toEqual(
      firstPage(matchingNames('gsoc', 'oss contributor')),
    );

    await user.click(removeFilters()!);
    expect(shown()).toContain(`of ${contributors.length} people`);
  });

  it('starts with the filters given in the URL', () => {
    window.history.replaceState(null, '', '/contributors?filter=gsoc');
    render(<ContributorsPage />);
    expect(shown()).toContain(`of ${matching('gsoc')} people`);
    expect(listedPeople()).toEqual(firstPage(matchingNames('gsoc')));
  });

  it('combines the External and Lead filters', () => {
    window.history.replaceState(null, '', '/contributors?filter=external,lead');
    render(<ContributorsPage />);
    const names = contributors
      .filter((person) => isExternal(person) || isLead(person))
      .map((person) => person.name);
    expect(names.length).toBeGreaterThan(
      contributors.filter(isExternal).length,
    );
    expect(shown()).toContain(`of ${names.length} people`);
    expect(listedPeople()).toEqual(firstPage(names));
  });
});
