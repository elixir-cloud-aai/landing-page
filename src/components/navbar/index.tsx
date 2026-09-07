import { FC, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState(pathname);

  useEffect(() => {
    setLocation(pathname);
  }, [pathname]);

  const links = useMemo(
    () => [
      {
        name: 'News & Press',
        path: '/news',
      },
      {
        name: 'Solutions',
        path: '/solutions',
      },
    ],
    [],
  );

  const renderDarkModeIcon = () => {
    if (theme === 'light') {
      return (
        <svg
          className="h-6 w-6 text-gray-500"
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
        className="h-6 w-6 text-gray-200"
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
    <div className="fixed z-50 w-full  font-pop text-gray-700 dark:bg-gray-900 dark:text-gray-200">
      {showBanner && (
        <div className="bg-elixirblue py-2 text-center text-xs text-white md:text-sm">
          This website is currently under construction and may have missing,
          incomplete and/or outdated content
          <span
            className="mt-0 flex cursor-pointer justify-center md:absolute md:right-5 md:-mt-5"
            onClick={() => {
              setShowBanner(false);
              localStorage.setItem('banner-status', false.toString());
            }}
          >
            <svg
              className="h-4 w-4 md:h-5 md:w-5"
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

      <Navbar className="top-0">
        <NavBody
          className={
            scroll <= 1
              ? 'bg-white px-4 py-4 dark:bg-gray-900'
              : 'bg-white px-4 py-3 dark:bg-gray-900'
          }
        >
          <Link href="/" passHref>
            <div
              className="z-20 flex cursor-pointer items-center"
              onClick={() => {
                setLocation('/');
              }}
            >
              <img
                alt="logo"
                className="mx-2 inline-block w-7 pb-1"
                height="auto"
                src="/elixir-cloud-aai.png"
                width="auto"
              />
              <div className="text-lg font-semibold md:text-2xl">
                ELIXIR Cloud & AAI
              </div>
            </div>
          </Link>

          <div className="absolute inset-0 hidden items-center justify-center gap-4 lg:flex">
            {links.map((link) => (
              <Link href={link.path} key={link.name} passHref>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    location === link.path
                      ? 'bg-gray-100 text-elixirblue dark:bg-gray-800'
                      : 'text-gray-600 hover:text-elixirblue dark:text-gray-300'
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="z-20 hidden lg:flex">
            <button
              className="rounded-md p-1"
              onClick={() => toggleDarkMode()}
              type="button"
            >
              {renderDarkModeIcon()}
            </button>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <Link href="/" passHref>
              <div
                className="flex cursor-pointer items-center"
                onClick={() => {
                  setLocation('/');
                }}
              >
                <img
                  alt="logo"
                  className="mx-2 inline-block w-6 pb-1"
                  height="auto"
                  src="/elixir-cloud-aai.png"
                  width="auto"
                />
                <div className="text-base font-semibold">
                  ELIXIR Cloud & AAI
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md p-1"
                onClick={() => toggleDarkMode()}
                type="button"
              >
                {renderDarkModeIcon()}
              </button>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative block text-base ${
                  location === item.path
                    ? 'text-elixirblue'
                    : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};

export default NavBar;
