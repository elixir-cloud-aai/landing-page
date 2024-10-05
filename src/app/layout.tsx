import GAScript from '@/analytics/ga';
import BaseLayout from '@/components/base-layout';
import CookieConsent from '@/components/cookie-consent';
import seo from '@/seo/base-seo';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import React from 'react';

const poppins = Poppins({
  style: 'normal',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  display: 'swap',
  variable: '--font-poppins',
});

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
    <html lang="en" className={poppins.className}>
      <body>
        {process.env.NODE_ENV === 'production' && <GAScript />}
        <BaseLayout>{children}</BaseLayout>
        <CookieConsent />
      </body>
    </html>
  );
}
