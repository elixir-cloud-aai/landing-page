import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowDown, ExternalLink, Mail, Network } from 'lucide-react';
import aaaiData from '@/data/aaai.json';
import nodesData from '@/data/nodes.json';
import servicesData from '@/data/services.json';
import { FeedbackCallout, PageHero } from '@/components/catalog/page-hero';
import { ServiceCard } from '@/components/catalog/service-catalog';
import { OwnerChip } from '@/components/catalog/shared';
import type { ElixirNode, Service } from '@/components/catalog/types';
import { CONTACT_EMAIL, DOCS_OPERATORS_URL } from '@/lib/site';
import { cn } from '@/lib/utils';

const DESCRIPTION =
  'Whether you are a prospective adopter or implementer: Try our reference federation, deployed across various ELIXIR Nodes.';

export const metadata: Metadata = {
  title: 'Demo',
  description: DESCRIPTION,
};

// By name, ascending, alphanumerical
const nodes = [...(nodesData.nodes as ElixirNode[])].sort((a, b) =>
  a.name.localeCompare(b.name, 'en', { numeric: true, sensitivity: 'base' }),
);
const services = servicesData.services as Service[];
// The AAAI providers that the federation's services trust for login
const providers = aaaiData.providers as ElixirNode[];

// The core services, in this order: the portal on the left, the registry on
// the right. The registry lists all other services.
const CORE_SERVICE_IDS = ['elixir-on-cloud-portal', 'elixir-on-cloud-registry'];
const coreServices = CORE_SERVICE_IDS.map((id) =>
  services.find((service) => service.id === id)!,
);

// Short link text, e.g. "csc.fi". Falls back to the raw value, so a malformed
// URL in nodes.json can't break the page.
const hostLabel = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

// The card of an ELIXIR Node, also used for AAAI providers (same fields: the
// provider's name as `institute`, its infrastructure as `name`)
function NodeCard({
  node,
  liaisonLabel = 'Node liaison',
}: {
  node: ElixirNode;
  liaisonLabel?: string;
}) {
  const contactEmail = node.contact?.email ?? null;
  const contactUrl = node.contact?.url ?? null;

  return (
    <article
      className={cn(
        'flex min-w-0 scroll-mt-28 flex-col rounded-2xl border bg-card text-card-foreground shadow-sm transition-[border-color,box-shadow] duration-200 [overflow-wrap:anywhere] hover:shadow-lg target:ring-2 target:ring-primary/30',
        node.status === 'onboarding'
          ? 'border-dashed hover:border-warning/50'
          : 'hover:border-primary/40',
      )}
      id={node.code.toLowerCase()}
    >
      {/* Logos are made for white backgrounds, so they sit on a white panel
          in both themes. */}
      <div className="flex h-24 items-center justify-center rounded-t-2xl border-b bg-white px-6">
        {node.logo ? (
          <div className="relative h-12 w-full max-w-[220px]">
            <Image
              alt={`${node.institute ?? node.name} logo`}
              className="object-contain"
              fill
              sizes="220px"
              src={node.logo}
            />
          </div>
        ) : (
          <span className="text-center text-base font-semibold text-slate-800">
            {node.institute ?? node.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold leading-snug tracking-tight">
          {node.institute ?? node.name}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Image
              alt={`Flag of ${node.country}`}
              className="h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-border"
              height={16}
              src={`/flags/${node.code.toLowerCase()}.svg`}
              width={24}
            />
            {node.name}
          </p>
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
              node.status === 'live'
                ? 'bg-success/15 text-green-700 dark:text-green-300'
                : 'bg-warning/15 text-amber-700 dark:text-amber-300',
            )}
          >
            {node.status === 'live' ? 'Live' : 'Onboarding'}
          </span>
        </div>

        {/* The registry lists the services of each Node: no copy here, which
            would drift */}
        {/* Pushes the liaison down, in line across the cards of a row */}
        <div aria-hidden="true" className="min-h-5 flex-1" />
        {node.liaison && (
          <div className="border-t pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {liaisonLabel}
            </p>
            <OwnerChip owner={node.liaison} role={null} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t px-6 py-4">
        {node.website && (
          <a
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
            href={node.website}
            rel="noopener noreferrer"
            target="_blank"
          >
            {hostLabel(node.website)}
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        )}
        {contactUrl && (
          <a
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
            href={contactUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Contact page
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        )}
        {/* Until a Node contact is listed, route questions to the central team. */}
        <a
          className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          href={`mailto:${contactEmail ?? CONTACT_EMAIL}`}
        >
          <Mail className="h-4 w-4" />
          Contact
        </a>
      </div>
    </article>
  );
}

export default function DemoPage() {
  return (
    <div className="bg-background">
      <PageHero
        actions={
          <>
            <a
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              href="#nodes"
            >
              Browse Nodes
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              className="inline-flex h-11 items-center gap-2 rounded-full border bg-card px-6 text-sm font-semibold transition-colors hover:bg-muted"
              href={DOCS_OPERATORS_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Onboard your Node
              <ExternalLink className="h-4 w-4" />
            </a>
          </>
        }
        description={DESCRIPTION}
        eyebrow="Demo"
        icon={<Network className="h-3.5 w-3.5" />}
        stats={[
          { value: coreServices.length, label: 'Core services' },
          { value: providers.length, label: 'AAAI providers' },
          { value: nodes.length, label: 'Nodes' },
        ]}
        title={
          <>
            ELIXIR On-Cloud&apos;s{' '}
            <span className="bg-gradient-to-r from-elixirgreen via-teal-500 to-elixirblue bg-clip-text text-transparent">
              Federation Sandbox
            </span>
          </>
        }
      />

      <section
        aria-labelledby="services-heading"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 pt-14 lg:px-8"
        id="services"
      >
        <h2
          className="mb-6 text-2xl font-semibold tracking-tight"
          id="services-heading"
        >
          Core services
        </h2>
        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
          {coreServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="aaai-heading"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 pt-14 lg:px-8"
        id="aaai"
      >
        <h2
          className="mb-6 text-2xl font-semibold tracking-tight"
          id="aaai-heading"
        >
          AAAI providers
        </h2>
        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
          {providers.map((provider) => (
            <NodeCard
              key={provider.code}
              liaisonLabel="Provider liaison"
              node={provider}
            />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="nodes-heading"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 lg:px-8"
        id="nodes"
      >
        <h2
          className="mb-6 text-2xl font-semibold tracking-tight"
          id="nodes-heading"
        >
          Nodes
        </h2>
        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
          {nodes.map((node) => (
            <NodeCard key={node.code} node={node} />
          ))}
        </div>
      </section>

      <FeedbackCallout subject="Node" />
    </div>
  );
}
