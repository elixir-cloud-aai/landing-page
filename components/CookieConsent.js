import { useEffect } from 'react';
import pluginConfig from './CookieConsentConfig';
import 'vanilla-cookieconsent';

const CookieConsent = () => {
  useEffect(() => {
    if (!document.getElementById('cc--main')) {
      window.CookieConsentApi = window.initCookieConsent();
      window.CookieConsentApi.run(pluginConfig);
    }
  }, []);

  return null;
};

export default CookieConsent;
