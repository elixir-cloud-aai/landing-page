import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  check,
  classify,
  collect,
  DEAD_EXIT_CODE,
  isNonPublic,
  isTestFile,
  plain,
  summarize,
} from '../../scripts/check-links.mjs';

const networkError = (code: string) =>
  Object.assign(new TypeError('fetch failed'), { cause: { code } });

describe('isTestFile', () => {
  it.each([
    'src/data/data.test.ts',
    'src/components/a.test.tsx',
    'src/test/setup.ts',
    'src/lib/foo.spec.ts',
    'src/data/fixture.test.json',
    'src/data/fixture.spec.json',
  ])('skips %s', (path) => expect(isTestFile(path)).toBe(true));

  it.each(['src/data/nodes.json', 'src/components/a.tsx', 'src/latest/a.ts'])(
    'keeps %s',
    (path) => expect(isTestFile(path)).toBe(false),
  );
});

describe('collect', () => {
  let root: string;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'links-'));
    await mkdir(join(root, 'test'));
    await mkdir(join(root, 'data'));
    await writeFile(
      join(root, 'data', 'a.json'),
      '{"u": "https://example.org/a.", "v": "http://localhost:3000"}',
    );
    await writeFile(
      join(root, 'data', 'b.tsx'),
      '<a href="https://example.org/a">',
    );
    await writeFile(
      join(root, 'data', 'b.test.tsx'),
      '"https://fixture.example/x"',
    );
    await writeFile(
      join(root, 'data', 'c.test.json'),
      '{"u": "https://json-fixture.example/z"}',
    );
    await writeFile(
      join(root, 'test', 'setup.ts'),
      '"https://setup.example/y"',
    );
    await writeFile(join(root, 'data', 'notes.md'), 'https://other.example/');
  });

  afterEach(() => rm(root, { recursive: true, force: true }));

  it('collects source URLs, skipping tests, ignored URLs and other files', async () => {
    const urls = await collect(root);
    expect([...urls.keys()]).toEqual(['https://example.org/a']);
    expect([...urls.get('https://example.org/a')!].sort()).toEqual([
      'src/data/a.json',
      'src/data/b.tsx',
    ]);
  });
});

describe('classify', () => {
  it.each([
    [200, 'ok'],
    [301, 'ok'],
    [404, 'dead'],
    [410, 'dead'],
    [403, 'unverified'],
    [429, 'unverified'],
    [500, 'transient'],
    [504, 'transient'],
    ['ENOTFOUND', 'dead'],
    ['CERT_HAS_EXPIRED', 'dead'],
    ['ERR_TLS_CERT_ALTNAME_INVALID', 'dead'],
    ['UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'dead'],
    ['DEPTH_ZERO_SELF_SIGNED_CERT', 'dead'],
    ['ECONNRESET', 'transient'],
    ['EAI_AGAIN', 'transient'],
    ['TimeoutError', 'transient'],
    ['ERR_INVALID_URL', 'dead'],
    ['NON_PUBLIC_ADDRESS', 'dead'],
    ['TOO_MANY_REDIRECTS', 'unverified'],
    ['REDIRECT_NOT_HTTP', 'unverified'],
  ])('%s is %s', (status, verdict) => expect(classify(status)).toBe(verdict));
});

describe('isNonPublic', () => {
  // One address per range, plus the edges of some
  it.each([
    '0.0.0.0',
    '10.1.2.3',
    '100.64.0.1',
    '100.127.255.255',
    '127.0.0.1',
    '168.63.129.16',
    '169.254.169.254',
    '172.16.0.1',
    '172.31.255.255',
    '192.0.0.8',
    '192.0.2.1',
    '192.168.1.1',
    '198.18.0.1',
    '198.19.255.255',
    '198.51.100.1',
    '203.0.113.1',
    '224.0.0.1',
    '240.0.0.1',
    '255.255.255.255',
    '::',
    '::1',
    '::7f00:1',
    '::ffff:127.0.0.1',
    '::ffff:a9fe:a9fe',
    '::ffff:0:a9fe:a9fe',
    '64:ff9b::a9fe:a9fe',
    '64:ff9b:1::1',
    '100::1',
    '2001:db8::1',
    '2002:7f00:1::',
    'fc00::1',
    'fd00:ec2::254',
    'fe80::1',
    'ff02::1',
    'not-an-address',
  ])('refuses %s', (address) => expect(isNonPublic(address)).toBe(true));

  it.each([
    '8.8.8.8',
    '93.184.215.14',
    '100.63.255.255',
    '100.128.0.1',
    '168.63.129.17',
    '172.15.255.255',
    '172.32.0.1',
    '198.17.255.255',
    '223.255.255.255',
    '::ffff:8.8.8.8',
    '2606:4700::1111',
  ])('accepts %s', (address) => expect(isNonPublic(address)).toBe(false));
});

describe('plain', () => {
  it('replaces line breaks, control characters and backticks', () => {
    expect(plain('src/a\n```\n# b\u0007.tsx')).toBe('src/a?????# b?.tsx');
  });

  it('keeps ordinary paths and URLs', () => {
    expect(plain('src/data/a b(1).json')).toBe('src/data/a b(1).json');
  });
});

// Shared by the tests of `check`
const sleep = vi.fn(() => Promise.resolve());
// Resolves every host to a public address (documentation ranges count as
// non-public)
const lookup = vi.fn(() => Promise.resolve(['93.184.215.14']));
const response = (status: number, location?: string) =>
  Promise.resolve({
    status,
    headers: new Headers(location ? { location } : {}),
  });
const methods = (fetch: ReturnType<typeof vi.fn>) =>
  fetch.mock.calls.map(([, init]) => init.method);
const targets = (fetch: ReturnType<typeof vi.fn>) =>
  fetch.mock.calls.map(([url]) => url);

describe('check', () => {
  beforeEach(() => {
    sleep.mockClear();
    lookup.mockClear();
  });

  it('skips unverifiable sites without fetching', async () => {
    const fetch = vi.fn();
    expect(
      await check('https://www.linkedin.com/x', { fetch, lookup, sleep }),
    ).toEqual({ verdict: 'skip', status: 'skip' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('falls back from HEAD to GET', async () => {
    const fetch = vi
      .fn()
      .mockReturnValueOnce(response(405))
      .mockReturnValueOnce(response(200));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'ok',
      status: '200',
    });
    expect(methods(fetch)).toEqual(['HEAD', 'GET']);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('reports 404 as dead without retry', async () => {
    const fetch = vi.fn(() => response(404));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'dead',
      status: '404',
    });
    expect(sleep).not.toHaveBeenCalled();
  });

  it('confirms DNS errors with one retry before calling them dead', async () => {
    const fetch = vi.fn(() => Promise.reject(networkError('ENOTFOUND')));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'dead',
      status: 'ENOTFOUND',
    });
    expect(methods(fetch)).toEqual(['HEAD', 'GET', 'HEAD', 'GET']);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('accepts a link whose DNS error clears on the retry', async () => {
    const fetch = vi
      .fn()
      .mockReturnValueOnce(Promise.reject(networkError('ENOTFOUND')))
      .mockReturnValueOnce(Promise.reject(networkError('ENOTFOUND')))
      .mockReturnValueOnce(response(200));
    expect(
      (await check('https://a.example', { fetch, lookup, sleep })).verdict,
    ).toBe('ok');
  });

  it('reports TLS errors as dead without retry', async () => {
    const fetch = vi.fn(() => Promise.reject(networkError('CERT_HAS_EXPIRED')));
    expect(
      (await check('https://a.example', { fetch, lookup, sleep })).verdict,
    ).toBe('dead');
    expect(sleep).not.toHaveBeenCalled();
  });

  it('tries GET when HEAD fails with a network error', async () => {
    const fetch = vi
      .fn()
      .mockReturnValueOnce(Promise.reject(networkError('ECONNRESET')))
      .mockReturnValueOnce(response(200));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'ok',
      status: '200',
    });
    expect(methods(fetch)).toEqual(['HEAD', 'GET']);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('retries a 5xx once and accepts a later success', async () => {
    const fetch = vi
      .fn()
      .mockReturnValueOnce(response(504))
      .mockReturnValueOnce(response(504))
      .mockReturnValueOnce(response(200));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'ok',
      status: '200',
    });
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('reports a repeated 5xx as unverified', async () => {
    const fetch = vi.fn(() => response(503));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'unverified',
      status: '503',
    });
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('reports repeated network errors as unverified', async () => {
    const fetch = vi.fn(() => Promise.reject(networkError('ECONNRESET')));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'unverified',
      status: 'ECONNRESET',
    });
    expect(methods(fetch)).toEqual(['HEAD', 'GET', 'HEAD', 'GET']);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('reports a repeated timeout as unverified, by its name', async () => {
    const timeout = Object.assign(new Error('t'), { name: 'TimeoutError' });
    const fetch = vi.fn(() => Promise.reject(timeout));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'unverified',
      status: 'TimeoutError',
    });
    expect(methods(fetch)).toEqual(['HEAD', 'GET', 'HEAD', 'GET']);
    expect(sleep).toHaveBeenCalledTimes(1);
  });
});

describe('check: destinations and redirects', () => {
  beforeEach(() => {
    sleep.mockClear();
    lookup.mockClear();
  });

  it('reports a malformed URL as dead without a request', async () => {
    const fetch = vi.fn();
    expect(await check('https://[', { fetch, lookup, sleep })).toEqual({
      verdict: 'dead',
      status: 'ERR_INVALID_URL',
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(sleep).not.toHaveBeenCalled();
  });

  it.each([
    'http://169.254.169.254/latest/meta-data/',
    'http://127.0.0.1:8080/',
    'http://10.0.0.1/',
    'http://[::1]/',
    'http://[fd00:ec2::254]/',
    'http://[::ffff:127.0.0.1]/',
    'http://2130706433/',
  ])('refuses %s without a request', async (url) => {
    const fetch = vi.fn();
    expect(await check(url, { fetch, lookup, sleep })).toEqual({
      verdict: 'dead',
      status: 'NON_PUBLIC_ADDRESS',
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(lookup).not.toHaveBeenCalled();
    expect(sleep).not.toHaveBeenCalled();
  });

  it.each([
    { name: 'a private address', addresses: ['10.0.0.1'] },
    {
      name: 'a private and a public address',
      addresses: ['93.184.215.14', '192.168.0.1'],
    },
    { name: 'no address', addresses: [] },
  ])('refuses a host that resolves to $name', async ({ addresses }) => {
    const fetch = vi.fn();
    const lookup = vi.fn(() => Promise.resolve(addresses));
    expect(
      await check('https://intranet.example', { fetch, lookup, sleep }),
    ).toEqual({ verdict: 'dead', status: 'NON_PUBLIC_ADDRESS' });
    expect(lookup).toHaveBeenCalledWith('intranet.example');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('confirms a DNS error of the lookup with one retry', async () => {
    const fetch = vi.fn();
    const lookup = vi.fn(() =>
      Promise.reject(Object.assign(new Error('x'), { code: 'ENOTFOUND' })),
    );
    expect(
      await check('https://gone.example', { fetch, lookup, sleep }),
    ).toEqual({ verdict: 'dead', status: 'ENOTFOUND' });
    expect(lookup).toHaveBeenCalledTimes(4);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('follows redirects to public addresses, checking each target', async () => {
    const fetch = vi
      .fn()
      .mockReturnValueOnce(response(301, '/b'))
      .mockReturnValueOnce(response(302, 'https://c.example/c'))
      .mockReturnValueOnce(response(200));
    expect(
      await check('https://a.example/a', {
        fetch,
        lookup,
        sleep,
      }),
    ).toEqual({ verdict: 'ok', status: '200' });
    expect(targets(fetch)).toEqual([
      'https://a.example/a',
      'https://a.example/b',
      'https://c.example/c',
    ]);
    expect(
      fetch.mock.calls.every(([, init]) => init.redirect === 'manual'),
    ).toBe(true);
    expect(lookup.mock.calls).toEqual([
      ['a.example'],
      ['a.example'],
      ['c.example'],
    ]);
  });

  it('refuses a redirect to a non-public address', async () => {
    const fetch = vi.fn(() =>
      response(302, 'http://169.254.169.254/latest/meta-data/'),
    );
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'dead',
      status: 'NON_PUBLIC_ADDRESS',
    });
    // HEAD stops at the redirect; GET would end the same way
    expect(targets(fetch)).toEqual(['https://a.example/']);
    expect(methods(fetch)).toEqual(['HEAD']);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('refuses a redirect to a host that resolves to a private address', async () => {
    const fetch = vi.fn(() => response(301, 'https://internal.example/'));
    const lookup = vi.fn((host: string) =>
      Promise.resolve(host === 'internal.example' ? ['10.1.1.1'] : ['8.8.8.8']),
    );
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'dead',
      status: 'NON_PUBLIC_ADDRESS',
    });
    expect(targets(fetch)).not.toContain('https://internal.example/');
  });

  it('reports a malformed redirect target as dead', async () => {
    const fetch = vi.fn(() => response(301, 'http://['));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'dead',
      status: 'ERR_INVALID_URL',
    });
    expect(methods(fetch)).toEqual(['HEAD']);
  });

  it('leaves a redirect to another scheme unverified', async () => {
    const fetch = vi.fn(() => response(302, 'mailto:info@a.example'));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'unverified',
      status: 'REDIRECT_NOT_HTTP',
    });
    expect(sleep).not.toHaveBeenCalled();
  });

  it('stops after too many redirects', async () => {
    const fetch = vi.fn(() => response(301, '/loop'));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'unverified',
      status: 'TOO_MANY_REDIRECTS',
    });
    // 11 requests (the URL and 10 redirects) for HEAD and for GET
    expect(fetch).toHaveBeenCalledTimes(22);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('lets GET decide when HEAD ends in a redirect loop', async () => {
    const fetch = vi.fn((...[, init]: [string, RequestInit]) =>
      init.method === 'HEAD' ? response(301, '/loop') : response(200),
    );
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'ok',
      status: '200',
    });
    expect(methods(fetch).at(-1)).toBe('GET');
  });

  it('discards the body of every response', async () => {
    const cancel = vi.fn(() => Promise.reject(new Error('already closed')));
    const fetch = vi
      .fn()
      .mockReturnValueOnce(
        Promise.resolve({
          status: 301,
          headers: new Headers({ location: '/b' }),
          body: { cancel },
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          status: 200,
          headers: new Headers(),
          body: { cancel },
        }),
      );
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'ok',
      status: '200',
    });
    expect(cancel).toHaveBeenCalledTimes(2);
  });

  it('accepts a 3xx without a location as it is', async () => {
    const fetch = vi.fn(() => response(304));
    expect(await check('https://a.example', { fetch, lookup, sleep })).toEqual({
      verdict: 'ok',
      status: '304',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('summarize', () => {
  const urls = new Map([
    ['https://a.example', new Set(['src/a.json'])],
    ['https://b.example', new Set(['src/b.tsx', 'src/c.tsx'])],
    ['https://c.example', new Set(['src/a.json'])],
  ]);

  it('passes when nothing is dead, listing unverified links', () => {
    const { text, exitCode } = summarize(
      [
        { url: 'https://a.example', verdict: 'ok', status: '200' },
        { url: 'https://b.example', verdict: 'unverified', status: '503' },
      ],
      urls,
    );
    expect(exitCode).toBe(0);
    expect(text).toContain('Checked 3 links, 0 dead, 1 unverified.');
    expect(text).toContain('Unverified (not confirmed dead):');
    expect(text).toContain(
      '503  https://b.example\n      in src/b.tsx, src/c.tsx',
    );
    expect(text).not.toContain('Dead:');
  });

  it('fails with its own exit code when a link is dead', () => {
    const { text, exitCode } = summarize(
      [
        { url: 'https://a.example', verdict: 'dead', status: '404' },
        { url: 'https://b.example', verdict: 'unverified', status: '403' },
        { url: 'https://c.example', verdict: 'skip', status: 'skip' },
      ],
      urls,
    );
    expect(exitCode).toBe(DEAD_EXIT_CODE);
    expect(DEAD_EXIT_CODE).toBe(2);
    expect(text).toMatch(/Dead:\n {2}404 {2}https:\/\/a\.example/);
    expect(text.indexOf('Dead:')).toBeLessThan(text.indexOf('Unverified'));
  });

  it('prints file names and URLs as plain text', () => {
    const { text } = summarize(
      [{ url: 'https://a.example', verdict: 'dead', status: '404' }],
      new Map([['https://a.example', new Set(['src/a\n```\n# b.json'])]]),
    );
    expect(text).toContain('in src/a?????# b.json');
    expect(text).not.toContain('`');
    expect(text.split('\n')).toHaveLength(5);
  });

  it('prints only the count when every link is fine', () => {
    expect(summarize([], new Map()).text).toBe(
      'Checked 0 links, 0 dead, 0 unverified.',
    );
  });
});
