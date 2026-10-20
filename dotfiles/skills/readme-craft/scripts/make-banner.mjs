#!/usr/bin/env node
// Generate a matching pair of README banners (light + dark SVG) to customise by hand.
// Zero dependencies; works on Windows, macOS and Linux with Node 18+.
//
// node make-banner.mjs --title "reelfn" --highlight "fn" --tagline "Your reel, as a function of an idea." \
//   --code "reel = f(idea)" --features "Narrated · captioned · on-brand" --motif cards --out docs/assets
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const HELP = `Usage: node make-banner.mjs --title <name> [options]

  --title <text>       Project name (required), drawn large
  --highlight <text>   Part of the title to draw in the accent colour (e.g. the last letters)
  --tagline <text>     One line under the title
  --code <text>        Optional monospace line (a tiny code idea, e.g. "reel = f(idea)")
  --features <text>    Optional small line, e.g. "Fast · Typed · Tiny"
  --motif <name>       Right-hand illustration: cards | terminal | nodes | bars | none   (default: cards)
  --accent <#hex>      Accent colour for dark banner (default #FFB547)
  --accent2 <#hex>     Second accent for dark banner (default #4FD1C5)
  --out <dir>          Output folder (default: docs/assets)

Writes banner-dark.svg and banner-light.svg. Then LOOK at them (rasterise to PNG) and customise the motif.`;

const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--help' || argv[i] === '-h') { console.log(HELP); process.exit(0); }
  if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[i + 1]?.startsWith('--') ? '' : argv[++i];
}
if (!args.title) { console.error(HELP); process.exit(2); }

const esc = (text = '') => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const SANS = "ui-sans-serif, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/** Lighten-for-light-theme: darker variants of the accents keep contrast on a pale background. */
const darken = (hex, amount = 0.38) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const ch = (shift) => Math.round(((n >> shift) & 255) * (1 - amount)).toString(16).padStart(2, '0');
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};

const accent = args.accent || '#FFB547';
const accent2 = args.accent2 || '#4FD1C5';
const palettes = {
  dark: { bg: '#101114', panel: '#17181C', border: '#2C2F36', text: '#F2F2F0', muted: '#9E9E98', accent, accent2 },
  light: { bg: '#F7F5F0', panel: '#EFECE5', border: '#D3CEC3', text: '#16161A', muted: '#5E5E66', accent: darken(accent), accent2: darken(accent2) },
};

function title(p, y) {
  const name = args.title;
  const hl = args.highlight && name.lastIndexOf(args.highlight);
  // Long names get a smaller size so they never collide with the motif.
  const size = Math.max(48, Math.min(96, Math.floor(1100 / Math.max(name.length, 6))));
  const body = hl > -1 && args.highlight
    ? `${esc(name.slice(0, hl))}<tspan fill="${p.accent}">${esc(args.highlight)}</tspan>${esc(name.slice(hl + args.highlight.length))}`
    : esc(name);
  return `<text x="72" y="${y}" font-family="${SANS}" font-size="${size}" font-weight="700" letter-spacing="-2" fill="${p.text}">${body}</text>`;
}

const motifs = {
  none: () => '',
  cards: (p) => [0, 1, 2].map((i) => {
    const x = 860 + i * 130, y = i === 1 ? 34 : 50, hl = i === 1 ? p.accent2 : p.accent;
    return `<g transform="translate(${x},${y})">
    <rect width="120" height="213" rx="14" fill="${p.panel}" stroke="${p.border}" stroke-width="2"/>
    <rect x="14" y="28" width="70" height="8" rx="4" fill="${p.text}" opacity="0.9"/>
    <rect x="14" y="48" width="92" height="44" rx="6" fill="${p.bg}" stroke="${p.border}"/>
    <rect x="22" y="58" width="50" height="5" rx="2.5" fill="${p.muted}"/>
    <rect x="22" y="70" width="64" height="5" rx="2.5" fill="${p.muted}"/>
    <rect x="22" y="82" width="38" height="5" rx="2.5" fill="${hl}"/>
    <rect x="14" y="110" width="${30 + 22 * i}" height="10" rx="5" fill="${hl}"/>
    <rect x="14" y="128" width="${80 - 18 * i}" height="10" rx="5" fill="${p.muted}" opacity="0.6"/>
    <rect x="30" y="182" width="60" height="6" rx="3" fill="${p.text}" opacity="0.75"/>
  </g>`;
  }).join('\n  '),
  terminal: (p) => `<g transform="translate(830,48)">
    <rect width="390" height="204" rx="14" fill="${p.panel}" stroke="${p.border}" stroke-width="2"/>
    <circle cx="24" cy="22" r="6" fill="#FF5F57"/><circle cx="44" cy="22" r="6" fill="#FEBC2E"/><circle cx="64" cy="22" r="6" fill="#28C840"/>
    <text x="24" y="72" font-family="${MONO}" font-size="18" fill="${p.accent}">$ <tspan fill="${p.text}">${esc(args.title)}</tspan></text>
    <text x="24" y="104" font-family="${MONO}" font-size="16" fill="${p.muted}">✔ ready</text>
    <rect x="24" y="126" width="220" height="8" rx="4" fill="${p.muted}" opacity="0.5"/>
    <rect x="24" y="146" width="160" height="8" rx="4" fill="${p.accent2}"/>
    <rect x="24" y="174" width="12" height="18" fill="${p.text}" opacity="0.8"/>
  </g>`,
  nodes: (p) => {
    const pts = [[880, 90], [990, 60], [1100, 120], [960, 200], [1190, 70], [1170, 220]];
    const edges = [[0, 1], [1, 2], [0, 3], [3, 2], [2, 4], [2, 5]];
    return `${edges.map(([a, b]) => `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="${p.border}" stroke-width="3"/>`).join('')}
  ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 2 ? 22 : 14}" fill="${i === 2 ? p.accent : i % 2 ? p.accent2 : p.panel}" stroke="${p.border}" stroke-width="2"/>`).join('')}`;
  },
  bars: (p) => [70, 120, 95, 160, 135, 190].map((h, i) =>
    `<rect x="${860 + i * 62}" y="${250 - h}" width="40" height="${h}" rx="6" fill="${i === 5 ? p.accent : i % 2 ? p.accent2 : p.border}"/>`).join('\n  '),
};

function banner(p) {
  const motif = motifs[args.motif || 'cards'];
  if (!motif) { console.error(`Unknown motif "${args.motif}". Use: ${Object.keys(motifs).join(', ')}`); process.exit(2); }
  // Centre the text block vertically: the more lines under the title, the higher the title sits.
  const count = [args.code, args.tagline, args.features].filter(Boolean).length;
  const titleY = [175, 140, 122, 104][count];
  let y = titleY + 50;
  const lines = [];
  if (args.code) { lines.push(`<text x="76" y="${y}" font-family="${MONO}" font-size="26" fill="${p.muted}">${esc(args.code)}</text>`); y += 42; }
  if (args.tagline) { lines.push(`<text x="76" y="${y}" font-family="${SANS}" font-size="24" fill="${p.text}" opacity="0.85">${esc(args.tagline)}</text>`); y += 38; }
  if (args.features) lines.push(`<text x="76" y="${y}" font-family="${SANS}" font-size="20" fill="${p.muted}">${esc(args.features)}</text>`);
  const label = `${args.title}${args.tagline ? `: ${args.tagline}` : ''}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="300" viewBox="0 0 1280 300" role="img" aria-label="${esc(label)}">
  <title>${esc(label)}</title>
  <rect width="1280" height="300" rx="20" fill="${p.bg}"/>
  ${title(p, titleY)}
  ${lines.join('\n  ')}
  ${motif(p)}
</svg>
`;
}

const out = resolve(args.out || join('docs', 'assets'));
mkdirSync(out, { recursive: true });
for (const [name, palette] of Object.entries(palettes)) {
  writeFileSync(join(out, `banner-${name}.svg`), banner(palette));
  console.log(`wrote ${join(out, `banner-${name}.svg`)}`);
}
console.log('Next: rasterise both to PNG and look at them (see references/visuals.md), then customise the motif.');
