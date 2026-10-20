#!/usr/bin/env node
// Offline README checker: relative links and images exist, #anchors resolve, images have alt text,
// and no secrets or local absolute paths slipped in. Zero dependencies; Node 18+; any OS.
//
// node check-readme.mjs README.md [more.md ...] [--online]
//   --online   also send a HEAD/GET request to each external http(s) link (slower; needs network)
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const files = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const online = process.argv.includes('--online');
if (!files.length) { console.error('Usage: node check-readme.mjs README.md [more.md ...] [--online]'); process.exit(2); }

let errors = 0;
let warnings = 0;
const report = (level, file, line, message) => {
  if (level === 'error') errors++; else warnings++;
  console.log(`${level === 'error' ? 'ERROR' : 'WARN '} ${file}:${line}  ${message}`);
};

/** GitHub-style heading slug (close to github-slugger): lower-case, keep letters/numbers/space/-/_ , spaces to -. */
const slug = (text) => text.trim().toLowerCase()
  .replace(/<[^>]+>/g, '').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*_~]/g, (c) => (c === '_' ? '_' : ''))
  .replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');

const SECRETS = [
  [/AKIA[0-9A-Z]{16}/, 'an AWS access key'],
  [/AIza[0-9A-Za-z_-]{35}/, 'a Google API key'],
  [/\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}/, 'an OpenAI/Anthropic-style secret key'],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}/, 'a GitHub token'],
  [/\bxox[abpr]-[A-Za-z0-9-]{10,}/, 'a Slack token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'a private key'],
  [/^\s*[A-Z][A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)\s*=\s*[^\s<{$]{8,}/, 'a filled-in secret assignment'],
];
const LOCAL_PATHS = /(?:\/home\/(?!user\b)[a-z][\w.-]*\/|\/Users\/(?!you\b|name\b)[A-Za-z][\w.-]*\/|[A-Z]:\\Users\\(?!USER\b|you\b)[^\\\s]+\\)/;

async function checkFile(file) {
  const path = resolve(file);
  if (!existsSync(path)) { report('error', file, 0, 'file not found'); return; }
  const base = dirname(path);
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);

  // Pass 1: anchors (headings + explicit ids), outside code fences.
  const anchors = new Set();
  const seen = new Map();
  let fence = null;
  lines.forEach((line) => {
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) { fence = fence ? (line.trim().startsWith(fence) ? null : fence) : f[1]; return; }
    if (fence) return;
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const id = slug(heading[1]);
      const count = seen.get(id) ?? 0;
      anchors.add(count ? `${id}-${count}` : id);
      seen.set(id, count + 1);
    }
    for (const m of line.matchAll(/<[a-z]+[^>]*\s(?:id|name)=["']([^"']+)["']/gi)) anchors.add(m[1].toLowerCase());
  });

  // Pass 2: links, images, secrets.
  const external = [];
  fence = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const n = i + 1;
    for (const [pattern, what] of SECRETS) if (pattern.test(line)) report('error', file, n, `looks like ${what}; remove it`);
    if (LOCAL_PATHS.test(line)) report('warn', file, n, 'contains a personal absolute path; use a relative or generic path');
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) { fence = fence ? (line.trim().startsWith(fence) ? null : fence) : f[1]; continue; }
    if (fence) continue;
    const plain = line.replace(/`[^`]*`/g, '');

    const targets = [];
    for (const m of plain.matchAll(/(!?)\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
      if (m[1] && !m[2].trim()) report('error', file, n, `image ${m[3]} has no alt text`);
      targets.push(m[3]);
    }
    for (const m of plain.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/g)) targets.push(m[1]);
    for (const m of plain.matchAll(/<img\b[^>]*>/gi)) {
      const alt = m[0].match(/\balt=["']([^"']*)["']/i);
      if (!alt || !alt[1].trim()) report('error', file, n, 'an <img> has no alt text');
    }
    for (const m of plain.matchAll(/\b(?:src|href|srcset)=["']([^"']+)["']/gi)) targets.push(m[1].split(/\s+/)[0]);

    for (const raw of targets) {
      if (/^(mailto:|tel:|data:)/i.test(raw)) continue;
      if (/^https?:\/\//i.test(raw)) { external.push([raw, n]); continue; }
      const [target, hash] = raw.split('#');
      if (!target) {
        if (hash && !anchors.has(decodeURIComponent(hash).toLowerCase())) {
          report('error', file, n, `#${hash} matches no heading or <a id>; add <a id="${hash}"></a> above the heading or fix the link`);
        }
        continue;
      }
      const local = resolve(base, decodeURIComponent(target.split('?')[0]));
      if (!existsSync(local)) report('error', file, n, `${target} does not exist`);
      else if (statSync(local).isFile() && statSync(local).size > 5 * 1024 * 1024 && /\.(gif|png|jpe?g|webp|mp4)$/i.test(local)) {
        report('warn', file, n, `${target} is larger than 5 MB; it will load slowly`);
      }
    }
  }

  if (online) {
    for (const [url, n] of external) {
      try {
        let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10_000) });
        if (response.status >= 400) response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(10_000) });
        if (response.status >= 400) report(response.status === 404 ? 'error' : 'warn', file, n, `${url} returned HTTP ${response.status}`);
      } catch (error) {
        report('warn', file, n, `${url} could not be reached (${error.cause?.code ?? error.name})`);
      }
    }
  }
}

for (const file of files) await checkFile(file);
console.log(`\n${errors} error(s), ${warnings} warning(s)${online ? '' : ' (external links not checked; add --online)'}`);
process.exitCode = errors ? 1 : 0;
