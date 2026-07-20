#!/usr/bin/env node
// voice-gates.mjs - THE single source of truth for content-ops deterministic voice/format gates.
// Consumed by BOTH /content-review (CLI mode) and prompt-eval promptfoo configs (module import).
// Design rule (docs/specs/content-agent-skills-design.md Q3): these patterns exist in exactly ONE
// committed file. Duplicating them elsewhere is a defect (gate drift = latent false-green).
//
// CLI:    node scripts/voice-gates.mjs <file> [--platform <name>] [--published]
//         exit 0 = clean, exit 1 = violations (printed one per line), exit 2 = usage/read/platform error
//         --published: strip ::: embed/image marker blocks before checking, so the length gate
//                      reports the TRUE published word count. Marker blocks are editor instructions,
//                      not published text; counting them false-tripped the word ceiling and forced a
//                      separate `awk '/^:::/{b=!b;next}b{next}'` pass on every gate run (retro 2026-07-09).
// Module: import { GATES, LENGTH_WINDOWS, checkText, checkLength, normalizePlatform, stripEmbedBlocks } from './voice-gates.mjs'

import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

// The ::: embed/image marker convention (MEDIA-EMBED-GUIDE) is single-sourced in the shared draft parser
// so the length gate and the publish tooling share exactly one implementation (CodeRabbit PR #11: avoid a
// second copy of the ::: parsing that could drift). draft-parse.mjs is pure (no import side effects), so
// importing it here is safe. Re-exported to keep `voice-gates.stripEmbedBlocks` a stable public entry.
import { stripEmbedBlocks } from './lib/draft-parse.mjs';
export { stripEmbedBlocks };

// The banned-term pattern is constructed (not written literally) so this source file itself
// stays clean under the blanket substring ban (Qodo PR #3 finding 2).
const BANNED_TERM = ['k', 'i', 'l', 'l'].join('');
const BANNED_TERM_PATTERN = new RegExp('\\b' + BANNED_TERM, 'gi');

// Each gate: id, why it exists, regex, and how to read a hit.
export const GATES = [
  {
    id: 'em-dash',
    why: 'Em dashes read as an AI tell in published content (house rule, career-ops feedback_no_em_dashes_in_materials). En dashes in date ranges are allowed.',
    pattern: /—/g,
    message: 'em dash found: replace with comma, colon, period, or parens',
  },
  {
    id: 'banned-term',
    why: 'Banned word in all Mitchell materials (house rule; the four-letter k-word for terminate). Say "banned-phrase checklist", "stop", "end", "remove" instead.',
    pattern: BANNED_TERM_PATTERN,
    message: 'banned term (the k-word, any form) found: use end / stop / remove / retire instead',
  },
  {
    id: 'straight-idiom',
    why: 'Never the "be straight / straight up" idioms in Mitchell\'s voice; use honest / transparent / upfront. Matches ASCII and typographic apostrophes.',
    pattern: /\b(i[’']?ll be straight|straight up|let me be straight|being straight with you)\b/gi,
    message: 'banned idiom found: use honest / transparent / upfront',
  },
];

// ---- banned phrases (generated from the Voice OS list) ----------------------
// CANONICAL SOURCE: voice-os/data/banned_list.txt. Committed here as
// scripts/banned-phrases.json by scripts/gen-banned.mjs, for the same resilience
// reason as FALLBACK_WINDOWS: voice-os is a separate repo and may be absent.
// Promoted to a HARD FAIL (not a warning tier) on 2026-07-20 after measuring the
// full list against drafts/: 30 hits across 49 files, and every hit landing in
// outward material was a true positive. A warning would exit 0 and enforce
// nothing, which is a false green.
const BANNED_ARTIFACT = new URL('./banned-phrases.json', import.meta.url);

export function loadBannedTokens() {
  let raw;
  try {
    raw = readFileSync(BANNED_ARTIFACT, 'utf8');
  } catch (e) {
    return { tokens: null, problem: `banned-phrases.json unreadable (${e.message})` };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { tokens: null, problem: `banned-phrases.json is not valid JSON (${e.message})` };
  }
  if (!Array.isArray(parsed.tokens) || parsed.tokens.length === 0) {
    return { tokens: null, problem: 'banned-phrases.json has no tokens array' };
  }
  if (!parsed.tokens.every((t) => typeof t === 'string' && t.length > 0)) {
    return { tokens: null, problem: 'banned-phrases.json tokens must all be non-empty strings' };
  }
  return { tokens: parsed.tokens, problem: null };
}

const _banned = loadBannedTokens();
if (_banned.tokens) {
  // Hyphen is in the boundary class so a hyphenated banned phrase is not matched
  // as a fragment of a longer hyphenated compound. Note this comment deliberately
  // names no banned phrase: the file must stay clean under its own gates, same
  // reason BANNED_TERM above is built with join() instead of written out.
  const pattern = new RegExp(`(?<![\\w-])(?:${_banned.tokens.join('|')})(?![\\w-])`, 'gi');
  GATES.push({
    id: 'banned-phrase',
    why: 'Banned vocabulary from the Voice OS list (voice-os/data/banned_list.txt), the single source of truth. Cut it or replace with a concrete fact or trade-off.',
    pattern,
    message: 'banned phrase found',
    // Names the actual phrases, so the fix is obvious without re-grepping.
    describe: (matches) => {
      const distinct = [...new Set(matches.map((m) => m.toLowerCase()))];
      return `banned phrase found: ${distinct.join(', ')}`;
    },
  });
}

// House per-platform length windows for DRAFT bodies (word counts unless noted).
// CANONICAL SOURCE: the `length_window: <one-line JSON|null>` header in each
// knowledge/platforms/<platform>.md (single writer: /platform-playbook-refresh, which
// updates that line whenever a refresh changes a window). The table below is a RESILIENCE
// FALLBACK only, used when a playbook is unreadable or lacks the line; a stderr warning
// fires so the gap is visible. `--check-windows` fails if fallback and playbooks disagree,
// which forces this table to be updated in the same commit as any playbook window change
// (Qodo PR #3 alternative #2: generate, don't mirror).
const FALLBACK_WINDOWS = {
  substack: { minWords: 550, maxWords: 2600 },
  linkedin: { minWords: 80, maxWords: 380 },
  x: { maxChars: 4000 },
  hackernews: null,
  reddit: null,
  github: null,
  discord: null,
  tiktok: { minWords: 50, maxWords: 220 }, // spoken script for 30-90s
  youtube: null,
};

const PLAYBOOKS_DIR = new URL('../knowledge/platforms/', import.meta.url);

// Schema guard (Qodo PR #4 finding 4): a window is null, or a plain non-array object whose
// only keys are minWords/maxWords/maxChars with positive finite numbers. Anything else is
// invalid and must NOT override the fallback (a parseable-but-wrong value would fail open:
// checkLength reads win.minWords etc., all undefined, zero violations).
const WINDOW_KEYS = new Set(['minWords', 'maxWords', 'maxChars']);
export function validateWindow(value) {
  if (value === null) return { ok: true, window: null };
  if (typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'must be null or a plain object' };
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return { ok: false, error: 'object has no window keys' };
  for (const k of keys) {
    if (!WINDOW_KEYS.has(k)) return { ok: false, error: `unknown key "${k}" (allowed: minWords, maxWords, maxChars)` };
    if (typeof value[k] !== 'number' || !Number.isFinite(value[k]) || value[k] <= 0) {
      return { ok: false, error: `"${k}" must be a positive finite number` };
    }
  }
  return { ok: true, window: value };
}

// Returns { windows, problems[] }. The PLATFORM SET is the directory listing of
// knowledge/platforms/*.md (Qodo PR #4 finding 5: playbooks are canonical, so a new or
// renamed playbook must be seen here, not just the ones the fallback table knows about).
// problems: unreadable dir/files, missing length_window lines, unparseable JSON, invalid schema.
export function loadWindowsFromPlaybooks() {
  const windows = {};
  const problems = [];
  let files;
  try {
    files = readdirSync(PLAYBOOKS_DIR).filter((f) => f.endsWith('.md'));
  } catch (e) {
    return { windows, problems: [`playbooks dir unreadable (${e.message})`] };
  }
  for (const file of files) {
    const platform = file.replace(/\.md$/, '');
    let text;
    try {
      text = readFileSync(new URL(file, PLAYBOOKS_DIR), 'utf8');
    } catch (e) {
      problems.push(`${platform}: playbook unreadable (${e.message})`);
      continue;
    }
    const m = text.match(/^length_window:\s*(.+?)\s*$/m);
    if (!m) {
      problems.push(`${platform}: no length_window: line in playbook`);
      continue;
    }
    let parsed;
    try {
      parsed = JSON.parse(m[1]);
    } catch {
      problems.push(`${platform}: length_window is not valid one-line JSON: ${m[1]}`);
      continue;
    }
    const v = validateWindow(parsed);
    if (!v.ok) {
      problems.push(`${platform}: length_window has invalid schema (${v.error}): ${m[1]}`);
      continue;
    }
    windows[platform] = v.window;
  }
  return { windows, problems };
}

const _loaded = loadWindowsFromPlaybooks();
if (_loaded.problems.length > 0) {
  for (const p of _loaded.problems) console.error(`voice-gates WARNING: ${p}; using fallback window`);
}
export const LENGTH_WINDOWS = { ...FALLBACK_WINDOWS, ..._loaded.windows };

const PLATFORM_ALIASES = {
  twitter: 'x',
  'x.com': 'x',
  hn: 'hackernews',
  'hacker news': 'hackernews',
  'hacker-news': 'hackernews',
  'linked-in': 'linkedin',
  yt: 'youtube',
  ig: null, // not a supported platform; kept so the error names it clearly
};

// Lowercase + trim + alias-map. Returns { ok: true, platform } or { ok: false, error }.
// Unknown platforms are an ERROR, never a silent skip (Qodo PR #3 finding 6: a mismatched
// key must not produce a false CLEAN).
export function normalizePlatform(input) {
  if (input === null || input === undefined || String(input).trim() === '') {
    return { ok: false, error: 'platform is empty' };
  }
  let p = String(input).trim().toLowerCase();
  // Own-property check, not `in`: `in` walks the prototype chain, so inputs like
  // "constructor" or "toString" would resolve to Object.prototype members.
  if (Object.prototype.hasOwnProperty.call(PLATFORM_ALIASES, p)) p = PLATFORM_ALIASES[p];
  if (p && Object.prototype.hasOwnProperty.call(LENGTH_WINDOWS, p)) {
    return { ok: true, platform: p };
  }
  return {
    ok: false,
    error: `unknown platform "${input}" (known: ${Object.keys(LENGTH_WINDOWS).join(', ')})`,
  };
}

// opts.stripMarkers (default false, non-breaking): check the PUBLISHED text only, i.e. with :::
// embed/image instruction blocks removed. Module callers keep the old whole-file behavior unless
// they opt in; the CLI opts in via --published.
export function checkText(text, opts = {}) {
  const target = opts.stripMarkers ? stripEmbedBlocks(text) : text;
  const violations = [];
  // Fail CLOSED: if the generated banned list could not load, the gate did not run,
  // and a silent pass here would be a false green on every artifact checked.
  if (_banned.problem) {
    violations.push({
      gate: 'banned-phrase',
      count: 1,
      message: `banned-phrase gate could not run: ${_banned.problem}. Run: node scripts/gen-banned.mjs`,
    });
  }
  for (const gate of GATES) {
    const matches = target.match(gate.pattern);
    if (matches) {
      violations.push({
        gate: gate.id,
        count: matches.length,
        message: gate.describe ? gate.describe(matches) : gate.message,
      });
    }
  }
  return violations;
}

// platform is required here; callers that have no platform simply do not call checkLength.
// An unknown/unnormalizable platform returns a violation (fail-closed), never [].
// opts.stripMarkers (default false): count the published word/char total (::: blocks removed).
export function checkLength(text, platform, opts = {}) {
  const norm = normalizePlatform(platform);
  if (!norm.ok) {
    return [{ gate: 'length', count: 1, message: `length gate cannot run: ${norm.error}` }];
  }
  const win = LENGTH_WINDOWS[norm.platform];
  if (!win) return []; // known platform with no deterministic window (intentional, e.g. hackernews)
  const target = opts.stripMarkers ? stripEmbedBlocks(text) : text;
  const words = target.trim().split(/\s+/).filter(Boolean).length;
  const chars = target.length;
  const violations = [];
  if (win.minWords && words < win.minWords)
    violations.push({ gate: 'length', count: 1, message: `${norm.platform}: ${words} words is under the ${win.minWords}-word floor` });
  if (win.maxWords && words > win.maxWords)
    violations.push({ gate: 'length', count: 1, message: `${norm.platform}: ${words} words exceeds the ${win.maxWords}-word ceiling` });
  if (win.maxChars && chars > win.maxChars)
    violations.push({ gate: 'length', count: 1, message: `${norm.platform}: ${chars} chars exceeds the ${win.maxChars}-char ceiling` });
  return violations;
}

// promptfoo javascript-assert adapter: return { pass, score, reason } for an output string.
export function promptfooAssert(output, platform = null) {
  const violations = [...checkText(output), ...(platform ? checkLength(output, platform) : [])];
  return violations.length === 0
    ? { pass: true, score: 1, reason: 'all voice gates clean' }
    : { pass: false, score: 0, reason: violations.map((v) => `[${v.gate}] ${v.message} (x${v.count})`).join('; ') };
}

// CLI
// Exact entry-point comparison. The old basename endsWith() check would treat this
// module as the CLI whenever the real entry script merely SHARED its basename.
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const args = process.argv.slice(2);
  const usage =
    'usage: node scripts/voice-gates.mjs <file> [--platform <name>] [--published] | --check-windows | --check-banned';
  const published = args.includes('--published');

  // Drift check: the committed scripts/banned-phrases.json must match what
  // scripts/gen-banned.mjs produces from voice-os/data/banned_list.txt right now.
  // Exit 0 clean, 1 on drift, 2 if the source list is unreachable (which is a
  // real failure, not a pass: an unverifiable gate is not a verified one).
  // Kill switch: VOICE_GATES_DISABLE_BANNED_CHECK=true
  if (args.includes('--check-banned')) {
    if (process.env.VOICE_GATES_DISABLE_BANNED_CHECK === 'true') {
      console.log('banned drift check DISABLED via VOICE_GATES_DISABLE_BANNED_CHECK=true (no checks ran)');
      process.exit(0);
    }
    const gen = new URL('./gen-banned.mjs', import.meta.url);
    const r = spawnSync(process.execPath, [fileURLToPath(gen), '--check'], { stdio: 'inherit' });
    process.exit(r.status === null ? 2 : r.status);
  }

  // Drift check (regression detector): every playbook file must declare a parseable,
  // schema-valid length_window line; the resilience fallback table must match the playbooks
  // exactly; and every fallback entry must have a live playbook file (catches renames).
  // Exit 0 clean, 1 on drift. Kill switch: VOICE_GATES_DISABLE_WINDOW_CHECK=true
  // (documented in AGENTS.md § Detectors, per the every-detector-has-a-kill-switch rule).
  if (args.includes('--check-windows')) {
    if (process.env.VOICE_GATES_DISABLE_WINDOW_CHECK === 'true') {
      console.log('window drift check DISABLED via VOICE_GATES_DISABLE_WINDOW_CHECK=true (no checks ran)');
      process.exit(0);
    }
    const { windows, problems } = loadWindowsFromPlaybooks();
    const dirty = [...problems];
    for (const platform of Object.keys(FALLBACK_WINDOWS)) {
      if (!(platform in windows)) {
        if (!problems.some((p) => p.startsWith(`${platform}:`))) {
          dirty.push(`${platform}: in FALLBACK_WINDOWS but no playbook file exists (renamed or deleted?)`);
        }
        continue;
      }
      const a = JSON.stringify(FALLBACK_WINDOWS[platform]);
      const b = JSON.stringify(windows[platform]);
      if (a !== b) dirty.push(`${platform}: fallback ${a} != playbook ${b} (update FALLBACK_WINDOWS in the same commit)`);
    }
    if (dirty.length === 0) {
      console.log(`CLEAN: ${Object.keys(windows).length} playbook windows parse, pass schema, and match the fallback table`);
      process.exit(0);
    }
    for (const d of dirty) console.log(`DRIFT: ${d}`);
    process.exit(1);
  }
  let platform = null;
  const pIdx = args.indexOf('--platform');
  if (pIdx !== -1) {
    const val = args[pIdx + 1];
    if (!val || val.startsWith('--')) {
      console.error(`--platform requires a value. ${usage}`);
      process.exit(2);
    }
    const norm = normalizePlatform(val);
    if (!norm.ok) {
      console.error(`${norm.error}. ${usage}`);
      process.exit(2);
    }
    platform = norm.platform;
  }
  const file = args.find((a, i) => !a.startsWith('--') && (pIdx === -1 || i !== pIdx + 1));
  if (!file) {
    console.error(usage);
    process.exit(2);
  }
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch (e) {
    console.error(`cannot read ${file}: ${e.message}`);
    process.exit(2);
  }
  const opts = { stripMarkers: published };
  if (published) {
    const publishedWords = stripEmbedBlocks(text).trim().split(/\s+/).filter(Boolean).length;
    console.log(`published word count (::: marker blocks stripped): ${publishedWords}`);
  }
  const violations = [...checkText(text, opts), ...(platform ? checkLength(text, platform, opts) : [])];
  if (violations.length === 0) {
    console.log(`CLEAN: ${file} passes all voice gates${platform ? ` + ${platform} length window` : ''}${published ? ' (published body)' : ''}`);
    process.exit(0);
  }
  for (const v of violations) console.log(`VIOLATION [${v.gate}] ${v.message} (x${v.count})`);
  process.exit(1);
}
