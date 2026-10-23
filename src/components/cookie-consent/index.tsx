'use client';
import { FC, useEffect } from 'react';
import { useTheme } from 'next-themes';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CookieConsentApi from 'vanilla-cookieconsent';
import { CONTACT_EMAIL } from '@/lib/site';

// Apply the visitor's analytics choice. Runs on every page load once consent
// exists (onConsent) and whenever it changes (onChange), not just the first time.
const syncAnalytics = () => {
  if (process.env.NODE_ENV !== 'production') return;
  if (CookieConsentApi.acceptedCategory('analytics')) {
    if (window.GAConsentGranted) window.GAConsentGranted();
    // The GA helper may load after us; it checks this flag on startup.
    else window.__pendingGAConsent = true;
  } else {
    window.__pendingGAConsent = false;
    window.GAConsentRevoked?.();
  }
};

const pluginConfig: CookieConsentApi.CookieConsentConfig = {
  // Bump when the categories or the policy change, to ask everyone again.
  revision: 1,
  autoClearCookies: true,
  disablePageInteraction: false,
  guiOptions: {
    consentModal: {
      layout: 'box',
      position: 'bottom left',
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: 'box',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  onConsent: syncAnalytics,
  onChange: syncAnalytics,
  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      // GDPR: consent must be opt-in, so this is off until the visitor agrees.
      enabled: false,
      autoClear: {
        cookies: [{ name: /^_ga/ }, { name: '_gid' }],
      },
    },
  },
  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'Cookies on this site',
          description:
            'We use strictly necessary storage to remember your settings, such as theme and cookie choices. With your permission, we also use Google Analytics to understand how the site is used so we can improve it. <a class="cc-link" href="/privacy">Privacy policy</a>',
          acceptAllBtn: 'Accept analytics',
          acceptNecessaryBtn: 'Reject analytics',
          showPreferencesBtn: 'Manage preferences',
        },
        preferencesModal: {
          title: 'Cookie preferences',
          savePreferencesBtn: 'Save preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'How we use cookies',
              description:
                'You can change your choice at any time from the "Cookie settings" link in the footer. See our <a class="cc-link" href="/privacy">privacy policy</a> for details.',
            },
            {
              title: 'Strictly necessary',
              description:
                'Required for the site to work, for example to remember your theme and your cookie choices. These cannot be turned off.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Analytics',
              description:
                'Google Analytics cookies (_ga, _ga_*) that tell us which pages are visited and how visitors arrive, with IP anonymization enabled. Off unless you opt in.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Name',
                  provider: 'Provider',
                  expiration: 'Expires',
                },
                body: [
                  { name: '_ga', provider: 'Google', expiration: '2 years' },
                  { name: '_ga_*', provider: 'Google', expiration: '2 years' },
                ],
              },
            },
            {
              title: 'Questions',
              description: `For questions about cookies or your data, <a class="cc-link" href="mailto:${CONTACT_EMAIL}">contact us</a>.`,
            },
          ],
        },
      },
    },
  },
};

const CookieConsent: FC = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!document.getElementById('cc-main')) {
      CookieConsentApi.run(pluginConfig);
    }
  }, []);

  // Match the banner to the site theme.
  useEffect(() => {
    document.documentElement.classList.toggle(
      'cc--darkmode',
      resolvedTheme === 'dark',
    );
  }, [resolvedTheme]);

  return null;
};

export default CookieConsent;
