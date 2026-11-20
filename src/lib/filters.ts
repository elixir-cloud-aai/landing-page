// Shared filter behaviour of the listings (Products, Funding, Contributors):
// several filters can be selected, an item is listed if it matches any of
// them, and the selection lives in the URL (`?filter=a,b`), so that a link
// can open a listing with filters already set.

export const FILTER_PARAM = 'filter';

const SEPARATOR = ',';

/**
 * Turns a label into a filter id for the URL, e.g. "GA4GH WES" into
 * "ga4gh-wes".
 */
export function filterId(label: string): string {
  return label
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Returns the options unchanged after checking that every id is non-empty
 * and unique, as two labels can turn into the same id (e.g. "GA4GH TES" and
 * "GA4GH-TES"). Pages are prerendered, so a clash fails the build.
 */
export function checkFilterIds<T extends { value: string; label: string }>(
  options: T[],
): T[] {
  const labels = new Map<string, string>();
  options.forEach(({ value, label }) => {
    if (!value) {
      throw new Error(`The filter "${label}" has an empty id`);
    }
    const other = labels.get(value);
    if (other !== undefined) {
      throw new Error(
        `The filters "${other}" and "${label}" share the id "${value}"`,
      );
    }
    labels.set(value, label);
  });
  return options;
}

/**
 * Reads the selected filters from a URL query string. Unknown and repeated
 * ids are dropped, and the result follows the order of `ids`.
 */
export function parseFilters(
  search: string,
  ids: readonly string[],
  param: string = FILTER_PARAM,
): string[] {
  const value = new URLSearchParams(search).get(param);
  if (!value) {
    return [];
  }
  const requested = new Set(value.split(SEPARATOR));
  return ids.filter((id) => requested.has(id));
}

/**
 * Returns the query string with the selected filters set, or without the
 * filter parameter when none is selected. Other parameters are kept.
 */
export function withFilters(
  search: string,
  selected: readonly string[],
  param: string = FILTER_PARAM,
): string {
  const params = new URLSearchParams(search);
  if (selected.length) {
    params.set(param, selected.join(SEPARATOR));
  } else {
    params.delete(param);
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

/**
 * Whether an item with the filter ids `itemIds` is listed: with no filter
 * selected every item is, otherwise those matching any selected filter.
 */
export function matchesAny(
  selected: readonly string[],
  itemIds: readonly string[],
): boolean {
  return !selected.length || itemIds.some((id) => selected.includes(id));
}
