'use client';

import { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronDown, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import {
  EmptyState,
  FilterBar,
  matchesQuery,
  Monogram,
  OwnerChip,
  StandardChip,
} from './shared';
import type { Product } from './types';

const ALL = 'all';

function DetailList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground marker:text-border">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const hasDetails =
    product.description ||
    product.howItWorks?.length ||
    product.requirements?.length ||
    product.quickStart?.length ||
    product.relatedRepos?.length;

  return (
    <article
      id={product.id}
      className="group flex min-w-0 scroll-mt-28 flex-col [overflow-wrap:anywhere] rounded-2xl border bg-card text-card-foreground shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-lg target:border-primary target:ring-2 target:ring-primary/30"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-4">
          <Monogram name={product.name} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                {product.name}
              </h3>
              {product.status && (
                <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                  {product.status.split(';')[0]}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium text-primary">
              {product.tagline}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {product.blurb}
        </p>

        {!!product.features?.length && (
          <ul className="mt-5 space-y-2">
            {product.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="min-w-0 leading-5 text-foreground/80">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {product.standards.map((standard) => (
            <StandardChip key={standard} label={standard} />
          ))}
          {product.license && (
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-inset ring-border">
              {product.license}
            </span>
          )}
        </div>

        {hasDetails && (
          <details className="group/details mt-5 rounded-xl border bg-muted/40 open:bg-muted/60">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
              Details
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open/details:rotate-180" />
            </summary>
            <div className="space-y-4 border-t px-4 py-4">
              {product.description && (
                <p className="text-sm leading-6 text-muted-foreground">
                  {product.description}
                </p>
              )}
              <DetailList title="Who it's for" items={product.audience} />
              <DetailList title="All features" items={product.features} />
              <DetailList title="How it works" items={product.howItWorks} />
              <DetailList title="Requirements" items={product.requirements} />
              <DetailList title="Deployment" items={product.deployment} />
              <DetailList title="Tech stack" items={product.techStack} />
              {!!product.quickStart?.length && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quick start
                  </h4>
                  <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                    <code>
                      {product.quickStart
                        .map((step) =>
                          /^[a-z]/.test(step) ? `$ ${step}` : `# ${step}`,
                        )
                        .join('\n')}
                    </code>
                  </pre>
                </div>
              )}
              {!!product.relatedRepos?.length && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Related repositories
                  </h4>
                  <ul className="space-y-1.5 text-sm">
                    {product.relatedRepos.map((repo) => (
                      <li key={repo.url}>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {repo.name}
                        </a>
                        <span className="text-muted-foreground">
                          {' '}
                          · {repo.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!!product.extraLinks?.length && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {product.extraLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </details>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4">
        {product.owner ? (
          <OwnerChip owner={product.owner} />
        ) : (
          <span className="text-xs text-muted-foreground">
            ELIXIR On-Cloud community
          </span>
        )}
        <div className="flex gap-2">
          {product.repoUrl && (
            <a
              href={product.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${product.name} source code`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <FaGithub className="h-4 w-4" />
              Code
            </a>
          )}
          {product.docsUrl && (
            <a
              href={product.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${product.name} documentation`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <BookOpen className="h-4 w-4" />
              Docs
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const [standard, setStandard] = useState(ALL);

  const options = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) =>
      product.standards.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)),
    );
    return [
      { value: ALL, label: 'All', count: products.length },
      ...Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => ({ value, label: value, count })),
    ];
  }, [products]);

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (standard === ALL || product.standards.includes(standard)) &&
          matchesQuery(query, [
            product.name,
            product.tagline,
            product.blurb,
            ...product.tags,
          ]),
      ),
    [products, query, standard],
  );

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search products, e.g. TES, Kubernetes"
        options={options}
        selected={standard}
        onSelect={setStandard}
        resultCount={filtered.length}
        noun="products"
      />
      {filtered.length ? (
        <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          onReset={() => {
            setQuery('');
            setStandard(ALL);
          }}
        />
      )}
    </>
  );
}
