import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import { FILTER_PARAM, parseFilters, withFilters } from './filters';

// Sent after the filters in the URL change, so that every listing using the
// hook re-reads them (history.replaceState fires no event of its own).
const CHANGE_EVENT = 'filterchange';

/**
 * Tells the listings when Next.js changes the URL, e.g. a <Link> to
 * `/products?filter=…` while on /products: such navigations fire no browser
 * event. Rendered once in the layout, inside <Suspense>, as
 * useSearchParams() opts its tree out of prerendering; it renders nothing,
 * so the pages stay prerendered.
 */
export function FilterUrlSync() {
  const searchParams = useSearchParams();
  useEffect(() => {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, [searchParams]);
  return null;
}

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getSearch = () => window.location.search;

// Pages are prerendered without a URL: they start unfiltered, and the
// browser applies the URL's filters right after hydration.
const getServerSearch = () => '';

/**
 * The selected filters of a listing, kept in the URL (`?filter=a,b`).
 * @param ids the listing's filter ids, in display order; pass a stable
 *   (memoized) array
 */
export function useUrlFilters(
  ids: readonly string[],
  param: string = FILTER_PARAM,
) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const selected = useMemo(
    () => parseFilters(search, ids, param),
    [search, ids, param],
  );

  const select = useCallback(
    (next: readonly string[]) => {
      const url = new URL(window.location.href);
      // Keep the display order, so that a selection has one URL
      url.search = withFilters(
        url.search,
        ids.filter((id) => next.includes(id)),
        param,
      );
      // Replace, not push: toggling filters shouldn't fill the history
      window.history.replaceState(window.history.state, '', url);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [ids, param],
  );

  const toggle = useCallback(
    (id: string) =>
      select(
        selected.includes(id)
          ? selected.filter((value) => value !== id)
          : [...selected, id],
      ),
    [select, selected],
  );

  const clear = useCallback(() => select([]), [select]);

  return { selected, toggle, clear };
}
