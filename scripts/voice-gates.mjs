#!/usr/bin/env node
// voice-gates.mjs - THE single source of truth for content-ops deterministic voice/format gates.
// Consumed by BOTH /content-review (CLI mode) and prompt-eval promptfoo configs (module import).
// Design rule (docs/specs/content-agent-skills-design.md Q3): these patterns exist in exactly ONE
// committed file. Duplicating them elsewhere is a defect (gate drift = latent false-green).
//
// CLI:    node scripts/voice-gates.mjs <file> [--platform <name>]
//         exit 0 = clean, exit 1 = violations (printed one per line), exit 2 = usage/read/platform error
// Module: import { GATES, LENGTH_WINDOWS, checkText, checkLength, normalizePlatform } from './voice-gates.mjs'

import { readFileSync } from 'node:fs';

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

// Returns { windows, problems[] }. problems are strings describing playbooks that are
// missing, unreadable, missing the length_window line, or carrying unparseable JSON.
export function loadWindowsFromPlaybooks() {
  const windows = {};
  const problems = [];
  for (const platform of Object.keys(FALLBACK_WINDOWS)) {
    let text;
    try {
      text = readFileSync(new URL(`${platform}.md`, PLAYBOOKS_DIR), 'utf8');
    } catch (e) {
      problems.push(`${platform}: playbook unreadable (${e.message})`);
      continue;
    }
    const m = text.match(/^length_window:\s*(.+)\s*$/m);
    if (!m) {
      problems.push(`${platform}: no length_window: line in playbook`);
      continue;
    }
    try {
      windows[platform] = JSON.parse(m[1]);
    } catch {
      problems.push(`${platform}: length_window is not valid one-line JSON: ${m[1]}`);
    }
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
  if (p in PLATFORM_ALIASES) p = PLATFORM_ALIASES[p];
  if (p && Object.prototype.hasOwnProperty.call(LENGTH_WINDOWS, p)) {
    return { ok: true, platform: p };
  }
  return {
    ok: false,
    error: `unknown platform "${input}" (known: ${Object.keys(LENGTH_WINDOWS).join(', ')})`,
  };
}

export function checkText(text) {
  const violations = [];
  for (const gate of GATES) {
    const matches = text.match(gate.pattern);
    if (matches) {
      violations.push({ gate: gate.id, count: matches.length, message: gate.message });
    }
  }
  return violations;
}

// platform is required here; callers that have no platform simply do not call checkLength.
// An unknown/unnormalizable platform returns a violation (fail-closed), never [].
export function checkLength(text, platform) {
  const norm = normalizePlatform(platform);
  if (!norm.ok) {
    return [{ gate: 'length', count: 1, message: `length gate cannot run: ${norm.error}` }];
  }
  const win = LENGTH_WINDOWS[norm.platform];
  if (!win) return []; // known platform with no deterministic window (intentional, e.g. hackernews)
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
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
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isMain) {
  const args = process.argv.slice(2);
  const usage = 'usage: node scripts/voice-gates.mjs <file> [--platform <name>] | --check-windows';

  // Drift check: every playbook must declare a parseable length_window line, and the
  // resilience fallback table must match the playbooks exactly. Exit 0 clean, 1 on drift.
  if (args.includes('--check-windows')) {
    const { windows, problems } = loadWindowsFromPlaybooks();
    let dirty = [...problems];
    for (const platform of Object.keys(FALLBACK_WINDOWS)) {
      if (!(platform in windows)) continue; // already reported in problems
      const a = JSON.stringify(FALLBACK_WINDOWS[platform]);
      const b = JSON.stringify(windows[platform]);
      if (a !== b) dirty.push(`${platform}: fallback ${a} != playbook ${b} (update FALLBACK_WINDOWS in the same commit)`);
    }
    if (dirty.length === 0) {
      console.log(`CLEAN: ${Object.keys(windows).length}/${Object.keys(FALLBACK_WINDOWS).length} playbook windows parse and match the fallback table`);
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
  const violations = [...checkText(text), ...(platform ? checkLength(text, platform) : [])];
  if (violations.length === 0) {
    console.log(`CLEAN: ${file} passes all voice gates${platform ? ` + ${platform} length window` : ''}`);
    process.exit(0);
  }
  for (const v of violations) console.log(`VIOLATION [${v.gate}] ${v.message} (x${v.count})`);
  process.exit(1);
}
