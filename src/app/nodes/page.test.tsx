import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ElixirNode } from '@/components/catalog/types';
import nodesData from '@/data/nodes.json';
import { CONTACT_EMAIL } from '@/lib/site';
import NodesPage from './page';

const nodes = nodesData.nodes as ElixirNode[];

const cardFor = (node: ElixirNode) =>
  screen
    .getAllByRole('article')
    .find((card) => card.id === node.code.toLowerCase())!;

describe('Nodes page', () => {
  it('shows one card per Node, titled with its institute', () => {
    render(<NodesPage />);
    expect(screen.getAllByRole('article')).toHaveLength(nodes.length);
    nodes.forEach((node) => {
      expect(
        within(cardFor(node)).getByRole('heading', { level: 3 }),
      ).toHaveTextContent(node.institute ?? node.name);
    });
  });

  it('shows flag, status, liaison and links on every card', () => {
    render(<NodesPage />);
    nodes.forEach((node) => {
      const card = within(cardFor(node));
      expect(card.getByAltText(`Flag of ${node.country}`)).toBeInTheDocument();
      expect(
        card.getByText(node.status === 'live' ? 'Live' : 'Onboarding'),
      ).toBeInTheDocument();
      if (node.liaison) {
        expect(card.getByText(node.liaison.name)).toBeInTheDocument();
      }
      if (node.website) {
        const host = new URL(node.website).hostname.replace(/^www\./, '');
        expect(card.getByRole('link', { name: host })).toHaveAttribute(
          'href',
          node.website,
        );
      }
      expect(card.getByRole('link', { name: 'Contact' })).toHaveAttribute(
        'href',
        `mailto:${node.contact?.email ?? CONTACT_EMAIL}`,
      );
    });
  });

  it('never says "Planned"', () => {
    const { container } = render(<NodesPage />);
    expect(container).not.toHaveTextContent(/planned/i);
  });
});
