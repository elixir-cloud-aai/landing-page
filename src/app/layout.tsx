import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';
import React from 'react';
import seo from '@/seo/base-seo';
import GAScript from '@/analytics/ga';
import CookieConsent from '@/components/CookieConsent';
import Script from 'next/script';
import Layout from '@/components/Layout';
const poppins = Poppins({
  style: 'normal',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  display: 'swap',
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
    <html lang="en">
      <body className={poppins.className}>
        {/* 
          <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin={'anonymous'}
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
          <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap"
          rel="stylesheet"
        /> */}
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
        <Layout>{children}</Layout>
        <CookieConsent />
      </body>
    </html>
  );
}
