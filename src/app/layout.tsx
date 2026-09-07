import GAScript from '@/analytics/ga';
import BaseLayout from '@/components/base-layout';
import CookieConsent from '@/components/cookie-consent';
import seo from '@/seo/base-seo';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import React from 'react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = seo;

export const viewport: Viewport = {
  themeColor: '#3DA9F6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('font-sans')}>
      <body>
        {process.env.NODE_ENV === 'production' && <GAScript />}

        <BaseLayout>{children}</BaseLayout>

        <CookieConsent />
      </body>
    </html>
  );
}
