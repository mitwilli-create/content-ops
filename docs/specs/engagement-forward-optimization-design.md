# Engagement Forward-Optimization: Design

_Design doc (agent-architecture skill). Written 2026-07-09. Slug: engagement-forward-optimization._

## 1. Problem + audience

During the launch of Mitchell's first Substack pillar (`drafts/krieger-what-the-room-missed/`) he needed **pre-publish** engagement guidance for LinkedIn (how to shape the hook to the current feed algorithm, where to put the Substack link, when to post, which format to choose) and the `engagement-analyst` subagent could not provide it. That agent is **retrospective-only**: it reads `data/performance-log.md` *after* results land. The content engine can measure what happened but cannot advise before a post goes out, which is exactly the moment optimization has leverage. The audience is Mitchell at the point of staging a draft (his own hand still owns the send button). The capability needed: forward-looking, per-platform pre-publish engagement optimization across **X, Reddit, LinkedIn, Hacker News**, covering post timing, tags/flairs, hook/story shaping to each platform's engagement mechanics, format choice, and the first-hour engagement plan.

## 2. Topology decision

**Decision: re-wire, do not bloat the subagent.** The forward capability gets ONE clear owner, a new orchestrator SKILL `/engagement-optimize`, that **calls** `/timing-check`, `/story-scout` pulse, and the `knowledge/platforms/*.md` playbooks rather than re-implementing any of them. The `engagement-analyst` subagent stays a pure retrospective leaf. The *content engine* becomes bidirectional (optimize before + measure after); that bidirectionality is split across two surfaces because the two halves have opposite shapes.

| Surface | Build? | Reasoning |
|---|---|---|
| **`.claude/skills/engagement-optimize/SKILL.md`** (new) | **YES** | Forward optimization is inherently *orchestration*: it must invoke other skills (`/timing-check`), consume a subagent's output (`story-scout` pulse), read multiple playbooks, and synthesize. Orchestration lives in the skill layer. This is the "one clear owner" the brief asked for. |
| **`engagement-analyst` subagent** (existing) | **Light edit only** | Stays retrospective-only. A one-line pointer added to its description + body naming `/engagement-optimize` as the forward sibling, so the pair is legible and the retro-to-playbook-to-forward feedback loop is explicit. Its dataflow (read logs, propose learnings) is the opposite of the forward dataflow (orchestrate skills, synthesize guidance); merging them into one "pre/post mode" agent would overload a clean leaf and, fatally, a **subagent cannot invoke skills**, so a "pre mode" on the subagent physically could not call `/timing-check`. |
| `knowledge/platforms/*.md` | **NO**, consume only | Playbooks already own per-platform format/tags/flairs/timing/mechanics baselines. The new skill READS them. Duplicating any baseline into the skill is the defect this design exists to avoid. The LinkedIn bridge-behavior finding lives here already ([linkedin.md:16](../../knowledge/platforms/linkedin.md)). |
| `memory/` | **NO** | No new learned state. The flywheel already runs through `data/performance-log.md` (written via the retro path) into playbooks (via `/platform-playbook-refresh`). Forward guidance reads that accumulated state; it does not open a second store. |
| MCP connector | **NO** | Everything needed (web verify, live-X pulse, calendar availability) is reachable through the skills being called. No new external system. |

**What I am explicitly NOT building** (each would be a duplication defect):
- No new "when to post" logic. `/timing-check` owns it; the skill calls it.
- No new saturation/live-conversation scan. `story-scout` pulse owns it; the skill consumes the verdict `/timing-check` already produces, and only invokes pulse directly when `/timing-check` skipped it (non-topical piece).
- No hardcoded platform mechanics (tags, flair lists, link-placement rules, timing windows). Playbooks own them, kept fresh by `/platform-playbook-refresh`. **Hardcoding any of these is the single highest-risk failure of this design** (see §5).
- No new subagent. The per-platform synthesis is small (read 2-4 playbooks, format guidance from already-gathered timing + pulse context), so the orchestrator does it inline. A `platform-adapter`-style fan-out is unjustified for 2-4 lightweight reads.
- No posting. Publishing gate is unchanged: this skill advises, Mitchell sends.

## 3. Data flow

**Inputs**: a staged draft dir `drafts/<slug>/` (master + per-platform adaptations from `/draft-post`, OR a hand-written draft), and the target platforms (default: the draft's primary platforms).

**Transformations** (the `/engagement-optimize` procedure):
1. **Freshness gate**: for each target platform, read `knowledge/platforms/<platform>.md`; if `last_verified` > 30 days, STOP and route to `/platform-playbook-refresh <platform>`. (Same gate `/timing-check` uses; guidance on a stale playbook validates against fiction.)
2. **When**: call `/timing-check` per platform (it does the T1 verify + optional pulse + Mitchell-availability pass). Do not re-derive windows. `/timing-check` surfaces a pulse verdict in its output whenever the piece is topical.
3. **Live shaping signal (single-sourced)**: reuse the pulse verdict from step 2's `/timing-check` output. Only if `/timing-check` did not run pulse (non-topical piece) and hook shaping still needs live signal, invoke `/story-scout` pulse once directly. Pulse is never scanned twice. The `fresh | crowded | stale` + `unsaid_angle` verdict shapes hook framing and may argue for the unsaid angle.
4. **Per-platform synthesis**: from the (fresh) playbook's format/mechanics/tags sections plus the timing and pulse outputs, produce guidance: hook shaped to the platform's algorithm, tag/flair selection, **link placement pulled from the playbook** (e.g. LinkedIn = native excerpt, no bridge-behavior link-in-comment), format choice (text vs document-carousel vs video vs HN Show/Ask), and a first-hour engagement plan.

**Outputs**: written to the draft's `drafts/<slug>/NOTES.md` under a new `## Engagement plan (pre-publish)` section (extends the NOTES.md convention `/draft-post` already established; single writer into this section), and surfaced to Mitchell. Every claim tagged with its source (playbook + line, timing-check verification date, pulse verdict) so nothing reads as an unverified assertion. Never writes to playbooks, performance-log, or memory.

**The loop**: `/engagement-optimize` (before), then Mitchell posts, then `engagement-analyst` (after) reads results, proposes performance-log entries + flags playbook conflicts, then `/platform-playbook-refresh` updates playbooks, then the next `/engagement-optimize` reads fresher playbooks. Closed, single-writer at every hop.

## 4. Reuse audit

Read `.claude/skills/`, `.claude/agents/`, and AGENTS.md first. Existing coverage:

| Concern | Already owned by | This design's relationship |
|---|---|---|
| When to post (live-verified) | `/timing-check` skill | **Calls it.** Zero re-implementation. |
| Live conversation / saturation for a take | `story-scout` subagent, pulse mode (via `/story-scout` / `/timing-check`) | **Consumes its verdict** (produced by `/timing-check`); invokes pulse directly only when `/timing-check` skipped it. Zero re-implementation, no double scan. |
| Per-platform format / tags / flairs / timing / mechanics baselines | `knowledge/platforms/*.md` (9 playbooks; LinkedIn refreshed 2026-07-06) | **Reads them.** Zero duplication. |
| Playbook freshness (single writer) | `/platform-playbook-refresh` | **Routes to it** on a stale gate; never edits playbooks. |
| Draft generation + adaptations + NOTES.md | `/draft-post` (+ `platform-adapter`) | `/draft-post` gains a step calling `/engagement-optimize` before final staging; NOTES.md section extended, not forked. |
| Pre-publish safety gate (voice, grounding, HN-proofing) | `/content-review` | Adjacent, kept separate: content-review is a pass/fail *gate*; engagement-optimize is generative *guidance*. Sequence: optimize, then review, then stage. |
| Retrospective performance synthesis | `engagement-analyst` subagent | Unchanged in function; light description edit to name the forward sibling. |

Conclusion: the forward capability is a genuine gap (nothing synthesizes timing + pulse + playbook mechanics into per-platform pre-publish guidance for a specific draft). Every primitive it needs already exists; the new surface is pure orchestration + synthesis. No existing surface is duplicated.

## 5. Failure modes

| Failure | First observable signal |
|---|---|
| **Hardcoded mechanics drift** (skill bakes in a tag list, timing window, or "link in first comment" and the platform changes) | Guidance contradicts the current playbook; e.g. skill says "link in first comment" while [linkedin.md:16](../../knowledge/platforms/linkedin.md) says bridge behavior is now penalized. **Mitigation: the skill contains ZERO platform facts; every mechanic is read live from the playbook at run time.** This is the load-bearing rule; a review that finds any platform constant hardcoded in the SKILL.md fails the build. |
| Stale playbook silently used | Freshness gate skipped, so guidance is built on >30-day facts. Signal: recommended window/format diverges from a fresh manual check. Mitigation: mandatory `last_verified` gate before synthesis (mirrors `/timing-check`). |
| Skill re-implements timing instead of calling `/timing-check` | Two timing writers diverge; NOTES.md window disagrees with a `/timing-check` run. Mitigation: skill has no timing logic of its own; it invokes `/timing-check` and quotes its output. |
| Pulse scanned twice (double Grok spend) | Two pulse calls per run in the logs, or a pulse verdict in NOTES.md that disagrees with the `/timing-check` output. Mitigation: pulse is single-sourced from `/timing-check`; the skill invokes pulse directly only when `/timing-check` skipped it. |
| Guidance drifts toward posting/automation | Any wording that schedules or posts autonomously. Mitigation: explicit publishing-gate rule; output is recommendations for Mitchell's hand only. |
| Voice-rule leak into recommended hooks | An em dash or banned term in a proposed hook. Mitigation: proposed hooks are draft artifacts; `/content-review` + `scripts/voice-gates.mjs` remain the enforcing gate downstream. |

## 6. Acceptance test

Re-run the launch scenario that exposed the gap. With `drafts/krieger-what-the-room-missed/` staged, invoke `/engagement-optimize` for LinkedIn and assert the run:
1. Hits the freshness gate on `knowledge/platforms/linkedin.md` (passes, since `last_verified: 2026-07-06`).
2. Calls `/timing-check` and quotes a verified window with its verification date (does not invent one).
3. Reuses the pulse verdict from `/timing-check` (or runs pulse once itself only if timing-check skipped it) and reflects it in hook framing, with no second scan.
4. Produces a `## Engagement plan (pre-publish)` section in `drafts/krieger-what-the-room-missed/NOTES.md` containing: a hook shaped to the LinkedIn feed algorithm, an explicit **link-placement recommendation read from the playbook** (native excerpt + plain-text "full essay on Substack", NOT link-in-first-comment), a format choice, and a first-hour engagement plan, each line source-tagged.
5. Contains **no** hardcoded platform constant: `grep` the SKILL.md for timing windows / tag lists / flair names / link-placement verbs returns only instructions to read them from the playbook, never the values themselves.

Build/gate path (AGENTS.md): feature branch, then smoke test (the 5 asserts above, using a fixture draft), then CodeRabbit PR review, then merge only on a clean review, then a `docs/skill-adoption-ledger.md` row. Platform-mechanics claims in any test fixture are T1-verified, never asserted from memory.
