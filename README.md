# content-ops

Mitchell Williams' content engine: an agent system for sourcing story ideas, refining writing, and optimizing posts across Substack, LinkedIn, X, Hacker News, Reddit, GitHub, Discord, TikTok, and YouTube for four audiences (AI developers, AI builders, the newly AI-enabled, general).

## Layout

- `CLAUDE.md` - the content agent: mission, voice rules, T0-T3 research policy, LLM routing, operating rules
- `AGENTS.md` - the builder layer: how skills enter this repo (quarantine, Qodo PR gate, adoption ledger)
- `knowledge/` - 4 audience profiles + 9 platform playbooks (every mechanics claim dated; 30-day staleness gate)
- `data/` (gitignored) - story ledger, performance log, baselines
- `drafts/` (gitignored) - one dir per story: master.md + platform adaptations + NOTES.md
- `memory/` - voice rules, accounts, standing decisions, performance learnings index
- `.claude/skills/` - content skills (story-scout, draft-post, platform-adapt, timing-check, content-review) + SDLC builder skills
- `.claude/agents/` - subagents: story-scout, platform-adapter, engagement-analyst
- `scripts/voice-gates.mjs` - THE deterministic voice/format gates (single source; content-review + prompt-eval both consume it)

## Quickstart

Open a Claude Code session in this directory, then:

0. `/platform-playbook-refresh <platform>` for any target platform whose playbook `last_verified` (or BASELINE date) is older than 30 days. Most playbooks still carry Jan 2026 baselines, so expect this step on first use: `/timing-check` and `/platform-adapt` refuse to run against a stale playbook by design.
1. `/story-scout` - refresh the ledger with live angles
2. `/draft-post` on a ledger row (start with #14, the harness piece, per the ledger's sequencing plan)
3. `/timing-check` on the staged draft (refuses if the playbook is stale; see step 0)
4. `/content-review` before anything reaches you for posting

Nothing posts autonomously, ever (see `memory/publishing-gate.md`). The agent drafts, stages, and proposes; you press send.

## Design docs

`docs/specs/` - architecture decisions (per-story pipeline: story-14; skills + subagent topology: content-agent-skills). `docs/skill-adoption-ledger.md` - every skill's provenance, evidence, review verdict.
