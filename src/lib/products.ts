import type { Product } from '@/components/catalog/types';
import { FILTER_PARAM, filterId } from './filters';

// The filters of the Products page besides the GA4GH standards: one for whose
// product it is, one for how it runs
export const OWN_PRODUCTS = 'ELIXIR On-Cloud products';
export const PARTNER_PRODUCTS = 'Partner products';
export const CLOUD_NATIVE = 'Cloud native';

/** By name, ascending, alphanumerical */
export function sortProducts<T extends Pick<Product, 'name'>>(
  products: T[],
): T[] {
  return [...products].sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { numeric: true, sensitivity: 'base' }),
  );
}

/** The labels of the filters that list a product */
export function productFilters(
  product: Pick<Product, 'partner' | 'cloudNative' | 'standards'>,
): string[] {
  return [
    product.partner ? PARTNER_PRODUCTS : OWN_PRODUCTS,
    ...(product.cloudNative ? [CLOUD_NATIVE] : []),
    ...product.standards,
  ];
}

/** The listing with the given filters set, e.g. for the stats */
export function productsUrl(labels: readonly string[]): string {
  // Ids are made of [a-z0-9-] only, so they need no escaping
  return `/products?${FILTER_PARAM}=${labels.map(filterId).join(',')}#catalog`;
}
