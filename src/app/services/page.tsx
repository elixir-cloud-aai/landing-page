import servicesData from '@/data/services.json';

import {
  ArrowRight,
  Check,
  ExternalLink,
  Globe,
  Server,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { FaGithub } from 'react-icons/fa6';
import Image from 'next/image';

const services = servicesData.services;

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={3}
        repeatDelay={1}
        className={cn(
          'mask-[radial-gradient(520px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
        )}
      />

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        <div className="mx-auto max-w-4xl py-9 text-center bg-white/6 backdrop-blur-[2px] backdrop-saturate-[109%] border border-white/20 rounded-[16px] shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] dark:text-white">
          <div className="mb-8 flex justify-center dark:text-white">
            <Badge
              variant="secondary"
              className="rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm shadow-sm backdrop-blur"
            >
              <Globe className="mr-2 h-3.5 w-3.5 text-primary" />
              <span>Live network deployments</span>
            </Badge>
          </div>

          <h1 className="text-balance text-5xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
            ELIXIR
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent font-extrabold">
                On-Cloud Services.
              </span>
              <span className="absolute bottom-2 left-0 -z-0 h-3 w-full rounded-full bg-primary/10 blur-sm" />
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Explore live production services, service registries, and node
            deployments powering the global GA4GH ecosystem.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="group h-12 rounded-full px-7 text-base shadow-lg shadow-primary/25"
            >
              Browse live services
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="mx-auto dark:text-white max-w-7xl px-6 pb-28 lg:px-8">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-primary" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Network Deployments
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Active services &
              <br />
              <span className="text-muted-foreground">
                demonstrator endpoints.
              </span>
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              Interact directly with deployed registries, node demonstrators,
              and standardized APIs across the infrastructure.
            </p>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ service }: { service: any }) {
  return (
    <Card className="group dark:text-white relative bg-white/6 backdrop-blur-[2px] backdrop-saturate-[109%] flex h-full flex-col overflow-hidden rounded-[1.75rem] border-border/60 bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
      <CardContent className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Header / Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {service.standards?.map((standard: string) => (
              <Badge
                key={standard}
                variant="outline"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                {standard}
              </Badge>
            ))}
          </div>
          {service.status && (
            <Badge
              variant="secondary"
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                service.status === 'Live'
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : '',
              )}
            >
              {service.status}
            </Badge>
          )}
        </div>

        {/* Title & Tagline */}
        <div className="mt-5">
          <h3 className="text-2xl font-bold tracking-tight transition-colors duration-300 group-hover:text-primary">
            {service.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-primary">
            {service.tagline}
          </p>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {service.blurb ||
            service.description ||
            'No description available yet.'}
        </p>

        {/* Features list */}
        {service.features?.length > 0 && (
          <div className="mt-6 space-y-2.5">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Key Capabilities
            </p>
            {service.features.map((feature: string) => (
              <div key={feature} className="flex items-start gap-2.5 text-sm">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="leading-5 text-muted-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Nodes / Audience if available */}
        {service.nodes?.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Nodes:
            </span>
            {service.nodes.map((node: string) => (
              <Badge
                key={node}
                variant="secondary"
                className="rounded-md px-2 py-0.5 text-xs"
              >
                {node}
              </Badge>
            ))}
          </div>
        )}

        {/* Tags */}
        {service.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {service.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        <Separator className="my-6" />

        {/* Owners details */}
        {service.owners && service.owners.length > 0 && (
          <div className="flex flex-col gap-3">
            {service.owners.map((owner: any) => (
              <div key={owner.name} className="flex items-center gap-3">
                {owner.image ? (
                  <Image
                    src={owner.image}
                    alt={owner.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {owner.name.charAt(0)}
                  </div>
                )}
                <div className="text-xs">
                  <p className="font-medium">{owner.name}</p>
                  {owner.email && (
                    <a
                      href={`mailto:${owner.email}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {owner.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="px-6 pb-6 pt-0 flex flex-wrap gap-3">
        {service.deploymentUrl && (
          <Button className="flex-1 rounded-xl text-sm font-medium" asChild>
            <a
              href={service.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="mr-2 h-4 w-4" />
              Visit Service
            </a>
          </Button>
        )}
        {service.repoUrl && (
          <Button
            variant="outline"
            className="flex-1 rounded-xl text-sm font-medium"
            asChild
          >
            <a href={service.repoUrl} target="_blank" rel="noopener noreferrer">
              <FaGithub className="mr-2 h-4 w-4" />
              Repository
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
