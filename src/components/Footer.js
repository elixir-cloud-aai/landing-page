import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Footer extends Component {
  state = {
    footer: [
      {
        title: "About Us",
        links: [
          {
            name: "Overview",
            link: "/about-us",
          },
          {
            name: "Contributors",
            link: "/contributors",
          },
          {
            name: "Funding",
            link: "/funding",
          },
          {
            name: "Contact Us",
            link: "/contact",
          },
        ],
      },
      {
        title: "Related Links",
        links: [
          {
            name: "ELIXIR Compute Platform",
            link: "https://elixir-europe.org/platforms/compute",
            a: true,
          },
          {
            name: "ELIXIR Tools Platform",
            link: "https://elixir-europe.org/platforms/tools",
            a: true,
          },
          {
            name: "GA4GH Cloud WS",
            link: "https://github.com/ga4gh/wiki/wiki",
            a: true,
          },
          {
            name: "GA4GH Driver Projects",
            link: "https://www.ga4gh.org/howwework/driver-projects.html",
            a: true,
          },
        ],
      },
      {
        title: "ELIXIR Communities",
        links: [
          {
            name: "Galaxy Community",
            link: "https://elixir-europe.org/communities/galaxy",
            a: true,
          },
          {
            name: "Human Data Community",
            link: "https://elixir-europe.org/communities/human-data",
            a: true,
          },
          {
            name: "Rare Disease Community",
            link: "https://elixir-europe.org/communities/rare-diseases",
            a: true,
          },
          {
            name: "Marine Metagenomics Community",
            link: "https://elixir-europe.org/communities/marine-metagenomics",
            a: true,
          },
        ],
      },
      {
        title: "Contribute",
        links: [
          {
            name: "Slack",
            link: "https://elixir-cloud.slack.com/",
            a: true,
          },
          {
            name: "Github",
            link: "https://github.com/elixir-cloud-aai/",
            a: true,
          },
          {
            name: "Twitter",
            link: "https://twitter.com/ELIXIRcloud_aai",
            a: true,
          },
        ],
      },
    ],
  };

  renderFooterLinks = () => {
    return (
      <div className="px-10 flex space-x-20 text-base">
        {this.state.footer.map((footer) => {
          return (
            <div className="footer-links space-y-3">
              <div className="text-lg font-semibold">{footer.title}</div>
              <div className="space-y-2">
                {footer.links.map((link) => {
                  if (link.a) {
                    return (
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:underline"
                      >
                        {link.name}
                      </a>
                    );
                  } else {
                    return (
                      <Link to={link.link} className="block hover:underline">
                        {link.name}
                      </Link>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <footer className="bg-gray-900 px-10 pt-12 py-5 text-gray-200 font-pop flex text-sm  rounded-t-xl">
        <div className="text-center pb-0 pt-5">
          <div>
            <a
              href="https://elixir-europe.github.io/cloud/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 cursor-pointer"
            >
              <img
                src="/elixir-cloud-aii.png"
                alt="elixir-cloud-aii-logo"
                className="inline-block w-20 mx-5 mr-7"
              ></img>
            </a>
            <a
              href="https://elixir-europe.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 cursor-pointer "
            >
              <img src="/elixir.png" alt="elixir-logo" className="inline-block w-20 mx-5"></img>
            </a>
            <a
              href="https://www.ga4gh.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 cursor-pointer "
            >
              <img src="/ga4gh.png" alt="ga4gh-logo" className="inline-block w-20 mx-5"></img>
            </a>
          </div>
          <a
            href="https://github.com/elixir-cloud-aai/elixir-cloud-aai.github.io/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="leading-loose mt-5 mx-3 hover:underline"
          >
            <p>© 2021 Elixir Cloud AII</p>
            <p> Released under MIT License</p>
          </a>
        </div>
        {this.renderFooterLinks()}
      </footer>
    );
  }
}
