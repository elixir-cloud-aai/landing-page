import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import contributorData from '@/data/contributor.json';
import {
  affiliation,
  type Contributor,
  contributors,
  isELIXIR,
  isExternal,
  isGSoC,
  isLead,
  isOSS,
  nodesRepresented,
  roles,
  sortContributors,
} from '@/lib/contributors';
import ContributorsPage from './page';

// The globe needs WebGL, which jsdom lacks
vi.mock('@/components/ui/globe-lazy', () => ({ default: () => null }));

// Filters live in the URL; start every test unfiltered
afterEach(() => {
  window.history.replaceState(null, '', '/');
});

const tiles = () => screen.getAllByRole('article');

const tileOf = (name: string) =>
  tiles().find(
    (tile) =>
      within(tile).getByRole('heading', { level: 3 }).textContent === name,
  )!;

// The first matching contributor; `firstPage`: among the 20 shown before
// "Load more" without filters
const find = (test: (person: Contributor) => boolean, firstPage = true) => {
  const person = (firstPage ? contributors.slice(0, 20) : contributors).find(
    test,
  );
  if (!person) {
    throw new Error('No contributor in the data matches the test');
  }
  return person;
};

describe('Contributors page', () => {
  it('shows the stats, with the ELIXIR Nodes represented', () => {
    render(<ContributorsPage />);
    const stats = screen.getAllByTestId('stat').map((stat) => ({
      value: stat.firstChild?.textContent,
      label: stat.lastChild?.textContent,
    }));
    expect(stats.map((stat) => stat.label)).toEqual([
      'Contributors',
      'OSS contributors',
      'ELIXIR Nodes represented',
    ]);
    expect(stats[2].value).toBe(String(nodesRepresented(contributors).length));
  });

  it('offers the ELIXIR, OSS, External, GSoC and Lead filters', () => {
    render(<ContributorsPage />);
    const filters = within(screen.getByRole('group', { name: 'Filter' }))
      .getAllByRole('button')
      .map((button) => button.firstChild?.textContent);
    expect(filters).toEqual(['ELIXIR', 'OSS', 'External', 'GSoC', 'Lead']);
  });

  it('sorts contributors by name', () => {
    render(<ContributorsPage />);
    const names = tiles().map(
      (tile) => within(tile).getByRole('heading', { level: 3 }).textContent,
    );
    const sorted = sortContributors(contributorData as Contributor[]).map(
      (person) => person.name,
    );
    expect(names).toEqual(sorted.slice(0, names.length));
  });

  it('subtitles ELIXIR Node members with the Node and its flag', () => {
    render(<ContributorsPage />);
    const person = find(isELIXIR);
    const tile = within(tileOf(person.name));
    const { label, flag } = affiliation(person);
    expect(tile.getByTestId('affiliation').textContent).toBe(label);
    expect(tile.getByAltText(`Flag of ${label}`).getAttribute('src')).toContain(
      `/flags/${flag}.svg`,
    );
  });

  it.each([
    ['OSS contributor', 'oss', (p: Contributor) => isOSS(p) && !isELIXIR(p)],
    ['External contributor', 'external', isExternal],
  ])('subtitles others as "%s", without a flag', (label, filter, test) => {
    // Filtered, so that the person is on the first page
    window.history.replaceState(null, '', `/contributors?filter=${filter}`);
    render(<ContributorsPage />);
    const person = find(test, false);
    const tile = within(tileOf(person.name));
    expect(tile.getByTestId('affiliation').textContent).toBe(label);
    expect(tile.queryByAltText(/^Flag of/)).toBeNull();
  });

  it('lists only roles, not affiliations', () => {
    render(<ContributorsPage />);
    const person = find((p) => roles(p).length > 0 && !!affiliation(p).flag);
    const tile = within(tileOf(person.name));
    const listed = tile
      .getAllByTestId('role')
      .map((badge) => badge.textContent);
    expect(listed).toEqual(roles(person));
    expect(tile.getByText('Roles')).toBeInTheDocument();
  });

  it('marks leads and GSoC contributors with badges', () => {
    render(<ContributorsPage />);
    const lead = find(isLead);
    expect(within(tileOf(lead.name)).getByText('Lead')).toBeInTheDocument();
    const gsoc = find(isGSoC);
    expect(within(tileOf(gsoc.name)).getByText('GSoC')).toBeInTheDocument();
    const neither = find((p) => !isLead(p) && !isGSoC(p));
    const tile = within(tileOf(neither.name));
    expect(tile.queryByText('Lead')).toBeNull();
    expect(tile.queryByText('GSoC')).toBeNull();
  });

  it('links GitHub profiles by icon, without profile buttons', () => {
    render(<ContributorsPage />);
    const person = find((p) => !!p.github);
    const tile = within(tileOf(person.name));
    expect(
      tile.getByRole('link', { name: 'GitHub profile' }).getAttribute('href'),
    ).toBe(person.github);
    expect(screen.queryByText(/View profile/i)).toBeNull();
    expect(screen.queryByText(/^Contributor$/)).toBeNull();
  });

  it('shows the same details in the list view', async () => {
    const user = userEvent.setup();
    render(<ContributorsPage />);
    await user.click(screen.getByRole('button', { name: 'List view' }));
    const person = find((p) => isLead(p) && roles(p).length > 0);
    const item = within(tileOf(person.name));
    expect(item.getByTestId('affiliation').textContent).toBe(
      affiliation(person).label,
    );
    expect(item.getAllByTestId('role').map((r) => r.textContent)).toEqual(
      roles(person),
    );
    expect(item.getByText('Lead')).toBeInTheDocument();
    expect(screen.queryByText(/^Profile$/)).toBeNull();
  });
});
