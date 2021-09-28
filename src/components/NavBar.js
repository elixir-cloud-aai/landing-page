import React, { Component } from "react";
import { Link } from "react-router-dom";
import history from "../history";

export default class Home extends Component {
  state = {
    navtop: true,
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
  };

  componentDidMount() {
    window.onscroll = () => {
      if (document.documentElement.scrollTop <= 1) {
        this.setState({ navtop: true });
      } else {
        this.setState({ navtop: false });
      }
    };
  }

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
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div className="text-gray-700 font-pop">
        <div
          id="navbar"
          style={
            this.state.navtop
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
            this.state.navtop
              ? "z-10 fixed px-5 bg-white w-full"
              : "z-10 fixed px-5 bg-white w-full shadow-lg"
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
                className="inline-block w-7 mx-3 pb-1.5"
                alt="logo"
              ></img>
              <div className="inline-block font-semibold text-2xl">Elixir Cloud & AII</div>
            </Link>
            {this.renderLinks()}
          </div>
        </div>
      </div>
    );
  }
}
