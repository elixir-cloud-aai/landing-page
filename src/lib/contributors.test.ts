import { describe, expect, it } from 'vitest';
import {
  affiliation,
  type Contributor,
  elixirNode,
  isExternal,
  isGSoC,
  isLead,
  isOSS,
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

describe('roles', () => {
  it('leaves out the affiliations', () => {
    expect(roles(nodeMember)).toEqual(['ELIXIR Compute Platform: Lead']);
    expect(roles(ossMember)).toEqual(["GSoC '21 Contributor"]);
    expect(roles(external)).toEqual([]);
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
