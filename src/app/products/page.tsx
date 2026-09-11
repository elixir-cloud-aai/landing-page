import products from '@/data/product.json';

import {
  ArrowRight,
  Check,
  CircleCheck,
  Download,
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
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      {/* <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-350px] h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <div className="absolute right-[-200px] top-[500px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[140px]" />

        <div className="absolute bottom-[-250px] left-[-200px] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[140px]" />

        
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div> */}

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        <div className="mx-auto max-w-4xl py-9 text-center bg-white/6 backdrop-blur-[2px] backdrop-saturate-[109%] border border-white/20 rounded-[16px] shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] dark:text-white">
          {/* Announcement */}

          <div className="mb-8 flex  justify-center dark:text-white">
            <Badge
              variant="secondary"
              className="rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm shadow-sm backdrop-blur"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />

              <span>Resources built for the future</span>
            </Badge>
          </div>

          {/* Heading */}

          <h1 className="text-balance text-5xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
            Learn faster.
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-red-600 via-yellow-500 to-blue-500 bg-clip-text text-transparent font-extrabold ">
                Build smarter.
              </span>

              <span className="absolute bottom-2 left-0 -z-0 h-3 w-full rounded-full bg-primary/10 blur-sm" />
            </span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum,
            doloremque cum ex dolorem enim ipsum dolore amet magnam nobis eius
            minus labore tempore. Atque cum corporis dolorum quaerat quos.
          </p>

          {/* CTA */}

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="group h-12 rounded-full px-7 text-base shadow-lg shadow-primary/20"
            >
              Explore
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="ghost"
              className="h-12 rounded-full px-7 text-base"
            >
              See what's inside
            </Button>
          </div>

          {/* Social proof */}

          {/* <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-primary" />

              <span>Instant access</span>
            </div>

            <div className="hidden h-4 w-px bg-border sm:block" />

            <div className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-primary" />

              <span>Lifetime access</span>
            </div>

            <div className="hidden h-4 w-px bg-border sm:block" />

            <div className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-primary" />

              <span>One-time payment</span>
            </div>
          </div> */}
        </div>

        {/* Floating decorative cards */}

        <div className="pointer-events-none absolute left-[5%] top-[35%] hidden -rotate-6 rounded-2xl border bg-background/40 p-4 shadow-xl backdrop-blur-xl xl:block">
          <Zap className="h-5 w-5 text-primary" />
        </div>

        <div className="pointer-events-none absolute right-[6%] top-[28%] hidden rotate-6 rounded-2xl border bg-background/40 p-4 shadow-xl backdrop-blur-xl xl:block">
          <Sparkles className="h-5 w-5 text-purple-500" />
        </div>
      </section>

      {/* =====================================================
          TRUST STRIP
      ===================================================== */}

      <section className="mx-auto dark:text-white max-w-6xl px-6 pb-28 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-card/40 p-2 shadow-sm backdrop-blur-xl">
          <div className="grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
            <Stat icon={<Sparkles />} value="100+" label="Digital resources" />

            <Stat icon={<Star />} value="4.8/5" label="Average rating" />

            <Stat
              icon={<Download />}
              value="Instant"
              label="Digital delivery"
            />

            <Stat
              icon={<ShieldCheck />}
              value="Forever"
              label="Lifetime access"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS HEADER
      ===================================================== */}

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
              Resources worth
              <br />
              <span className="text-muted-foreground">your attention.</span>
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              error blanditiis ab enim fugit assumenda excepturi ad at
              provident.
            </p>
          </div>

          <Button
            variant="outline"
            className="group h-11 w-fit rounded-full px-5"
          >
            Browse everything
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* =====================================================
            PRODUCTS GRID
        ===================================================== */}

        <div className="grid gap-7 pb-28 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              featured={index === 0}
            />
          ))}
        </div>
      </section>

      {/* =====================================================
          WHY SECTION
      ===================================================== */}

      <section className="border-y dark:text-white bg-muted/30 ">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 ">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:items-start">
            <div>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Why these resources?
              </Badge>

              <h2 className="mt-6 text-4xl font-bold tracking-tight">
                Lorem Epsum.
                <br />
                More useful stuff.
              </h2>

              <p className="mt-5 max-w-md leading-7 text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Cupiditate eaque rem aliquam, fuga eveniet dolorem.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FeatureCard
                icon={<Zap />}
                title="Practical"
                description="lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
              />

              <FeatureCard
                icon={<Sparkles />}
                title="Focused"
                description="lorem ipsum dolor sit amet consectetur adipisicing."
              />

              <FeatureCard
                icon={<Download />}
                title="Instant access"
                description="lorem ipsum dolor sit amet."
              />

              <FeatureCard
                icon={<ShieldCheck />}
                title="Yours forever"
                description="lorem ipsum dolor sit amet consectetur."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="mx-auto dark:text-white max-w-7xl px-6 py-12 lg:px-8">
        <div className="relative overflow-hidden bg-white/6 backdrop-blur-[2px] backdrop-saturate-[109%] border border-white/20 rounded-[16px] shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] bg-card px-6 py-20 text-center sm:px-12">
          {/* Glow */}

          <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Start exploring
            </Badge>

            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Your next idea
              <br />
              starts here.
            </h2>

            <p className="mx-auto mt-5 max-w-lg leading-7 text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
              omnis nam velit vitae?
            </p>

            <Button size="lg" className="group mt-8 h-12 rounded-full px-7">
              Explore products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  featured,
}: {
  product: any;
  featured?: boolean;
}) {
  const discounted =
    product.price.originalPrice &&
    product.price.originalPrice > product.price.amount;

  const currency = product.price.currency === 'INR' ? '₹' : '$';

  return (
    <Card className="group dark:text-white relative bg-white/6 backdrop-blur-[2px] backdrop-saturate-[109%] flex h-full flex-col overflow-hidden rounded-[1.75rem] border-border/60 bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
      {/* Featured glow */}

      {featured && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent" />
      )}

      {/* Image */}

      <div className="relative m-3 aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Badge */}

        {product.badge && (
          <Badge className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-white shadow-lg backdrop-blur-md hover:bg-black/50">
            <Sparkles className="mr-1.5 h-3 w-3" />

            {product.badge}
          </Badge>
        )}

        {/* Rating */}

        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />

          <span>{product.rating}</span>

          <span className="text-white/60">({product.reviewCount})</span>
        </div>
      </div>

      {/* Content */}

      <CardContent className="flex flex-1 flex-col px-6 pb-6 pt-3">
        {/* Meta */}

        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-[11px] font-medium"
          >
            {product.category}
          </Badge>

          {product.digital && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Instant access
            </div>
          )}
        </div>

        {/* Title */}

        <h3 className="mt-5 text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-primary">
          {product.name}
        </h3>

        {/* Description */}

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {product.shortDescription || product.description}
        </p>

        {/* Features */}

        {product.features?.length > 0 && (
          <div className="mt-6 space-y-3">
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

        {/* Spacer */}

        <div className="flex-1" />

        <Separator className="my-6" />

        {/* Price */}

        {/* <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">
              {product.price.startingFrom
                ? "Starting from"
                : "One-time purchase"}
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">
                {currency}
                {product.price.amount}
              </span>

              {discounted && (
                <del className="text-sm text-muted-foreground">
                  {currency}
                  {product.price.originalPrice}
                </del>
              )}
            </div>
          </div>

          {product.price.discount && (
            <Badge
              variant="secondary"
              className="mb-1 rounded-full px-3 py-1"
            >
              Save {product.price.discount}%
            </Badge>
          )}
        </div> */}
      </CardContent>

      {/* Footer */}

      <CardFooter className="px-6 pb-6 pt-0">
        <Button className="group/button h-12 w-full rounded-xl text-sm font-medium">
          {product.cta?.primary || 'Explore product'}

          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}

/* =========================================================
   STAT
========================================================= */

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

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl dark:text-white  bg-white/6 backdrop-blur-[2px] backdrop-saturate-[109%] border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <div className="h-5 w-5">{icon}</div>
      </div>

      <h3 className="mt-5 font-semibold tracking-tight">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
