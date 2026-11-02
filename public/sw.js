// The site was a PWA until 2026, and browsers of past visitors still have the
// service worker of that time registered at this URL, serving cached pages.
// This one replaces it, clears its caches and removes itself. Written by hand,
// not generated: keep it until at least November 2027, when those browsers are
// unlikely to return.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // A failure here must not keep the worker from removing itself.
      const names = await caches.keys().catch(() => []);
      await Promise.allSettled(names.map((name) => caches.delete(name)));
      await self.registration.unregister();
      const pages = await self.clients.matchAll({ type: 'window' });
      await Promise.allSettled(pages.map((page) => page.navigate(page.url)));
    })(),
  );
});
