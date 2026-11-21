import contributorData from '@/data/contributor.json';

// A person on the Contributors page. `roles` mixes affiliations (an ELIXIR
// Node, "OSS Contributor", "External Contributor") with roles proper, e.g.
// "GSoC '21 Contributor" or "GA4GH Driver Project Champion".
export type Contributor = {
  name: string;
  image?: string | null;
  roles?: string[];
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
};

// The ELIXIR Nodes that contributors are affiliated with, and the flag
// (`public/flags/<code>.svg`) shown with each. The ELIXIR Hub and EMBL-EBI
// are international, so they get the EU flag.
export const NODE_FLAGS: Readonly<Record<string, string>> = {
  'ELIXIR Czech Republic': 'cz',
  'ELIXIR Finland': 'fi',
  'ELIXIR Germany': 'de',
  'ELIXIR Greece': 'gr',
  'ELIXIR Hub': 'eu',
  'ELIXIR Netherlands': 'nl',
  'ELIXIR Switzerland': 'ch',
  'ELIXIR United Kingdom': 'gb',
  'EMBL-EBI': 'eu',
};

// Affiliations that are not ELIXIR Nodes: the ELIXIR Hub coordinates the
// Nodes but is not one of them.
const NOT_NODES = new Set(['ELIXIR Hub']);

const OSS = 'oss contributor';
const EXTERNAL = 'external contributor';

// The leads of ELIXIR On-Cloud, marked with a "Lead" badge
export const LEADS: readonly string[] = [
  'Alex Kanitz',
  'Jonathan Tedds',
  'Martin Kuba',
];

const lower = (role: string) => role.toLowerCase();

// Node names must match NODE_FLAGS exactly (own keys only)
const isNode = (role: string) => Object.hasOwn(NODE_FLAGS, role);

// An ELIXIR Node, "OSS Contributor" or "External Contributor"
const isAffiliation = (role: string) =>
  isNode(role) || [OSS, EXTERNAL].includes(lower(role));

/** The contributor's ELIXIR Node (or Hub), if any. */
export function elixirNode(person: Contributor): string | null {
  return person.roles?.find(isNode) ?? null;
}

/** Whether the contributor is with an ELIXIR Node, the Hub or EMBL-EBI. */
export function isELIXIR(person: Contributor): boolean {
  return !!elixirNode(person);
}

/**
 * Whether one of the contributor's roles is an affiliation: an ELIXIR Node,
 * "OSS Contributor" or "External Contributor".
 */
export function hasAffiliation(person: Contributor): boolean {
  return (person.roles ?? []).some(isAffiliation);
}

export function isOSS(person: Contributor): boolean {
  return (person.roles ?? []).some((role) => lower(role) === OSS);
}

export function isGSoC(person: Contributor): boolean {
  return (person.roles ?? []).some((role) => lower(role).includes('gsoc'));
}

export function isLead(person: Contributor): boolean {
  return LEADS.includes(person.name);
}

/** Everyone who is neither an OSS contributor nor with ELIXIR. */
export function isExternal(person: Contributor): boolean {
  return !isOSS(person) && !elixirNode(person);
}

/**
 * The subtitle under the contributor's name: their ELIXIR Node with its
 * flag, or else "OSS contributor" or "External contributor".
 */
export function affiliation(person: Contributor): {
  label: string;
  flag: string | null;
} {
  const node = elixirNode(person);
  if (node) {
    return { label: node, flag: NODE_FLAGS[node] };
  }
  return {
    label: isOSS(person) ? 'OSS contributor' : 'External contributor',
    flag: null,
  };
}

/** The roles to list on the tile: all but the affiliations. */
export function roles(person: Contributor): string[] {
  return (person.roles ?? []).filter((role) => !isAffiliation(role));
}

/** The ELIXIR Nodes that contributors come from (the Hub isn't one). */
export function nodesRepresented(people: readonly Contributor[]): string[] {
  return Array.from(
    new Set(
      people
        .map(elixirNode)
        .filter((node): node is string => !!node && !NOT_NODES.has(node)),
    ),
  );
}

/** Orders contributors by name (ascending, alphanumerical); a new array. */
export function sortContributors<T extends Contributor>(
  people: readonly T[],
): T[] {
  return [...people].sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { numeric: true, sensitivity: 'base' }),
  );
}

export const contributors: Contributor[] = sortContributors(
  contributorData as Contributor[],
);
