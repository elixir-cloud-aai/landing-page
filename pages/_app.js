import { useEffect } from 'react';
import Script from 'next/script';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import CookieConsent from '../components/CookieConsent';

function GAScript() {
  return (
    <>
      <Script id="google-analytics-consent">
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied'
      });
    `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics">
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${process.env.GA_MEASUREMENT_ID}');
    `}
      </Script>
      <Script id="google-analytics-consent-granted">
        {`
      function GAConsentGranted() {
        gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted'
        });
      }
    `}
      </Script>
    </>
  );
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log(
              'Service Worker registration successful with scope: ',
              registration.scope,
            );
          },
          (err) => {
            console.log('Service Worker registration failed: ', err);
          },
        );
      });
    }
  }, []);

  return (
    <>
      {process.env.NODE_ENV === 'production' && <GAScript />}
      <DefaultSeo {...SEO} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <CookieConsent />
    </>
  );
}

export default MyApp;
