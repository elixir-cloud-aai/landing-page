// The site was a PWA until 2026, and browsers of past visitors still have the
// service worker of that time registered at this URL, serving cached pages.
// This one replaces it, clears its caches and removes itself. The file has to
// stay until those registrations can be assumed gone.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
      await self.registration.unregister();
      const pages = await self.clients.matchAll({ type: 'window' });
      pages.forEach((page) => page.navigate(page.url));
    })(),
  );
});
