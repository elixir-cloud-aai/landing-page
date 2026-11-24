import type { Metadata } from 'next';
import { ArrowDown, Boxes } from 'lucide-react';
import productsData from '@/data/product.json';
import { FeedbackCallout, PageHero } from '@/components/catalog/page-hero';
import { ProductCatalog } from '@/components/catalog/product-catalog';
import type { Product } from '@/components/catalog/types';
import {
  CLOUD_NATIVE,
  OWN_PRODUCTS,
  PARTNER_PRODUCTS,
  productFilters,
  productsUrl,
} from '@/lib/products';

const DESCRIPTION =
  'Clients, services and tools for federating research infrastructures. Use them all at once, or pick the ones that fill your gaps.';

export const metadata: Metadata = {
  title: 'Products',
  description: DESCRIPTION,
};

const products = productsData.products as Product[];
const count = (label: string) =>
  products.filter((product) => productFilters(product).includes(label)).length;
const standards = Array.from(
  new Set(products.flatMap((product) => product.standards)),
);

export default function ProductsPage() {
  return (
    <div className="bg-background">
      <PageHero
        actions={
          <a
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            href="#catalog"
          >
            Browse products
            <ArrowDown className="h-4 w-4" />
          </a>
        }
        description={DESCRIPTION}
        eyebrow="Open-source software"
        icon={<Boxes className="h-3.5 w-3.5" />}
        // Each stat opens the listing with its filters set
        stats={[
          {
            value: count(OWN_PRODUCTS),
            label: OWN_PRODUCTS,
            href: productsUrl([OWN_PRODUCTS]),
          },
          {
            value: count(PARTNER_PRODUCTS),
            label: PARTNER_PRODUCTS,
            href: productsUrl([PARTNER_PRODUCTS]),
          },
          {
            value: standards.length,
            label: 'GA4GH standards',
            href: productsUrl(standards),
          },
          {
            value: count(CLOUD_NATIVE),
            label: CLOUD_NATIVE,
            href: productsUrl([CLOUD_NATIVE]),
          },
        ]}
        title={
          <>
            Software for{' '}
            <span className="bg-gradient-to-r from-elixirred via-elixiryellow to-elixirblue bg-clip-text text-transparent">
              infrastructure federation
            </span>
          </>
        }
      />

      <section
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 lg:px-8"
        id="catalog"
      >
        <ProductCatalog products={products} />
      </section>

      <FeedbackCallout subject="product" />
    </div>
  );
}
