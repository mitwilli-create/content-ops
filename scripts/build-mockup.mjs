#!/usr/bin/env node
// build-mockup.mjs - render a content-ops draft into a Substack-styled HTML preview so Mitchell can see
// the piece the way it will read, with media placed in position: YouTube thumbnails, inline images, the
// callout box, and the code template. Takes the draft path as an ARGUMENT (no hardcoded SRC/OUT/vN name;
// retro 2026-07-09 - the old scratchpad build_mockup.py had all three baked in and was recovered and
// re-pointed every session).
//
// Usage: node scripts/build-mockup.mjs <draft-file.md> [--out <path>]
//        default out: <draft-dir>/.render/mockup.html   (predictable, per-draft, gitignored)
// Open with: open -a "Google Chrome" <out>   (the Chrome MCP mangles file:// URLs; use real Chrome or a
// headless screenshot). Images resolve via absolute paths so the preview works from any --out location.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parseDraft, renderMarkdown, escapeHtml, youtubeId } from './lib/draft-parse.mjs';

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
    console.error('usage: node scripts/build-mockup.mjs <draft-file.md> [--out <path>]');
    process.exit(2);
  }
  return { draft: positional[0], out };
}

const { draft, out } = parseArgs(process.argv);
let text;
try { text = readFileSync(draft, 'utf8'); }
catch (e) { console.error(`cannot read ${draft}: ${e.message}`); process.exit(2); }

const draftDir = dirname(resolve(draft));
const { title, subtitle, blocks, mediaCount } = parseDraft(text);

function renderMedia(m, n) {
  const cap = m.caption ? `<figcaption>${escapeHtml(m.caption)}</figcaption>` : '';
  if (m.type === 'video') {
    const id = youtubeId(m.target);
    const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
    return `<figure class="media video">
      ${thumb ? `<div class="thumb" style="background-image:url('${thumb}')"><span class="play">&#9654;</span></div>` : ''}
      <figcaption>VIDEO ${n}/${mediaCount}: <a href="${escapeHtml(m.target)}">${escapeHtml(m.target)}</a>${m.why ? ` — ${escapeHtml(m.why)}` : ''}</figcaption>
    </figure>`;
  }
  if (m.type === 'tweet') {
    return `<figure class="media tweet"><div class="tweet-card">TWEET ${n}/${mediaCount}${m.risky ? ' (embed-risky: screenshot fallback)' : ''}<br><a href="${escapeHtml(m.target)}">${escapeHtml(m.target)}</a></div>${m.why ? `<figcaption>${escapeHtml(m.why)}</figcaption>` : ''}</figure>`;
  }
  // image
  const src = resolve(draftDir, m.rendered || `assets/${m.target}`);
  const alt = m.alt ? escapeHtml(m.alt) : escapeHtml(m.target);
  return `<figure class="media image"><img src="${src}" alt="${alt}">${cap || `<figcaption>IMAGE ${n}/${mediaCount}: ${escapeHtml(m.target)}</figcaption>`}</figure>`;
}

const parts = [];
let n = 0;
for (const b of blocks) {
  if (b.kind === 'markdown') { parts.push(renderMarkdown(b.text)); continue; }
  if (b.kind === 'code') { parts.push(`<pre class="template"><code>${escapeHtml(b.text)}</code></pre>`); continue; }
  n += 1;
  parts.push(renderMedia(b.media, n));
}

const doc = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title || 'mockup')}</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; background: #f7f7f5; color: #1a1a1a;
    font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; }
  .page { max-width: 680px; margin: 0 auto; padding: 48px 24px 120px; background: #fff; }
  h1 { font-size: 2.2rem; line-height: 1.15; margin: 0 0 .4em; font-family: -apple-system, Helvetica, Arial, sans-serif; }
  .subtitle { font-size: 1.25rem; color: #555; margin: 0 0 1.5em; font-family: -apple-system, Helvetica, Arial, sans-serif; }
  h2 { font-size: 1.5rem; margin: 1.8em 0 .5em; font-family: -apple-system, Helvetica, Arial, sans-serif; }
  p { font-size: 1.13rem; margin: 0 0 1.1em; }
  a { color: #1a5fb4; }
  ul { font-size: 1.13rem; padding-left: 1.4em; }
  li { margin: .3em 0; }
  blockquote { border-left: 4px solid #1a1a1a; margin: 1.5em 0; padding: .4em 1.2em; background: #faf8f2;
    font-style: italic; font-size: 1.18rem; }
  pre.template { background: #1e1e1e; color: #eaeaea; padding: 18px 20px; border-radius: 8px; overflow-x: auto;
    font-family: ui-monospace, Menlo, monospace; font-size: .92rem; line-height: 1.5; white-space: pre; font-style: normal; }
  figure.media { margin: 1.8em 0; }
  figure img { max-width: 100%; height: auto; border-radius: 6px; display: block; }
  figcaption { font-size: .92rem; color: #666; margin-top: .5em; font-family: -apple-system, Helvetica, Arial, sans-serif; }
  .video .thumb { position: relative; width: 100%; aspect-ratio: 16/9; background-size: cover; background-position: center;
    border-radius: 8px; background-color: #000; }
  .video .play { position: absolute; inset: 0; margin: auto; width: 64px; height: 64px; display: flex; align-items: center;
    justify-content: center; font-size: 28px; color: #fff; background: rgba(0,0,0,.6); border-radius: 50%; }
  .tweet-card { border: 1px solid #cfd9de; border-radius: 12px; padding: 16px; background: #fff;
    font-family: -apple-system, Helvetica, Arial, sans-serif; font-size: .95rem; }
</style></head>
<body><div class="page">
${title ? `<h1>${escapeHtml(title)}</h1>` : ''}
${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ''}
${parts.join('\n')}
</div></body></html>
`;

const outPath = out ? resolve(out) : join(draftDir, '.render', 'mockup.html');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, doc, 'utf8');

console.log(`mockup -> ${outPath}`);
console.log(`rendered ${mediaCount} media placement(s) in position.`);
console.log(`open with: open -a "Google Chrome" "${outPath}"`);
