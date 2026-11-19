import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ElixirNode } from '@/components/catalog/types';
import nodesData from '@/data/nodes.json';
import servicesData from '@/data/services.json';
import { CONTACT_EMAIL } from '@/lib/site';
import DemoPage from './page';

const nodes = nodesData.nodes as ElixirNode[];

const region = (name: string) => within(screen.getByRole('region', { name }));

const nodeCards = () => region('Nodes').getAllByRole('article');

const cardFor = (node: ElixirNode) =>
  nodeCards().find((card) => card.id === node.code.toLowerCase())!;

describe('Demo page', () => {
  it('shows the Cloud Registry as a live service, not the demonstrator', () => {
    render(<DemoPage />);
    const services = region('Live services');
    const registry = servicesData.services.find(
      (service) => service.id === 'elixir-on-cloud-registry',
    )!;
    expect(
      services.getByRole('heading', { level: 3, name: registry.name }),
    ).toBeInTheDocument();
    expect(
      services
        .getAllByRole('link')
        .some((link) => link.getAttribute('href') === registry.deploymentUrl),
    ).toBe(true);
    expect(services.queryByText(/Demonstrator/)).toBeNull();
  });

  it('no longer links Node services to the removed Services page', () => {
    const { container } = render(<DemoPage />);
    expect(container.querySelector('a[href^="/services"]')).toBeNull();
  });
});

describe('Demo page: Nodes', () => {
  it('shows one card per Node, titled with its institute', () => {
    render(<DemoPage />);
    expect(nodeCards()).toHaveLength(nodes.length);
    nodes.forEach((node) => {
      expect(
        within(cardFor(node)).getByRole('heading', { level: 3 }),
      ).toHaveTextContent(node.institute ?? node.name);
    });
  });

  it('shows flag, status, liaison and links on every card', () => {
    render(<DemoPage />);
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
    const { container } = render(<DemoPage />);
    expect(container).not.toHaveTextContent(/planned/i);
  });
});
