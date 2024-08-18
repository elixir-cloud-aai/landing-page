import { useEffect, useState, FC } from 'react';
import Link from 'next/link';
import { Slide } from 'react-awesome-reveal';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  scroll: number;
  setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
  showBanner: boolean;
  theme: string;
  toggleDarkMode: () => void;
}

const NavBar: FC<NavbarProps> = ({
  scroll,
  toggleDarkMode,
  theme,
  showBanner,
  setShowBanner,
}) => {
  const pathname = usePathname();
  const links = [
    {
      name: 'News & Press',
      path: '/news',
    },
    {
      name: 'Solutions',
      path: '/solutions',
    },
  ];

  const [location, setLocation] = useState(pathname);
  const [navOpen, setNavOpen] = useState(false);
  // const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    setLocation(pathname);
  }, [pathname]);

  const renderLinks = () => (
    <div>
      {links.map((link) => (
        <Link href={link.path} key={link.name} passHref>
          <div
            className={`inline-block px-3 cursor-pointer ${
              location === link.path ? 'text-elixirblue' : 'text-gray-500'
            }
                  hover:text-elixirblue`}
          >
            {link.name}
          </div>
        </Link>
      ))}
    </div>
  );

  const renderNavButton = () => (
    <div>
      {navOpen ? (
        <svg
          className="h-6 w-6 text-gray-500 hover:text-elixirblue cursor-pointer outline-none mb-1"
          fill="none"
          onClick={() => setNavOpen(!navOpen)}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ) : (
        <svg
          className="h-6 w-6 text-gray-500 hover:text-elixirblue cursor-pointer outline-none mb-1"
          fill="none"
          onClick={() => setNavOpen(!navOpen)}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6h16M4 12h16M4 18h16"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      )}
    </div>
  );

  const renderNav = () =>
    navOpen ? (
      <Slide duration={5} direction="up" triggerOnce={true}>
        <div
          className={`left-0 w-full bg-white py-5 text-lg top-20 transition duration-200 ease-in-out dark:bg-gray-900 ${
            navOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex flex-col justify-center items-center">
            {links.map((link) => (
              <Link href={link.path} key={link.name} passHref>
                <div
                  className={`inline-block py-2 text-center cursor-pointer ${
                    location === link.path ? 'text-elixirblue' : 'text-gray-500'
                  }
                        hover:text-elixirblue`}
                  onClick={() => {
                    setLocation(link.path);
                    setNavOpen(false);
                  }}
                >
                  {link.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Slide>
    ) : null;

  const renderDarkModeIcon = () => {
    if (theme === 'light') {
      return (
        <svg
          className="h-6 w-6 mb-1.5 md:mb-1 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      );
    }
    return (
      <svg
        className="h-6 w-6 mb-1.5 md:mb-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    );
  };

  return (
    <div className="text-gray-700 font-pop dark:text-gray-200 dark:bg-gray-900 fixed z-10 w-full bg-white">
      {showBanner && (
        <div className="text-center py-2 bg-elixirblue text-white md:text-sm text-xs">
          This website is currently under construction and may have missing,
          incomplete and/or outdated content
          <span
            className="md:-mt-5 mt-0 md:absolute md:right-5 flex justify-center cursor-pointer"
            onClick={() => {
              setShowBanner(false);
              localStorage.setItem('banner-status', false.toString());
            }}
          >
            <svg
              className="md:w-5 md:h-5 w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      )}
      <div
        className={
          scroll <= 1
            ? 'px-5 w-full flex flex-col'
            : 'px-5 w-full shadow-lg flex flex-col '
        }
        id="navbar"
        style={
          scroll <= 1
            ? {
                paddingTop: '2rem',
                paddingBottom: '2rem',
                transition: 'all 0.5s',
              }
            : {
                paddingTop: '1rem',
                paddingBottom: '0.75rem',
                transition: 'all 0.5s',
              }
        }
      >
        <div className="flex items-center justify-between">
          <Link href="/" passHref>
            <div
              className="cursor-pointer"
              onClick={() => {
                setLocation('/');
              }}
            >
              <img
                alt="logo"
                className="inline-block w-6 md:w-7 mx-3 pb-1.5"
                height="auto"
                src="/elixir-cloud-aai.png"
                width="auto"
              />
              <div className="inline-block font-semibold text-lg md:text-2xl">
                ELIXIR Cloud & AAI
              </div>
            </div>
          </Link>
          <div className="flex items-center">
            <div
              className="cursor-pointer block md:hidden p-1 m-1 rounded-md"
              onClick={() => toggleDarkMode()}
            >
              {renderDarkModeIcon()}
            </div>
            <div className="hidden md:block">{renderLinks()}</div>
            <div className="block md:hidden">{renderNavButton()}</div>
            <div
              className="cursor-pointer hidden md:block p-1 px-3 m-1 rounded-md"
              onClick={() => toggleDarkMode()}
            >
              {renderDarkModeIcon()}
            </div>
          </div>
        </div>
        <div>
          <div>{renderNav()}</div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
