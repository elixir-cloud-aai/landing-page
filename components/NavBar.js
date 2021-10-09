import React, { useState } from "react";
import Link from "next/link";
import Slide from "react-reveal/Slide";
import { useRouter } from "next/router";

const NavBar = ({ scroll }) => {
  const router = useRouter();
  const [links, setLinks] = useState([
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
  ]);

  const [location, setLocation] = useState(router.pathname);
  const [navOpen, setNavOpen] = useState(false);

  const renderLinks = () => {
    return (
      <div>
        {links.map((link) => {
          return (
            <Link href={link.path} key={link.name} passHref>
              <div
                onClick={() => {
                  setLocation(link.path);
                }}
                className={`inline-block px-3 cursor-pointer ${
                  location === link.path ? "text-elixirblue" : "text-gray-500"
                }
                  hover:text-elixirblue`}
              >
                {link.name}
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  const renderNavButton = () => {
    return (
      <div>
        {navOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 hover:text-elixirblue cursor-pointer outline-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => setNavOpen(!navOpen)}
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
            className="h-6 w-6 text-gray-500 hover:text-elixirblue cursor-pointer outline-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => setNavOpen(!navOpen)}
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

  const renderNav = () => {
    return (
      <Slide when={navOpen} duration={5} top={true}>
        <div
          className={`left-0 w-full bg-white py-5 text-lg top-20 transition duration-200 ease-in-out ${
            navOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col justify-center items-center">
            {links.map((link) => {
              return (
                <>
                  <Link href={link.path} key={link.name} passHref>
                    <div
                      onClick={() => {
                        setLocation(link.path);
                      }}
                      className={`inline-block py-2 text-center cursor-pointer ${
                        location === link.path ? "text-elixirblue" : "text-gray-500"
                      }
                        hover:text-elixirblue`}
                    >
                      {link.name}
                    </div>
                  </Link>
                </>
              );
            })}
          </div>
        </div>
      </Slide>
    );
  };

  return (
    <div className="text-gray-700 font-pop">
      <div
        id="navbar"
        style={
          scroll <= 1
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
          scroll <= 1
            ? "z-10 fixed px-5 bg-white w-full flex flex-col"
            : "z-10 fixed px-5 bg-white w-full shadow-lg flex flex-col"
        }
      >
        <div className="flex items-center justify-between">
          <Link href="/" passHref>
            <div
              onClick={() => {
                setLocation("/");
              }}
              className="cursor-pointer"
            >
              <img
                src="/elixir-cloud-aai.png"
                className="inline-block w-6 md:w-7 mx-3 pb-1.5"
                alt="logo"
              ></img>
              <div className="inline-block font-semibold text-lg md:text-2xl">
                Elixir Cloud & AAI
              </div>
            </div>
          </Link>
          <div className="hidden md:block">{renderLinks()}</div>
          <div className="block md:hidden">{renderNavButton()}</div>
        </div>
        <div>
          <div>{renderNav()}</div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
