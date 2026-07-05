# content-ops — Builder-Skill Layer (SDLC)

This file governs the BUILDER side of content-ops: the skills a Claude Code instance uses to build and evolve the content-engine agent defined in CLAUDE.md. The content agent itself (voice rules, research tiers, LLM routing) lives in CLAUDE.md; this file is about how we build it correctly.

## Sourcing policy (locked 2026-07-05)

1. **Community-first.** For every SDLC phase, prefer skills built by experienced engineers with verifiable evidence (stars, downloads, ratings, author track record). Mitchell's earlier locally-authored career-ops skills are reference-only.
2. **Evidence or it didn't happen.** Every adopted skill's evidence is recorded in `docs/skill-adoption-ledger.md`. Unverifiable popularity claims get downgraded.
3. **Qodo gate is mandatory.** No skill (adopted OR authored) is promoted from `.claude/skills-inbox/` to `.claude/skills/` without passing `scripts/qodo-skill-gate.sh` (quality + security review) AND a functional smoke test. HIGH security finding = REJECT.
4. **Quarantine flow:** install → `.claude/skills-inbox/<name>/` → Qodo review → smoke test → promote to `.claude/skills/<name>/` → ledger entry.

## SDLC skill matrix

Verdicts from the 2026-07-05 council-of-models research (7 models, $0.44) + dealbreaker adjudication. Report: `docs/skill-sourcing-report.md`.

Star counts verified against the live GitHub API on 2026-07-05 (dealbreaker: 34 gh-API calls; independently spot-checked in-session). Full adjudication: `docs/skill-sourcing-adjudicated.md`.

| # | SDLC phase | Skill (adopted/authored) | Source + evidence (verified 2026-07-05) | Status |
|---|---|---|---|---|
| 1 | Spec-driven development | superpowers + spec-kit | [obra/superpowers](https://github.com/obra/superpowers) ★246,807 · [github/spec-kit](https://github.com/github/spec-kit) ★118,145 | INBOX (Qodo pending) |
| 2 | Architecture/design (agent systems) | `/agent-architecture` (authored; BMAD-METHOD ★50,096 as reference method — no topology skill exists) | authored | INBOX (Qodo pending) |
| 3 | Prompt engineering + eval harness | `/prompt-eval` (authored thin wrap of promptfoo) | [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) ★22,943 | INBOX (Qodo pending) |
| 4 | MCP build + debug/test | mcp-builder plugin (Anthropic) + `/mcp-debug` (authored wrap of inspector + fastmcp) | [modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector) ★10,282 · [PrefectHQ/fastmcp](https://github.com/PrefectHQ/fastmcp) ★25,981 | INBOX (Qodo pending) |
| 5 | Agent memory design | planning-with-files (+ agentmemory lib optional) | [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) ★24,663 · [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) ★24,589 | INBOX (Qodo pending) |
| 6 | Knowledge-base construction | `/kb-build` (authored thin wrap of LlamaIndex; council's "graphify ★78k" did NOT resolve on GitHub search — downgraded) | [run-llama/llama_index](https://github.com/run-llama/llama_index) ~50,660★ | INBOX (Qodo pending) |
| 7 | Agent eval / benchmarking | `/prompt-eval` (same skill: promptfoo + deepeval golden sets) | [confident-ai/deepeval](https://github.com/confident-ai/deepeval) ★16,652 | INBOX (Qodo pending) |
| 8 | Testing / TDD | superpowers TDD chain + tdd-guard | [nizos/tdd-guard](https://github.com/nizos/tdd-guard) ★2,241 | INBOX (Qodo pending) |
| 9 | Deployment (scheduled agents, launchd) | `/deploy-scheduled-agent` (authored — nothing credible for macOS launchd; claude-code-action ★8,253 is CI-only) | authored | INBOX (Qodo pending) |
| 10 | Maintenance / regression | `/regression-wire` (authored wrap: langfuse traces + promptfoo CI) | [langfuse/langfuse](https://github.com/langfuse/langfuse) ★30,468 | INBOX (Qodo pending) |
| 11 | Social-platform optimization | `knowledge/platforms/*` (sibling-built) + `/platform-playbook-refresh` (authored — council found only weak skills, e.g. blacktwist ★305) | authored + local KB | INBOX (Qodo pending) |

Acceptance test for this matrix: zero TBD rows, every row's Status is PROMOTED or AUTHORED with a ledger entry. Current gate: ALL promotion blocked on Qodo auth (`qodo login` — Mitchell, one-time browser flow), then `bash scripts/qodo-skill-gate.sh .claude/skills-inbox/<name>` per skill.

Retroactive review queue (same gate): the 5 sibling-authored content-agent skills in `.claude/skills/` (story-scout, draft-post, platform-adapt, timing-check, content-review) predate the gate.

## Standing infrastructure (reused, not rebuilt)

- Multi-LLM fan-out: `~/Documents/career-ops/lib/council.mjs` via `scripts/run-council-content.sh` (explicit `--models` always; empty flag silently degrades to Sonnet-only).
- Global agents: `council-of-models`, `dealbreaker`, `researcher`.
- Anthropic plugins (first-class): `skill-creator`, `mcp-builder`, `prompt-optimizer`, `prompt-master`, `consolidate-memory`, `engineering:*`.
- Voice: `make-it-sound-like-mitchell` + `mitchells-voice-style` (global plugins) + CLAUDE.md hard voice rules.

## Conventions

- Skills follow the agentskills.io SKILL.md standard (frontmatter: name, description; body: instructions). Match the structure of the best adopted community skills.
- Personal data (drafts, story ledger, account handles, engagement analytics) is gitignored — see `.gitignore`. Never commit.
- No em dashes in any publishable artifact. Banned word: "kill" (use "banned-phrase checklist").
- Every KB claim about platform mechanics carries a freshness date (see CLAUDE.md research tiers).
