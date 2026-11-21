import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import funding from '@/data/funding.json';
import { grantType, PROGRAMMES, sortGrants } from '@/lib/funding';
import FundingPage from './page';

// The grant cards, in display order
const cards = () => screen.getAllByRole('article');

describe('Funding page', () => {
  it('shows the stats in order, capitalized like the rest of the site', () => {
    render(<FundingPage />);
    const labels = screen
      .getAllByTestId('stat')
      .map((stat) => stat.lastChild?.textContent);
    expect(labels).toEqual(['Total grants', 'ELIXIR grants', 'GSoC projects']);
  });

  it('offers one filter per programme', () => {
    render(<FundingPage />);
    const filters = within(screen.getByRole('group', { name: 'Filter' }))
      .getAllByRole('button')
      .map((button) => button.firstChild?.textContent);
    expect(filters).toEqual(PROGRAMMES.map(({ name }) => name));
  });

  it('sorts grants by end date, start date and name', () => {
    render(<FundingPage />);
    const titles = cards().map(
      (card) => within(card).getByRole('heading', { level: 3 }).textContent,
    );
    expect(titles).toEqual(sortGrants(funding).map((grant) => grant.project));
  });

  it('titles each card with its programme, logo and grant type', () => {
    render(<FundingPage />);
    const sorted = sortGrants(funding);
    cards().forEach((card, index) => {
      const grant = sorted[index];
      const header = within(card);
      expect(
        header.getByRole('heading', { level: 4 }).textContent,
        grant.project,
      ).toBe(grant.category);
      expect(header.getByRole('img').getAttribute('alt')).toBe(
        `${grant.category} logo`,
      );
      const type = card.querySelector('[data-testid="grant-type"]');
      expect(type?.textContent ?? null).toBe(grantType(grant));
      // The programme is in the title; no badge repeats it
      expect(header.queryByText(/^(Grant|GSoC)$/)).toBeNull();
    });
  });
});
