import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

type Listener = (event: { waitUntil: (work: Promise<void>) => void }) => void;

// Runs public/sw.js against a stand-in for the service worker's globals.
const loadWorker = (navigate = vi.fn()) => {
  const listeners: Record<string, Listener> = {};
  const client = { url: 'https://example.org/', navigate };
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
  const source = readFileSync(resolve(__dirname, '../../public/sw.js'), 'utf8');
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

  it('finishes even if a page cannot be reloaded', async () => {
    const navigate = vi.fn().mockRejectedValue(new TypeError('not controlled'));
    const { listeners, worker } = loadWorker(navigate);
    let work: Promise<void> | undefined;
    listeners.activate({ waitUntil: (promise) => (work = promise) });
    await expect(work).resolves.toBeUndefined();
    expect(worker.registration.unregister).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('https://example.org/');
  });

  it('finishes even if the caches cannot be read', async () => {
    const { listeners, worker, caches } = loadWorker();
    caches.keys.mockRejectedValue(new Error('denied'));
    let work: Promise<void> | undefined;
    listeners.activate({ waitUntil: (promise) => (work = promise) });
    await expect(work).resolves.toBeUndefined();
    expect(worker.registration.unregister).toHaveBeenCalled();
  });

  it('waits for the caches to be cleared before unregistering', async () => {
    const { listeners, worker, caches } = loadWorker();
    let finishDeleting: (deleted: boolean) => void = () => undefined;
    caches.delete.mockReturnValue(
      new Promise((resolve) => (finishDeleting = resolve)),
    );
    let work: Promise<void> | undefined;
    listeners.activate({ waitUntil: (promise) => (work = promise) });
    await vi.waitFor(() => expect(caches.delete).toHaveBeenCalled());
    expect(worker.registration.unregister).not.toHaveBeenCalled();
    finishDeleting(true);
    await work;
    expect(worker.registration.unregister).toHaveBeenCalled();
  });
});
