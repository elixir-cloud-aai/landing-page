import Link from 'next/link';
import { FC } from 'react';

interface LinkObject {
  name: string;
  link: string;
  a?: boolean;
}
interface FooterLinks {
  title: string;
  link?: string;
  links: LinkObject[];
}

const Footer: FC = () => {
  const footers: FooterLinks[] = [
    {
      title: 'About Us',
      links: [
        {
          name: 'Overview',
          link: '/overview',
        },
        {
          name: 'Contributors',
          link: '/contributors',
        },
        {
          name: 'Partners',
          link: '/partners',
        },
        {
          name: 'Funding',
          link: '/funding',
        },
      ],
    },
    {
      title: 'Docs',
      link: 'https://elixir-cloud-aai.github.io/',
      links: [
        {
          name: 'Users',
          link: 'https://elixir-cloud-aai.github.io/guides/guide-user/',
          a: true,
        },
        {
          name: 'Developers',
          link: 'https://elixir-cloud-aai.github.io/guides/guide-dev/',
          a: true,
        },
        {
          name: 'Administrators',
          link: 'https://elixir-cloud-aai.github.io/guides/guide-admin/',
          a: true,
        },
        {
          name: 'Contributors',
          link: 'https://elixir-cloud-aai.github.io/guides/guide-contributor/',
          a: true,
        },
      ],
    },
    {
      title: 'Reach Out',
      links: [
        {
          name: 'Email',
          link: 'mailto:cloud-service@elixir-europe.org',
          a: true,
        },
        {
          name: 'Slack',
          link: 'https://join.slack.com/t/elixir-cloud/shared_invite/zt-1uvebyx1e-NcC0Hof2guT9df~haBdQaw',
          a: true,
        },
        {
          name: 'Github',
          link: 'https://github.com/elixir-cloud-aai/',
          a: true,
        },
      ],
    },
  ];

  const renderFooterLinks = () => (
    <div className="px-0 md:px-10 flex flex-wrap text-base justify-center md:justify-start 2xl:justify-end">
      {footers.map((footer) => (
        <div
          className="px-8 py-3 md:py-0 md:mx-4 2xl:mx-50 md:my-4"
          key={footer.title}
        >
          <div className="text-sm md:text-lg md:font-semibold text-left">
            {footer.link ? (
              <a className="hover:underline" href={footer.link}>
                {footer.title}
              </a>
            ) : (
              <div>{footer.title}</div>
            )}
          </div>
          <div className="space-y-1 md:space-y-2 text-left">
            {footer.links.map((link) => {
              if (link?.a) {
                return (
                  <a
                    className="text-xs md:text-base block hover:underline"
                    href={link.link}
                    key={link.link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <div
                  className="text-xs md:text-base block hover:underline cursor-pointer"
                  key={link.link}
                >
                  <Link href={link.link} passHref>
                    {link.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <footer className="bg-gray-900 text-gray-300 font-pop text-sm rounded-t-2xl">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
          {/* Brand & Licensing */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 md:gap-8 mb-6">
              <a
                href="https://elixir-cloud.dcc.sib.swiss/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="/elixir-cloud-aai.png"
                  alt="elixir-cloud-aai-logo"
                  className="h-10 md:h-14 w-auto object-contain"
                />
              </a>
              <a
                href="https://elixir-europe.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="/elixir.png"
                  alt="elixir-logo"
                  className="h-10 md:h-14 w-auto object-contain"
                />
              </a>
              <a
                href="https://www.ga4gh.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="/ga4gh.png"
                  alt="ga4gh-logo"
                  className="h-10 md:h-14 w-auto object-contain"
                />
              </a>
            </div>

            <a
              href="https://github.com/elixir-cloud-aai/elixir-cloud-aai.github.io/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-white transition-colors flex flex-col md:flex-row items-center gap-1 md:gap-2"
            >
              <span>© 2021 ELIXIR Cloud AAI</span>
              <span className="hidden md:inline text-gray-600">•</span>
              <span>Released under MIT License</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex-grow w-full md:w-auto flex justify-center md:justify-end">
            {renderFooterLinks()}
          </div>
        </div>

        {/* Attribution Bar */}
        <div className="mt-10 pt-5 border-t border-gray-800 flex justify-center md:justify-end">
          <span className="text-xs text-gray-500">
            Icons by{' '}
            <a
              href="https://icons8.com/"
              className="hover:text-gray-300 transition-colors underline decoration-gray-700 underline-offset-2"
            >
              icons8.com
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
