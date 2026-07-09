---
name: content-review
description: Use as the pre-publish gate on any content artifact - a draft or adaptation is about to be staged for Mitchell, the user asks "is this ready", "review this post", "check the harness piece", or any drafts/ artifact is about to be marked review/scheduled without a recorded verdict.
---

# Content Review

The last gate before content reaches Mitchell for publishing. Verdict is binary and recorded: **READY** or **PARTIAL with a named gap list**. Never "looks good"; never a silent pass.

## Procedure

1. **Deterministic gates (never hand-rolled):** run `node scripts/voice-gates.mjs <file> --platform <platform>` on the artifact. This script is the single source of the em-dash / banned-word / banned-idiom / length gates, shared with the prompt-eval assert layer (design doc Q3). Any violation = PARTIAL, verbatim gate output in the gap list.
2. **Grounding check:** every factual claim is common knowledge, cited, or Mitchell's lived experience. Any `[NEEDS-CONFIRM]` markers = PARTIAL (they are for Mitchell, but the verdict must surface them, never bury). Any claim you cannot source = PARTIAL with the claim quoted.
3. **Source-fidelity check (person-claims):** every claim that characterizes what a NAMED person said or did (direct quotes AND paraphrases) is verified against the PRIMARY source, not against a distilled SAFE-TO-CITE / adjudicated summary. Summaries drop the source's actual words, so a plausible paraphrase can invert what the person meant and still pass a cite-list check. For each person-claim:
   - **Find the primary source on file.** It must live in the draft's `research/` dir: the transcript/recording/article itself, or a `research/sources.md` pointer giving the URL, retrieval date, and the relevant verbatim passage. No primary source on file for a person-claim = **PARTIAL**, claim quoted; the fix is to put the source on file, not to wave the claim through on the summary alone.
   - **Read the drafted line against that primary passage.** If the primary does not support it, or the framing goes further than or against what the person actually said, that is **PARTIAL**: quote both the drafted line and the conflicting primary passage. An adjudication note like "treat as paraphrase until timestamped" means the primary is unverified, which is itself PARTIAL until timestamped.
   - Regression fixture (`drafts/krieger-what-the-room-missed/`): the pillar shipped "barely used Claude for the work that mattered most," which inverts his talk ("I was using the models as much as possible... spending all my weekends trying to build with it"); the real constraint was his role (CPO), not his usage. It passed the old gate because grounding was checked against the adjudicated list, not the transcript, and the research dir held no primary transcript at all. This step exists to catch exactly that, on both legs: unsupported paraphrase AND no primary on file.
4. **Voice check:** read against `memory/voice-rules.md`. Arc order intact (journalist, then comms strategist, then builder), one-aphorism budget, no borrowed cleverness, HuffPost-era register correct if referenced.
5. **Audience fit:** read the target audience profile in `knowledge/audiences.md`; confirm register and "what dies there" list is respected for the target platform's playbook.
6. **HN-proofing (dev-audience artifacts only):** would a skeptical senior engineer flag any claim? Numbers reproducible? Tradeoffs admitted unprompted? For pillar pieces this is the council-critique pass from `knowledge/llm-routing.md`; for smaller posts, one adversarial read.
7. **Record the verdict** in the draft dir's `NOTES.md`: date, artifact, READY/PARTIAL, gap list, gate output. Advancing a ledger row to `review` without a recorded verdict is a process defect.

## Verdict rules

- PARTIAL is a normal, useful verdict, not a failure; unnamed gaps are the failure mode this skill exists to prevent.
- A person-claim with no primary source on file, or a paraphrase the primary source does not support, is a PARTIAL by the same standard as any unsourceable claim. Source-fidelity is never satisfied by the SAFE-TO-CITE / adjudicated list: those are summaries, and this check exists precisely because a summary cannot catch a paraphrase that has drifted from the source.
- READY means every check above ran and passed. A READY with a skipped check is a false READY; if a check cannot run (e.g. voice-gates errors), the verdict is PARTIAL with that named.
- This gate reviews FORWARD work only. Never run it against already-published or already-submitted material (house rule: no post-submission error-flagging).
