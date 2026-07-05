# Design: the 5 content-agent skills + subagent topology

Produced by following `.claude/skills/agent-architecture/SKILL.md` (2026-07-05, session resuming the v1 interruption). Capability under design: the five skills declared in CLAUDE.md § Skills (story-scout, draft-post, platform-adapt, timing-check, content-review) plus the subagent layer that supports them. Executes `docs/plan-finish-content-agent-v2.md` Step 0.

## 1. Problem + audience

The content agent's CLAUDE.md declares five skills that are empty dirs (AGENTS.md FINDING, 2026-07-05). Without them the orchestrator improvises each pipeline run: idea sourcing, drafting, adaptation, timing, and pre-publish gating happen ad hoc, with no repeatable procedure and no deterministic voice gates. Audience: the Claude Code orchestrator running content-ops sessions for Mitchell across all four content audiences.

## 2. Topology decision

- **SKILL.md × 5** — all five are repeatable orchestrator workflows: correct surface. Authored in-house (AGENTS.md matrix rows 3/11 confirmed no credible community equivalents for the content-specific ones).
- **Subagents × 3, not 4** — see reuse audit Q1: `trend-monitor` is NOT built. Ratified set: `story-scout` (research fan-out, read-only + web), `platform-adapter` (parallel per-platform adaptation), `engagement-analyst` (performance synthesis).
- **`scripts/voice-gates.mjs` (NEW, one small script)** — see reuse audit Q3: the deterministic voice/format checks must exist ONCE, consumed by both `/content-review` and prompt-eval configs. A shared script is the only way two consumers stay in lockstep.
- **knowledge/**: no new docs; the 9 playbooks + audiences + llm-routing cover the domain. This build ADDS freshness markers to the 4 docs flagged by the kb-build census (kb-build rule 1/5 compliance), no new files.
- **memory/**: no new files. Performance learnings continue to flow to `data/performance-log.md` (template created this build) and `memory/MEMORY.md`'s performance section.
- **MCP connectors**: none. Chrome MCP + WebSearch + council wrapper already cover every external need. NOT building: any platform-posting connector (publishing-gate memory forbids autonomous posting).

## 3. Data flow

`data/story-ledger.md` → `/story-scout` (angles + net-new ideas appended, statuses advanced) → `/draft-post` → `drafts/<slug>/master.md` + adaptations (via `platform-adapter` subagents for parallel platforms) → `/timing-check` (live T1/T2 verify of TODAY's windows; READ-ONLY vs playbooks) → `/content-review` (runs `scripts/voice-gates.mjs` + judgment checks → READY / PARTIAL) → staged for Mitchell (publishing gate) → results reported → `engagement-analyst` → `data/performance-log.md` + memory learnings.

## 4. Reuse audit (the three overlap questions, answered)

**Q1 — trend-monitor vs story-scout: FOLD.** Both surfaces would do X/HN/Reddit pulse work with the same tools (`run-council-content.sh` + grok-4-x-search, HN/Reddit fetches). Verdict: ONE `story-scout` subagent with two modes: `scout` (mine for angles/net-new ideas → ledger) and `pulse` (saturation + conversation-timing signal for one named take → report to caller). `/timing-check` calls it in pulse mode; `/story-scout` calls it in scout mode. Building trend-monitor separately would duplicate prompts, tools, and cost with zero added capability. 3 subagents ship, not 4.

**Q2 — timing-check vs /platform-playbook-refresh: ONE WRITER PER FILE CLASS.** `knowledge/platforms/*.md` has exactly one writer: `/platform-playbook-refresh` (already promoted). `/timing-check` is a READER: it verifies TODAY's window for a specific post (T1 searches + pulse mode), compares against the playbook, and when it detects drift or a `last_verified` older than 30 days it STOPS and instructs running `/platform-playbook-refresh` first. v1's "timing-check writes findings back into the playbook" wording is dead: two writers into the same doc class means silent overwrites of the refresh skill's dated claims (career-ops bug-class: contract-drift-across-layers).

**Q3 — content-review checks ≡ prompt-eval standard asserts: DEFINE ONCE.** The deterministic gates (em dash, banned word, banned idioms, platform length windows) live in `scripts/voice-gates.mjs` as an exported `GATES` table + CLI. `/content-review` executes the CLI on artifacts. Prompt-eval configs consume the SAME module via promptfoo `javascript` asserts (`file://scripts/voice-gates.mjs` import). Editing a gate in one place updates both consumers; a drifted duplicate regex list is a latent false-green.

Existing surfaces reused, not rebuilt: `run-council-content.sh` (all model fan-out), `/platform-playbook-refresh` (playbook writes), `/prompt-eval` (eval harness), global `make-it-sound-like-mitchell` (voice pass), `/deep-research` + career-ops `researcher` (T3), story-14 design (per-story pipeline precedent — confirms no per-story skills are ever needed).

## 5. Failure modes

- **Stale playbook at timing time** → mistimed post. Signal: `last_verified` > 30 days. Mitigation: hard refusal gate in `/timing-check` AND `/platform-adapt` (both read playbooks).
- **Gate drift between content-review and prompt-eval** → false-green ships an AI-tell. Signal: gate regex present in >1 file. Mitigation: single `voice-gates.mjs` source; grep census in acceptance test.
- **story-scout pulse mode hallucinating saturation** ("everyone's said this") → good takes spiked. Signal: pulse verdicts with zero cited posts/links. Mitigation: pulse output schema requires cited examples or explicitly states "no live signal found".
- **Subagent writes colliding on drafts/** → lost adaptations. Signal: truncated/duplicated files. Mitigation: platform-adapter agents each own exactly one output file path, passed by the caller (no shared-file writes).
- **Ledger status not advanced after drafting** → duplicate future drafts. Signal: drafts dir exists for an `idea`-status row. Mitigation: `/draft-post` updates the ledger row in the same run (story-14 design, inherited).

## 6. Acceptance test

1. Five SKILL.md files + three agent .md files exist with valid frontmatter; `find .claude/skills .claude/agents -name "*.md"` shows zero empty dirs.
2. `node scripts/voice-gates.mjs` on a deliberately-dirty fixture (contains an em dash + the banned word) exits non-zero naming BOTH gates; `/content-review` on that fixture returns PARTIAL with both gaps listed.
3. Prompt-eval golden mini-suite on draft-post's core prompt (2-3 ledger ideas × 2 models) green, with asserts importing `voice-gates.mjs` (not duplicated regexes).
4. Grep census: the em-dash/banned-word regexes appear in exactly one committed source (`scripts/voice-gates.mjs`), referenced elsewhere.
5. The 4 flagged KB docs carry `last_verified:` + a "How to refresh this" line; local kb-freshness baseline updated 7 → 11 with a provenance note (regression-wire re-seed rule).
