# content-ops — Builder-Skill Layer (SDLC)

This file governs the BUILDER side of content-ops: the skills a Claude Code instance uses to build and evolve the content-engine agent defined in CLAUDE.md. The content agent itself (voice rules, research tiers, LLM routing) lives in CLAUDE.md; this file is about how we build it correctly.

## Sourcing policy (locked 2026-07-05)

1. **Community-first.** For every SDLC phase, prefer skills built by experienced engineers with verifiable evidence (stars, downloads, ratings, author track record). Mitchell's earlier locally-authored career-ops skills are reference-only.
2. **Evidence or it didn't happen.** Every adopted skill's evidence is recorded in `docs/skill-adoption-ledger.md`. Unverifiable popularity claims get downgraded.
3. **Qodo gate is mandatory — PR-review form.** Qodo discontinued its CLI (backend refuses all calls as of 2026-07-05); the working product is automatic PR review on a connected Git repo. Promotion is therefore a PR: `bash scripts/promote-skill.sh <name>...` copies the skill from quarantine into `.claude/skills/` on a `promote/*` branch and opens a PR; Qodo reviews the diff (repo must be connected ONCE at https://app.qodo.ai — Mitchell action); merge only after a clean review + smoke test. HIGH security finding = close the PR, REJECT.
4. **Quarantine flow:** install → `.claude/skills-inbox/<name>/` (gitignored) → supply-chain pre-scan → smoke test → promotion PR → Qodo review → merge → ledger entry.
5. **Tool-shaped adoptions are not vendored.** Community winners that are CLIs/libraries rather than SKILL.md dirs (spec-kit, tdd-guard, promptfoo, etc.) get documented install commands here + a wrapping skill where needed — never a full repo copied into `.claude/skills/`.

## SDLC skill matrix

Verdicts from the 2026-07-05 council-of-models research (7 models, $0.44) + dealbreaker adjudication. Report: `docs/skill-sourcing-report.md`.

Star counts verified against the live GitHub API on 2026-07-05 (dealbreaker: 34 gh-API calls; independently spot-checked in-session). Full adjudication: `docs/skill-sourcing-adjudicated.md`.

| # | SDLC phase | Skill (adopted/authored) | Source + evidence (verified 2026-07-05) | Status |
|---|---|---|---|---|
| 1 | Spec-driven development | superpowers + spec-kit | [obra/superpowers](https://github.com/obra/superpowers) ★246,807 · [github/spec-kit](https://github.com/github/spec-kit) ★118,145 | PROMOTED |
| 2 | Architecture/design (agent systems) | `/agent-architecture` (authored; BMAD-METHOD ★50,096 as reference method — no topology skill exists) | authored | PROMOTED |
| 3 | Prompt engineering + eval harness | `/prompt-eval` (authored thin wrap of promptfoo) | [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) ★22,943 | PROMOTED |
| 4 | MCP build + debug/test | mcp-builder plugin (Anthropic) + `/mcp-debug` (authored wrap of inspector + fastmcp) | [modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector) ★10,282 · [PrefectHQ/fastmcp](https://github.com/PrefectHQ/fastmcp) ★25,981 | PROMOTED |
| 5 | Agent memory design | planning-with-files (+ agentmemory lib optional) | [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) ★24,663 · [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) ★24,589 | PROMOTED |
| 6 | Knowledge-base construction | `/kb-build` (authored thin wrap of LlamaIndex; council's "graphify ★78k" did NOT resolve on GitHub search — downgraded) | [run-llama/llama_index](https://github.com/run-llama/llama_index) ~50,660★ | PROMOTED |
| 7 | Agent eval / benchmarking | `/prompt-eval` (same skill: promptfoo + deepeval golden sets) | [confident-ai/deepeval](https://github.com/confident-ai/deepeval) ★16,652 | PROMOTED |
| 8 | Testing / TDD | superpowers TDD chain + tdd-guard | [nizos/tdd-guard](https://github.com/nizos/tdd-guard) ★2,241 | PROMOTED |
| 9 | Deployment (scheduled agents, launchd) | `/deploy-scheduled-agent` (authored — nothing credible for macOS launchd; claude-code-action ★8,253 is CI-only) | authored | PROMOTED |
| 10 | Maintenance / regression | `/regression-wire` (authored wrap: langfuse traces + promptfoo CI) | [langfuse/langfuse](https://github.com/langfuse/langfuse) ★30,468 | PROMOTED |
| 11 | Social-platform optimization | `knowledge/platforms/*` (sibling-built) + `/platform-playbook-refresh` (authored — council found only weak skills, e.g. blacktwist ★305) | authored + local KB | PROMOTED |

Acceptance test for this matrix: zero TBD rows, every row's Status is PROMOTED or AUTHORED with a ledger entry. Current gate state: promotion PRs [#1](https://github.com/mitwilli-create/content-ops/pull/1) (7 authored skills) + [#2](https://github.com/mitwilli-create/content-ops/pull/2) (14 superpowers SDLC skills, MIT-attributed) were Qodo-reviewed (no security concerns) and MERGED 2026-07-05 with Mitchell approval — the gate is live end-to-end.

Adoption modes for tool-shaped winners (not vendored): **spec-kit** — `uvx --from git+https://github.com/github/spec-kit.git specify init <project>`; **tdd-guard** — `npm i -g tdd-guard` + hook config per its README; **planning-with-files** — pattern reference (read from quarantine or upstream; its file-based planning patterns are encoded in the authored `agent-architecture` + kb-build skills).

FINDING (2026-07-05): the 5 content-agent skills declared in CLAUDE.md § Skills (story-scout, draft-post, platform-adapt, timing-check, content-review) are EMPTY dirs — declared-but-unbuilt. Build them THROUGH this gate (author in quarantine → promotion PR) as the content agent's next work item.

## Standing infrastructure (reused, not rebuilt)

- Multi-LLM fan-out: `~/Documents/career-ops/lib/council.mjs` via `scripts/run-council-content.sh` (explicit `--models` always; empty flag silently degrades to Sonnet-only).
- Global agents: `council-of-models`, `dealbreaker`, `researcher`.
- Anthropic plugins (first-class): `skill-creator`, `mcp-builder`, `prompt-optimizer`, `prompt-master`, `consolidate-memory`, `engineering:*`.
- Voice: `make-it-sound-like-mitchell` + `mitchells-voice-style` (global plugins) + CLAUDE.md hard voice rules.

## Detectors (regression checks; every detector documents its kill switch here)

| Detector | Command | What it fails on | Kill switch |
|---|---|---|---|
| Voice/format gates | `node scripts/voice-gates.mjs <file> [--platform <p>]` | em dash, banned term, banned idioms, platform length window in the given artifact | none (core gate; bypassing is a per-invocation choice, not an env flag) |
| Length-window drift | `node scripts/voice-gates.mjs --check-windows` | playbook missing/unparseable/schema-invalid `length_window:` line; fallback table diverging from playbooks; fallback entry with no playbook file | `VOICE_GATES_DISABLE_WINDOW_CHECK=true` (short-circuits, exit 0, prints a disabled notice) |

Canonical window source: the `length_window: <one-line JSON|null>` header in each `knowledge/platforms/*.md` (single writer: `/platform-playbook-refresh`). `scripts/voice-gates.mjs` loads them at import, platform set derived from the directory listing; the in-script table is a warn-loudly resilience fallback only. Run `--check-windows` after any playbook window edit.

## Conventions

- Skills follow the agentskills.io SKILL.md standard (frontmatter: name, description; body: instructions). Match the structure of the best adopted community skills.
- Personal data (drafts, story ledger, account handles, engagement analytics) is gitignored — see `.gitignore`. Never commit.
- No em dashes in any publishable artifact. Banned word: "kill" (use "banned-phrase checklist").
- Every KB claim about platform mechanics carries a freshness date (see CLAUDE.md research tiers).
