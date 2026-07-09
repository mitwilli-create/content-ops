---
name: draft-post
description: Use when turning a story-ledger idea into publishable content - the user says "draft #N", "write the harness piece", "turn this idea into a post", names a ledger row, or a story's status should advance from idea/researching to drafting. Also use when a draft exists but needs its platform adaptations built.
---

# Draft Post

Ledger idea in, staged draft pack out: `drafts/<slug>/master.md` plus per-platform adaptations. The master is the canonical argument; adaptations are derivatives, never separately-invented takes.

## Procedure

1. **Read the row** in `data/story-ledger.md`: audience, primary platforms, angle note. Read `knowledge/audiences.md` for the target audience's register and the relevant `knowledge/platforms/*.md`.
2. **Research tier gate** (CLAUDE.md table): personal-experience narrative = T0, go. Dev-audience factual claims = T3 first (`/deep-research` or career-ops researcher); do not draft claims the research hasn't returned. Topical hook = run `/story-scout` pulse mode first.
3. **Draft the master** with the core prompt at `prompt-core.md` in this skill dir (keep it there - it is the unit under eval in prompt-eval golden suites). Supply `{{length_hint}}` from the target platform's playbook format section (the deterministic windows live in `scripts/voice-gates.mjs::LENGTH_WINDOWS`). Fable 5 drafts; no delegation of the master draft.
4. **Council critique for pillar pieces** (Substack/HN-bound): fan out per `knowledge/llm-routing.md` § council-critique pattern (GPT-5 skeptic lens, Grok saturation lens, Gemini newly-enabled-reader lens), then synthesize. Skip for daily-register X/LinkedIn posts.
5. **Adaptations**: for each primary platform, dispatch a `platform-adapter` subagent with the master + ONE platform + ONE explicit output path `drafts/<slug>/<platform>.md` (single-writer rule; parallel agents never share a file).
6. **Voice pass**: run the global `make-it-sound-like-mitchell` skill over master + adaptations.
7. **Engagement pass**: run `/engagement-optimize` for the primary platforms. It writes the `## Engagement plan (pre-publish)` section into `NOTES.md` (timing via `/timing-check`, saturation via `/story-scout` pulse, mechanics from the playbooks). This replaces hand-rolling post windows into NOTES.md - do not derive timing or tags here.
8. **Gate + stage**: run `/content-review` on every artifact. On READY, set the ledger row status to `review` in the same run (skipping this re-drafts the idea later - story-14 design failure mode) and tell Mitchell what is staged and where. NEVER post anything (publishing gate).

## Deliverable shape (every run)

`drafts/<slug>/` containing `master.md`, one `<platform>.md` per primary platform each with 2-3 hook variants at top, and a `NOTES.md` whose `## Engagement plan (pre-publish)` section (written by `/engagement-optimize` in step 7) carries the per-platform post windows, tags/flairs, link placement, format choice, and first-hour plan, plus cross-post sequencing and any claims awaiting Mitchell's fact-confirmation.

## Rules

- Grounding discipline: no fabricated metrics, experiences, or credentials. If the master needs a fact you cannot cite, mark `[NEEDS-CONFIRM]` and surface it in NOTES.md rather than inventing.
- The em-dash/banned-word gates are enforced by `scripts/voice-gates.mjs` via `/content-review`; do not hand-roll checks here.
