import { describe, expect, it } from 'vitest';
import {
  affiliation,
  type Contributor,
  elixirNode,
  emailAddress,
  hasAffiliation,
  isELIXIR,
  isExternal,
  isGSoC,
  isLead,
  isOSS,
  LEADS,
  nodesRepresented,
  roles,
  sortContributors,
} from './contributors';

const person = (name: string, ...personRoles: string[]): Contributor => ({
  name,
  roles: personRoles,
});

const nodeMember = person(
  'Node Member',
  'ELIXIR Finland',
  'ELIXIR Compute Platform: Lead',
);
const ossMember = person(
  'OSS Member',
  'OSS Contributor',
  "GSoC '21 Contributor",
);
const external = person('External Person', 'External Contributor');

describe('affiliations', () => {
  it('finds the ELIXIR Node with its flag', () => {
    expect(elixirNode(nodeMember)).toBe('ELIXIR Finland');
    expect(affiliation(nodeMember)).toEqual({
      label: 'ELIXIR Finland',
      flag: 'fi',
    });
  });

  it('gives the ELIXIR Hub and EMBL-EBI the EU flag', () => {
    expect(affiliation(person('a', 'ELIXIR Hub')).flag).toBe('eu');
    expect(affiliation(person('b', 'EMBL-EBI')).flag).toBe('eu');
  });

  it('prefers the Node over OSS', () => {
    const both = person('Both', 'OSS Contributor', 'ELIXIR Switzerland');
    expect(affiliation(both).label).toBe('ELIXIR Switzerland');
    expect(isOSS(both)).toBe(true);
    expect(isExternal(both)).toBe(false);
  });

  it('calls everyone else OSS or external contributors', () => {
    expect(affiliation(ossMember)).toEqual({
      label: 'OSS contributor',
      flag: null,
    });
    expect(affiliation(external)).toEqual({
      label: 'External contributor',
      flag: null,
    });
    expect(affiliation(person('No roles'))).toEqual({
      label: 'External contributor',
      flag: null,
    });
  });

  it('treats as external everyone who is neither OSS nor ELIXIR', () => {
    expect(isExternal(external)).toBe(true);
    expect(isExternal(person('No roles'))).toBe(true);
    expect(isExternal(ossMember)).toBe(false);
    expect(isExternal(nodeMember)).toBe(false);
  });
});

describe('isELIXIR', () => {
  it('includes the Nodes, the Hub and EMBL-EBI', () => {
    expect(isELIXIR(nodeMember)).toBe(true);
    expect(isELIXIR(person('a', 'ELIXIR Hub'))).toBe(true);
    expect(isELIXIR(person('b', 'EMBL-EBI'))).toBe(true);
    expect(isELIXIR(ossMember)).toBe(false);
  });

  it('only knows Node names spelled exactly', () => {
    expect(isELIXIR(person('a', 'Elixir Finland'))).toBe(false);
    expect(isELIXIR(person('b', 'constructor'))).toBe(false);
  });
});

describe('hasAffiliation', () => {
  it('is true for a Node, OSS or external contributor', () => {
    expect(hasAffiliation(nodeMember)).toBe(true);
    expect(hasAffiliation(ossMember)).toBe(true);
    expect(hasAffiliation(external)).toBe(true);
  });

  it('is false for roles proper only', () => {
    expect(hasAffiliation(person('a', "GSoC '21 Contributor"))).toBe(false);
    expect(hasAffiliation(person('b', 'Elixir Finland'))).toBe(false);
  });
});

describe('roles', () => {
  it('leaves out the affiliations', () => {
    expect(roles(nodeMember)).toEqual(['ELIXIR Compute Platform: Lead']);
    expect(roles(ossMember)).toEqual(["GSoC '21 Contributor"]);
    expect(roles(external)).toEqual([]);
  });
});

describe('nodesRepresented with several Nodes', () => {
  it('counts every Node of a contributor', () => {
    expect(
      nodesRepresented([person('a', 'ELIXIR Finland', 'ELIXIR Germany')]),
    ).toEqual(['ELIXIR Finland', 'ELIXIR Germany']);
  });
});

describe('emailAddress', () => {
  it('reads the address from a Markdown link', () => {
    expect(emailAddress('[a@b.org](mailto:a@b.org)')).toBe('a@b.org');
  });

  it('keeps a plain address', () => {
    expect(emailAddress(' a@b.org ')).toBe('a@b.org');
  });
});

describe('LEADS', () => {
  it('names the leads of ELIXIR On-Cloud', () => {
    expect([...LEADS].sort()).toEqual([
      'Alex Kanitz',
      'Jonathan Tedds',
      'Martin Kuba',
    ]);
  });
});

describe('markers', () => {
  it('marks GSoC contributors', () => {
    expect(isGSoC(ossMember)).toBe(true);
    expect(isGSoC(nodeMember)).toBe(false);
  });

  it('marks the leads by name', () => {
    expect(isLead(person('Alex Kanitz'))).toBe(true);
    expect(isLead(nodeMember)).toBe(false);
  });
});

describe('nodesRepresented', () => {
  it('counts each Node once, without the Hub', () => {
    expect(
      nodesRepresented([
        nodeMember,
        person('a', 'ELIXIR Finland'),
        person('b', 'EMBL-EBI'),
        person('c', 'ELIXIR Hub'),
        ossMember,
      ]),
    ).toEqual(['ELIXIR Finland', 'EMBL-EBI']);
  });
});

describe('sortContributors', () => {
  it('sorts by name, ignoring case and accents', () => {
    const sorted = sortContributors([
      person('Bea'),
      person('Álvaro'),
      person('anna'),
      person('Zoe'),
    ]);
    expect(sorted.map((p) => p.name)).toEqual(['Álvaro', 'anna', 'Bea', 'Zoe']);
  });
});
