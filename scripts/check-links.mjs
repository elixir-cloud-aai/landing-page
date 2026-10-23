#!/usr/bin/env node
// Checks every outbound http(s) link in src/ (data files and components) and
// exits non-zero if any is dead. Usage: npm run check-links
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;
const EXTENSIONS = /\.(json|tsx?|jsx?)$/;
const URL_PATTERN = /https?:\/\/[^\s"'`<>)\]}\\]+/g;
const TIMEOUT_MS = 20000;
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
const UNVERIFIABLE = [/linkedin\.com/, /join\.slack\.com/];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXTENSIONS.test(entry.name)) yield path;
  }
}

async function collect() {
  const urls = new Map();
  for await (const file of walk(ROOT)) {
    const text = await readFile(file, 'utf8');
    for (const match of text.matchAll(URL_PATTERN)) {
      const url = match[0].replace(/[.,;:]+$/, '');
      if (IGNORE.some((pattern) => pattern.test(url))) continue;
      if (!urls.has(url)) urls.set(url, new Set());
      urls.get(url).add(file.replace(ROOT, 'src/'));
    }
  }
  return urls;
}

async function check(url) {
  if (UNVERIFIABLE.some((pattern) => pattern.test(url))) {
    return { ok: true, status: 'skip' };
  }
  const attempt = async (method) => {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'Mozilla/5.0 (link-checker; elixir-on.cloud)' },
    });
    return response.status;
  };
  try {
    let status = await attempt('HEAD');
    // Many servers reject HEAD; retry with GET before calling it dead.
    if (status >= 400) status = await attempt('GET');
    // 429 means rate limited, not dead.
    return { ok: status < 400 || status === 429, status: String(status) };
  } catch (error) {
    return { ok: false, status: error.cause?.code || error.name };
  }
}

const urls = await collect();
const queue = [...urls.keys()];
const failures = [];

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const url = queue.shift();
      const result = await check(url);
      const label =
        result.status === 'skip' ? 'skip' : result.ok ? 'ok  ' : 'DEAD';
      console.log(`${label} ${result.status.padEnd(14)} ${url}`);
      if (!result.ok) failures.push({ url, ...result });
    }
  }),
);

console.log(`\nChecked ${urls.size} links, ${failures.length} dead.`);
for (const { url, status } of failures) {
  console.log(`  ${status}  ${url}\n      in ${[...urls.get(url)].join(', ')}`);
}
process.exit(failures.length ? 1 : 0);
