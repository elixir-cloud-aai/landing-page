import { ReactNode } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { FEEDBACK_URL } from '@/lib/site';

interface PageHeroProps {
  eyebrow: string;
  icon: ReactNode;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
  stats: { value: string | number; label: string }[];
}

export function PageHero({
  eyebrow,
  icon,
  title,
  description,
  actions,
  stats,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Animation is confined to the hero so the catalog below stays cheap to scroll. */}
      <AnimatedGridPattern
        numSquares={14}
        maxOpacity={0.35}
        duration={3}
        repeatDelay={1}
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="text-primary">{icon}</span>
            {eyebrow}
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
          {actions && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {actions}
            </div>
          )}
        </div>

        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 overflow-hidden rounded-2xl border bg-card shadow-sm sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={
                'flex flex-col-reverse px-4 py-5 text-center ' +
                (index % 2 === 1 ? 'border-l ' : '') +
                (index >= 2 ? 'border-t sm:border-t-0 ' : '') +
                (index === 2 ? 'sm:border-l' : '')
              }
            >
              <dt className="mt-1 text-xs text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="text-2xl font-bold tracking-tight">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function FeedbackCallout({ subject }: { subject: string }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
      <div className="flex flex-col items-start gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-lg font-semibold">
            Missing a {subject}, or spotted an error?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This catalog is maintained by the community. Tell us what to add or
            fix.
          </p>
        </div>
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Give feedback
        </a>
      </div>
    </section>
  );
}
