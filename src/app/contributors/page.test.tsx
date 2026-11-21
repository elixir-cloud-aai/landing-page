import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import contributorData from '@/data/contributor.json';
import {
  affiliation,
  type Contributor,
  contributors,
  isGSoC,
  isLead,
  nodesRepresented,
  roles,
  sortContributors,
} from '@/lib/contributors';
import ContributorsPage from './page';

// The globe needs WebGL, which jsdom lacks
vi.mock('@/components/ui/globe-lazy', () => ({ default: () => null }));

const tiles = () => screen.getAllByRole('article');

const tileOf = (name: string) =>
  tiles().find(
    (tile) =>
      within(tile).getByRole('heading', { level: 3 }).textContent === name,
  )!;

const find = (test: (person: Contributor) => boolean) =>
  contributors.find(test)!;

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

  it.each([
    ['an ELIXIR Node member', (p: Contributor) => !!affiliation(p).flag],
    ['an OSS contributor', (p: Contributor) => !affiliation(p).flag],
  ])('subtitles %s with the affiliation', (_, test) => {
    render(<ContributorsPage />);
    const person = find(test);
    const tile = within(tileOf(person.name));
    const { label, flag } = affiliation(person);
    expect(tile.getByTestId('affiliation').textContent).toBe(label);
    const flagImage = tile.queryByAltText(`Flag of ${label}`);
    if (flag) {
      expect(flagImage?.getAttribute('src')).toContain(`/flags/${flag}.svg`);
    } else {
      expect(flagImage).toBeNull();
    }
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
});
