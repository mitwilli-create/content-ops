# Design: Story #14 pipeline — "What's a harness and why should I build one?"

Produced by following the agent-architecture skill end-to-end (smoke test, 2026-07-05; the skill was in quarantine at `.claude/skills-inbox/` during that run and now lives promoted at `.claude/skills/agent-architecture/SKILL.md`). Capability under design: take ledger idea #14 from idea → master draft → platform adaptations → timing recommendation.

## 1. Problem + audience

Idea #14 explains what an agent harness is and why builders should own one. Primary audiences: newly-AI-enabled (needs the concept demystified) and AI builders (needs the "why build your own" argument). Mitchell's lived credential: career-ops IS a harness he built, so the piece ladders to real experience — the exact differentiation CLAUDE.md demands.

## 2. Topology decision

- **SKILL.md surfaces: reuse only.** The pipeline is fully covered by three existing sibling skills: `/draft-post` (ledger idea → master + adaptations), `/platform-adapt`, `/timing-check`. No new skill is warranted.
- **knowledge/**: reuse `knowledge/platforms/{substack,x,linkedin,hackernews}.md` (primary targets for a definitional dev-adjacent piece). No new knowledge doc — the harness concept is Mitchell's expertise (T0, no research needed per CLAUDE.md tiers).
- **memory/**: no new file; post-publish performance goes to the existing `data/performance-log.md`.
- **agents / MCP**: none needed. Drafting is orchestrator-inline (Fable 5 per the routing table).
- NOT building: a per-story spec skill, a harness-topic research pass, any connector.

## 3. Data flow

`data/story-ledger.md` (idea #14, status → drafting) → `/draft-post` → `drafts/harness-explainer/master.md` + per-platform adaptations in the same dir → `/timing-check` (live-verify windows; playbook `last_verified` must be <30 days or `/platform-playbook-refresh` fires first) → staged for Mitchell's review (never auto-published) → after publish, engagement numbers → `data/performance-log.md`.

## 4. Reuse audit

Read `.claude/skills/` (5 sibling skills) + AGENTS.md matrix. Every step maps to an existing surface; this design's conclusion is that ZERO new surfaces are required. The skill's reuse-audit section did its job: without it, the builder instance would plausibly have authored a redundant "story-pipeline" skill duplicating `/draft-post`.

## 5. Failure modes

- Stale platform playbook → mistimed post. Signal: `last_verified` older than 30 days at `/timing-check` time. Mitigation: refresh gate (hard rule in platform-playbook-refresh).
- Voice drift in adaptations → AI-tell artifacts. Signal: em-dash/banned-word grep non-zero on any draft. Mitigation: prompt-eval standard asserts run on the drafts.
- Ledger status not updated → idea re-drafted later. Signal: duplicate drafts dir. Mitigation: `/draft-post` updates ledger status in the same run.

## 6. Acceptance test

`drafts/harness-explainer/` contains `master.md` + ≥3 platform adaptations; all pass `grep -c "—" == 0` and banned-word grep == 0; ledger row #14 status updated; timing recommendation cites a playbook with `last_verified` ≤ 30 days old.
