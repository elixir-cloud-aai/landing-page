'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  X,
  Award,
  Calendar,
  Users,
  Building2,
  Sparkles,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';

import fundingData from '@/data/funding.json';

type FundingItem = {
  id: string;
  funder: string;
  project: string;
  recipients: string[];
  startDate: string;
  endDate: string;
  formattedDuration: string;
  category: string;
};

const grants = fundingData as FundingItem[];

export default function FundingPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Dynamic list of categories
  const categories = useMemo(() => {
    const set = new Set(grants.map((g) => g.category));
    return ['all', ...Array.from(set)];
  }, []);

  // Filter logic
  const filteredGrants = useMemo(() => {
    const q = query.trim().toLowerCase();

    return grants.filter((item) => {
      const matchesSearch =
        !q ||
        item.project.toLowerCase().includes(q) ||
        item.funder.toLowerCase().includes(q) ||
        item.recipients.some((r) => r.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [query, selectedCategory]);

  // Stat metrics
  const gsocCount = grants.filter((g) =>
    g.funder.includes('Google Summer of Code'),
  ).length;
  const elixirCount = grants.filter((g) => g.funder.includes('ELIXIR')).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Dynamic Background Pattern */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.4}
        duration={3}
        repeatDelay={1}
        className={cn(
          '[mask-image:radial-gradient(520px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
        )}
      />

      {/* Hero Header */}
      <section className="relative border-b">
        <div className="mx-auto mt-24 max-w-7xl rounded-[16px] border border-white/20 bg-white/5 px-6 pb-14 pt-20 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] backdrop-blur-[2px] backdrop-saturate-[109%] lg:px-8 lg:pb-20 ">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-5 rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm"
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
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 divide-x rounded-2xl border bg-card/70 p-1 shadow-sm backdrop-blur">
            <Stat value={grants.length} label="Total Grants" />
            <Stat value={gsocCount} label="GSoC Projects" />
            <Stat value={elixirCount} label="ELIXIR Grants" />
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search project, recipient, or funder..."
                className="h-10 rounded-xl pl-9 pr-9"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 rounded-xl border bg-muted/40 p-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'All Grants' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Funding Cards Grid */}
        {filteredGrants.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGrants.map((item) => (
              <FundingCard key={item.id} item={item} />
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
              variant="outline"
              className="mt-5 rounded-xl"
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
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

function FundingCard({ item }: { item: FundingItem }) {
  const isGSoC = item.funder.includes('Google Summer of Code');

  return (
    <Card className="group relative bg-white/6 backdrop-blur-[2px] backdrop-saturate-[109%]  flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      {/* Background Hover Effect */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

      <div className="relative flex-1 space-y-4">
        {/* Funder Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/50 text-primary">
              {isGSoC ? (
                <Sparkles className="h-4 w-4 text-amber-500" />
              ) : (
                <Building2 className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.funder}
              </h4>
            </div>
          </div>

          <Badge
            variant="secondary"
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
              isGSoC
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            }`}
          >
            {isGSoC ? 'GSoC' : 'Grant'}
          </Badge>
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
    <div className="px-3 py-4 text-center sm:px-6">
      <div className="text-xl font-bold tracking-tight sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
        {label}
      </div>
    </div>
  );
}
