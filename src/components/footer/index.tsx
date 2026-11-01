'use client';
import Link from 'next/link';
import { FC } from 'react';
import { Mail, MessageSquarePlus } from 'lucide-react';
import { FaGithub, FaSlack } from 'react-icons/fa6';
import * as CookieConsentApi from 'vanilla-cookieconsent';
import {
  CONTACT_EMAIL,
  FEEDBACK_URL,
  SLACK_URL,
  WEBSITE_REPO_URL,
} from '@/lib/site';

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Products', href: '/products' },
      { label: 'Services', href: '/services' },
      { label: 'Nodes', href: '/nodes' },
      { label: 'Projects', href: '/projects' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Contributors', href: '/contributors' },
      { label: 'Funding', href: '/funding' },
      { label: 'News', href: '/news' },
    ],
  },
];

const linkClass = 'transition-colors hover:text-white';

const Footer: FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 font-pop text-sm text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div className="space-y-4">
          <Link href="/" aria-label="ELIXIR On-Cloud home">
            <img
              src="/ELIXIR On-Cloud Logo Pack/On-Cloud_MONO.png"
              alt="ELIXIR On-Cloud"
              className="h-10 w-auto"
            />
          </Link>
          <p className="max-w-xs text-xs leading-5">
            Federated, GA4GH standards-based cloud infrastructure for the life
            sciences, built by the ELIXIR community.
          </p>
          <div className="flex items-center gap-1">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email us"
              className={`${linkClass} p-1.5`}
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href={SLACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Slack"
              className={`${linkClass} p-1.5`}
            >
              <FaSlack className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/elixir-cloud-aai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub organization"
              className={`${linkClass} p-1.5`}
            >
              <FaGithub className="h-4 w-4" />
            </a>
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-200">
              {column.title}
            </h2>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-200">
            Feedback
          </h2>
          <p className="mb-3 text-xs leading-5">
            Something missing or wrong? We would love to hear from you.
          </p>
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Give feedback
          </a>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© {new Date().getFullYear()} ELIXIR On-Cloud · Apache-2.0</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className={linkClass}>
              Privacy policy
            </Link>
            <button
              type="button"
              onClick={() => CookieConsentApi.showPreferences()}
              className={linkClass}
            >
              Cookie settings
            </button>
            <a
              href={WEBSITE_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} inline-flex items-center gap-1.5`}
            >
              <FaGithub className="h-3.5 w-3.5" />
              Website source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
