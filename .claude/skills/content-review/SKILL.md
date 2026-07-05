---
name: content-review
description: Use as the pre-publish gate on any content artifact — a draft or adaptation is about to be staged for Mitchell, the user asks "is this ready", "review this post", "check the harness piece", or any drafts/ artifact is about to be marked review/scheduled without a recorded verdict.
---

# Content Review

The last gate before content reaches Mitchell for publishing. Verdict is binary and recorded: **READY** or **PARTIAL with a named gap list**. Never "looks good"; never a silent pass.

## Procedure

1. **Deterministic gates (never hand-rolled):** run `node scripts/voice-gates.mjs <file> --platform <platform>` on the artifact. This script is the single source of the em-dash / banned-word / banned-idiom / length gates, shared with the prompt-eval assert layer (design doc Q3). Any violation = PARTIAL, verbatim gate output in the gap list.
2. **Grounding check:** every factual claim is common knowledge, cited, or Mitchell's lived experience. Any `[NEEDS-CONFIRM]` markers = PARTIAL (they are for Mitchell, but the verdict must surface them, never bury). Any claim you cannot source = PARTIAL with the claim quoted.
3. **Voice check:** read against `memory/voice-rules.md`. Arc order intact (journalist, then comms strategist, then builder), one-aphorism budget, no borrowed cleverness, HuffPost-era register correct if referenced.
4. **Audience fit:** read the target audience profile in `knowledge/audiences.md`; confirm register and "what dies there" list is respected for the target platform's playbook.
5. **HN-proofing (dev-audience artifacts only):** would a skeptical senior engineer flag any claim? Numbers reproducible? Tradeoffs admitted unprompted? For pillar pieces this is the council-critique pass from `knowledge/llm-routing.md`; for smaller posts, one adversarial read.
6. **Record the verdict** in the draft dir's `NOTES.md`: date, artifact, READY/PARTIAL, gap list, gate output. Advancing a ledger row to `review` without a recorded verdict is a process defect.

## Verdict rules

- PARTIAL is a normal, useful verdict, not a failure; unnamed gaps are the failure mode this skill exists to prevent.
- READY means every check above ran and passed. A READY with a skipped check is a false READY; if a check cannot run (e.g. voice-gates errors), the verdict is PARTIAL with that named.
- This gate reviews FORWARD work only. Never run it against already-published or already-submitted material (house rule: no post-submission error-flagging).
