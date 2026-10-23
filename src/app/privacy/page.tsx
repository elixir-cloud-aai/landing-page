import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'How the ELIXIR On-Cloud website handles personal data, cookies and analytics.',
};

const LAST_UPDATED = '24 October 2026';

const storage = [
  {
    name: 'cc_cookie',
    type: 'Cookie',
    purpose: 'Remembers your cookie choices',
    category: 'Strictly necessary',
    expiry: '6 months',
  },
  {
    name: 'theme',
    type: 'Local storage',
    purpose: 'Remembers light or dark theme',
    category: 'Strictly necessary',
    expiry: 'Until cleared',
  },
  {
    name: 'banner-status',
    type: 'Local storage',
    purpose: 'Remembers that you dismissed the site banner',
    category: 'Strictly necessary',
    expiry: 'Until cleared',
  },
  {
    name: '_ga, _ga_*',
    type: 'Cookie (Google)',
    purpose: 'Counts visits and page views',
    category: 'Analytics, only with consent',
    expiry: '2 years',
  },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Privacy
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-10 text-[15px] leading-7 text-muted-foreground">
          <Section title="Summary">
            <ul className="list-disc space-y-1 pl-5">
              <li>You can use this website without an account or login.</li>
              <li>We do not sell personal data or use it for advertising.</li>
              <li>
                Analytics (Google Analytics) runs only if you opt in, and you
                can withdraw consent at any time.
              </li>
            </ul>
          </Section>

          <Section title="Who is responsible">
            <p>
              This website is run by the ELIXIR On-Cloud community, part of the{' '}
              <a
                href="https://elixir-europe.org/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ELIXIR
              </a>{' '}
              research infrastructure. For any privacy question or request,
              email{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="What we collect and why">
            <p>
              <strong className="text-foreground">Technical data.</strong> When
              you load a page, the server that hosts the site receives technical
              information such as your IP address, browser type and the page
              requested. This is needed to deliver the site and keep it secure
              (legal basis: legitimate interest, Art. 6(1)(f) GDPR).
            </p>
            <p>
              <strong className="text-foreground">
                Analytics, only with your consent.
              </strong>{' '}
              If you accept analytics cookies, we use Google Analytics to
              understand which pages are visited and how visitors find us. IP
              anonymization is enabled. Google may process this data outside the
              EU under its own safeguards (legal basis: consent, Art. 6(1)(a)
              GDPR). Until you opt in, the Google Analytics script is not
              loaded.
            </p>
            <p>
              <strong className="text-foreground">When you contact us.</strong>{' '}
              If you email us or open an issue on GitHub, we use what you send
              only to answer you. GitHub&apos;s own privacy policy applies to
              content you post there.
            </p>
          </Section>

          <Section title="Cookies and local storage">
            <p>
              You can change your choice at any time with the &ldquo;Cookie
              settings&rdquo; link in the footer.
            </p>
            <div className="overflow-x-auto rounded-xl border bg-card">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Purpose</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {storage.map((row) => (
                    <tr key={row.name}>
                      <td className="px-4 py-3 align-top">
                        <code className="font-mono text-xs text-foreground">
                          {row.name}
                        </code>
                        <div className="text-xs">{row.type}</div>
                      </td>
                      <td className="px-4 py-3 align-top">{row.purpose}</td>
                      <td className="px-4 py-3 align-top">{row.category}</td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        {row.expiry}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Links to other sites">
            <p>
              This site links to services, repositories and documentation run by
              ELIXIR Nodes, partners and third parties such as GitHub. Their own
              privacy policies apply once you leave this site.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              Under the GDPR you have the right to access, correct or delete
              your personal data, to restrict or object to its processing, to
              data portability, and to withdraw consent at any time without
              affecting earlier processing. To use any of these rights, email
              us. You also have the right to lodge a complaint with a data
              protection supervisory authority.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We will update this page if our practices change, and ask for your
              cookie consent again when the categories change.
            </p>
          </Section>

          <p className="border-t pt-6 text-sm">
            <Link href="/" className="text-primary hover:underline">
              ← Back to the home page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
