# content-ops: Builder-Skill Layer (SDLC)

This file governs the BUILDER side of content-ops: the skills a Claude Code instance uses to build and evolve the content-engine agent defined in CLAUDE.md. The content agent itself (voice rules, research tiers, LLM routing) lives in CLAUDE.md; this file is about how we build it correctly.

> **Lane rules (Codex, read first):** `~/Documents/mission-control/WORKSPACE.md` defines the multi-agent lanes for this machine. Your lane here (Codex) is building; Claude Code reviews your output and owns orchestration/memory; CodeRabbit reviews commits and PRs automatically. Non-negotiable in this repo: personal data (`data/`, `drafts/`, `memory/accounts.md`, analytics) is gitignored and never committed; `data/story-ledger.md` follows a byte-preservation contract (mission-control rewrites exactly ONE status cell per kanban move; never restructure it); nothing publishes without Mitchell's manual send.

## Sourcing policy (locked 2026-07-05)

1. **Community-first.** For every SDLC phase, prefer skills built by experienced engineers with verifiable evidence (stars, downloads, ratings, author track record). Mitchell's earlier locally-authored career-ops skills are reference-only.
2. **Evidence or it didn't happen.** Every adopted skill's evidence is recorded in `docs/skill-adoption-ledger.md`. Unverifiable popularity claims get downgraded.
3. **Qodo gate is mandatory: PR-review form.** Qodo discontinued its CLI (backend refuses all calls as of 2026-07-05); the working product is automatic PR review on a connected Git repo. Promotion is therefore a PR: `bash scripts/promote-skill.sh <name>...` copies the skill from quarantine into `.claude/skills/` on a `promote/*` branch and opens a PR; Qodo reviews the diff (repo must be connected ONCE at https://app.qodo.ai, a Mitchell action); merge only after a clean review + smoke test. HIGH security finding = close the PR, REJECT.
4. **Quarantine flow:** install → `.claude/skills-inbox/<name>/` (gitignored) → supply-chain pre-scan → smoke test → promotion PR → Qodo review → merge → ledger entry.
5. **Tool-shaped adoptions are not vendored.** Community winners that are CLIs/libraries rather than SKILL.md dirs (spec-kit, tdd-guard, promptfoo, etc.) get documented install commands here + a wrapping skill where needed. Never a full repo copied into `.claude/skills/`.

## SDLC skill matrix

Verdicts from the 2026-07-05 council-of-models research (7 models, $0.44) + dealbreaker adjudication. Report: `docs/skill-sourcing-report.md`.

Star counts verified against the live GitHub API on 2026-07-05 (dealbreaker: 34 gh-API calls; independently spot-checked in-session). Full adjudication: `docs/skill-sourcing-adjudicated.md`.

| # | SDLC phase | Skill (adopted/authored) | Source + evidence (verified 2026-07-05) | Status |
|---|---|---|---|---|
| 1 | Spec-driven development | superpowers + spec-kit | [obra/superpowers](https://github.com/obra/superpowers) ★246,807 · [github/spec-kit](https://github.com/github/spec-kit) ★118,145 | PROMOTED |
| 2 | Architecture/design (agent systems) | `/agent-architecture` (authored; BMAD-METHOD ★50,096 as reference method: no topology skill exists) | authored | PROMOTED |
| 3 | Prompt engineering + eval harness | `/prompt-eval` (authored thin wrap of promptfoo) | [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) ★22,943 | PROMOTED |
| 4 | MCP build + debug/test | mcp-builder plugin (Anthropic) + `/mcp-debug` (authored wrap of inspector + fastmcp) | [modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector) ★10,282 · [PrefectHQ/fastmcp](https://github.com/PrefectHQ/fastmcp) ★25,981 | PROMOTED |
| 5 | Agent memory design | planning-with-files (+ agentmemory lib optional) | [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) ★24,663 · [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) ★24,589 | PROMOTED |
| 6 | Knowledge-base construction | `/kb-build` (authored thin wrap of LlamaIndex; council's "graphify ★78k" did NOT resolve on GitHub search: downgraded) | [run-llama/llama_index](https://github.com/run-llama/llama_index) ~50,660★ | PROMOTED |
| 7 | Agent eval / benchmarking | `/prompt-eval` (same skill: promptfoo + deepeval golden sets) | [confident-ai/deepeval](https://github.com/confident-ai/deepeval) ★16,652 | PROMOTED |
| 8 | Testing / TDD | superpowers TDD chain + tdd-guard | [nizos/tdd-guard](https://github.com/nizos/tdd-guard) ★2,241 | PROMOTED |
| 9 | Deployment (scheduled agents, launchd) | `/deploy-scheduled-agent` (authored: nothing credible for macOS launchd; claude-code-action ★8,253 is CI-only) | authored | PROMOTED |
| 10 | Maintenance / regression | `/regression-wire` (authored wrap: langfuse traces + promptfoo CI) | [langfuse/langfuse](https://github.com/langfuse/langfuse) ★30,468 | PROMOTED |
| 11 | Social-platform optimization | `knowledge/platforms/*` (sibling-built) + `/platform-playbook-refresh` (authored: council found only weak skills, e.g. blacktwist ★305) | authored + local KB | PROMOTED |

Acceptance test for this matrix: zero TBD rows, every row's Status is PROMOTED or AUTHORED with a ledger entry. Current gate state: promotion PRs [#1](https://github.com/mitwilli-create/content-ops/pull/1) (7 authored skills) + [#2](https://github.com/mitwilli-create/content-ops/pull/2) (14 superpowers SDLC skills, MIT-attributed) were Qodo-reviewed (no security concerns) and MERGED 2026-07-05 with Mitchell approval. The gate is live end-to-end.

Adoption modes for tool-shaped winners (not vendored): **spec-kit**: `uvx --from git+https://github.com/github/spec-kit.git specify init <project>`; **tdd-guard**: `npm i -g tdd-guard` + hook config per its README; **planning-with-files**: pattern reference (read from quarantine or upstream; its file-based planning patterns are encoded in the authored `agent-architecture` + kb-build skills).

FINDING (2026-07-05, RESOLVED 2026-07-06): the 5 content-agent skills declared in CLAUDE.md § Skills (story-scout, draft-post, platform-adapt, timing-check, content-review) were empty declared-but-unbuilt dirs at first audit. They have since been built through this gate and PROMOTED (PRs #3 and #5, Qodo-reviewed, ledger rows in docs/skill-adoption-ledger.md).

## Standing infrastructure (reused, not rebuilt)

- Multi-LLM fan-out: `~/Documents/career-ops/lib/council.mjs` via `scripts/run-council-content.sh` (explicit `--models` always; empty flag silently degrades to Sonnet-only).
- Global agents: `council-of-models`, `dealbreaker`, `researcher`.
- Anthropic plugins (first-class): `skill-creator`, `mcp-builder`, `prompt-optimizer`, `prompt-master`, `consolidate-memory`, `engineering:*`.
- Voice: `make-it-sound-like-mitchell` + `mitchells-voice-style` (global plugins) + CLAUDE.md hard voice rules.

## Detectors (regression checks; every detector documents its kill switch here)

| Detector | Command | What it fails on | Kill switch |
|---|---|---|---|
| Voice/format gates | `node scripts/voice-gates.mjs <file> [--platform <p>] [--published]` | em dash, banned term, banned idioms, platform length window in the given artifact. `--published` strips `:::` marker blocks first so the length gate reports the TRUE published word count (a raw count false-trips the ceiling on drafts with embed markers) | none (core gate; bypassing is a per-invocation choice, not an env flag) |
| Length-window drift | `node scripts/voice-gates.mjs --check-windows` | playbook missing/unparseable/schema-invalid `length_window:` line; fallback table diverging from playbooks; fallback entry with no playbook file | `VOICE_GATES_DISABLE_WINDOW_CHECK=true` (short-circuits, exit 0, prints a disabled notice) |
| Banned-phrase drift | `node scripts/voice-gates.mjs --check-banned` | committed `scripts/banned-phrases.json` diverging from `voice-os/data/banned_list.txt`; exit 2 if the source list is unreachable (an unverifiable gate is not a verified one) | `VOICE_GATES_DISABLE_BANNED_CHECK=true` (short-circuits, exit 0, prints a disabled notice) |
| Adaptation staleness | `node scripts/check-adaptation-staleness.mjs <draft-dir> --master <file>` | a platform adaptation whose `source_hash` no longer matches its master (STALE), or, absent a hash, a master edited after the adaptation (LIKELY-STALE), or a named source that is missing (ERROR) | none (per-invocation; run it in `/draft-post`, `/platform-adapt`, and `/publish` preconditions) |

Canonical window source: the `length_window: <one-line JSON|null>` header in each `knowledge/platforms/*.md` (single writer: `/platform-playbook-refresh`). `scripts/voice-gates.mjs` loads them at import, platform set derived from the directory listing; the in-script table is a warn-loudly resilience fallback only. Run `--check-windows` after any playbook window edit.

Canonical banned-vocabulary source: `voice-os/data/banned_list.txt`, generated into `scripts/banned-phrases.json` by `scripts/gen-banned.mjs` (override the source path with `VOICE_OS_BANNED`). Committed rather than read at runtime for the same reason as the fallback windows: voice-os is a separate repo and an absent source must not silently disable the gate. `checkText` fails CLOSED if the artifact is missing or corrupt. Run `--check-banned` after any edit to the Voice OS list, and regenerate in the same commit.

All banned phrases are HARD FAILS, never warnings. Ruled 2026-07-20 after measuring the full list against `drafts/`: 30 hits across 49 files and 132,631 words, and every hit in outward material was a true positive (22 instances of one cold-outreach cliché in a DM template). The false positives were all in working material (research transcripts, quoted third-party titles, experiment fixtures, internal notes), which the per-file invocation never reaches. A warning tier would exit 0 and enforce nothing.

## Publish tooling (durable; productized from launch scratchpad 2026-07-09)

The first Substack launch rebuilt these from an ephemeral scratchpad every session. They now live in `scripts/`, take the draft path as an ARGUMENT (no hardcoded paths / vN filenames), and write predictable per-draft outputs to `<draft-dir>/.render/` (gitignored with `drafts/`). Reconstructed as dependency-free Node `.mjs` to match `voice-gates.mjs` (the Python originals were never committed).

- `scripts/build-paste-body.mjs <draft>` - rich-text body for the Substack editor; each `:::` media block becomes a numbered `⛳ N/TOTAL` marker line. TOTAL is AUTO-COUNTED from the draft (no hand-edited constant).
- `scripts/build-mockup.mjs <draft>` - Substack-styled HTML preview with media in position (YouTube thumbs, inline images, callout, code template).
- `scripts/load-clipboard.sh <draft> [--screenshot]` - renders first, then loads the rich-text clipboard LAST. Headless Chrome clobbers the clipboard, so the load must be the final step; this script enforces that order.
- `scripts/lib/draft-parse.mjs` - shared parser (single-sources the `:::` convention shared with `voice-gates.mjs::stripEmbedBlocks`).
- The end-to-end runbook is the `/publish` skill.

## Conventions

- Skills follow the agentskills.io SKILL.md standard (frontmatter: name, description; body: instructions). Match the structure of the best adopted community skills.
- Personal data (drafts, story ledger, account handles, engagement analytics) is gitignored: see `.gitignore`. Never commit.
- No em dashes in any publishable artifact. Banned word: "kill" (use "banned-phrase checklist").
- Every KB claim about platform mechanics carries a freshness date (see CLAUDE.md research tiers).
