import React, { useState } from "react";
import Link from "next/link";

const Footer = () => {
  const [footers, setFooters] = useState([
    {
      title: "About Us",
      links: [
        {
          name: "Overview",
          link: "/overview",
        },
        {
          name: "Contributors",
          link: "/contributors",
        },
        {
          name: "Partners",
          link: "/partners",
        },
        {
          name: "Funding",
          link: "/funding",
        },
      ],
    },
    {
      title: "Reach Out",
      links: [
        {
          name: "Email",
          link: "mailto:cloud-service@elixir-europe.org",
          a: true,
        },
        {
          name: "Slack",
          link: "https://join.slack.com/t/elixir-cloud/shared_invite/enQtNzA3NTQ5Mzg2NjQ3LTZjZGI1OGQ5ZTRiOTRkY2ExMGUxNmQyODAxMDdjM2EyZDQ1YWM0ZGFjOTJhNzg5NjE0YmJiZTZhZDVhOWE4MWM",
          a: true,
        },
        {
          name: "Github",
          link: "https://github.com/elixir-cloud-aai/",
          a: true,
        },
      ],
    },
  ]);

  const renderFooterLinks = () => {
    return (
      <>
        <div className="px-0 md:px-10 flex flex-wrap text-base justify-between md:justify-end">
          {footers.map((footer) => {
            return (
              <div
                className="space-y-1.5 md:space-y-3 py-3 md:py-0 mx-10 md:mx-50"
                key={footer.title}
              >
                <div className="text-sm md:text-lg md:font-semibold">{footer.title}</div>
                <div className="space-y-1 md:space-y-2">
                  {footer.links.map((link) => {
                    if (link.a) {
                      return (
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs md:text-base block hover:underline"
                        >
                          {link.name}
                        </a>
                      );
                    } else {
                      return (
                        <Link href={link.link} passHref>
                          <div className="text-xs md:text-base block hover:underline cursor-pointer">
                            {link.name}
                          </div>
                        </Link>
                      );
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <footer className="bg-gray-900 px-5 md:px-64 pt-7 md:pt-12 py-3 md:py-5 text-gray-200 font-pop flex md:flex-row flex-col text-sm rounded-t-xl">
      <div className="text-center pb-0 pt-5">
        <div>
          <a
            href="https://elixir-cloud.dcc.sib.swiss/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 cursor-pointer"
          >
            <img
              src="/elixir-cloud-aai.png"
              alt="elixir-cloud-aai-logo"
              className="inline-block w-14 md:w-20 mx-3 mr-3 md:mr-7"
              width="auto"
              height="auto"
            ></img>
          </a>
          <a
            href="https://elixir-europe.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 cursor-pointer "
          >
            <img
              src="/elixir.png"
              alt="elixir-logo"
              className="inline-block w-14 md:w-20 mr-3 md:mx-5"
              width="auto"
              height="auto"
            ></img>
          </a>
          <a
            href="https://www.ga4gh.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 cursor-pointer "
          >
            <img
              src="/ga4gh.png"
              alt="ga4gh-logo"
              className="inline-block w-14 md:w-20 mr-3 md:mx-5"
              width="auto"
              height="auto"
            ></img>
          </a>
        </div>
        <a
          href="https://github.com/elixir-cloud-aai/elixir-cloud-aai.github.io/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="leading-loose mt-5 mx-3 hover:underline"
        >
          <span className="text-xs md:block">© 2021 ELIXIR Cloud AAI </span>
          <span className="text-xs md:hidden">○</span>
          <span className="text-xs md:block"> Released under MIT License</span>
        </a>
      </div>
      <div className="mt-4 md:mt-0 flex-grow">{renderFooterLinks()}</div>
    </footer>
  );
};

export default Footer;
