'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Check,
  Clock,
  ExternalLink,
  Globe,
  Package,
} from 'lucide-react';
import { FaGithub, FaGitlab } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { isGitlabUrl, Monogram, OwnerChip } from './shared';
import type { Service } from './types';

export function StatusBadge({ status }: { status: Service['status'] }) {
  if (status === 'Live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 dark:text-green-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        Live
      </span>
    );
  }
  if (status === 'Onboarding') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
        <Clock className="h-3 w-3" />
        Onboarding
      </span>
    );
  }
  return null;
}

const linkButton =
  'inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted';

export function ServiceCard({ service }: { service: Service }) {
  const repoIsGitlab = isGitlabUrl(service.repoUrl);

  return (
    <article
      className={cn(
        'flex min-w-0 scroll-mt-28 flex-col [overflow-wrap:anywhere] rounded-2xl border bg-card text-card-foreground shadow-sm transition-[border-color,box-shadow] duration-200 hover:shadow-lg target:ring-2 target:ring-primary/30',
        service.status === 'Onboarding'
          ? 'border-dashed hover:border-warning/50'
          : 'hover:border-primary/40',
      )}
      id={service.id}
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-4">
          <Monogram name={service.name} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                {service.name}
              </h3>
              <StatusBadge status={service.status} />
            </div>
            <p className="mt-0.5 text-sm font-medium text-primary">
              {service.tagline}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {service.blurb}
        </p>

        {!!service.features.length && (
          <ul className="mt-5 space-y-2">
            {service.features.slice(0, 3).map((feature) => (
              <li className="flex items-start gap-2.5 text-sm" key={feature}>
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="min-w-0 leading-5 text-foreground/80">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        {service.relatedProductId && (
          <Link
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            href={`/products#${service.relatedProductId}`}
          >
            <Package className="h-4 w-4" />
            About the software
          </Link>
        )}

        {/* Pushes the owner down, in line across the cards of a row */}
        <div aria-hidden="true" className="min-h-5 flex-1" />
        {(service.owners.length > 0 || service.nodes.length > 0) && (
          <div className="border-t pt-4">
            {service.owners.length > 0 && (
              <>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Service owner
                </p>
                <div className="flex flex-wrap gap-4">
                  {service.owners.map((owner) => (
                    <OwnerChip key={owner.name} owner={owner} role={null} />
                  ))}
                </div>
              </>
            )}
            {/* The Nodes that run the service, linked to their cards below,
                also when it names no owner */}
            {service.nodes.map((node) => (
              <a
                className="mt-3 flex w-fit items-center gap-2 text-sm text-muted-foreground first:mt-0 hover:text-primary"
                href={`#${node.code.toLowerCase()}`}
                key={node.code}
              >
                {/* Decorative: the Node's name follows */}
                <Image
                  alt=""
                  className="h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-border"
                  height={16}
                  src={`/flags/${node.code.toLowerCase()}.svg`}
                  width={24}
                />
                {node.name}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t px-6 py-4">
        {service.deploymentUrl ? (
          <a
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href={service.deploymentUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Globe className="h-4 w-4" />
            Open service
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        ) : service.trackingUrl ? (
          <a
            className={linkButton}
            href={service.trackingUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Clock className="h-4 w-4" />
            Track deployment
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">
            Public endpoint coming soon
          </span>
        )}
        <div className="ml-auto flex gap-2">
          {service.docsUrl && (
            <a
              aria-label={`${service.name} documentation`}
              className={linkButton}
              href={service.docsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <BookOpen className="h-4 w-4" />
              Docs
            </a>
          )}
          {service.repoUrl && (
            <a
              aria-label={`${service.name} source code`}
              className={linkButton}
              href={service.repoUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {repoIsGitlab ? (
                <FaGitlab className="h-4 w-4" />
              ) : (
                <FaGithub className="h-4 w-4" />
              )}
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
