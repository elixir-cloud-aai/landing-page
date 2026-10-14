import productsData from '@/data/product.json';

import {
  ArrowRight,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { FaGithub } from 'react-icons/fa6';
import Image from 'next/image';

const products = productsData.products;

export default function Home() {
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
              <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
              <span>Built for infrastructure teams</span>
            </Badge>
          </div>

          <h1 className="text-balance text-5xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
            Infrastructure for
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-red-600 via-yellow-500 to-blue-500 bg-clip-text text-transparent font-extrabold">
                federated compute.
              </span>
              <span className="absolute bottom-2 left-0 -z-0 h-3 w-full rounded-full bg-primary/10 blur-sm" />
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Open-source services and developer tools for deploying, connecting,
            and building against GA4GH cloud infrastructure.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="group h-12 rounded-full px-7 text-base shadow-lg shadow-primary/25"
            >
              Explore products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto dark:text-white max-w-6xl px-6 pb-28 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-card/40 p-2 shadow-sm backdrop-blur-xl">
          <div className="grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
            <Stat
              icon={<Sparkles />}
              value={`${products.length}`}
              label="Open-source products"
            />
            <Stat icon={<Star />} value="GA4GH" label="Standards aligned" />
            <Stat
              icon={<Download />}
              value="K8s"
              label="Cloud-native tooling"
            />
            <Stat
              icon={<ShieldCheck />}
              value="OSS"
              label="Open-source ecosystem"
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="mx-auto dark:text-white max-w-7xl px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-primary" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Explore
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Tools for
              <br />
              <span className="text-muted-foreground">
                modern research infrastructure.
              </span>
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              Explore services and developer tools built to help administrators
              deploy infrastructure and developers build applications against
              federated life-science compute environments.
            </p>
          </div>
        </div>

        <div className="grid gap-7 pb-28 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="group dark:text-white relative bg-white/6 backdrop-blur-[2px] backdrop-saturate-[109%] flex h-full flex-col overflow-hidden rounded-[1.75rem] border-border/60 bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
      <CardContent className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Header / Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {product.standards?.map((standard: string) => (
              <Badge
                key={standard}
                variant="outline"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                {standard}
              </Badge>
            ))}
          </div>
          {product.license && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-normal"
            >
              {product.license}
            </Badge>
          )}
        </div>

        {/* Title & Tagline */}
        <div className="mt-5">
          <h3 className="text-2xl font-bold tracking-tight transition-colors duration-300 group-hover:text-primary">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-primary">
            {product.tagline}
          </p>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {product.blurb || product.description}
        </p>

        {/* Features list */}
        {product.features?.length > 0 && (
          <div className="mt-6 space-y-2.5">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Key Features
            </p>
            {product.features.slice(0, 3).map((feature: string) => (
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

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {product.tags.map((tag: string) => (
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

        {/* Owner details */}
        {product.owner && (
          <div className="flex items-center gap-3">
            {product.owner.image ? (
              <Image
                src={product.owner.image}
                alt={product.owner.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {product.owner.name.charAt(0)}
              </div>
            )}
            <div className="text-xs">
              <p className="font-medium">{product.owner.name}</p>
              {product.owner.email && (
                <a
                  href={`mailto:${product.owner.email}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {product.owner.email}
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="px-6 pb-6 pt-0 flex flex-wrap gap-3">
        {product.repoUrl && (
          <Button
            variant="outline"
            className="flex-1 rounded-xl text-sm font-medium"
            asChild
          >
            <a href={product.repoUrl} target="_blank" rel="noopener noreferrer">
              <FaGithub className="mr-2 h-4 w-4" />
              Repository
            </a>
          </Button>
        )}
        {product.docsUrl && (
          <Button
            variant="ghost"
            className="flex-1 rounded-xl text-sm font-medium"
            asChild
          >
            <a href={product.docsUrl} target="_blank" rel="noopener noreferrer">
              Documentation
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex dark:text-white flex-col items-center justify-center px-4 py-7 text-center">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <div className="h-4 w-4">{icon}</div>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
    </div>
  );
}
