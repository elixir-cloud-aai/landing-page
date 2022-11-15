import Layout from "../components/Layout";
import "../styles/globals.css";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import { useEffect, useState } from "react";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

const MyApp = ({ Component, pageProps }) => {
  const [isLoggedIn, setIsLoggedIn] = useState('loading');

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
    const isLoggedIn = localStorage.getItem('params');
    if (isLoggedIn) {
      setIsLoggedIn('true');
    } else {
      setIsLoggedIn('false');
    }
  }, []);

  return (
    <>
      <DefaultSeo {...SEO} />
      <Layout isLoggedIn={isLoggedIn}>
        <Component {...pageProps} isLoggedIn={isLoggedIn} />
      </Layout>
    </>
  );
};

export default MyApp;
