import { useEffect } from 'react';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import CookieConsent from '../components/CookieConsent';

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
      <DefaultSeo {...SEO} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <CookieConsent />
    </>
  );
}

export default MyApp;
