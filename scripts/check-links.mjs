#!/usr/bin/env node
// Checks every outbound http(s) link in src/ (data files and components,
// not tests). Usage: npm run check-links
//
// Verdicts: "ok"; "dead" (404/410, TLS errors, or DNS errors that persist
// after one retry); "unverified" (other 4xx, or 5xx and network errors that
// persist after one retry); "skip" (sites that block automated requests).
// Exits with 2 on dead links, 0 otherwise (1 if the check itself breaks).
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EXTENSIONS = /\.(json|tsx?|jsx?)$/;
const URL_PATTERN = /https?:\/\/[^\s"'`<>)\]}\\]+/g;
const TIMEOUT_MS = 20000;
const RETRY_DELAY_MS = 10000;
const CONCURRENCY = 8;

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
const TEST_FILE = /\.(test|spec)\.[jt]sx?$/;
const TEST_DIR = /(^|\/)src\/test\//;

// Errors that mean the link itself is broken, not that the network hiccuped.
const DNS_ERRORS = new Set(['ENOTFOUND']);
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
  if (DNS_ERRORS.has(status) || TLS_ERROR.test(status)) {
    return 'dead';
  }
  return 'transient';
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Checks one URL, retrying once after a delay on 5xx and network errors.
 * @param {string} url
 * @param {{
 *   fetch?: (url: string, init: RequestInit) => Promise<{status: number}>,
 *   sleep?: () => Promise<void>,
 * }} [deps] injectable for tests
 * @returns {Promise<{verdict: 'ok' | 'dead' | 'unverified' | 'skip', status: string}>}
 */
export async function check(
  url,
  { fetch = globalThis.fetch, sleep = () => wait(RETRY_DELAY_MS) } = {},
) {
  if (UNVERIFIABLE.some((pattern) => pattern.test(url))) {
    return { verdict: 'skip', status: 'skip' };
  }
  /** @param {string} method */
  const request = async (method) => {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'Mozilla/5.0 (link-checker; elixir-on.cloud)' },
    });
    return response.status;
  };
  /** @param {unknown} error */
  const code = (error) => {
    const err = /** @type {{cause?: {code?: string}, name: string}} */ (error);
    return err.cause?.code || err.name;
  };
  /** @returns {Promise<number | string>} */
  const attempt = async () => {
    try {
      const status = await request('HEAD');
      if (status < 400) {
        return status;
      }
    } catch {
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
        `  ${status}  ${url}\n      in ${[...(urls.get(url) ?? [])].join(', ')}`,
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
