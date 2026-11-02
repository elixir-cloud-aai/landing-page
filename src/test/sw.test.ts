import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

type Listener = (event: { waitUntil: (work: Promise<void>) => void }) => void;

// Runs public/sw.js against a stand-in for the service worker's globals.
const loadWorker = () => {
  const listeners: Record<string, Listener> = {};
  const client = { url: 'https://example.org/', navigate: vi.fn() };
  const worker = {
    addEventListener: (type: string, listener: Listener) => {
      listeners[type] = listener;
    },
    skipWaiting: vi.fn(),
    registration: { unregister: vi.fn().mockResolvedValue(true) },
    clients: { matchAll: vi.fn().mockResolvedValue([client]) },
  };
  const caches = {
    keys: vi.fn().mockResolvedValue(['start-url', 'next-static']),
    delete: vi.fn().mockResolvedValue(true),
  };
  const source = readFileSync('public/sw.js', 'utf8');
  new Function('self', 'caches', source)(worker, caches);
  return { listeners, client, worker, caches };
};

describe('public/sw.js', () => {
  it('takes over from the old worker at once', () => {
    const { listeners, worker } = loadWorker();
    listeners.install({ waitUntil: () => undefined });
    expect(worker.skipWaiting).toHaveBeenCalled();
  });

  it('clears the caches, unregisters itself and reloads open pages', async () => {
    const { listeners, client, worker, caches } = loadWorker();
    let work: Promise<void> | undefined;
    listeners.activate({ waitUntil: (promise) => (work = promise) });
    await work;
    expect(caches.delete).toHaveBeenCalledWith('start-url');
    expect(caches.delete).toHaveBeenCalledWith('next-static');
    expect(worker.registration.unregister).toHaveBeenCalled();
    expect(client.navigate).toHaveBeenCalledWith(client.url);
  });
});
