#!/usr/bin/env node
// build-paste-body.mjs - render a content-ops draft into the rich-text body you paste into the Substack
// editor: published prose as HTML, each :::embed/:::image block replaced by a numbered ⛳ N/TOTAL marker
// line so you know exactly what media goes where. TOTAL is AUTO-COUNTED from the draft's media blocks -
// no hand-edited constant (retro 2026-07-09; the old scratchpad build_paste_body.py hardcoded TOTAL and
// had to be re-edited every time the media set changed 9->5->4).
//
// Usage: node scripts/build-paste-body.mjs <draft-file.md> [--out <path>]
//        default out: <draft-dir>/.render/paste-body.html   (predictable, per-draft, gitignored)
// Prints the resolved output path and the auto-counted media manifest to stdout.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parseDraft, renderMarkdown, escapeHtml } from './lib/draft-parse.mjs';

const TYPE_LABEL = { video: 'VIDEO', tweet: 'TWEET', image: 'IMAGE', embed: 'EMBED' };

function parseArgs(argv) {
  const args = argv.slice(2);
  let out = null;
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out') { out = args[++i]; continue; }
    if (args[i].startsWith('--')) { console.error(`unknown flag ${args[i]}`); process.exit(2); }
    positional.push(args[i]);
  }
  if (positional.length !== 1) {
    console.error('usage: node scripts/build-paste-body.mjs <draft-file.md> [--out <path>]');
    process.exit(2);
  }
  return { draft: positional[0], out };
}

const { draft, out } = parseArgs(process.argv);
let text;
try { text = readFileSync(draft, 'utf8'); }
catch (e) { console.error(`cannot read ${draft}: ${e.message}`); process.exit(2); }

const { title, subtitle, blocks, mediaCount } = parseDraft(text);

// Walk blocks; render prose/code as HTML, media as a numbered marker line.
const parts = [];
const manifest = [];
let n = 0;
for (const b of blocks) {
  if (b.kind === 'markdown') { parts.push(renderMarkdown(b.text)); continue; }
  if (b.kind === 'code') { parts.push(`<pre><code>${escapeHtml(b.text)}</code></pre>`); continue; }
  // media
  n += 1;
  const m = b.media;
  const label = TYPE_LABEL[m.type] || 'MEDIA';
  const target = m.type === 'image' ? (m.target || m.rendered || '(image)') : (m.target || '(url)');
  const risky = m.risky ? ' [EMBED-RISKY: screenshot fallback]' : '';
  const why = m.why ? ` (WHY: ${m.why})` : '';
  const marker = `⛳ ${n}/${mediaCount} ${label}: ${target}${risky}${why}`;
  parts.push(`<p data-media-marker="${n}"><strong>${escapeHtml(marker)}</strong></p>`);
  manifest.push({ n, label, target, risky: m.risky, why: m.why || '' });
}

const bodyHtml = parts.join('\n');
const doc = `<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title || 'paste body')}</title></head>
<body>
${title ? `<h1>${escapeHtml(title)}</h1>` : ''}
${subtitle ? `<p><em>${escapeHtml(subtitle)}</em></p>` : ''}
${bodyHtml}
</body></html>
`;

const outPath = out ? resolve(out) : join(dirname(resolve(draft)), '.render', 'paste-body.html');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, doc, 'utf8');

console.log(`paste body -> ${outPath}`);
console.log(`media markers (auto-counted TOTAL = ${mediaCount}):`);
if (mediaCount === 0) console.log('  (none - no :::embed/:::image blocks in this draft)');
for (const item of manifest) {
  console.log(`  ⛳ ${item.n}/${mediaCount} ${item.label}: ${item.target}${item.risky ? ' [EMBED-RISKY]' : ''}`);
}
console.log('Next: run scripts/load-clipboard.sh LAST (after any headless-Chrome render) to load this as the rich-text clipboard.');
