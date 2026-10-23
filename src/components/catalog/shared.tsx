import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Owner } from './types';

const monogramColors = [
  'bg-elixirblue/15 text-sky-700 dark:text-sky-300',
  'bg-elixirgreen/15 text-green-700 dark:text-green-300',
  'bg-elixiryellow/20 text-amber-700 dark:text-amber-300',
  'bg-elixirred/15 text-red-700 dark:text-red-300',
];

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1)
    h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Monogram({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold tracking-tight',
        monogramColors[hash(name) % monogramColors.length],
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}

export function OwnerChip({ owner }: { owner: Owner }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {owner.image ? (
        <Image
          src={owner.image}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
          {initials(owner.name)}
        </div>
      )}
      <div className="min-w-0 text-xs leading-tight">
        <p className="truncate font-medium text-foreground">{owner.name}</p>
        {owner.email ? (
          <a
            href={`mailto:${owner.email}`}
            className="truncate text-muted-foreground hover:text-primary"
          >
            {owner.email}
          </a>
        ) : (
          <p className="text-muted-foreground">Maintainer</p>
        )}
      </div>
    </div>
  );
}

export function StandardChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
      {label}
    </span>
  );
}

interface FilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string; count: number }[];
  selected: string;
  onSelect: (value: string) => void;
  resultCount: number;
  noun: string;
}

export function FilterBar({
  query,
  onQueryChange,
  placeholder,
  options,
  selected,
  onSelect,
  resultCount,
  noun,
}: FilterBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-sm">
          <span className="sr-only">Search {noun}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={placeholder}
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-9 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onQueryChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {resultCount} {resultCount === 1 ? noun.replace(/s$/, '') : noun}
        </p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected === option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              selected === option.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {option.label}
            <span
              className={cn(
                'rounded-full px-1.5 text-[10px]',
                selected === option.value ? 'bg-white/20' : 'bg-muted',
              )}
            >
              {option.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
      <p className="font-medium">Nothing matches your search.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 text-sm font-medium text-primary hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}

export function matchesQuery(
  query: string,
  fields: (string | null | undefined)[],
) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => field?.toLowerCase().includes(q));
}
