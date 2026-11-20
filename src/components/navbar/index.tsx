'use client';
import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Moon, Sun, X } from 'lucide-react';
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavBody,
} from '@/components/ui/resizable-navbar';
import { DOCS_HUB_URL } from '@/lib/site';
import { cn } from '@/lib/utils';

interface NavbarProps {
  setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
  showBanner: boolean;
  theme: string;
  mounted: boolean;
  toggleDarkMode: () => void;
}

// Followed by "Docs" (external). The Projects page is parked: it stays
// online but out of the navigation until there is more to show.
const links = [
  { name: 'Demo', path: '/demo' },
  { name: 'Products', path: '/products' },
];

// The colour lockup has dark grey text, so dark mode uses the white version.
// The two files have different padding, hence separate sizes. The width and
// height props give each file's aspect ratio at its largest size; the classes
// set the shown height.
const Logo: FC<{ lightClassName: string; darkClassName: string }> = ({
  lightClassName,
  darkClassName,
}) => (
  <>
    <Image
      alt="ELIXIR On-Cloud"
      className={cn('block w-auto dark:hidden', lightClassName)}
      height={44}
      // At the top of every page, so not lazy like the other images
      loading="eager"
      src="/ELIXIR On-Cloud Logo Pack/On-Cloud_LockUp.png"
      width={156}
    />
    <Image
      alt="ELIXIR On-Cloud"
      className={cn('hidden w-auto dark:block', darkClassName)}
      height={32}
      src="/ELIXIR On-Cloud Logo Pack/On-Cloud_MONO.png"
      width={188}
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
          <Link className="z-20 flex items-center" href="/">
            <Logo darkClassName="mx-2 h-8" lightClassName="h-11" />
          </Link>

          <nav
            aria-label="Main"
            className="absolute inset-0 hidden items-center justify-center gap-1 lg:flex"
          >
            {links.map((link) => (
              <Link
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                href={link.path}
                key={link.name}
              >
                {link.name}
              </Link>
            ))}
            <a
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href={DOCS_HUB_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Docs
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="z-20 hidden lg:flex">{themeToggle}</div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <Link className="flex items-center" href="/">
              <Logo darkClassName="mx-1 h-6" lightClassName="h-9" />
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
                className={cn(
                  'block text-base font-medium',
                  isActive(item.path) ? 'text-primary' : 'text-foreground',
                )}
                href={item.path}
                key={item.name}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              className="flex items-center gap-1 text-base font-medium text-foreground"
              href={DOCS_HUB_URL}
              rel="noopener noreferrer"
              target="_blank"
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
