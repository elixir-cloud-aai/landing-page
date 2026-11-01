import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, BookOpen, Globe, Server } from 'lucide-react';
import servicesData from '@/data/services.json';
import { FeedbackCallout, PageHero } from '@/components/catalog/page-hero';
import { ServiceCatalog } from '@/components/catalog/service-catalog';
import type { Service, ServiceNode } from '@/components/catalog/types';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Live ELIXIR On-Cloud services: the service registry, the proTES gateway, the federated TES network and more.',
};

const services = servicesData.services as Service[];
const liveCount = services.filter((s) => s.status === 'Live').length;
const plannedCount = services.filter((s) => s.status === 'Planned').length;

// One entry per ELIXIR Node across all services; a node is live if any
// service runs there.
const nodes = Array.from(
  services
    .flatMap((service) => service.nodes)
    .reduce((map, node) => {
      const existing = map.get(node.code);
      if (
        !existing ||
        (existing.status === 'planned' && node.status === 'live')
      ) {
        map.set(node.code, node);
      }
      return map;
    }, new Map<string, ServiceNode>())
    .values(),
).sort((a, b) =>
  a.status === b.status
    ? a.code.localeCompare(b.code)
    : a.status === 'live'
      ? -1
      : 1,
);

const servicesAt = (code: string) =>
  services.filter((service) =>
    service.nodes.some((node) => node.code === code),
  );

export default function ServicesPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Running infrastructure"
        icon={<Globe className="h-3.5 w-3.5" />}
        title={
          <>
            ELIXIR On-Cloud{' '}
            <span className="bg-gradient-to-r from-elixirblue via-teal-500 to-elixirgreen bg-clip-text text-transparent">
              services
            </span>
          </>
        }
        description="Deployments operated by ELIXIR Nodes and partners: registries, gateways and a federated GA4GH compute network you can use today."
        actions={
          <>
            <a
              href="#catalog"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Browse services
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="/products"
              className="inline-flex h-11 items-center gap-2 rounded-full border bg-card px-6 text-sm font-semibold transition-colors hover:bg-muted"
            >
              <BookOpen className="h-4 w-4" />
              Product documentation
            </a>
          </>
        }
        stats={[
          { value: liveCount, label: 'Live services' },
          { value: plannedCount, label: 'Planned' },
          {
            value: nodes.filter((node) => node.status === 'live').length,
            label: 'ELIXIR Nodes live',
          },
          { value: 'GA4GH', label: 'Standard APIs' },
        ]}
      />

      {nodes.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-14 lg:px-8">
          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                  <Server className="h-5 w-5 text-primary" />
                  Network coverage
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  ELIXIR Nodes running ELIXIR On-Cloud services.{' '}
                  <Link
                    href="/nodes"
                    className="font-medium text-primary hover:underline"
                  >
                    All Nodes →
                  </Link>
                </p>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" /> Live
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warning" /> Planned
                </span>
              </div>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {nodes.map((node) => (
                <li key={node.code}>
                  <Link
                    href={`/nodes#${node.code.toLowerCase()}`}
                    className={cn(
                      'block h-full rounded-xl border p-4 transition-colors hover:border-primary/40',
                      node.status === 'live'
                        ? 'bg-background'
                        : 'border-dashed',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold tracking-tight">
                        {node.code}
                      </span>
                      <span
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          node.status === 'live' ? 'bg-success' : 'bg-warning',
                        )}
                        aria-label={node.status}
                      />
                    </div>
                    <p className="mt-1 text-xs font-medium">{node.name}</p>
                    <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
                      {node.status === 'live'
                        ? servicesAt(node.code)
                            .filter((s) =>
                              s.nodes.some(
                                (n) =>
                                  n.code === node.code && n.status === 'live',
                              ),
                            )
                            .map((s) => s.name)
                            .join(', ')
                        : 'Joining soon'}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section
        id="catalog"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 lg:px-8"
      >
        <ServiceCatalog services={services} />
      </section>

      <FeedbackCallout subject="service" />
    </div>
  );
}
