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
    <footer className="bg-gray-900 px-5 md:px-64 pt-7 md:pt-12 py-3 md:py-9 text-gray-200 font-pop text-sm rounded-t-xl relative">
      <div className="flex md:flex-row flex-col">
        <div className="text-center pb-0 pt-5">
          <div>
            <a
              className="mb-3 cursor-pointer"
              href="https://elixir-cloud.dcc.sib.swiss/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="elixir-cloud-aai-logo"
                className="inline-block w-14 md:w-20 mx-3 mr-3 md:mr-7"
                height="auto"
                src="/elixir-cloud-aai.png"
                width="auto"
              />
            </a>
            <a
              className="mb-3 cursor-pointer "
              href="https://elixir-europe.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="elixir-logo"
                className="inline-block w-14 md:w-20 mr-3 md:mx-5"
                height="auto"
                src="/elixir.png"
                width="auto"
              />
            </a>
            <a
              className="mb-3 cursor-pointer "
              href="https://www.ga4gh.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="ga4gh-logo"
                className="inline-block w-14 md:w-20 mr-3 md:mx-5"
                height="auto"
                src="/ga4gh.png"
                width="auto"
              />
            </a>
          </div>
          <a
            className="leading-loose mt-5 mx-3 hover:underline"
            href="https://github.com/elixir-cloud-aai/elixir-cloud-aai.github.io/blob/main/LICENSE"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="text-xs md:block">© 2021 ELIXIR Cloud AAI </span>
            <span className="text-xs md:hidden">○</span>
            <span className="text-xs md:block">
              {' '}
              Released under MIT License
            </span>
          </a>
        </div>
        <div className="mt-4 md:mt-0 flex-grow text-center">
          {renderFooterLinks()}
        </div>
      </div>
      <div className="text-[0.5rem] text-gray-700 text-right -mt-5 absolute bottom-0 md:right-64 right-5">
        Icons by <a href="https://icons8.com/">icons8.com</a>
      </div>
    </footer>
  );
};

export default Footer;
