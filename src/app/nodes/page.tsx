import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ExternalLink, Mail, MapPin, Network } from 'lucide-react';
import nodesData from '@/data/nodes.json';
import servicesData from '@/data/services.json';
import { FeedbackCallout, PageHero } from '@/components/catalog/page-hero';
import { OwnerChip } from '@/components/catalog/shared';
import type { ElixirNode, Service } from '@/components/catalog/types';
import { CONTACT_EMAIL } from '@/lib/site';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Nodes',
  description:
    'ELIXIR Nodes that run ELIXIR On-Cloud services, with their institutes and contacts.',
};

const nodes = nodesData.nodes as ElixirNode[];
const services = servicesData.services as Service[];

const servicesAt = (code: string) =>
  services.filter((service) =>
    service.nodes.some((node) => node.code === code),
  );

function NodeCard({ node }: { node: ElixirNode }) {
  const hosted = servicesAt(node.code);
  const contactEmail = node.contact?.email ?? null;
  const contactUrl = node.contact?.url ?? null;

  return (
    <article
      id={node.code.toLowerCase()}
      className={cn(
        'flex min-w-0 scroll-mt-28 flex-col rounded-2xl border bg-card text-card-foreground shadow-sm transition-[border-color,box-shadow] duration-200 [overflow-wrap:anywhere] hover:shadow-lg target:ring-2 target:ring-primary/30',
        node.status === 'planned'
          ? 'border-dashed hover:border-warning/50'
          : 'hover:border-primary/40',
      )}
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={`/flags/${node.code.toLowerCase()}.svg`}
              alt={`Flag of ${node.country}`}
              className="h-8 w-12 shrink-0 rounded-[3px] object-cover shadow-sm ring-1 ring-border"
            />
            <div className="min-w-0">
              <h3 className="text-lg font-semibold tracking-tight">
                {node.name}
              </h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {node.country}
              </p>
            </div>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
              node.status === 'live'
                ? 'bg-success/15 text-green-700 dark:text-green-300'
                : 'bg-warning/15 text-amber-700 dark:text-amber-300',
            )}
          >
            {node.status === 'live' ? 'Live' : 'Planned'}
          </span>
        </div>

        {(node.institute || node.logo) && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border bg-background p-3">
            {node.logo && (
              <img
                src={node.logo}
                alt=""
                className="h-10 w-auto max-w-[120px] object-contain"
              />
            )}
            {node.institute && (
              <p className="text-sm font-medium">{node.institute}</p>
            )}
          </div>
        )}

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ELIXIR On-Cloud services
          </p>
          {hosted.length ? (
            <ul className="flex flex-wrap gap-1.5">
              {hosted.map((service) => {
                // A service can list this Node as planned (e.g. a joining TES node).
                const planned = service.nodes.some(
                  (n) => n.code === node.code && n.status === 'planned',
                );
                return (
                  <li key={service.id}>
                    <Link
                      href={`/services#${service.id}`}
                      className={cn(
                        'inline-flex gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors hover:border-primary/40',
                        planned
                          ? 'border-dashed text-muted-foreground'
                          : 'bg-secondary text-secondary-foreground',
                      )}
                    >
                      {service.name}
                      {planned && (
                        <span className="font-normal">· planned</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Joining soon</p>
          )}
        </div>

        {node.liaison && (
          <div className="mt-5 border-t pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Node liaison
            </p>
            <OwnerChip owner={node.liaison} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t px-6 py-4">
        {node.website && (
          <a
            href={node.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Website
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        )}
        {contactUrl && (
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Contact page
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        )}
        {/* Until a Node contact is listed, route questions to the central team. */}
        <a
          href={`mailto:${contactEmail ?? CONTACT_EMAIL}`}
          className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Mail className="h-4 w-4" />
          Contact
        </a>
      </div>
    </article>
  );
}

export default function NodesPage() {
  const live = nodes.filter((node) => node.status === 'live');

  return (
    <div className="bg-background">
      <PageHero
        eyebrow="ELIXIR Nodes"
        icon={<Network className="h-3.5 w-3.5" />}
        title={
          <>
            The{' '}
            <span className="bg-gradient-to-r from-elixirgreen via-teal-500 to-elixirblue bg-clip-text text-transparent">
              Nodes
            </span>{' '}
            behind the network
          </>
        }
        description="ELIXIR Nodes contribute compute and operate ELIXIR On-Cloud services. Each one is run by a national institute with its own contact point."
        actions={
          <>
            <a
              href="#nodes"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Browse Nodes
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex h-11 items-center gap-2 rounded-full border bg-card px-6 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Onboard your Node
              <Mail className="h-4 w-4" />
            </a>
          </>
        }
        stats={[
          { value: live.length, label: 'Live Nodes' },
          { value: nodes.length - live.length, label: 'Planned' },
          {
            value: new Set(nodes.map((n) => n.country)).size,
            label: 'Countries',
          },
          {
            value: services.filter((s) => s.nodes.length > 0).length,
            label: 'Services on Nodes',
          },
        ]}
      />

      <section
        id="nodes"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 lg:px-8"
      >
        <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {nodes.map((node) => (
            <NodeCard key={node.code} node={node} />
          ))}
        </div>
      </section>

      <FeedbackCallout subject="Node" />
    </div>
  );
}
