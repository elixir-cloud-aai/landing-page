import Script from 'next/script';

export default function GAScript() {
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
