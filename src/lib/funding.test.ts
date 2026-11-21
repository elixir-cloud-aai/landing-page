import { describe, expect, it } from 'vitest';
import {
  checkGrants,
  type Grant,
  grantType,
  type Programme,
  sortGrants,
} from './funding';

const grant = (
  project: string,
  startDate: string,
  endDate: string,
  category: Programme = 'ELIXIR',
  funder: string = category,
): Grant => ({
  id: project,
  funder,
  project,
  recipients: [],
  startDate,
  endDate,
  formattedDuration: '',
  category,
});

describe('sortGrants', () => {
  it('orders by end date (newest first)', () => {
    const grants = [
      grant('a', '2020-01-01', '2021-01-01'),
      grant('b', '2020-01-01', '2023-01-01'),
      grant('c', '2020-01-01', '2022-01-01'),
    ];
    expect(sortGrants(grants).map((g) => g.project)).toEqual(['b', 'c', 'a']);
  });

  it('then by start date (oldest first)', () => {
    const grants = [
      grant('a', '2022-01-01', '2023-01-01'),
      grant('b', '2020-01-01', '2023-01-01'),
      grant('c', '2021-01-01', '2023-01-01'),
    ];
    expect(sortGrants(grants).map((g) => g.project)).toEqual(['b', 'c', 'a']);
  });

  it('then by name (ascending, alphanumerical)', () => {
    const grants = [
      grant('Task 10', '2020-01-01', '2023-01-01'),
      grant('task 9', '2020-01-01', '2023-01-01'),
      grant('Apps', '2020-01-01', '2023-01-01'),
    ];
    expect(sortGrants(grants).map((g) => g.project)).toEqual([
      'Apps',
      'task 9',
      'Task 10',
    ]);
  });

  it('leaves its input unchanged', () => {
    const grants = [
      grant('a', '2020-01-01', '2021-01-01'),
      grant('b', '2020-01-01', '2023-01-01'),
    ];
    sortGrants(grants);
    expect(grants.map((g) => g.project)).toEqual(['a', 'b']);
  });
});

describe('grantType', () => {
  it('is the detailed type when it differs from the programme', () => {
    expect(
      grantType(
        grant(
          'a',
          '2020-01-01',
          '2021-01-01',
          'ELIXIR',
          'ELIXIR Strategic Implementation Study',
        ),
      ),
    ).toBe('ELIXIR Strategic Implementation Study');
  });

  it('is null when the type is the programme itself', () => {
    expect(
      grantType(
        grant('a', '2020-01-01', '2021-01-01', 'Google Summer of Code'),
      ),
    ).toBeNull();
  });
});

describe('checkGrants', () => {
  it('accepts grants of known programmes', () => {
    const grants = [grant('a', '2020-01-01', '2021-01-01')];
    expect(checkGrants(grants)).toBe(grants);
  });

  it('rejects a grant of an unknown programme', () => {
    expect(() =>
      checkGrants([
        { ...grant('a', '2020-01-01', '2021-01-01'), category: 'Other' },
      ]),
    ).toThrow('The grant "a" has the unknown programme "Other"');
  });
});
