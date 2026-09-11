import projects from '@/data/project.json';

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Code2,
  ExternalLink,
  Layers3,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FaGithub } from 'react-icons/fa6';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { cn } from 'cn';
import { Terminal } from '@/components/ui/terminal';
import Image from 'next/image';

export default function ProjectsPage() {
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <main className="min-h-screen  overflow-hidden bg-background">
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
      {/* <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-350px] h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <div className="absolute right-[-250px] top-[40%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px]" />

        <div className="absolute bottom-[-250px] left-[-250px] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div> */}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {/* LEFT — Content */}
            <div className="fle  flex-col items-start">
              <div className="bg-white/6 backdrop-blur-[2px] backdrop-saturate-[109%]">
                <Badge
                  variant="secondary"
                  className="mb-7 rounded-full px-4 py-1.5"
                >
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  Selected work
                </Badge>

                <h1 className="max-w-2xl text-5xl font-bold tracking-[-0.045em] sm:text-6xl lg:text-7xl dark:text-white">
                  Ideas turned into{' '}
                  <span className="bg-gradient-to-r from-red-500 via-green-500 to-yellow-300 bg-clip-text font-extrabold text-transparent">
                    real products.
                  </span>
                </h1>

                <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg dark:text-white">
                  A collection of software, experiments, platforms, and digital
                  products I've designed, engineered, and shipped.
                </p>

                {/* Stats */}
                <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6 dark:text-white">
                  <div>
                    <div className="text-3xl font-bold tracking-tight">
                      {projects.length}+
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Projects shipped
                    </div>
                  </div>

                  <div className="h-10 w-px bg-border" />

                  <div>
                    <div className="text-3xl font-bold tracking-tight">
                      {
                        new Set(projects.flatMap((p) => p.technologies || []))
                          .size
                      }
                      +
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Technologies
                    </div>
                  </div>

                  <div className="h-10 w-px bg-border" />

                  <div>
                    <div className="text-3xl font-bold tracking-tight">
                      {new Set(projects.map((p) => p.category)).size}+
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Industries
                    </div>
                  </div>
                </div>

                {/* Small availability indicator */}
                <div className="mt-12 flex items-center gap-2 text-sm text-muted-foreground dark:text-white">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  Building & shipping new things
                </div>
              </div>
            </div>

            {/* RIGHT — Terminal */}
            <div className="relative lg:translate-y-2">
              {/* Very subtle glow behind terminal */}
              <div className="absolute -inset-8 -z-10 rounded-full bg-primary/[0.04] blur-3xl" />

              {/* <div className="relative overflow-hidden rounded-2xl border bg-card/70 shadow-2xl shadow-black/10 backdrop-blur"> */}

              <Terminal
                commands={[
                  'git clone github.com/elixir-cloud-aai/tes-dashboard',
                  'docker compose up --build -d',
                  'curl localhost:8000/api/health',
                  'curl localhost:8000/api/network_metrics',
                ]}
                outputs={{
                  0: [
                    "Cloning into 'tes-dashboard'...",
                    '✓ Repository cloned successfully.',
                  ],
                  1: [
                    '✓ Building frontend...',
                    '✓ Building Flask backend...',
                    '✓ Started 2 services.',
                  ],
                  2: ['{"status":"healthy"}', '✓ TES gateway is responding.'],
                  3: [
                    '✓ Federation metrics loaded.',
                    '✓ TES network is online.',
                  ],
                }}
                typingSpeed={45}
                delayBetweenCommands={1200}
              />
              {/* </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 dark:text-white">
          <SectionHeading
            eyebrow="Featured work"
            title="Projects worth exploring"
            description="A closer look at some of the products and systems I've worked on."
          />

          <div className="mt-10 space-y-8">
            {featuredProjects.map((project, index) => (
              <FeaturedProject
                key={project.id}
                project={project}
                reversed={index % 2 !== 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-8 dark:text-white">
          <SectionHeading
            eyebrow="More work"
            title="Other projects"
            description="More experiments, products and engineering work."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 dark:text-white  ">
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center sm:px-12">
          <div className="absolute left-1/2 top-0 -z-0 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <Badge variant="outline" className="rounded-full">
              <Zap className="mr-2 h-3.5 w-3.5" />
              Have an idea?
            </Badge>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Let's build something useful.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Have a product idea, business problem, or project in mind? Let's
              turn it into something people can actually use.
            </p>

            <Button size="lg" className="mt-8 rounded-full px-7">
              Start a conversation
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================================================= */
/* Featured Project                                 */
/* ================================================= */

function FeaturedProject({
  project,
  reversed,
}: {
  project: any;
  reversed: boolean;
}) {
  return (
    <Card className="group overflow-hidden rounded-3xl border-border/60 bg-card/70 shadow-sm backdrop-blur transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
      <div
        className={`grid lg:grid-cols-2 ${
          reversed ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        {/* Image */}
        <div className="relative min-h-[300px] overflow-hidden bg-muted lg:min-h-[480px]">
          <Image
            src={project.images.cover}
            alt={project.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <Badge className="rounded-full bg-background/90 text-foreground backdrop-blur hover:bg-background">
              {project.category}
            </Badge>

            <Badge
              variant="secondary"
              className="rounded-full bg-black/50 text-white backdrop-blur"
            >
              {project.status}
            </Badge>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex flex-wrap gap-2">
              {project.tags?.slice(0, 4).map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <div className="mb-5 flex items-center gap-2">
            {project.featured && (
              <Badge className="rounded-full">
                <Sparkles className="mr-1.5 h-3 w-3" />
                Featured
              </Badge>
            )}

            <span className="text-sm text-muted-foreground">
              {project.year}
            </span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {project.name}
          </h3>

          <p className="mt-4 leading-7 text-muted-foreground">
            {project.description}
          </p>

          {/* Meta */}
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Meta
              icon={<Code2 className="h-4 w-4" />}
              label="Role"
              value={project.role}
            />

            <Meta
              icon={<CalendarDays className="h-4 w-4" />}
              label="Duration"
              value={project.duration}
            />

            <Meta
              icon={<Users className="h-4 w-4" />}
              label="Team"
              value={project.team}
            />
          </div>

          <Separator className="my-7" />

          {/* Tech stack */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Built with
            </p>

            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((technology: string) => (
                <Badge
                  key={technology}
                  variant="outline"
                  className="rounded-lg px-3 py-1.5 font-normal"
                >
                  {technology}
                </Badge>
              ))}
            </div>
          </div>

          {/* Metrics */}
          {project.metrics?.length > 0 && (
            <div className="mt-7 grid grid-cols-3 gap-3">
              {project.metrics.slice(0, 3).map((metric: any) => (
                <div key={metric.label} className="rounded-xl bg-muted/50 p-3">
                  <p className="text-lg font-bold">{metric.value}</p>

                  <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="rounded-xl">
              {project.cta?.primary || 'View Project'}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>

            {project.links?.github && (
              <Button variant="outline" className="rounded-xl" asChild>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}

            {project.links?.live && (
              <Button variant="ghost" className="rounded-xl" asChild>
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live demo
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ================================================= */
/* Project Card                                     */
/* ================================================= */

function ProjectCard({ project }: { project: any }) {
  return (
    <Card className="group overflow-hidden rounded-3xl border-border/60 bg-card/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={project.images.thumbnail || project.images.cover}
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute left-4 top-4">
          <Badge className="rounded-full bg-background/90 text-foreground backdrop-blur hover:bg-background">
            {project.category}
          </Badge>
        </div>

        <div className="absolute bottom-4 right-4">
          <Badge
            variant="secondary"
            className="rounded-full bg-black/60 text-white backdrop-blur"
          >
            {project.status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {project.type}
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
              {project.name}
            </h3>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {project.shortDescription}
        </p>

        {/* Tech */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies?.slice(0, 4).map((technology: string) => (
            <Badge
              key={technology}
              variant="secondary"
              className="rounded-lg px-2.5 py-1 text-xs font-normal"
            >
              {technology}
            </Badge>
          ))}

          {project.technologies?.length > 4 && (
            <Badge
              variant="outline"
              className="rounded-lg px-2.5 py-1 text-xs font-normal"
            >
              +{project.technologies.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex w-full items-center justify-between border-t pt-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {project.year}
          </div>

          <Button variant="ghost" size="sm" className="rounded-lg px-3">
            Explore
            <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

/* ================================================= */
/* Section Heading                                  */
/* ================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

      <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

/* ================================================= */
/* Hero Stat                                        */
/* ================================================= */

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3">
      <p className="text-xl font-bold sm:text-2xl">{value}</p>

      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
    </div>
  );
}

/* ================================================= */
/* Meta                                             */
/* ================================================= */

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground">
        {icon}

        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>

      <p className="line-clamp-1 text-sm font-medium">{value}</p>
    </div>
  );
}
