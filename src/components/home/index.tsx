'use client';
import { FC } from 'react';
import Link from 'next/link';
import { Zoom } from 'react-awesome-reveal';
import { AnimatedGridPattern } from '../ui/animated-grid-pattern';
import { cn } from '@/lib/utils';
import { MorphingText } from '../ui/morphing-text';
import Globe3D from '../ui/globe-lazy';
import { contributorMarkers } from '@/lib/contributor-markers';
import { DOCS_HUB_URL } from '@/lib/site';

const texts = [
  <span className="text-elixirred" key="findable">
    Findable
  </span>,
  <span className="text-elixirgreen" key="accessible">
    Accessible
  </span>,
  <span className="text-elixiryellow" key="interoperable">
    Interoperable
  </span>,
  <span className="text-elixirblue" key="reusable">
    Reusable
  </span>,
  <div className="flex" key="fair">
    <span className="text-elixirred">F</span>
    <span className="text-elixirgreen">A</span>
    <span className="text-elixiryellow">I</span>
    <span className="text-elixirblue">R</span>
  </div>,
];

// Defined once so the globe doesn't get a new config object on every render.
const globeConfig = {
  atmosphereColor: '#4da6ff',
  atmosphereIntensity: 20,
  bumpScale: 5,
  autoRotateSpeed: 0.3,
};

const Home: FC = () => {
  const renderTextLoop = () => (
    <MorphingText
      className="text-[clamp(2.7rem,8vw,6.5rem)] text-left font-semibold tracking-[-0.08em] md:h-28 lg:text-[7rem]"
      texts={texts}
    />
  );

  return (
    <div className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,rgba(61,169,246,0.09),transparent_35%),linear-gradient(180deg,#f8fbff_0%,#ffffff_34%,#f7fafc_100%)] font-pop dark:bg-[radial-gradient(circle_at_top,rgba(61,169,246,0.16),transparent_36%),linear-gradient(180deg,#020617_0%,#0f172a_44%,#111827_100%)] dark:text-white">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={3}
        repeatDelay={1}
        className={cn(
          '[mask-image:radial-gradient(520px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-transparent to-white/90 dark:from-slate-950/65 dark:to-slate-950/95" />

      <main className="relative mx-auto flex min-h-screen flex-col px-4 py-6 sm:px-6 md:px-10 md:py-10 lg:px-16">
        <section className="flex flex-1">
          <div className="grid w-full min-w-0 gap-12 p-5 sm:p-8 md:p-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:p-16 bg-card/85 border border-border rounded-[11px] dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.75)]">
            <Zoom triggerOnce>
              <div className="flex flex-col justify-center">
                <div className="inline-flex w-fit items-center rounded-full border border-elixirblue/20 bg-elixirblue/8 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-elixirblue shadow-sm dark:border-elixirblue/30 dark:bg-elixirblue/10">
                  ELIXIR On-Cloud
                </div>

                <div className="mt-8 space-y-6">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 sm:tracking-[0.35em] dark:text-slate-400">
                    FAIR data infrastructure for life sciences
                  </p>
                  <h1 className="max-w-4xl break-words text-[2.5rem] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-5xl sm:tracking-[-0.07em] text-slate-900 md:text-7xl lg:text-[5.8rem] dark:text-white">
                    Making Cloud Infrastructure for the Life Sciences
                    <span className="mt-5 block">{renderTextLoop()}</span>
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-600 md:text-lg dark:text-slate-300">
                    A coordinated federation of cloud services, identities, and
                    standards for secure, scalable analysis across ELIXIR nodes
                    and international research partners.
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    href="/services"
                  >
                    Explore services
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    href="/products"
                  >
                    Browse products
                  </Link>
                </div>
              </div>
            </Zoom>

            <Zoom triggerOnce>
              <div className="flex items-center justify-center">
                <div className="relative my-16 h-[700px] w-full max-w-lg overflow-hidden rounded-xl bg-white p-10 shadow-sm ring-1 shadow-black/10 ring-black/10 sm:my-24 sm:h-[300px] md:my-32 md:h-[400px] dark:bg-[#111827]">
                  <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                    All over the world
                  </h2>
                  <p className="max-w-lg text-balance text-neutral-600 dark:text-neutral-400">
                    Meet the{' '}
                    <Link
                      className="font-medium text-primary hover:underline"
                      href="/contributors"
                    >
                      contributors
                    </Link>{' '}
                    building ELIXIR On-Cloud across Europe and beyond.
                  </p>
                  <Globe3D
                    className="absolute -bottom-96 -left-0 h-[700px]"
                    markers={contributorMarkers}
                    config={globeConfig}
                  />
                </div>
              </div>
            </Zoom>
          </div>
        </section>

        <Zoom triggerOnce>
          <section className="pb-8 pt-12 md:pt-16">
            <div className="grid gap-8 rounded-2xl bg-card/85 border border-border p-6 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.75)] md:p-10 lg:grid-cols-[1.25fr_0.75fr] dark:border-white/10 dark:bg-slate-950/60">
              <div className="space-y-5">
                <p className="text-sm font-medium uppercase tracking-[0.32em] text-elixirblue">
                  Project focus
                </p>
                <h2 className="text-2xl font-medium tracking-[-0.04em] text-slate-900 md:text-3xl dark:text-white">
                  A coordinated network for federated cloud research
                </h2>
                <p className="max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
                  The ELIXIR Cloud and Authentication and Authorization
                  Infrastructure (AAI) project leverages ELIXIR Nodes to deliver
                  a GA4GH standards-compliant environment for population-scale
                  genomic and phenotypic analysis across international
                  boundaries.
                </p>
                <a
                  className="inline-flex w-fit items-center rounded-full text-sm font-medium text-elixirblue transition hover:underline"
                  href={DOCS_HUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more in the Documentation Hub
                </a>
              </div>

              <div className="grid gap-3 self-center text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/5">
                  Standards-first collaboration across nodes and projects.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/5">
                  Identity-aware access designed for trusted scientific teams.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/5">
                  Built to scale with interoperable infrastructure and reusable
                  services.
                </div>
              </div>
            </div>
          </section>
        </Zoom>
      </main>
    </div>
  );
};

export default Home;
