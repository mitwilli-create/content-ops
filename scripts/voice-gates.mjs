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

// ---- repo-wide sweep exclusions (--sweep only) ------------------------------
// These files are skipped by the REPO SWEEP and by nothing else. Every artifact under
// drafts/ still gets the full gate on every per-file invocation and in /publish
// preconditions; this list changes no publishing behavior.
//
// Approved by Mitchell 2026-07-20 against a measured census of 55 dirty tracked files.
// Three reasons, and no fourth is admissible. "This file is inconvenient to clean" is
// not a reason; that file goes in the cleanup batch.
//
//   SELF      the file IS the matcher or IS the token list. Editing it to satisfy the
//             gate DISABLES the gate. Precedent: voice-os scrub_em_dashes once rewrote
//             the EmDash.yml rule's own token and silently switched the rule off, and
//             stack-ops carries the same exemption for that file in .vale.ini.
//   VENDORED  upstream source under someone else's copyright (superpowers, MIT, Jesse
//             Vincent, imported wholesale in 1ac5ca9). Rewriting the prose makes every
//             future upstream diff a conflict. Scoped to the 14 imported directories BY
//             NAME, never to .claude/skills/ as a whole: seven SKILL.md files in that
//             tree are Mitchell's own (3d5f41d) and stay in scope.
//   GENERATED machine output kept as an audit record of what those models actually said.
//             Editing the prose edits the record.
const SWEEP_EXCLUSIONS = [
  { path: 'scripts/voice-gates.mjs', reason: 'SELF: defines every gate pattern in this list' },
  { path: 'scripts/banned-phrases.json', reason: 'SELF: is the banned-token list' },
  ...[
    'brainstorming',
    'dispatching-parallel-agents',
    'executing-plans',
    'finishing-a-development-branch',
    'receiving-code-review',
    'requesting-code-review',
    'subagent-driven-development',
    'systematic-debugging',
    'test-driven-development',
    'using-git-worktrees',
    'using-superpowers',
    'verification-before-completion',
    'writing-plans',
    'writing-skills',
  ].map((d) => ({ path: `.claude/skills/${d}/`, reason: 'VENDORED: superpowers upstream (MIT, 1ac5ca9)' })),
  { path: '.claude/skills/SUPERPOWERS-ATTRIBUTION.md', reason: 'VENDORED: upstream attribution' },
  { path: '.claude/skills/SUPERPOWERS-LICENSE', reason: 'VENDORED: upstream license text' },
  { path: 'docs/skill-sourcing-report.md', reason: 'GENERATED: council transcript, kept as record' },
  { path: 'docs/skill-sourcing-adjudicated.md', reason: 'GENERATED: dealbreaker output, kept as record' },
];

// A trailing slash means "this directory and everything under it".
export function isSweepExcluded(file) {
  for (const e of SWEEP_EXCLUSIONS) {
    if (e.path.endsWith('/') ? file.startsWith(e.path) : file === e.path) return e;
  }
  return null;
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
    'usage: node scripts/voice-gates.mjs <file> [--platform <name>] [--published] | --sweep | --check-windows | --check-banned | --self-test';
  const published = args.includes('--published');

  // Drift check: the committed scripts/banned-phrases.json must match what
  // scripts/gen-banned.mjs produces from voice-os/data/banned_list.txt right now.
  // Exit 0 clean, 1 on drift, 2 if the source list is unreachable (which is a
  // real failure, not a pass: an unverifiable gate is not a verified one).
  // Bypass switch: VOICE_GATES_DISABLE_BANNED_CHECK=true
  if (args.includes('--check-banned')) {
    if (process.env.VOICE_GATES_DISABLE_BANNED_CHECK === 'true') {
      console.log('banned drift check DISABLED via VOICE_GATES_DISABLE_BANNED_CHECK=true (no checks ran)');
      process.exit(0);
    }
    const gen = new URL('./gen-banned.mjs', import.meta.url);
    const r = spawnSync(process.execPath, [fileURLToPath(gen), '--check'], { stdio: 'inherit' });
    process.exit(r.status === null ? 2 : r.status);
  }

  // Self-test: do the gates actually FIRE on bad input?
  //
  // --check-banned proves the artifact matches its generator. It cannot prove the
  // gate WORKS, because a regenerated artifact always matches its generator. The
  // pattern above is assembled at import time from a join() inside a lookbehind/
  // lookahead boundary class; break that assembly and drift stays green, clean
  // files stay clean, and nothing anywhere says otherwise. Ported from stack-ops
  // (2026-07-20) after that repo shipped a banned-vocab rule that enforced nothing
  // for weeks and was twice "verified" against a clean tree. A clean pass proves
  // nothing about a matcher; only a known-bad input does.
  //
  // Probes are DERIVED from the loaded tokens, never hardcoded, so editing the
  // Voice OS list cannot quietly turn this into a no-op. Failing to derive one is
  // itself a failure, for the same reason.
  //
  // The three static gates (em-dash, banned-term, straight-idiom) are probed with
  // INDEPENDENTLY CONSTRUCTED bad input: a codepoint literal, a join(), a
  // concatenation. Never by reading GATES[n].pattern. A probe built from the thing
  // it is testing certifies itself and passes no matter how the pattern is broken,
  // which is precisely the stack-ops bug this whole exercise came out of (its step 4
  // restated step 2's grep instead of calling it). Everything routes through
  // checkText, so the probe exercises the same code path the real check uses.
  //
  // Exit 0 all assertions pass, 1 on any failure, 2 if the gate could not load.
  // Bypass: none, same as the core gate (phrased that way deliberately, since
  // this file must stay clean under its own banned-term gate). A self-test you
  // can switch off is the false green it exists to catch.
  if (args.includes('--self-test')) {
    if (_banned.problem) {
      console.error(`self-test: gate could not load: ${_banned.problem}`);
      console.error('Run: node scripts/gen-banned.mjs');
      process.exit(2);
    }
    // Tokens are regex source. Turn one back into the literal text it matches.
    const literal = (tok) =>
      tok
        .replace(/\(s\|es\|ed\|ing\|ly\)\?$/, '') // English morphology group
        .replace(/\['’\]/g, '’') // apostrophe class -> typographic form
        .replace(/\\(.)/g, '$1'); // undo escapeRe

    const wordTok = _banned.tokens.find((t) => /\(s\|es\|ed\|ing\|ly\)\?$/.test(t));
    const quoteTok = _banned.tokens.find((t) => t.includes("['’]"));
    const failures = [];
    let assertions = 0;

    // Count hits for ONE gate id, through the same checkText the real check calls.
    const hitsOn = (gateId, text) =>
      checkText(text).filter((v) => v.gate === gateId).length;
    const assert = (cond, msg) => {
      assertions += 1;
      if (!cond) failures.push(msg);
    };

    // ---- static gates. Bad input constructed here, never read from GATES. ----
    const EM = String.fromCharCode(0x2014); // em dash
    const EN = String.fromCharCode(0x2013); // en dash, explicitly ALLOWED in date ranges
    const KWORD = ['k', 'i', 'l', 'l'].join(''); // restated, not the module constant
    const STRAIGHT = 'straight' + ' ' + 'up';

    assert(
      hitsOn('em-dash', `A sentence ${EM} broken by a dash.`) > 0,
      `em-dash gate did NOT flag U+2014; it is enforcing nothing`
    );
    // The en dash is allowed (date ranges). An em-dash pattern widened to any dash
    // would fail every range in the knowledge base and train everyone to bypass.
    assert(
      hitsOn('em-dash', `The 2024${EN}2025 window.`) === 0,
      `em-dash gate flagged an en dash (U+2013); date ranges are allowed and it is over-matching`
    );
    assert(
      hitsOn('banned-term', `We should ${KWORD} the process.`) > 0,
      `banned-term gate did NOT flag the k-word; it is enforcing nothing`
    );
    // Both apostrophe forms, same reason as the banned-phrase pair below: real drafts
    // carry both and the matcher does not normalize them.
    assert(
      hitsOn('straight-idiom', `Let me be straight with you.`) > 0,
      `straight-idiom gate did NOT flag "let me be straight"`
    );
    assert(
      hitsOn('straight-idiom', `I${'’'}ll be straight about the numbers.`) > 0,
      `straight-idiom gate did NOT flag the typographic-apostrophe form`
    );
    assert(
      hitsOn('straight-idiom', `I'll be straight about the numbers.`) > 0,
      `straight-idiom gate did NOT flag the ASCII-apostrophe form`
    );
    assert(
      hitsOn('straight-idiom', `He walked ${STRAIGHT} to the desk.`) > 0,
      `straight-idiom gate did NOT flag "${STRAIGHT}"`
    );

    // ---- banned-phrase gate. Probes DERIVED from the loaded tokens. ----
    if (!wordTok || !quoteTok) {
      assert(
        false,
        `cannot derive probes from banned-phrases.json (word=${!!wordTok} quote=${!!quoteTok}); ` +
          'the self-test would be a no-op, which is the bug it exists to catch'
      );
    } else {
      // a) a banned single word is caught
      const w = literal(wordTok);
      assert(
        hitsOn('banned-phrase', `This ${w} approach.`) > 0,
        `banned word "${w}" was NOT flagged; the gate is enforcing nothing`
      );

      // b) BOTH apostrophe forms are caught. The matcher does not normalize them,
      //    and real drafts carry both, so one form passing is half a gate.
      const q = literal(quoteTok);
      assert(hitsOn('banned-phrase', q) > 0, `typographic-apostrophe phrase "${q}" was NOT flagged`);
      const qAscii = q.replace(/’/g, "'");
      assert(hitsOn('banned-phrase', qAscii) > 0, `ASCII-apostrophe phrase "${qAscii}" was NOT flagged`);
    }

    // ---- shared control. Clean text must be clean under EVERY gate. ----
    // A join() or boundary-class break can make a pattern match everything, which fails
    // outward material for no reason and trains everyone to bypass the gate. Over-matching
    // is a gate failure too, and it is the failure mode a fires-on-bad-input test misses.
    const control = 'We shipped the parser on Tuesday. It reads one file and exits.';
    const controlHits = checkText(control);
    assert(
      controlHits.length === 0,
      `clean control text WAS flagged by [${controlHits.map((v) => v.gate).join(', ')}]; a pattern is over-matching`
    );

    if (failures.length) {
      console.error(`self-test FAILED (${failures.length} of ${assertions} assertions):`);
      for (const f of failures) console.error(`  - ${f}`);
      process.exit(1);
    }
    console.log(
      `self-test ok: ${GATES.length} gates, ${_banned.tokens.length} banned tokens, ${assertions} assertions passed`
    );
    process.exit(0);
  }

  // Repo-wide sweep: run the gates over every TRACKED text file, honouring
  // SWEEP_EXCLUSIONS. This is the whole-repo mirror of stack-ops lint-prose.sh step 2,
  // built on checkText rather than a restated grep, so the sweep and the per-file check
  // can never disagree about what a violation is.
  //
  // Exit 0 clean, 1 on any violation or any rotted exclusion entry, 2 if the file list
  // could not be obtained (an unrunnable sweep is not a clean one).
  // Bypass switch: none. The exclusion list is the bypass, and it is reviewable in a diff.
  if (args.includes('--sweep')) {
    const ls = spawnSync('git', ['ls-files', '-z'], { encoding: 'utf8' });
    if (ls.status !== 0) {
      console.error(`sweep: cannot list tracked files (git ls-files exit ${ls.status}): ${ls.stderr || ''}`.trim());
      process.exit(2);
    }
    const tracked = ls.stdout.split('\0').filter(Boolean);
    if (tracked.length === 0) {
      console.error('sweep: git ls-files returned nothing; refusing to report a clean sweep of zero files');
      process.exit(2);
    }

    // A stale exclusion is a silent hole: the file it named is gone or renamed, and the
    // entry sits there looking like considered policy. Fail on it so the list stays honest.
    const rotted = SWEEP_EXCLUSIONS.filter((e) =>
      e.path.endsWith('/') ? !tracked.some((f) => f.startsWith(e.path)) : !tracked.includes(e.path)
    );

    let checked = 0;
    let skipped = 0;
    const dirty = [];
    for (const file of tracked) {
      if (isSweepExcluded(file)) {
        skipped += 1;
        continue;
      }
      let text;
      try {
        text = readFileSync(file, 'utf8');
      } catch {
        continue; // unreadable (submodule, broken symlink): not this detector's job
      }
      if (text.includes('\0')) continue; // binary
      checked += 1;
      const violations = checkText(text);
      if (violations.length) dirty.push({ file, violations });
    }

    for (const { file, violations } of dirty) {
      for (const v of violations) console.log(`${file}: [${v.gate}] ${v.message} (x${v.count})`);
    }
    for (const e of rotted) {
      console.log(`STALE EXCLUSION: ${e.path} no longer exists (${e.reason}); remove it from SWEEP_EXCLUSIONS`);
    }
    if (dirty.length === 0 && rotted.length === 0) {
      console.log(`CLEAN: ${checked} tracked files pass all voice gates (${skipped} excluded by policy)`);
      process.exit(0);
    }
    console.log(
      `\n${dirty.length} of ${checked} checked files violate the voice gates ` +
        `(${skipped} excluded by policy, ${rotted.length} stale exclusions)`
    );
    process.exit(1);
  }

  // Drift check (regression detector): every playbook file must declare a parseable,
  // schema-valid length_window line; the resilience fallback table must match the playbooks
  // exactly; and every fallback entry must have a live playbook file (catches renames).
  // Exit 0 clean, 1 on drift. Bypass switch: VOICE_GATES_DISABLE_WINDOW_CHECK=true
  // (documented in AGENTS.md § Detectors, per the every-detector-documents-its-bypass rule).
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
