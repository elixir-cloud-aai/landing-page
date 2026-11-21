import fundingData from '@/data/funding.json';

// A grant of the Funding page. `category` is the funding programme ("ELIXIR"
// or "Google Summer of Code"): the card's title and filter. `funder` is the
// detailed grant type, e.g. "ELIXIR Strategic Implementation Study", shown
// under the title when it adds to it.
export type Grant = {
  id: string;
  funder: string;
  project: string;
  recipients: string[];
  startDate: string;
  endDate: string;
  formattedDuration: string;
  category: string;
};

// Dates are ISO 8601 (`YYYY-MM-DD`), so they compare as strings.
const compareText = (a: string, b: string) =>
  a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });

/**
 * Orders grants by end date (newest first), then by start date (oldest
 * first), then by project name (ascending, alphanumerical). Returns a new
 * array.
 */
export function sortGrants<T extends Grant>(grants: readonly T[]): T[] {
  return [...grants].sort(
    (a, b) =>
      b.endDate.localeCompare(a.endDate) ||
      a.startDate.localeCompare(b.startDate) ||
      compareText(a.project, b.project),
  );
}

/** The detailed grant type to show under the title, if it adds anything. */
export function grantType(grant: Grant): string | null {
  return grant.funder !== grant.category ? grant.funder : null;
}

export const grants: Grant[] = sortGrants(fundingData as Grant[]);
