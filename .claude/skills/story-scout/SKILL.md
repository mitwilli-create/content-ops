---
name: story-scout
description: Use when sourcing new story ideas, finding fresh angles on ledger ideas, checking whether a take is already saturated, or the user asks "what should I write about", "is this angle taken", "what's the conversation right now", "scout for stories", or the story ledger has gone a week without new entries.
---

# Story Scout

Mine live conversation for story material and saturation signal. The ledger (`data/story-ledger.md`) is the single sink: everything found lands there or in a pulse report, never in chat alone.

## Two modes (one subagent, two jobs - design doc Q1)

**Scout mode** (default): hunt for angles + net-new ideas.
**Pulse mode**: saturation + conversation-timing check for ONE named take (called by `/timing-check` and pre-drafting).

## Scout procedure

0. **Drain capture first.** (a) Gmail sweep: search the connected Gmail MCP for `subject:IDEA` scoped by the inbox's `<!-- swept-through -->` cursor (`after:` the marker date; `never` = no date filter, full history). Ingest strictly-newer messages per the cursor semantics in the /capture skill (timestamp, tie-break by message id), append to `data/inbox.md` (`src: email`), advance the marker. Never apply a fixed recency window; the cursor is the only boundary, so arbitrarily old unswept ideas are always caught up. Gmail MCP unavailable in this context: print a notice and continue, never fail. (b) Triage `data/inbox.md`: move each idea line into `data/story-ledger.md` as a full row (audience, platform guess, angle note, status `idea`; email-sourced rows keep their `id:<gmail id>` token), then remove ONLY the drained idea lines. The header and the `<!-- swept-through -->` cursor line are load-bearing and MUST survive every drain; never truncate or recreate the file to clear it. If the cursor line is ever found missing, treat it as `never` but dedupe every swept message by its gmail id against BOTH the inbox and the ledger before appending, so a lost cursor degrades to a slower idempotent sweep, never to duplicates. Captured ideas outrank fresh scouting; they are Mitchell's own signal.
1. Read `data/story-ledger.md`: current ideas, statuses, and the sequencing plan. Scouting serves the ledger, not the feed.
2. Dispatch the `story-scout` subagent (`run_in_background` fine) with mode + the 3-5 ledger ideas currently most relevant. Sources per CLAUDE.md research tiers:
   - T2 X pulse: `bash scripts/run-council-content.sh <prompt> <out> "xai:grok-4-x-search"` (the third argument is the REQUIRED models list; the wrapper maps it to run-council.mjs `--models` and exits with usage if omitted)
   - HN front page + relevant subreddit tops via WebFetch
   - T1 news checks on any ledger idea touching current events
3. For each finding require: source link, why it maps to a ledger idea (or is net-new), which of the 4 audiences it serves, and a decay estimate (post this week vs evergreen).
4. Append results to `data/story-ledger.md` under "Net-new idea capture" (one line each) and update any ledger row whose angle sharpened. Never delete or reorder existing rows.

## Pulse procedure (for one take)

Same sources, one question: who has said this in the last 14 days, how big, and what angle is UNSAID. Output schema: `{ take, verdict: fresh | crowded | stale, cited_examples: [links] | "no live signal found", unsaid_angle }`. A verdict with zero cited examples MUST say "no live signal found" - an uncited "crowded" verdict is a hallucination signal (design doc failure mode).

## Rules

- Never pitch an idea that contradicts the values filters (no K-12-AI-deployment advocacy content; the 18+ / critical-thinking OPINION pieces are in scope).
- A crowded verdict retires nothing automatically: a saturated take with Mitchell's lived-experience angle (newsroom, xGE, career-ops receipts) may still be the right call. Report, recommend, let the orchestrator decide.
- Cost note: a Grok pulse call is ~$0.02-0.05; batch ledger ideas into one call rather than one call per idea.
