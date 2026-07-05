#!/usr/bin/env node
// voice-gates.mjs — THE single source of truth for content-ops deterministic voice/format gates.
// Consumed by BOTH /content-review (CLI mode) and prompt-eval promptfoo configs (module import).
// Design rule (docs/specs/content-agent-skills-design.md Q3): these regexes exist in exactly ONE
// committed file. Duplicating them elsewhere is a defect (gate drift = latent false-green).
//
// CLI:    node scripts/voice-gates.mjs <file> [--platform <name>]
//         exit 0 = clean, exit 1 = violations (printed one per line), exit 2 = usage/read error
// Module: import { GATES, LENGTH_WINDOWS, checkText, checkLength } from './voice-gates.mjs'

import { readFileSync } from 'node:fs';

// Each gate: id, why it exists, regex, and how to read a hit.
export const GATES = [
  {
    id: 'em-dash',
    why: 'Em dashes read as an AI tell in published content (house rule, career-ops feedback_no_em_dashes_in_materials). En dashes in date ranges are allowed.',
    pattern: /—/g,
    message: 'em dash found: replace with comma, colon, period, or parens',
  },
  {
    id: 'banned-kill',
    why: 'Banned word in all Mitchell materials (house rule). Say "banned-phrase checklist", "stop", "end", "remove" instead.',
    pattern: /\bkill/gi,
    message: 'banned word stem "kill" found',
  },
  {
    id: 'straight-idiom',
    why: 'Never "I\'ll be straight / straight up / let me be straight" in Mitchell\'s voice; use honest / transparent / upfront.',
    pattern: /\b(i'?ll be straight|straight up|let me be straight|being straight with you)\b/gi,
    message: 'banned idiom found: use honest / transparent / upfront',
  },
];

// House per-platform length windows for DRAFT bodies (word counts unless noted).
// Source: knowledge/platforms/*.md recommendations; update THERE first, then mirror here
// via /platform-playbook-refresh follow-through. null = no deterministic window.
export const LENGTH_WINDOWS = {
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

export function checkLength(text, platform) {
  const win = LENGTH_WINDOWS[platform];
  if (!win) return [];
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const violations = [];
  if (win.minWords && words < win.minWords)
    violations.push({ gate: 'length', count: 1, message: `${platform}: ${words} words is under the ${win.minWords}-word floor` });
  if (win.maxWords && words > win.maxWords)
    violations.push({ gate: 'length', count: 1, message: `${platform}: ${words} words exceeds the ${win.maxWords}-word ceiling` });
  if (win.maxChars && chars > win.maxChars)
    violations.push({ gate: 'length', count: 1, message: `${platform}: ${chars} chars exceeds the ${win.maxChars}-char ceiling` });
  return violations;
}

// promptfoo javascript-assert adapter: return { pass, reason } for an output string.
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
  const pIdx = args.indexOf('--platform');
  const platform = pIdx !== -1 ? args[pIdx + 1] : null;
  const file = args.find((a) => !a.startsWith('--') && a !== platform);
  if (!file) {
    console.error('usage: node scripts/voice-gates.mjs <file> [--platform <name>]');
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
