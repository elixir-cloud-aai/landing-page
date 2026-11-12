import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  check,
  classify,
  collect,
  isTestFile,
} from '../../scripts/check-links.mjs';

const networkError = (code: string) =>
  Object.assign(new TypeError('fetch failed'), { cause: { code } });

describe('isTestFile', () => {
  it.each([
    'src/data/data.test.ts',
    'src/components/a.test.tsx',
    'src/test/setup.ts',
    'src/lib/foo.spec.ts',
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
  ])('%s is %s', (status, verdict) => expect(classify(status)).toBe(verdict));
});

describe('check', () => {
  const sleep = vi.fn(() => Promise.resolve());
  const response = (status: number) => Promise.resolve({ status });

  beforeEach(() => sleep.mockClear());

  it('skips unverifiable sites without fetching', async () => {
    const fetch = vi.fn();
    expect(await check('https://www.linkedin.com/x', { fetch, sleep })).toEqual(
      { verdict: 'skip', status: 'skip' },
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('falls back from HEAD to GET', async () => {
    const fetch = vi
      .fn()
      .mockReturnValueOnce(response(405))
      .mockReturnValueOnce(response(200));
    expect(await check('https://a.example', { fetch, sleep })).toEqual({
      verdict: 'ok',
      status: '200',
    });
    expect(fetch.mock.calls.map(([, init]) => init.method)).toEqual([
      'HEAD',
      'GET',
    ]);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('reports 404 as dead without retry', async () => {
    const fetch = vi.fn(() => response(404));
    expect(await check('https://a.example', { fetch, sleep })).toEqual({
      verdict: 'dead',
      status: '404',
    });
    expect(sleep).not.toHaveBeenCalled();
  });

  it('reports DNS errors as dead without retry', async () => {
    const fetch = vi.fn(() => Promise.reject(networkError('ENOTFOUND')));
    expect(await check('https://a.example', { fetch, sleep })).toEqual({
      verdict: 'dead',
      status: 'ENOTFOUND',
    });
    expect(sleep).not.toHaveBeenCalled();
  });

  it('retries a 5xx once and accepts a later success', async () => {
    const fetch = vi
      .fn()
      .mockReturnValueOnce(response(504))
      .mockReturnValueOnce(response(504))
      .mockReturnValueOnce(response(200));
    expect(await check('https://a.example', { fetch, sleep })).toEqual({
      verdict: 'ok',
      status: '200',
    });
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('reports a repeated 5xx as unverified', async () => {
    const fetch = vi.fn(() => response(503));
    expect(await check('https://a.example', { fetch, sleep })).toEqual({
      verdict: 'unverified',
      status: '503',
    });
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('reports repeated network errors as unverified', async () => {
    const fetch = vi.fn(() => Promise.reject(networkError('ECONNRESET')));
    expect(await check('https://a.example', { fetch, sleep })).toEqual({
      verdict: 'unverified',
      status: 'ECONNRESET',
    });
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('reports a timeout without a cause by its name', async () => {
    const timeout = Object.assign(new Error('t'), { name: 'TimeoutError' });
    const fetch = vi.fn(() => Promise.reject(timeout));
    expect((await check('https://a.example', { fetch, sleep })).status).toBe(
      'TimeoutError',
    );
  });
});
