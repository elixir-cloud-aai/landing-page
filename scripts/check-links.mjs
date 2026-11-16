#!/usr/bin/env node
// Checks every outbound http(s) link in src/ (data files and components,
// not tests). Usage: npm run check-links
//
// Verdicts: "ok"; "dead" (404/410, TLS errors, DNS errors that persist
// after one retry, malformed URLs, and links or redirects to non-public
// addresses); "unverified" (other 4xx, or 5xx and network errors that
// persist after one retry); "skip" (sites that block automated requests).
// Exits with 2 on dead links, 0 otherwise (1 if the check itself breaks).
//
// Runs weekly on a GitHub-hosted runner. Each URL and each redirect target
// is resolved and checked before it is requested: loopback, private,
// link-local, carrier-grade NAT, cloud metadata and other reserved ranges
// are refused. This is a pre-check, not a guarantee: `fetch` resolves the
// name again, so a host whose DNS answer changes in between isn't caught.
// The check only reports status codes, never response bodies, and its step
// holds no token. Results need public DNS: resolvers that answer with
// private or synthetic addresses (some proxies, split-horizon DNS) make
// links look dead.
import { lookup as dnsLookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EXTENSIONS = /\.(json|tsx?|jsx?)$/;
const URL_PATTERN = /https?:\/\/[^\s"'`<>)\]}\\]+/g;
const TIMEOUT_MS = 20000;
const RETRY_DELAY_MS = 10000;
const CONCURRENCY = 8;
const MAX_REDIRECTS = 10;

// Not real destinations: examples, API bases, placeholders and templates.
const IGNORE = [
  /localhost|127\.0\.0\.1|your-wes-endpoint|your-domain|<host_url>/,
  /\$\{/,
  /^https?:\/\/(www\.)?w3\.org\//,
  /googletagmanager\.com|google-analytics\.com/,
  /schema\.org|ui\.shadcn\.com|magicui\.design\/r|aceternity\.com\/registry/,
  /api\.notion\.com/,
  /unpkg\.com\/three-globe/,
];

// Sites that block automated requests; listed as "skip" for a manual check.
const UNVERIFIABLE = [/linkedin\.com/, /join\.slack\.com/, /athenarc\.gr/];

// Test files hold fixture URLs that are not meant to resolve.
const TEST_FILE = /\.(test|spec)\.(json|[jt]sx?)$/;
const TEST_DIR = /(^|\/)src\/test\//;

// Errors that mean the link itself is broken, not that the network hiccuped.
const DNS_ERRORS = new Set(['ENOTFOUND']);
// Errors of the link itself, found without a request: no retry.
const INVALID_URL = 'ERR_INVALID_URL';
const NON_PUBLIC = 'NON_PUBLIC_ADDRESS';
const LINK_ERRORS = new Set([INVALID_URL, NON_PUBLIC]);
// Redirects the check doesn't follow: not judged.
const UNFOLLOWED = new Set(['TOO_MANY_REDIRECTS', 'REDIRECT_NOT_HTTP']);

// Addresses that are not on the public internet (IANA special-purpose
// registries), including the cloud metadata address 169.254.169.254.
// BlockList checks IPv4-mapped IPv6 addresses (::ffff:a.b.c.d) against the
// IPv4 ranges.
const NON_PUBLIC_RANGES = new BlockList();
for (const [network, prefix] of [
  ['0.0.0.0', 8], // "this" network
  ['10.0.0.0', 8], // private
  ['100.64.0.0', 10], // carrier-grade NAT
  ['127.0.0.0', 8], // loopback
  ['169.254.0.0', 16], // link-local, cloud metadata
  ['172.16.0.0', 12], // private
  ['192.0.0.0', 24], // IETF protocol assignments
  ['192.0.2.0', 24], // documentation
  ['192.168.0.0', 16], // private
  ['168.63.129.16', 32], // Azure platform services (WireServer)
  ['198.18.0.0', 15], // benchmarking
  ['198.51.100.0', 24], // documentation
  ['203.0.113.0', 24], // documentation
  ['224.0.0.0', 3], // multicast, reserved, broadcast
]) {
  NON_PUBLIC_RANGES.addSubnet(network, prefix, 'ipv4');
}
for (const [network, prefix] of [
  ['::', 96], // unspecified, loopback, IPv4-compatible
  ['::ffff:0:0:0', 96], // IPv4-translated
  ['64:ff9b::', 96], // IPv4/IPv6 translation (NAT64)
  ['64:ff9b:1::', 48], // local-use IPv4/IPv6 translation
  ['100::', 64], // discard
  ['2001:db8::', 32], // documentation
  ['2002::', 16], // 6to4
  ['fc00::', 7], // unique local, incl. cloud metadata (fd00:ec2::254)
  ['fe80::', 10], // link-local
  ['ff00::', 8], // multicast
]) {
  NON_PUBLIC_RANGES.addSubnet(network, prefix, 'ipv6');
}
const TLS_ERROR =
  /^(CERT_|ERR_TLS_|ERR_SSL_|UNABLE_TO_|DEPTH_ZERO_SELF_SIGNED_CERT$|SELF_SIGNED_CERT_IN_CHAIN$|HOSTNAME_MISMATCH$)/;

/**
 * Tells whether a path (relative, starting with `src/`) is a test file.
 * @param {string} path
 * @returns {boolean}
 */
export function isTestFile(path) {
  const posix = path.split(sep).join('/');
  return TEST_FILE.test(posix) || TEST_DIR.test(posix);
}

/**
 * @param {string} dir
 * @returns {AsyncGenerator<string>}
 */
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (EXTENSIONS.test(entry.name)) {
      yield path;
    }
  }
}

/**
 * Collects the outbound URLs in the source files under `root`.
 * @param {string} [root] directory that stands for `src/`
 * @returns {Promise<Map<string, Set<string>>>} URL to the files using it
 */
export async function collect(
  root = fileURLToPath(new URL('../src/', import.meta.url)),
) {
  const urls = new Map();
  for await (const file of walk(root)) {
    const name = `src/${relative(root, file).split(sep).join('/')}`;
    if (isTestFile(name)) {
      continue;
    }
    const text = await readFile(file, 'utf8');
    for (const match of text.matchAll(URL_PATTERN)) {
      const url = match[0].replace(/[.,;:]+$/, '');
      if (IGNORE.some((pattern) => pattern.test(url))) {
        continue;
      }
      if (!urls.has(url)) {
        urls.set(url, new Set());
      }
      urls.get(url).add(name);
    }
  }
  return urls;
}

/**
 * Tells whether an IP address is outside the public internet.
 * @param {string} address IPv4 or IPv6 address
 * @returns {boolean}
 */
export function isNonPublic(address) {
  const family = isIP(address);
  if (family === 0) {
    return true;
  }
  return NON_PUBLIC_RANGES.check(address, family === 4 ? 'ipv4' : 'ipv6');
}

/**
 * Resolves a host name to all its addresses.
 * @param {string} hostname
 * @returns {Promise<string[]>}
 */
const resolveAll = async (hostname) =>
  (await dnsLookup(hostname, { all: true, verbatim: true })).map(
    (entry) => entry.address,
  );

/**
 * Makes a string safe to print inside a Markdown code block: replaces
 * control characters (line breaks included) and backticks with `?`.
 * @param {string} text
 * @returns {string}
 */
export function plain(text) {
  return text.replace(/[\u0000-\u001f\u007f-\u009f`]/g, '?');
}

/**
 * Classifies an HTTP status or a network error code.
 * @param {number | string} status
 * @returns {'ok' | 'dead' | 'unverified' | 'transient'} "transient" means
 *   worth a retry
 */
export function classify(status) {
  if (typeof status === 'number') {
    if (status < 400) {
      return 'ok';
    }
    if (status === 404 || status === 410) {
      return 'dead';
    }
    return status >= 500 ? 'transient' : 'unverified';
  }
  if (
    DNS_ERRORS.has(status) ||
    TLS_ERROR.test(status) ||
    LINK_ERRORS.has(status)
  ) {
    return 'dead';
  }
  if (UNFOLLOWED.has(status)) {
    return 'unverified';
  }
  return 'transient';
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** An error with a code, as `code()` in `check()` reads it. */
class LinkError extends Error {
  /** @param {string} code */
  constructor(code) {
    super(code);
    this.code = code;
  }
}

/**
 * @typedef {{
 *   status: number,
 *   headers?: {get(name: string): string | null},
 *   body?: {cancel(): Promise<void>} | null,
 * }} FetchResponse
 */

/**
 * Checks one URL, retrying once after a delay on 5xx and network errors.
 * Follows redirects itself, so that every target is checked to be public.
 * @param {string} url
 * @param {{
 *   fetch?: (url: string, init: RequestInit) => Promise<FetchResponse>,
 *   lookup?: (hostname: string) => Promise<string[]>,
 *   sleep?: () => Promise<void>,
 * }} [deps] injectable for tests
 * @returns {Promise<{verdict: 'ok' | 'dead' | 'unverified' | 'skip', status: string}>}
 */
export async function check(
  url,
  {
    fetch = globalThis.fetch,
    lookup = resolveAll,
    sleep = () => wait(RETRY_DELAY_MS),
  } = {},
) {
  if (UNVERIFIABLE.some((pattern) => pattern.test(url))) {
    return { verdict: 'skip', status: 'skip' };
  }
  if (!URL.canParse(url)) {
    return { verdict: 'dead', status: INVALID_URL };
  }
  /** @param {URL} target */
  const assertPublic = async (target) => {
    // Brackets of IPv6 literals are not part of the address.
    const host = target.hostname.replace(/^\[|\]$/g, '');
    const addresses = isIP(host) ? [host] : await lookup(host);
    if (!addresses.length || addresses.some(isNonPublic)) {
      throw new LinkError(NON_PUBLIC);
    }
  };
  /** @param {string} method */
  const request = async (method) => {
    let target = new URL(url);
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await assertPublic(target);
      const response = await fetch(target.href, {
        method,
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          'user-agent': 'Mozilla/5.0 (link-checker; elixir-on.cloud)',
        },
      });
      // Only the status and headers count
      await response.body?.cancel().catch(() => {});
      const location = response.headers?.get('location');
      if (response.status < 300 || response.status >= 400 || !location) {
        return response.status;
      }
      if (!URL.canParse(location, target)) {
        throw new LinkError(INVALID_URL);
      }
      target = new URL(location, target);
      if (target.protocol !== 'http:' && target.protocol !== 'https:') {
        throw new LinkError('REDIRECT_NOT_HTTP');
      }
    }
    throw new LinkError('TOO_MANY_REDIRECTS');
  };
  /** @param {unknown} error */
  const code = (error) => {
    const err =
      /** @type {{cause?: {code?: string}, code?: unknown, name: string}} */ (
        error
      );
    // DOMExceptions (e.g. TimeoutError) have numeric codes: use the name.
    return (
      err.cause?.code || (typeof err.code === 'string' ? err.code : err.name)
    );
  };
  /** @returns {Promise<number | string>} */
  const attempt = async () => {
    try {
      const status = await request('HEAD');
      if (status < 400) {
        return status;
      }
    } catch (error) {
      // A malformed or non-public destination is the same for GET
      const headError = code(error);
      if (LINK_ERRORS.has(headError)) {
        return headError;
      }
      // Some servers drop HEAD requests; GET decides.
    }
    // Many servers reject HEAD; retry with GET before judging.
    try {
      return await request('GET');
    } catch (error) {
      return code(error);
    }
  };
  let status = await attempt();
  // A DNS failure can also be a short outage of the resolver: confirm it.
  if (classify(status) === 'transient' || DNS_ERRORS.has(String(status))) {
    await sleep();
    status = await attempt();
  }
  const verdict = classify(status);
  return {
    verdict: verdict === 'transient' ? 'unverified' : verdict,
    status: String(status),
  };
}

/** Exit code for dead links; other non-zero codes mean the check broke. */
export const DEAD_EXIT_CODE = 2;

/**
 * Builds the summary of a run.
 * @param {{url: string, verdict: string, status: string}[]} results
 * @param {Map<string, Set<string>>} urls URL to the files using it
 * @returns {{text: string, exitCode: number}}
 */
export function summarize(results, urls) {
  const dead = results.filter((result) => result.verdict === 'dead');
  const unverified = results.filter((r) => r.verdict === 'unverified');
  /** @param {{url: string, status: string}[]} list */
  const lines = (list) =>
    list.map(
      ({ url, status }) =>
        `  ${plain(status)}  ${plain(url)}\n      in ${[...(urls.get(url) ?? [])].map(plain).join(', ')}`,
    );
  const text = [
    `Checked ${urls.size} links, ${dead.length} dead, ${unverified.length} unverified.`,
    ...(dead.length ? ['', 'Dead:', ...lines(dead)] : []),
    ...(unverified.length
      ? ['', 'Unverified (not confirmed dead):', ...lines(unverified)]
      : []),
  ].join('\n');
  return { text, exitCode: dead.length ? DEAD_EXIT_CODE : 0 };
}

async function main() {
  const urls = await collect();
  const queue = [...urls.keys()];
  /** @type {{url: string, verdict: string, status: string}[]} */
  const results = [];
  const labels = { ok: 'ok  ', dead: 'DEAD', unverified: '????', skip: 'skip' };

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const url = /** @type {string} */ (queue.shift());
        const result = await check(url);
        console.log(
          `${labels[result.verdict]} ${result.status.padEnd(14)} ${url}`,
        );
        results.push({ url, ...result });
      }
    }),
  );

  const { text, exitCode } = summarize(results, urls);
  console.log(`\n${text}`);
  process.exit(exitCode);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main();
}
