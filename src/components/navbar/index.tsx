'use client';
import { FC, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ExternalLink, Moon, Sun, X } from 'lucide-react';
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import servicesData from '@/data/services.json';
import { DOCS_HUB_URL } from '@/lib/site';
import { cn } from '@/lib/utils';

interface NavbarProps {
  setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
  showBanner: boolean;
  theme: string;
  mounted: boolean;
  toggleDarkMode: () => void;
}

const links = [
  { name: 'Projects', path: '/projects' },
  { name: 'Products', path: '/products' },
  { name: 'Services', path: '/services' },
];

// Every service with a public endpoint, so all live services are reachable
// from the main navigation.
const liveServices = servicesData.services.filter(
  (service) => service.deploymentUrl,
);

// The colour lockup has dark grey text, so dark mode uses the white version.
// The two files have different padding, hence separate sizes.
const Logo: FC<{ lightClassName: string; darkClassName: string }> = ({
  lightClassName,
  darkClassName,
}) => (
  <>
    <img
      alt="ELIXIR On-Cloud"
      className={cn('block w-auto dark:hidden', lightClassName)}
      src="/ELIXIR On-Cloud Logo Pack/On-Cloud_LockUp.png"
    />
    <img
      alt="ELIXIR On-Cloud"
      className={cn('hidden w-auto dark:block', darkClassName)}
      src="/ELIXIR On-Cloud Logo Pack/On-Cloud_MONO.png"
    />
  </>
);

const NavBar: FC<NavbarProps> = ({
  toggleDarkMode,
  theme,
  mounted,
  showBanner,
  setShowBanner,
}) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(`${path}/`);

  const themeToggle = (
    <button
      aria-label={
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      }
      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      onClick={toggleDarkMode}
      type="button"
    >
      {/* Icon is only known after mount; keep the box size stable before. */}
      {!mounted ? (
        <span className="block h-5 w-5" />
      ) : theme === 'dark' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full font-pop">
      {showBanner && (
        <div className="relative bg-elixirblue px-10 py-2 text-center text-xs text-white md:text-sm">
          This website is currently under construction and may have missing,
          incomplete and/or outdated content.
          <button
            aria-label="Dismiss banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/15"
            onClick={() => {
              setShowBanner(false);
              try {
                localStorage.setItem('banner-status', 'false');
              } catch {
                // Storage can be unavailable (private mode); dismiss anyway.
              }
            }}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Navbar>
        <NavBody>
          <Link href="/" className="z-20 flex items-center">
            <Logo lightClassName="h-11" darkClassName="mx-2 h-8" />
          </Link>

          <nav
            aria-label="Main"
            className="absolute inset-0 hidden items-center justify-center gap-1 lg:flex"
          >
            {links.map((link) =>
              link.path === '/services' ? (
                <div className="group relative" key={link.name}>
                  <Link
                    href={link.path}
                    className={cn(
                      'flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      isActive(link.path)
                        ? 'bg-muted text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {link.name}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                  </Link>
                  {/* Dropdown: opens on hover and on keyboard focus. */}
                  <div className="invisible absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="rounded-xl border bg-popover p-2 text-popover-foreground shadow-xl">
                      <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Live services
                      </p>
                      {liveServices.map((service) => (
                        <a
                          key={service.id}
                          href={service.deploymentUrl as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                        >
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-success" />
                          <span className="min-w-0">
                            <span className="flex items-center gap-1 text-sm font-medium">
                              {service.name}
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {service.tagline}
                            </span>
                          </span>
                        </a>
                      ))}
                      <Link
                        href="/services"
                        className="mt-1 block rounded-lg border-t px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                      >
                        All services and network coverage →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={link.path}
                  key={link.name}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive(link.path)
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.name}
                </Link>
              ),
            )}
            <a
              href={DOCS_HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="z-20 hidden lg:flex">{themeToggle}</div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <Link href="/" className="flex items-center">
              <Logo lightClassName="h-9" darkClassName="mx-1 h-6" />
            </Link>
            <div className="flex items-center gap-1">
              {themeToggle}
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
                className={cn(
                  'block text-base font-medium',
                  isActive(item.path) ? 'text-primary' : 'text-foreground',
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="w-full border-t pt-3">
              <p className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Live services
              </p>
              {liveServices.map((service) => (
                <a
                  key={service.id}
                  href={service.deploymentUrl as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {service.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
            <a
              href={DOCS_HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-base font-medium text-foreground"
            >
              Docs
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </header>
  );
};

export default NavBar;
