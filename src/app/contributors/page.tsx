'use client';

import { useEffect, useMemo, useState } from 'react';
import { Mail, ArrowUpRight, Sparkles, GitBranch } from 'lucide-react';
import { Search, X, Users, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import contributors from '@/data/contributor.json';
import { FaLinkedin } from 'react-icons/fa6';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { cn } from 'cn';
import { Globe3D, GlobeMarker } from '@/components/ui/3d-globe';
import Image from 'next/image';

type Contributor = {
  name: string;
  image?: string;
  roles?: string[];
  email?: string;
  github?: string;
  linkedin?: string;
};

const people = contributors as Contributor[];

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function isGSoC(roles: string[] = []) {
  return roles.some((role) => role.toLowerCase().includes('gsoc'));
}

const contributorMarkers: GlobeMarker[] = contributors
  .filter(
    (
      contributor,
    ): contributor is typeof contributor & {
      lat: number;
      lng: number;
      image: string;
    } =>
      contributor.lat !== null &&
      contributor.lng !== null &&
      !!contributor.image,
  )
  .map((contributor) => ({
    lat: contributor.lat,
    lng: contributor.lng,
    src: contributor.image,
    label: contributor.name,
  }));

export default function ContributorsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'oss' | 'gsoc'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return people.filter((person) => {
      const matchesSearch =
        !q ||
        person.name.toLowerCase().includes(q) ||
        person.roles?.some((role) => role.toLowerCase().includes(q));

      const matchesFilter =
        filter === 'all' ||
        (filter === 'oss' &&
          person.roles?.some((role) =>
            role.toLowerCase().includes('oss contributor'),
          )) ||
        (filter === 'gsoc' && isGSoC(person.roles));

      return matchesSearch && matchesFilter;
    });
  }, [query, filter]);
  const [highlightedContributor, setHighlightedContributor] = useState<
    string | null
  >(null);
  const gsocCount = people.filter((person) => isGSoC(person.roles)).length;
  const ossCount = people.filter((person) =>
    person.roles?.some((role) =>
      role.toLowerCase().includes('oss contributor'),
    ),
  ).length;
  const INITIAL_COUNT = 20;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Reset visible count when query or filter changes
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [query, filter]);

  // Paginated slice
  const visibleContributors = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  return (
    <main className="min-h-screen overflow-hidden bg-background dark:text-white">
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
      {/* Ambient background */}
      {/* <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-12rem] top-[35%] h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-[-15rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-violet-500/10 blur-3xl" />
      </div> */}

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            {/* LEFT — Content */}
            <div className="relative z-10 max-w-xl">
              {/* Badge */}
              <Badge
                variant="secondary"
                className="mb-6 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Open source community
              </Badge>

              {/* Heading */}
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Meet the people
                <span className="mt-1 block bg-gradient-to-r from-red-500 via-green-500 to-yellow-300 bg-clip-text font-extrabold text-transparent">
                  behind the work.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Developers, researchers, and open-source contributors working
                together across the world to build, maintain, and advance the
                ecosystem.
              </p>

              {/* Stats */}
              <div className="mt-10 grid max-w-lg grid-cols-3 overflow-hidden rounded-2xl border border-white/15 bg-card/60 shadow-sm backdrop-blur">
                <div className="px-4 py-5">
                  <Stat value={people.length} label="Contributors" />
                </div>

                <div className="border-l border-white/10 px-4 py-5">
                  <Stat value={ossCount} label="OSS contributors" />
                </div>

                <div className="border-l border-white/10 px-4 py-5">
                  <Stat value={gsocCount} label="GSoC contributors" />
                </div>
              </div>

              {/* <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-px w-8 bg-border" />
                <span>Contributors from around the world</span>
              </div> */}
            </div>

            {/* RIGHT — Globe */}
            <div className="relative flex h-[480px] items-center justify-center lg:h-[620px]">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.08] blur-[100px]" />

              {/* Globe */}
              <div className="relative z-10 h-full w-full">
                <Globe3D
                  markers={contributorMarkers}
                  config={{
                    atmosphereColor: '#4da6ff',
                    atmosphereIntensity: 20,
                    bumpScale: 5,
                    autoRotateSpeed: 0.3,
                  }}
                  onMarkerClick={(marker) => {
                    const contributor = people.find(
                      (person) => person.name === marker.label,
                    );

                    if (!contributor) {
                      console.log('Contributor not found:', marker.label);
                      return;
                    }

                    console.log('Clicked contributor:', contributor.name);

                    setQuery('');
                    setFilter('all');

                    const contributorIndex = people.findIndex(
                      (person) => person.name === contributor.name,
                    );

                    setVisibleCount(
                      Math.max(INITIAL_COUNT, contributorIndex + 1),
                    );

                    setHighlightedContributor(contributor.name);

                    const elementId = `contributor-${encodeURIComponent(
                      contributor.name,
                    )}`;

                    setTimeout(() => {
                      const element = document.getElementById(elementId);

                      console.log('Scrolling to:', elementId);
                      console.log('Element:', element);

                      if (element) {
                        element.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        });
                      }
                    }, 100);

                    setTimeout(() => {
                      setHighlightedContributor(null);
                    }, 2500);
                  }}
                  onMarkerHover={(marker) => {
                    if (marker) {
                      console.log('Hovering:', marker.label);
                    }
                  }}
                />
              </div>

              <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Header & Controls */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Contributors
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {Math.min(visibleCount, filtered.length)} of{' '}
              {filtered.length} {filtered.length === 1 ? 'person' : 'people'}{' '}
              matching your search.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search contributors..."
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

            {/* Filter Tabs */}
            <div className="flex rounded-xl border bg-muted/40 p-1">
              <FilterButton
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All
              </FilterButton>
              <FilterButton
                active={filter === 'oss'}
                onClick={() => setFilter('oss')}
              >
                OSS
              </FilterButton>
              <FilterButton
                active={filter === 'gsoc'}
                onClick={() => setFilter('gsoc')}
              >
                GSoC
              </FilterButton>
            </div>

            {/* View Toggle (Grid / List) */}
            <div className="flex rounded-xl border bg-muted/40 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Directory Content */}
        {filtered.length > 0 ? (
          <div className="space-y-8">
            {/* Grid or List Layout */}
            {viewMode === 'grid' ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleContributors.map((person) => (
                  <div
                    key={person.name}
                    id={`contributor-${encodeURIComponent(person.name)}`}
                  >
                    <ContributorCard
                      person={person}
                      highlighted={highlightedContributor === person.name}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visibleContributors.map((person) => (
                  <div
                    key={person.name}
                    id={`contributor-${encodeURIComponent(person.name)}`}
                  >
                    <ContributorListItem
                      person={person}
                      highlighted={highlightedContributor === person.name}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setVisibleCount((prev) => prev + 20)}
                  variant="outline"
                  size="lg"
                  className="group rounded-full border-border/80 px-8 font-medium hover:border-primary/50 hover:bg-muted/50"
                >
                  Load more contributors
                  <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/20 px-6 text-center">
            <div className="mb-4 rounded-2xl border bg-card p-4 shadow-sm">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No contributors found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try a different name, role, or filter.
            </p>
            <Button
              variant="outline"
              className="mt-5 rounded-xl"
              onClick={() => {
                setQuery('');
                setFilter('all');
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
function ContributorListItem({
  person,
  highlighted = false,
}: {
  person: Contributor;
  highlighted?: boolean;
}) {
  const roles = person.roles || [];

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between gap-4 rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center',
        highlighted &&
          'border-primary ring-2 ring-primary/60 bg-primary/[0.06]',
      )}
    >
      {/* Left section: Avatar & Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative shrink-0">
          <div className="h-11 w-11 overflow-hidden rounded-lg border bg-muted shadow-sm">
            {person.image ? (
              <img
                src={person.image}
                alt={person.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xs font-bold text-primary">
                {initials(person.name)}
              </div>
            )}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-card-foreground">
              {person.name}
            </h3>
            {isGSoC(roles) && (
              <Badge
                variant="secondary"
                className="rounded-full bg-primary/10 px-2 py-0 text-[10px] font-medium text-primary"
              >
                GSoC
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            Open source contributor
          </p>
        </div>
      </div>

      {/* Middle section: Roles / Skills */}
      <div className="flex flex-wrap items-center gap-1.5 sm:justify-center">
        {roles.slice(0, 3).map((role) => (
          <Badge
            key={role}
            variant="outline"
            className="rounded-md border-border/60 bg-muted/30 px-2 py-0.5 text-xs font-normal text-muted-foreground"
          >
            {role}
          </Badge>
        ))}
        {roles.length > 3 && (
          <Badge
            variant="outline"
            className="rounded-md border-border/60 bg-muted/20 px-2 py-0.5 text-xs font-normal text-muted-foreground"
          >
            +{roles.length - 3}
          </Badge>
        )}
      </div>

      {/* Right section: Links & Profile */}
      <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-3 sm:border-0 sm:pt-0">
        <div className="flex items-center gap-0.5">
          {person.github && (
            <IconButton href={person.github} label="GitHub">
              <GitBranch className="h-4 w-4" />
            </IconButton>
          )}
          {person.linkedin && (
            <IconButton href={person.linkedin} label="LinkedIn">
              <FaLinkedin className="h-4 w-4" />
            </IconButton>
          )}
          {person.email && (
            <IconButton href={`mailto:${person.email}`} label="Email">
              <Mail className="h-4 w-4" />
            </IconButton>
          )}
        </div>

        {person.github ? (
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="h-8 gap-1 rounded-md px-2.5 text-xs font-medium hover:bg-primary hover:text-primary-foreground"
          >
            <a href={person.github} target="_blank" rel="noreferrer">
              Profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground/60">Contributor</span>
        )}
      </div>
    </div>
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

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function ContributorCard({
  person,
  highlighted = false,
}: {
  person: Contributor;
  highlighted?: boolean;
}) {
  const roles = person.roles ?? [];

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border p-6',
        'bg-gradient-to-b from-white/10 via-white/5 to-white/[0.02] backdrop-blur-xl border-white/15 dark:from-card/80 dark:to-card/40',
        'transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20',
        highlighted && [
          'border-primary ring-2 ring-primary/60 shadow-[0_0_40px_rgba(59,130,246,0.35)] bg-primary/[0.08]',
        ],
      )}
    >
      {/* Top accent line & ambient glow */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />

      <div className="relative z-10 space-y-5">
        {/* Header: Avatar, Name, and GSoC Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:border-primary/50">
                {person.image ? (
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/15 text-base font-bold text-primary">
                    {initials(person.name)}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-emerald-500 shadow-sm" />
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                {person.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                <p className="text-xs font-medium text-muted-foreground">
                  Open Source Contributor
                </p>
              </div>
            </div>
          </div>

          {isGSoC(roles) && (
            <Badge
              variant="secondary"
              className="shrink-0 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-xs font-bold text-primary border border-primary/30 shadow-sm flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              GSoC
            </Badge>
          )}
        </div>

        {/* Roles & Expertise Badges */}
        {roles.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Expertise & Focus
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                {roles.length} skills
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {roles.slice(0, 4).map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="rounded-lg border-white/10 bg-white/5 px-2.5 py-1 text-xs font-normal text-muted-foreground/90 backdrop-blur-sm transition-colors group-hover:border-primary/20"
                >
                  {role}
                </Badge>
              ))}
              {roles.length > 4 && (
                <Badge
                  variant="outline"
                  className="rounded-lg border-white/10 bg-white/5 px-2 py-1 text-xs font-normal text-muted-foreground/70"
                >
                  +{roles.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Area */}
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          {person.github && (
            <a
              href={person.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            >
              <GitBranch className="h-4 w-4" />
            </a>
          )}
          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            >
              <FaLinkedin className="h-4 w-4" />
            </a>
          )}
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              aria-label="Send Email"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>

        {person.github ? (
          <Button
            asChild
            size="sm"
            className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-md shadow-primary/20 bg-primary text-primary-foreground hover:opacity-90 transition-all"
          >
            <a
              href={person.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5"
            >
              View Profile
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Button>
        ) : (
          <span className="text-xs font-medium text-muted-foreground/60 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
            Contributor
          </span>
        )}
      </div>
    </Card>
  );
}

function IconButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="h-8 w-8 rounded-lg"
      title={label}
    >
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
        aria-label={`${label} link`}
      >
        {children}
      </a>
    </Button>
  );
}
