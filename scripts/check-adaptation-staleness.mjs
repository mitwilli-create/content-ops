#!/usr/bin/env node
// check-adaptation-staleness.mjs - flag platform adaptations that were built from an OLDER version of the
// canonical/master draft. Prevents shipping a promo built on a stale essay (retro 2026-07-09: this launch
// nearly shipped a LinkedIn post built on the pre-rewrite Krieger essay - linkedin.md was stale).
//
// Mechanism: each adaptation carries frontmatter recording the source it was built from and that source's
// content hash at generation time. This guard recomputes the source's current hash and compares.
//   ---
//   source: voiceos-final-v5.md
//   source_hash: sha256:<hex>       # stamped by /platform-adapt and /draft-post when the adaptation is written
//   ---
// No source_hash (older files) -> UNVERIFIED, with an mtime fallback: if the master was edited after the
// adaptation, it is reported as LIKELY-STALE.
//
// Usage: node scripts/check-adaptation-staleness.mjs <draft-dir> [--master <filename>]
//        default master: master.md (fall back required via --master when the canonical file is named
//        differently, e.g. voiceos-final-v5.md)
// Exit 0 = all adaptations fresh (or none found); exit 1 = at least one STALE / LIKELY-STALE / ERROR.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { LENGTH_WINDOWS } from './voice-gates.mjs';

const PLATFORMS = new Set(Object.keys(LENGTH_WINDOWS)); // canonical platform set (playbook-derived)

function parseArgs(argv) {
  const args = argv.slice(2);
  let master = 'master.md';
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--master') { master = args[++i]; continue; }
    if (args[i].startsWith('--')) { console.error(`unknown flag ${args[i]}`); process.exit(2); }
    positional.push(args[i]);
  }
  if (positional.length !== 1) {
    console.error('usage: node scripts/check-adaptation-staleness.mjs <draft-dir> [--master <filename>]');
    process.exit(2);
  }
  return { dir: positional[0], master };
}

function sha256(buf) { return createHash('sha256').update(buf).digest('hex'); }

// Read a leading --- ... --- frontmatter block; return { source, source_hash } (values may be undefined).
function readFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(source|source_hash):\s*(.+?)\s*$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^sha256:/, '').trim();
  }
  return fm;
}

// An adaptation is a .md file that is either named for a known platform, or carries a `source:` line.
// The master itself and NOTES/HANDOFF/spec files are excluded.
function isAdaptation(name, text) {
  if (!name.endsWith('.md')) return false;
  const stem = name.replace(/\.md$/, '').split('-')[0].toLowerCase(); // "linkedin-v2" -> "linkedin"
  if (PLATFORMS.has(stem)) return true;
  return /^---\n[\s\S]*?\bsource:\s*\S/.test(text);
}

const { dir, master } = parseArgs(process.argv);
const dirAbs = resolve(dir);
const masterPath = join(dirAbs, master);
let masterStat, masterHashDefault;
try {
  const buf = readFileSync(masterPath);
  masterHashDefault = sha256(buf);
  masterStat = statSync(masterPath);
} catch (e) {
  console.error(`cannot read master '${master}' in ${dirAbs}: ${e.message}`);
  console.error('pass the canonical draft name with --master (e.g. --master voiceos-final-v5.md)');
  process.exit(2);
}

let files;
try { files = readdirSync(dirAbs); }
catch (e) { console.error(`cannot read dir ${dirAbs}: ${e.message}`); process.exit(2); }

const results = [];
for (const name of files) {
  if (name === master) continue;
  const full = join(dirAbs, name);
  let st;
  try { st = statSync(full); } catch { continue; }
  if (!st.isFile()) continue;
  let text;
  try { text = readFileSync(full, 'utf8'); } catch { continue; }
  if (!isAdaptation(name, text)) continue;

  const fm = readFrontmatter(text);
  // Resolve which source this adaptation names (default to the given master).
  const srcName = fm.source || master;
  const srcPath = join(dirAbs, srcName);
  let srcHash, srcStat;
  try { srcHash = sha256(readFileSync(srcPath)); srcStat = statSync(srcPath); }
  catch { results.push({ name, verdict: 'ERROR', detail: `named source '${srcName}' not found` }); continue; }

  if (fm.source_hash) {
    if (fm.source_hash === srcHash) results.push({ name, verdict: 'FRESH', detail: `matches ${srcName}` });
    else results.push({ name, verdict: 'STALE', detail: `built from an older ${srcName}; regenerate or re-stamp` });
  } else {
    // No recorded hash: mtime fallback.
    if (srcStat.mtimeMs > st.mtimeMs) {
      results.push({ name, verdict: 'LIKELY-STALE', detail: `no source_hash; ${srcName} was edited after this file (${srcStat.mtime.toISOString().slice(0, 10)} > ${st.mtime.toISOString().slice(0, 10)})` });
    } else {
      results.push({ name, verdict: 'UNVERIFIED', detail: `no source_hash; add one via /platform-adapt to make this checkable` });
    }
  }
}

const bad = results.filter((r) => r.verdict === 'STALE' || r.verdict === 'LIKELY-STALE' || r.verdict === 'ERROR');
console.log(`adaptation staleness vs master '${master}' (${masterHashDefault.slice(0, 12)}...) in ${dirAbs}`);
if (results.length === 0) { console.log('  no platform adaptations found (nothing to check).'); process.exit(0); }
for (const r of results.sort((a, b) => a.name.localeCompare(b.name))) {
  console.log(`  [${r.verdict}] ${r.name} - ${r.detail}`);
}
if (bad.length > 0) {
  console.log(`\n${bad.length} adaptation(s) need attention: regenerate them from '${master}' (or re-stamp source_hash if verified still-current).`);
  process.exit(1);
}
console.log('\nall adaptations fresh.');
process.exit(0);
