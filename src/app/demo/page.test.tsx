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

const service = (id: string) => servicesData.services.find((s) => s.id === id)!;

const coreCards = () => region('Core services').getAllByRole('article');

describe('Demo page: core services', () => {
  it('shows the portal on the left and the registry on the right', () => {
    render(<DemoPage />);
    expect(
      coreCards().map(
        (card) => within(card).getByRole('heading', { level: 3 }).textContent,
      ),
    ).toEqual([
      service('elixir-on-cloud-portal').name,
      service('elixir-on-cloud-registry').name,
    ]);
    coreCards().forEach((card, index) => {
      const { deploymentUrl } = service(
        ['elixir-on-cloud-portal', 'elixir-on-cloud-registry'][index],
      );
      expect(
        within(card).getByRole('link', { name: /Open service/ }),
      ).toHaveAttribute('href', deploymentUrl);
    });
    expect(region('Core services').queryByText(/Demonstrator/)).toBeNull();
  });

  it('shows no filters, search, Node coverage or standard badges', () => {
    render(<DemoPage />);
    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
    coreCards().forEach((card, index) => {
      expect(card).not.toHaveTextContent(/Node coverage/i);
      // A badge is an element with just the standard's name; the texts may
      // still mention the standard
      const { standards } = service(
        ['elixir-on-cloud-portal', 'elixir-on-cloud-registry'][index],
      );
      expect(standards.length).toBeGreaterThan(0);
      standards.forEach((standard) =>
        expect(within(card).queryByText(standard)).toBeNull(),
      );
    });
  });

  it('names the service owner and the Node that runs each service', () => {
    render(<DemoPage />);
    coreCards().forEach((card) => {
      const tile = within(card);
      expect(tile.getByText('Service owner')).toBeInTheDocument();
      expect(tile.getByText('Valentin Schneider-Lunitz')).toBeInTheDocument();
      // Links to the Node's card further down the page
      expect(
        tile.getByRole('link', { name: 'ELIXIR Germany' }),
      ).toHaveAttribute('href', '#de');
    });
    // The link's target exists
    expect(nodeCards().map((card) => card.id)).toContain('de');
  });

  it('links the docs of the deployment, not of the product', () => {
    render(<DemoPage />);
    const [portal, registry] = coreCards();
    // No deployment docs for Krini yet
    expect(
      within(portal).queryByRole('link', { name: /documentation/ }),
    ).toBeNull();
    expect(
      within(registry).getByRole('link', { name: /documentation/ }),
    ).toHaveAttribute(
      'href',
      'https://docs.elixir-on.cloud/en/latest/operators/cloud-registry/',
    );
  });
});

describe('Demo page', () => {
  it('shows the title, description and stats of the sandbox', () => {
    const { container } = render(<DemoPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      "ELIXIR On-Cloud's Federation Sandbox",
    );
    expect(
      screen.getByText(
        'Whether you are a prospective adopter or implementer: Try our reference federation, deployed across various ELIXIR Nodes.',
      ),
    ).toBeInTheDocument();
    // Each stat is a <dd> value after its <dt> label (shown in reverse)
    const stats = Array.from(container.querySelectorAll('dl > div')).map(
      (stat) => [
        stat.querySelector('dt')!.textContent,
        stat.querySelector('dd')!.textContent,
      ],
    );
    expect(stats).toEqual([
      ['Core services', '2'],
      ['AAAI providers', '1'],
      ['Nodes', String(nodes.length)],
    ]);
    expect(nodes).toHaveLength(5);
  });

  it('has the three sections in order', () => {
    render(<DemoPage />);
    // The labelled sections, i.e. without the feedback note at the end
    expect(
      screen
        .getAllByRole('region')
        .map((section) => section.getAttribute('aria-labelledby'))
        .map((id) => document.getElementById(id!)!.textContent),
    ).toEqual(['Core services', 'AAAI providers', 'Nodes']);
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
    expect(card.getByAltText('Life Science Login logo')).toHaveAttribute(
      'src',
      expect.stringContaining('ls-login.png'),
    );
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

  // One height for all cards of the Node type, in both sections; the core
  // service cards are another type
  it('gives the provider and Node cards one height', () => {
    render(<DemoPage />);
    const marked = [
      ...region('AAAI providers').getAllByRole('article'),
      ...nodeCards(),
    ];
    marked.forEach((card) =>
      expect(card).toHaveAttribute('data-same-height', 'node-card'),
    );
    coreCards().forEach((card) =>
      expect(card).not.toHaveAttribute('data-same-height'),
    );
  });

  it('keeps "Node liaison" on the Node cards', () => {
    render(<DemoPage />);
    nodes.forEach((node) => {
      const card = within(cardFor(node));
      expect(card.queryByText('Provider liaison')).toBeNull();
      if (node.liaison) {
        expect(card.getByText('Node liaison')).toBeInTheDocument();
      }
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
      nodes
        .map((node) => node.name)
        .sort((a, b) => a.localeCompare(b, 'en', { numeric: true })),
    );
    // nodes.json is not in this order, so the page does the sorting
    expect(nodes.map((node) => node.name)).not.toEqual(names);
  });

  // The registry lists the services of each Node
  it('lists no services on the Node cards', () => {
    render(<DemoPage />);
    nodeCards().forEach((card) => {
      expect(card).not.toHaveTextContent(/ELIXIR On-Cloud services/i);
      expect(card).not.toHaveTextContent(/None yet/);
      servicesData.services.forEach((s) =>
        expect(within(card).queryByText(s.name, { exact: false })).toBeNull(),
      );
    });
  });

  it('never says "Planned"', () => {
    const { container } = render(<DemoPage />);
    expect(container).not.toHaveTextContent(/planned/i);
  });
});
