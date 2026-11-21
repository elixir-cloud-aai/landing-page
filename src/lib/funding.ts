import fundingData from '@/data/funding.json';

export const ELIXIR = 'ELIXIR';
export const GSOC = 'Google Summer of Code';

/** A funding programme: the `category` of a grant. */
export type Programme = typeof ELIXIR | typeof GSOC;

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
  category: Programme;
};

// The funding programmes (`category`), in the order of the filters, with
// their logos in `public/`. A new programme needs an entry here.
export const PROGRAMMES: readonly { name: Programme; logo: string }[] = [
  { name: ELIXIR, logo: '/elixir.png' },
  { name: GSOC, logo: '/gsoc.svg' },
];

const compareText = (a: string, b: string) =>
  a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });

/**
 * Orders grants by end date (newest first), then by start date (oldest
 * first), then by project name (ascending, alphanumerical). Returns a new
 * array.
 */
export function sortGrants<
  T extends Pick<Grant, 'startDate' | 'endDate' | 'project'>,
>(grants: readonly T[]): T[] {
  // Dates are ISO 8601 (`YYYY-MM-DD`), so they compare as strings
  return [...grants].sort(
    (a, b) =>
      b.endDate.localeCompare(a.endDate) ||
      a.startDate.localeCompare(b.startDate) ||
      compareText(a.project, b.project),
  );
}

/** The detailed grant type to show under the title, if it adds anything. */
export function grantType(grant: {
  funder: string;
  category: string;
}): string | null {
  return grant.funder !== grant.category ? grant.funder : null;
}

/**
 * Returns the grants after checking that each names a known programme, so
 * that none is listed without its logo and filter. Pages are prerendered,
 * so an unknown programme fails the build.
 */
export function checkGrants(
  data: readonly (Omit<Grant, 'category'> & { category: string })[],
): Grant[] {
  const known = new Set<string>(PROGRAMMES.map(({ name }) => name));
  data.forEach(({ project, category }) => {
    if (!known.has(category)) {
      throw new Error(
        `The grant "${project}" has the unknown programme "${category}"`,
      );
    }
  });
  return data as Grant[];
}

export const grants: Grant[] = sortGrants(checkGrants(fundingData));
