#!/usr/bin/env node
// Generate scripts/banned-phrases.json from the Voice OS banned list.
//
// Ruled 2026-07-20: voice-os/data/banned_list.txt is the SINGLE SOURCE OF TRUTH
// for banned vocabulary. It is corpus-mined and curated from rejected drafts.
// content-ops previously carried its own hand-written banned set (3 gates), with
// no link to that list; stack-ops had a third copy that had drifted to 2 shared
// entries out of 15. Generating from one source is what stops that recurring.
//
// WHY A COMMITTED ARTIFACT rather than reading voice-os at runtime: voice-os is a
// separate repo that may not be present on every machine. A missing source would
// make the gate silently pass (false green). Same rationale as FALLBACK_WINDOWS
// in voice-gates.mjs: committed for resilience, drift-checked so it cannot rot.
//
// WHY JSON rather than inlining the phrases in voice-gates.mjs: that file must
// stay clean under its own gates. It already constructs the k-word via join()
// for exactly this reason (Qodo PR #3 finding 2). A data file keeps the source
// census-clean while still being the single committed copy.
//
// Token shape is deliberately IDENTICAL to stack-ops/scripts/gen-antislop.mjs so
// the Vale rule and this gate match the same strings. One documented divergence:
// apostrophes are flexed to match both ASCII and typographic forms, because real
// drafts carry both and a missed match is a false green. Worth backporting.
//
// Path is config, not code:
//   VOICE_OS_BANNED=/path/to/banned_list.txt node scripts/gen-banned.mjs
// Run with --check to verify the committed artifact matches the source instead
// of rewriting it (used by voice-gates.mjs --check-banned).

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE =
  process.env.VOICE_OS_BANNED ||
  join(homedir(), 'Documents', 'voice-os', 'data', 'banned_list.txt');
const TARGET = join(REPO, 'scripts', 'banned-phrases.json');

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Drafts carry both ASCII and typographic apostrophes; match either.
const flexApostrophe = (s) => s.replace(/'/g, "['’]");

export function buildTokens(raw) {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((phrase) => {
      const esc = flexApostrophe(escapeRe(phrase));
      // Single words take an English morphology group; multi-word phrases are
      // matched as written, since "circle backing" is not a thing.
      return /\s/.test(phrase) ? esc : `${esc}(s|es|ed|ing|ly)?`;
    });
}

function build() {
  let source;
  try {
    source = readFileSync(SOURCE, 'utf8');
  } catch {
    console.error(
      `gen-banned: cannot read ${SOURCE}\n` +
        'Set VOICE_OS_BANNED to the Voice OS banned_list.txt path.'
    );
    process.exit(2);
  }
  const tokens = buildTokens(source);
  if (tokens.length === 0) {
    console.error('gen-banned: source list is empty, refusing to write');
    process.exit(2);
  }
  return (
    JSON.stringify(
      {
        _comment: [
          'GENERATED FILE, DO NOT EDIT BY HAND.',
          'Source: voice-os/data/banned_list.txt (the single source of truth).',
          'Regenerate: node scripts/gen-banned.mjs',
          'Verify:     node scripts/voice-gates.mjs --check-banned',
        ],
        tokens,
      },
      null,
      2
    ) + '\n'
  );
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const json = build();
  if (process.argv.includes('--check')) {
    const current = (() => {
      try {
        return readFileSync(TARGET, 'utf8');
      } catch {
        return null;
      }
    })();
    if (current !== json) {
      console.error(
        `gen-banned: ${TARGET} is out of sync with ${SOURCE}\n` +
          'Run: node scripts/gen-banned.mjs'
      );
      process.exit(1);
    }
    console.log(`gen-banned: in sync (${JSON.parse(json).tokens.length} tokens)`);
    process.exit(0);
  }
  writeFileSync(TARGET, json);
  console.log(`gen-banned: wrote ${JSON.parse(json).tokens.length} tokens to ${TARGET}`);
}
