---
name: engagement-optimize
description: Use BEFORE publishing to shape a staged post for maximum genuine engagement on a specific platform - the user says "optimize this for LinkedIn", "how should I post this", "what's the best hook/tags/format for X", "pre-publish engagement pass", or a draft is staged and needs per-platform engagement guidance (timing, tags/flairs, hook shaping, link placement, format choice, first-hour plan). The forward twin of the engagement-analyst subagent (which is retrospective). Reads live mechanics from the playbooks and calls /timing-check + /story-scout pulse; never hardcodes platform facts, never posts.
---

# Engagement Optimize

Forward-looking, pre-publish engagement optimization for ONE staged draft across its target platforms. Produces per-platform guidance: when to post, tags/flairs, hook and story shaping to each platform's engagement mechanics, link placement, format choice, and a first-hour engagement plan. Guidance for Mitchell's hand only: this skill advises, it never posts (publishing gate).

**This skill owns SYNTHESIS, not facts.** Every platform mechanic (timing windows, tags, flairs, link-placement rules, format norms) is read live from `knowledge/platforms/<platform>.md` at run time. It hardcodes NONE of them. Platform mechanics decay in weeks; the playbooks are the single source of truth and `/platform-playbook-refresh` is their single writer. If you ever find yourself typing a specific window, tag, flair, or "put the link in X" rule into a recommendation, STOP: read it from the playbook instead. (Example of why: LinkedIn's link-in-first-comment workaround is now penalized as "bridge behavior" - a rule that changed in weeks and is captured in the playbook, not here.)

Boundary with siblings (do not re-implement):
- **WHEN to post** is `/timing-check`'s job. Call it; quote its verified window. Do not derive timing here.
- **Live conversation / saturation** for the take is `/story-scout` pulse mode. Call it; let the verdict shape the hook. Do not re-scan here.
- **Per-platform baselines** live in the playbooks. Read them; never copy them into this skill.
- **Retrospective "what worked"** is the `engagement-analyst` subagent. That is the twin that runs AFTER results land and feeds the playbooks. This skill runs BEFORE.

## Procedure

1. **Locate the draft + targets.** Read the staged `drafts/<slug>/` (master + any per-platform adaptations). Targets default to the story-ledger row's primary platforms; honor an explicit platform list from the caller. This skill optimizes an existing draft; it does not write the draft (that is `/draft-post`).

2. **Freshness gate, per platform.** Read `knowledge/platforms/<platform>.md`. If `last_verified` (or the dated BASELINE line) is older than 30 days: STOP for that platform and instruct running `/platform-playbook-refresh <platform>` first. Engagement guidance built on a stale playbook validates against fiction. This mirrors `/timing-check`'s gate.

3. **When.** Run `/timing-check` for each target platform. Use its verified window, evidence, and verification date verbatim in the output. Do not invent or re-derive a window.

4. **Live shaping signal.** Run `/story-scout` pulse mode on the take (one call, reused across platforms). The verdict shapes hook framing: `crowded`/`stale` argues for the `unsaid_angle` or a wait; `fresh` clears the standard hook. A news-cycle window from pulse can override clock-time windows (defer to `/timing-check`'s handling of that overlap).

5. **Per-platform synthesis.** For each target, using ONLY the fresh playbook's format/mechanics/tags sections plus the timing and pulse outputs, produce:
   - **Hook shaping** - rewrite guidance for the opening so it works within the platform's truncation and rewards its ranking signals (read the playbook's format + algorithm sections for what those are). Offer 2-3 hook variants when the draft's existing hook is weak for the platform.
   - **Tags / flair** - which tags, subreddit flair, or none, read from the playbook. Never guess a flair or tag from memory; if the playbook does not specify, say so and route to `/platform-playbook-refresh`.
   - **Link placement** - read the playbook's current native-vs-link guidance and apply it. Do not hardcode a placement rule.
   - **Format choice** - text vs document/carousel vs native video vs Show/Ask framing vs thread, per the playbook's "format that works" section against this specific draft.
   - **First-hour engagement plan** - the platform's first-hour mechanics (reply cadence, warming, sequencing) from the playbook, tied to Mitchell's availability (the same availability `/timing-check` surfaces). The best window he cannot attend loses to a decent one he can.

6. **Write the plan.** Append a `## Engagement plan (pre-publish)` section to `drafts/<slug>/NOTES.md` (single writer into this section; extends the NOTES.md convention `/draft-post` established). One sub-block per platform. Every line is source-tagged: `(playbook: linkedin.md L16)`, `(timing-check verified 2026-07-09)`, `(pulse: fresh)`. A recommendation with no source tag is a guess wearing a timestamp - do not emit it. Also surface the plan to the caller.

7. **Hand off, do not gate or post.** Proposed hooks are draft artifacts: they still pass through `/content-review` + `scripts/voice-gates.mjs` before staging (this skill does not run those gates itself). Recommend the next step (usually `/content-review` then Mitchell's manual send). NEVER post, schedule autonomously, or mark anything published.

## Sequencing with the rest of the engine

`/draft-post` (generate) -> **`/engagement-optimize` (shape for reach, this skill)** -> `/content-review` (voice + grounding + HN-proofing gate) -> Mitchell's manual send -> `engagement-analyst` subagent (measure) -> `/platform-playbook-refresh` (fold learnings into playbooks) -> next `/engagement-optimize` reads fresher playbooks. Closed loop, single writer at every hop.

## Rules

- Zero hardcoded platform mechanics. Every window, tag, flair, link rule, and format norm is read from the playbook at run time. This is the load-bearing rule; a hardcoded constant is a defect.
- Never recommend autonomous posting or scheduling. Output is guidance for Mitchell's hand (publishing gate).
- Read-only against `knowledge/` and `data/`. The only file this skill writes is the target draft's `NOTES.md` engagement-plan section.
- No fabricated metrics or benchmarks. Cite the playbook line or the live check; if a needed mechanic is missing from the playbook, say so and route to `/platform-playbook-refresh` rather than inventing it.
- No em dashes, no banned terms in any proposed hook or copy (enforced downstream by `/content-review`, but do not introduce violations here).
