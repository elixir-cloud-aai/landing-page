import Script from 'next/script';

// Defines the GA helpers only. Nothing is fetched from Google and no
// analytics cookie is set until the visitor opts in through the cookie
// banner, which then calls window.GAConsentGranted().
export default function GAScript() {
  const id = process.env.GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied'
        });

        window.GAConsentGranted = function () {
          gtag('consent', 'update', { analytics_storage: 'granted' });
          if (window.__gaLoaded) return;
          window.__gaLoaded = true;
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=${id}';
          document.head.appendChild(s);
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true });
        };

        window.GAConsentRevoked = function () {
          gtag('consent', 'update', { analytics_storage: 'denied' });
        };

        if (window.__pendingGAConsent) window.GAConsentGranted();
      `}
    </Script>
  );
}
