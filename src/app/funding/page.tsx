'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Award,
  Calendar,
  HeartHandshake,
  Search,
  Users,
  X,
} from 'lucide-react';

import { FilterChips } from '@/components/catalog/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { checkFilterIds, filterId, matchesAny } from '@/lib/filters';
import {
  ELIXIR,
  type Grant,
  grants,
  grantType,
  GSOC,
  PROGRAMMES,
} from '@/lib/funding';
import { useUrlFilters } from '@/lib/use-url-filters';
import { cn } from '@/lib/utils';

// The logo of each programme (`category`)
const LOGOS = Object.fromEntries(
  PROGRAMMES.map(({ name, logo }) => [name, logo]),
);

// One filter per programme, in the order of PROGRAMMES
const categoryOptions = checkFilterIds(
  PROGRAMMES.map(({ name }) => ({
    value: filterId(name),
    label: name,
    count: grants.filter((grant) => grant.category === name).length,
  })),
);
const categoryIds = categoryOptions.map((option) => option.value);

export default function FundingPage() {
  const [query, setQuery] = useState('');
  const { selected, toggle, clear } = useUrlFilters(categoryIds);

  // Filter logic
  const filteredGrants = useMemo(() => {
    const q = query.trim().toLowerCase();

    return grants.filter((item) => {
      const matchesSearch =
        !q ||
        item.project.toLowerCase().includes(q) ||
        item.funder.toLowerCase().includes(q) ||
        item.recipients.some((r) => r.toLowerCase().includes(q));

      return matchesSearch && matchesAny(selected, [filterId(item.category)]);
    });
  }, [query, selected]);

  // Stat metrics
  const gsocCount = grants.filter((g) => g.category === GSOC).length;
  const elixirCount = grants.filter((g) => g.category === ELIXIR).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Dynamic Background Pattern */}
      <AnimatedGridPattern
        className={cn(
          '[mask-image:radial-gradient(520px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
        )}
        duration={3}
        maxOpacity={0.4}
        numSquares={30}
        repeatDelay={1}
      />

      {/* Hero Header */}
      <section className="relative border-b">
        <div className="mx-auto mt-24 max-w-7xl rounded-[16px] border border-border bg-card/85 px-6 pb-14 pt-20 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              className="mb-5 rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm"
              variant="secondary"
            >
              <HeartHandshake className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Sponsors & Grants
            </Badge>

            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              Gratitude to our
              <span className="ml-2 bg-gradient-to-r from-red-500 via-emerald-500 to-amber-400 bg-clip-text font-extrabold text-transparent">
                funders.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              We are immensely grateful to the organizations and grant programs
              that empower our research, software ecosystem, and open-source
              contributors.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 divide-x rounded-2xl border bg-card/70 p-1 shadow-sm">
            <Stat label="Total grants" value={grants.length} />
            <Stat label="ELIXIR grants" value={elixirCount} />
            <Stat label="GSoC projects" value={gsocCount} />
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Controls Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Supported Initiatives
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {filteredGrants.length} of {grants.length} project grants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 rounded-xl pl-9 pr-9"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search project, recipient, or funder..."
                value={query}
              />
              {query && (
                <button
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  onClick={() => setQuery('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category filters */}
            <FilterChips
              onClear={clear}
              onToggle={toggle}
              options={categoryOptions}
              selected={selected}
            />
          </div>
        </div>

        {/* Funding Cards Grid */}
        {filteredGrants.length > 0 ? (
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGrants.map((item) => (
              <FundingCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/20 px-6 text-center">
            <div className="mb-4 rounded-2xl border bg-card p-4 shadow-sm">
              <Award className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">
              No grants matching criteria
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search query or selecting a different category.
            </p>
            <Button
              className="mt-5 rounded-xl"
              onClick={() => {
                setQuery('');
                clear();
              }}
              variant="outline"
            >
              Reset filters
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

/* Helper Components */

function FundingCard({ item }: { item: Grant }) {
  const logo = LOGOS[item.category];
  const type = grantType(item);

  return (
    <Card
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
      role="article"
    >
      {/* Background Hover Effect */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

      <div className="relative flex-1 space-y-4">
        {/* Programme: logo, title and detailed grant type. The logo tile
            stays white, as the logos are made for light backgrounds. */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-white p-1.5">
            {logo && (
              <Image
                alt={`${item.category} logo`}
                className="h-full w-full object-contain"
                height={24}
                src={logo}
                width={24}
              />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {item.category}
            </h4>
            {type && (
              <p
                className="mt-0.5 text-xs text-muted-foreground"
                data-testid="grant-type"
              >
                {type}
              </p>
            )}
          </div>
        </div>

        {/* Project Title */}
        <div>
          <h3 className="text-base font-semibold text-card-foreground line-clamp-2 leading-snug">
            {item.project}
          </h3>
        </div>
      </div>

      {/* Meta Footer Details */}
      <div className="relative mt-5 space-y-2 border-t border-border/50 pt-3">
        {/* Recipients */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
          <span className="truncate font-medium text-foreground">
            {item.recipients.join(', ')}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
          <span className="truncate">{item.formattedDuration}</span>
        </div>
      </div>
    </Card>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="px-3 py-4 text-center sm:px-6" data-testid="stat">
      <div className="text-xl font-bold tracking-tight sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
        {label}
      </div>
    </div>
  );
}
