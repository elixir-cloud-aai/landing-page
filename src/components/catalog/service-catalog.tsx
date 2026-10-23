'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Check,
  Clock,
  ExternalLink,
  Globe,
  Package,
} from 'lucide-react';
import { FaGithub, FaGitlab } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import {
  EmptyState,
  FilterBar,
  matchesQuery,
  Monogram,
  OwnerChip,
  StandardChip,
} from './shared';
import type { Service, ServiceNode } from './types';

const ALL = 'all';

export function StatusBadge({ status }: { status: Service['status'] }) {
  if (status === 'Live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 dark:text-green-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        Live
      </span>
    );
  }
  if (status === 'Planned') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
        <Clock className="h-3 w-3" />
        Planned
      </span>
    );
  }
  return null;
}

export function NodeChip({ node }: { node: ServiceNode }) {
  return (
    <span
      title={`${node.name} (${node.status})`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium',
        node.status === 'live'
          ? 'bg-card text-foreground'
          : 'border-dashed bg-transparent text-muted-foreground',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          node.status === 'live' ? 'bg-success' : 'bg-warning',
        )}
      />
      {node.code}
      {node.status === 'planned' && (
        <span className="font-normal">planned</span>
      )}
    </span>
  );
}

const linkButton =
  'inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted';

function ServiceCard({ service }: { service: Service }) {
  const repoIsGitlab = service.repoUrl?.includes('gitlab.com');

  return (
    <article
      id={service.id}
      className={cn(
        'flex min-w-0 scroll-mt-28 flex-col [overflow-wrap:anywhere] rounded-2xl border bg-card text-card-foreground shadow-sm transition-[border-color,box-shadow] duration-200 hover:shadow-lg target:ring-2 target:ring-primary/30',
        service.status === 'Planned'
          ? 'border-dashed hover:border-warning/50'
          : 'hover:border-primary/40',
      )}
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-4">
          <Monogram name={service.name} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                {service.name}
              </h3>
              <StatusBadge status={service.status} />
            </div>
            <p className="mt-0.5 text-sm font-medium text-primary">
              {service.tagline}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {service.blurb}
        </p>

        {!!service.features.length && (
          <ul className="mt-5 space-y-2">
            {service.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="min-w-0 leading-5 text-foreground/80">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        {!!service.nodes.length && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Node coverage
            </p>
            <div className="flex flex-wrap gap-1.5">
              {service.nodes.map((node) => (
                <NodeChip key={node.code} node={node} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {service.standards.map((standard) => (
            <StandardChip key={standard} label={standard} />
          ))}
        </div>

        {service.relatedProductId && (
          <Link
            href={`/products#${service.relatedProductId}`}
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Package className="h-4 w-4" />
            About the software
          </Link>
        )}

        {service.owners.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-4 border-t pt-4">
            {service.owners.map((owner) => (
              <OwnerChip key={owner.name} owner={owner} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t px-6 py-4">
        {service.deploymentUrl ? (
          <a
            href={service.deploymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Globe className="h-4 w-4" />
            Open service
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        ) : service.trackingUrl ? (
          <a
            href={service.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkButton}
          >
            <Clock className="h-4 w-4" />
            Track deployment
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">
            Public endpoint coming soon
          </span>
        )}
        <div className="ml-auto flex gap-2">
          {service.docsUrl && (
            <a
              href={service.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${service.name} documentation`}
              className={linkButton}
            >
              <BookOpen className="h-4 w-4" />
              Docs
            </a>
          )}
          {service.repoUrl && (
            <a
              href={service.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${service.name} source code`}
              className={linkButton}
            >
              {repoIsGitlab ? (
                <FaGitlab className="h-4 w-4" />
              ) : (
                <FaGithub className="h-4 w-4" />
              )}
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ServiceCatalog({ services }: { services: Service[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(ALL);

  const options = useMemo(
    () => [
      { value: ALL, label: 'All', count: services.length },
      {
        value: 'Live',
        label: 'Live',
        count: services.filter((s) => s.status === 'Live').length,
      },
      {
        value: 'Planned',
        label: 'Planned',
        count: services.filter((s) => s.status === 'Planned').length,
      },
    ],
    [services],
  );

  const filtered = useMemo(
    () =>
      services.filter(
        (service) =>
          (status === ALL || service.status === status) &&
          matchesQuery(query, [
            service.name,
            service.tagline,
            service.blurb,
            ...service.tags,
            ...service.nodes.map((node) => node.name),
          ]),
      ),
    [services, query, status],
  );

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search services, e.g. WES, Germany"
        options={options}
        selected={status}
        onSelect={setStatus}
        resultCount={filtered.length}
        noun="services"
      />
      {filtered.length ? (
        <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          onReset={() => {
            setQuery('');
            setStatus(ALL);
          }}
        />
      )}
    </>
  );
}
