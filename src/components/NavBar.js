import React, { Component } from "react";
import { Link } from "react-router-dom";
import history from "../history";
import Slide from "react-reveal/Slide";

export default class Home extends Component {
  state = {
    links: [
      {
        name: "News & Press",
        path: "/news",
      },
      {
        name: "Products",
        path: "/products",
      },
      {
        name: "Guides & FAQ",
        path: "/guides",
      },
    ],
    location: history.location.pathname,
    navOpen: false,
  };

  renderLinks = () => {
    return (
      <div>
        {this.state.links.map((link) => {
          return (
            <Link
              to={link.path}
              key={link.name}
              onClick={() => {
                this.setState({ location: link.path });
              }}
              className={`inline-block px-3 ${
                this.state.location === link.path ? "text-elixirblue" : "text-gray-500"
              }
              hover:text-elixirblue`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    );
  };

  renderNavButton = () => {
    return (
      <div>
        {this.state.navOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 hover:text-elixirblue cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => this.setState({ navOpen: !this.state.navOpen })}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 hover:text-elixirblue cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => this.setState({ navOpen: !this.state.navOpen })}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </div>
    );
  };

  renderNav = () => {
    return (
      <Slide when={this.state.navOpen} duration={5} top={true}>
        <div
          className={`left-0 w-full bg-white py-5 text-lg top-20 transition duration-200 ease-in-out ${
            this.state.navOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col justify-center items-center">
            {this.state.links.map((link) => {
              return (
                <Link
                  to={link.path}
                  key={link.name}
                  onClick={() => {
                    this.setState({ location: link.path });
                  }}
                  className={`inline-block py-2 text-center ${
                    this.state.location === link.path ? "text-elixirblue" : "text-gray-500"
                  }
                    hover:text-elixirblue`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </Slide>
    );
  };

  render() {
    return (
      <div className="text-gray-700 font-pop">
        <div
          id="navbar"
          style={
            this.props.scroll <= 1
              ? {
                  paddingTop: "2rem",
                  paddingBottom: "2rem",
                  transition: "all 0.5s",
                }
              : {
                  paddingTop: "1rem",
                  paddingBottom: "0.75rem",
                  transition: "all 0.5s",
                }
          }
          className={
            this.props.scroll <= 1
              ? "z-10 fixed px-5 bg-white w-full flex flex-col"
              : "z-10 fixed px-5 bg-white w-full shadow-lg flex flex-col"
          }
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={() => {
                this.setState({ location: "/" });
              }}
            >
              <img
                src="/elixir-cloud-aii.png"
                className="inline-block w-6 md:w-7 mx-3 pb-1.5"
                alt="logo"
              ></img>
              <div className="inline-block font-semibold text-lg md:text-2xl">
                Elixir Cloud & AAI
              </div>
            </Link>
            <div className="hidden md:block">{this.renderLinks()}</div>
            <div className="block md:hidden">{this.renderNavButton()}</div>
          </div>
          <div>
            <div>{this.renderNav()}</div>
          </div>
        </div>
      </div>
    );
  }
}
