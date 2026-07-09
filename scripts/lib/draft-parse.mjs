// draft-parse.mjs - shared parser for content-ops draft markdown (the :::embed/:::image convention
// documented in each draft dir's MEDIA-EMBED-GUIDE.md). Single-sourced HERE so the paste-body builder
// and the mockup renderer agree on block structure and can never drift (retro 2026-07-09).
//
// The ::: block semantics match scripts/voice-gates.mjs::stripEmbedBlocks exactly: a block opens with a
// line beginning `:::` and closes with a bare `:::`; both toggle-lines and everything between are the
// editor instruction (never published prose). This module additionally CLASSIFIES each block so the
// media set can be auto-counted (no hand-edited TOTAL) and rendered.
//
// Exports: parseDraft(text) -> { title, subtitle, blocks[], mediaCount }
//          renderMarkdown(md) -> HTML string   (## / **bold** / [links] / - bullets / > callouts / paragraphs)
//          escapeHtml(s), youtubeId(url)

// Canonical ::: fence test: a block opens with a line beginning `:::` and closes with a bare `:::`.
// Single-sourced here and consumed by BOTH the build tooling (parseDraft below) and the length gate
// (scripts/voice-gates.mjs re-exports stripEmbedBlocks), so the convention has exactly one implementation.
export const EMBED_FENCE = /^:::/;

// stripEmbedBlocks(text) -> text with every ::: embed/image instruction block removed (toggle-lines and
// everything between). This is the canonical definition of "published text" for a marker-bearing draft.
// Mirrors the historical `awk 'BEGIN{b=0}/^:::/{b=!b;next}b{next}{print}'`.
export function stripEmbedBlocks(text) {
  const kept = [];
  let inBlock = false;
  for (const line of text.split('\n')) {
    if (EMBED_FENCE.test(line)) { inBlock = !inBlock; continue; }
    if (inBlock) continue;
    kept.push(line);
  }
  return kept.join('\n');
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Extract the 11-char YouTube id from a watch/share/embed URL, or null if not a YouTube URL.
export function youtubeId(url) {
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Inline markdown: escape first, then **bold** and [text](url). URLs are attribute-escaped for quotes.
function renderInline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u.replace(/"/g, '&quot;')}">${t}</a>`);
  return out;
}

// Block markdown for a run of prose lines (no ::: blocks, no ``` fences - those are handled by parseDraft).
// Groups consecutive `- ` into <ul>, consecutive `> ` into <blockquote>, `## ` into <h2>, blanks split
// paragraphs. Deliberately small (mirrors the ephemeral build_mockup.py's handling); not a full CommonMark.
export function renderMarkdown(md) {
  const lines = md.split('\n');
  const html = [];
  let i = 0;
  const flushList = (items) => { if (items.length) html.push('<ul>' + items.map((t) => `<li>${renderInline(t)}</li>`).join('') + '</ul>'); };
  const flushQuote = (qlines) => { if (qlines.length) html.push('<blockquote>' + qlines.map(renderInline).join('<br>') + '</blockquote>'); };
  let para = [];
  const flushPara = () => { if (para.length) { html.push('<p>' + para.map(renderInline).join(' ') + '</p>'); para = []; } };
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { flushPara(); i++; continue; }
    if (/^#{2,6}\s/.test(line)) {
      flushPara();
      const level = line.match(/^(#{2,6})/)[1].length;
      html.push(`<h${level}>${renderInline(line.replace(/^#{2,6}\s+/, ''))}</h${level}>`);
      i++; continue;
    }
    if (/^-\s/.test(line)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^-\s/.test(lines[i])) { items.push(lines[i].replace(/^-\s+/, '')); i++; }
      flushList(items); continue;
    }
    if (/^>\s?/.test(line)) {
      flushPara();
      const qlines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { qlines.push(lines[i].replace(/^>\s?/, '')); i++; }
      flushQuote(qlines); continue;
    }
    para.push(line); i++;
  }
  flushPara();
  return html.join('\n');
}

// Parse an opening ::: line into a media descriptor.
// Forms:  :::embed video | <url>  [meta]      :::embed tweet | <url>  [EMBED-RISKY ...]
//         :::image | <file>  [RENDERED: assets/<file>]
function parseMediaOpen(openLine) {
  const body = openLine.replace(/^:::/, '');
  const risky = /EMBED-RISKY/i.test(openLine);
  const barIdx = body.indexOf('|');
  const left = (barIdx === -1 ? body : body.slice(0, barIdx)).trim();
  let right = (barIdx === -1 ? '' : body.slice(barIdx + 1)).trim();
  // Pull a trailing [ ... ] hint off the target.
  let hint = null;
  const hintMatch = right.match(/\s*\[([^\]]*)\]\s*$/);
  if (hintMatch) { hint = hintMatch[1].trim(); right = right.slice(0, hintMatch.index).trim(); }
  const leftTokens = left.split(/\s+/);
  const kindWord = (leftTokens[0] || '').toLowerCase(); // "embed" | "image"
  let type;
  if (kindWord === 'image') type = 'image';
  else type = (leftTokens[1] || 'embed').toLowerCase(); // "video" | "tweet" | fallback "embed"
  // For images, prefer the [RENDERED: <path>] hint as the real asset path.
  let rendered = null;
  if (hint && /^RENDERED:/i.test(hint)) rendered = hint.replace(/^RENDERED:\s*/i, '').trim();
  return { type, target: right, rendered, risky, why: null, alt: null, caption: null, action: null };
}

// parseDraft(text) -> { title, subtitle, blocks, mediaCount }
// blocks is an ordered array; each is one of:
//   { kind: 'media', media: {type,target,rendered,risky,why,alt,caption,action} }
//   { kind: 'code', text }        (``` fence body - PUBLISHED verbatim, e.g. the ownership template)
//   { kind: 'markdown', text }    (a run of prose lines)
export function parseDraft(text) {
  const rawLines = text.split('\n');
  let title = null, subtitle = null;
  let start = 0;
  // Title = first `# ` line; subtitle = the immediately following *italic* line, if present.
  for (; start < rawLines.length; start++) {
    const l = rawLines[start];
    if (/^\s*$/.test(l)) continue;
    if (/^#\s/.test(l)) {
      title = l.replace(/^#\s+/, '').trim();
      const next = rawLines[start + 1] || '';
      const sub = next.match(/^\*(.+)\*\s*$/);
      if (sub) { subtitle = sub[1].trim(); start += 1; }
      start += 1;
    }
    break;
  }

  const blocks = [];
  let mdRun = [];
  const flushMd = () => { if (mdRun.join('').trim()) blocks.push({ kind: 'markdown', text: mdRun.join('\n') }); mdRun = []; };
  let i = start;
  while (i < rawLines.length) {
    const line = rawLines[i];
    if (EMBED_FENCE.test(line)) {
      flushMd();
      const media = parseMediaOpen(line);
      i++;
      while (i < rawLines.length && !EMBED_FENCE.test(rawLines[i])) {
        const attr = rawLines[i].match(/^(WHY|ALT|CAPTION|ACTION):\s*(.*)$/i);
        if (attr) media[attr[1].toLowerCase()] = attr[2].trim();
        i++;
      }
      i++; // consume the closing :::
      blocks.push({ kind: 'media', media });
      continue;
    }
    if (/^```/.test(line)) {
      flushMd();
      i++;
      const code = [];
      while (i < rawLines.length && !/^```/.test(rawLines[i])) { code.push(rawLines[i]); i++; }
      i++; // consume the closing fence
      blocks.push({ kind: 'code', text: code.join('\n') });
      continue;
    }
    mdRun.push(line);
    i++;
  }
  flushMd();

  const mediaCount = blocks.filter((b) => b.kind === 'media').length;
  return { title, subtitle, blocks, mediaCount };
}
