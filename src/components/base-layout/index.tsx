'use client';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import CookieConsent from '../cookie-consent';
import Footer from '../footer';
import NavBar from '../navbar';
import { Theme, ThemeProvider } from '@/context/default-theme';

const LayoutInner: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard: renders the client-only parts after mount
    setMounted(true);
    try {
      setShowBanner(localStorage.getItem('banner-status') !== 'false');
    } catch {
      setShowBanner(true);
    }
  }, []);

  // The server can't know the theme, so render "light" until mounted to avoid
  // hydration mismatches in components that branch on it.
  const theme: Theme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light';

  const themeValue = useMemo(
    () => ({
      theme,
      toggleDarkMode: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, setTheme],
  );

  return (
    <ThemeProvider value={themeValue}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <NavBar
          mounted={mounted}
          setShowBanner={setShowBanner}
          showBanner={showBanner}
          theme={theme}
          toggleDarkMode={themeValue.toggleDarkMode}
        />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CookieConsent />
      </div>
    </ThemeProvider>
  );
};

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    enableSystem
    storageKey="theme"
  >
    <LayoutInner>{children}</LayoutInner>
  </NextThemesProvider>
);

export default Layout;
