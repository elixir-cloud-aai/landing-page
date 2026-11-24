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

describe('Demo page: AAAI providers', () => {
  it('shows Life Science Login like a Node, with its liaison', () => {
    render(<DemoPage />);
    const cards = region('AAAI providers').getAllByRole('article');
    expect(cards).toHaveLength(1);
    const card = within(cards[0]);
    expect(card.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Life Science Login',
    );
    expect(card.getByAltText('Life Science Login logo')).toBeInTheDocument();
    expect(card.getByAltText('Flag of European Union')).toHaveAttribute(
      'src',
      expect.stringContaining('eu.svg'),
    );
    expect(card.getByText('Life Science-RI')).toBeInTheDocument();
    expect(card.getByText('Live')).toBeInTheDocument();
    expect(card.getByText('Provider liaison')).toBeInTheDocument();
    expect(card.getByText('Jan Pavlíček')).toBeInTheDocument();
    expect(
      card.getByRole('link', { name: 'lifescience-ri.eu' }),
    ).toHaveAttribute('href', 'https://lifescience-ri.eu/');
    expect(card.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      'mailto:cloud-service@elixir-europe.org',
    );
  });

  it('keeps "Node liaison" on the Node cards', () => {
    render(<DemoPage />);
    nodeCards().forEach((card) => {
      expect(within(card).queryByText('Provider liaison')).toBeNull();
    });
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

  // /nodes redirects here, and the browser keeps the #fragment: old links
  // such as /nodes#cz still land on their card
  it('keeps the anchors of the old Nodes page', () => {
    const { container } = render(<DemoPage />);
    nodes.forEach((node) => {
      const card = container.querySelector(`#${node.code.toLowerCase()}`);
      expect(card, node.code).not.toBeNull();
      expect(region('Nodes').getAllByRole('article')).toContain(card);
    });
  });

  it('sorts the Nodes by name', () => {
    render(<DemoPage />);
    const names = nodeCards().map(
      (card) => nodes.find((node) => card.id === node.code.toLowerCase())!.name,
    );
    expect(names).toEqual(
      [...names].sort((a, b) => a.localeCompare(b, 'en', { numeric: true })),
    );
    expect(names).toHaveLength(nodes.length);
  });

  // The registry lists the services of each Node
  it('lists no services on the Node cards', () => {
    render(<DemoPage />);
    nodeCards().forEach((card) => {
      expect(card).not.toHaveTextContent(/ELIXIR On-Cloud services/i);
      expect(card).not.toHaveTextContent(/None yet/);
    });
  });

  it('never says "Planned"', () => {
    const { container } = render(<DemoPage />);
    expect(container).not.toHaveTextContent(/planned/i);
  });
});
