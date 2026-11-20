import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GA4GH_DRIVER_PROJECT_URL } from '@/lib/site';
import Home from '.';

// The globe needs WebGL, which jsdom lacks
vi.mock('../ui/globe-lazy', () => ({ default: () => null }));

describe('Home page', () => {
  it('shows the subtitle', () => {
    render(<Home />);
    expect(
      screen.getByText(
        'A framework of services, tools, patterns and standards for securely federating your research infrastructures.',
      ),
    ).toBeInTheDocument();
  });

  it('invites visitors to try it out', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: 'Try it out' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Explore services' })).toBeNull();
  });

  it('links "contributors" above the globe to the Contributors page', () => {
    render(<Home />);
    const card = screen
      .getByRole('heading', { name: 'All over the world' })
      .closest('div')!;
    expect(
      within(card).getByRole('link', { name: 'contributors' }),
    ).toHaveAttribute('href', '/contributors');
  });

  it('describes the project focus without a separate title', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: 'Project focus' });
    const section = heading.closest('section')!;
    // Only the "Project focus" label is a heading
    expect(
      Array.from(section.querySelectorAll('h1, h2, h3, h4, h5, h6')),
    ).toEqual([heading]);
    expect(section).toHaveTextContent(
      /^Project focusA GA4GH Driver Project since its inception in 2020, ELIXIR On-Cloud \(formerly known as “ELIXIR Cloud & AAI”\) has brought together .* a seamless Federation of Federations for research infrastructures worldwide\./,
    );
    expect(
      screen.getByRole('link', { name: 'GA4GH Driver Project' }),
    ).toHaveAttribute('href', GA4GH_DRIVER_PROJECT_URL);
  });

  it('shows the three tag lines', () => {
    render(<Home />);
    [
      'Standards first and cloud native.',
      'Free and open source forever (Apache 2.0).',
      'Reference federation across ELIXIR Nodes.',
    ].forEach((line) => expect(screen.getByText(line)).toBeInTheDocument());
  });
});
