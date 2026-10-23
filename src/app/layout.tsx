import GAScript from '@/analytics/ga';
import BaseLayout from '@/components/base-layout';
import seo from '@/seo/base-seo';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import React from 'react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = seo;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next-themes sets the theme class on <html> before hydration.
    <html lang="en" className={cn('font-sans')} suppressHydrationWarning>
      <body>
        {process.env.NODE_ENV === 'production' && <GAScript />}

        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
