import type { Metadata } from 'next';
import { ArrowDown, Boxes } from 'lucide-react';
import productsData from '@/data/product.json';
import { FeedbackCallout, PageHero } from '@/components/catalog/page-hero';
import { ProductCatalog } from '@/components/catalog/product-catalog';
import type { Product } from '@/components/catalog/types';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Open-source software from ELIXIR On-Cloud for deploying, connecting and building against GA4GH cloud infrastructure.',
};

const products = productsData.products as Product[];
const standards = new Set(products.flatMap((product) => product.standards));
const openSource = products.filter((product) => product.repoUrl).length;

export default function ProductsPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Open-source software"
        icon={<Boxes className="h-3.5 w-3.5" />}
        title={
          <>
            Software for{' '}
            <span className="bg-gradient-to-r from-elixirred via-elixiryellow to-elixirblue bg-clip-text text-transparent">
              federated compute
            </span>
          </>
        }
        description="Implementations, clients and tools for GA4GH cloud standards. Deploy them yourself, or use them through the ELIXIR On-Cloud services."
        actions={
          <>
            <a
              href="#catalog"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Browse products
              <ArrowDown className="h-4 w-4" />
            </a>
          </>
        }
        stats={[
          { value: products.length, label: 'Products' },
          { value: standards.size, label: 'GA4GH standards' },
          { value: openSource, label: 'With public source' },
          { value: 'K8s', label: 'Cloud-native' },
        ]}
      />

      <section
        id="catalog"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 lg:px-8"
      >
        <ProductCatalog products={products} />
      </section>

      <FeedbackCallout subject="product" />
    </div>
  );
}
