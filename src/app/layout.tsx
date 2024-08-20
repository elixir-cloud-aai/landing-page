import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import React from 'react';
import seo from '../seo/base-seo';
import GAScript from '../analytics/ga';
import CookieConsent from '../components/cookie-consent';
import Script from 'next/script';
import BaseLayout from '../components/base-layout';

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
        <Script
          crossOrigin="anonymous"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
          type="module"
        />
        <Script
          crossOrigin="anonymous"
          noModule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
        />
        <BaseLayout>{children}</BaseLayout>
        <CookieConsent />
      </body>
    </html>
  );
}
