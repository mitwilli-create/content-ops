# LLM Routing — expanded rationale

last_verified: 2026-01 (baseline from model knowledge at authoring, 2026-07-05; model IDs + pricing drift, verify before relying)

Invocation: `node ~/Documents/career-ops/scripts/run-council.mjs` with explicit `--models` (empty flag silently falls back to Sonnet-only — always pass the list). API keys live in career-ops `.env`. Typical full-council run: ~$0.20-0.45.

## Per-job routing

| Job | Primary | Fallback | Notes |
|---|---|---|---|
| Drafting, voice, orchestration | Fable 5 (session) | Opus 4.7 | Never delegate final voice pass |
| X pulse / trend saturation | xai:grok-4-x-search | perplexity:sonar-reasoning-pro | Grok is the ONLY live-X source; use before timing any X post |
| Deep cited research (pillar essays) | perplexity:sonar-deep-research | gemini + websearch | 20-40 min async; kick off early |
| Whole-transcript / video-script ingest | google:gemini-3.1-pro | — | 1M+ context; feed raw footage transcripts |
| Contrarian redraft / headline A-B | openai:gpt-5 | xai:grok-4.3 | Different prior = genuine alternative, not paraphrase |
| Bulk tagging / thread summarization | claude-haiku-4-5 | gemini-flash | Pennies |
| Pre-publish adversarial review | council fan-out (3-7 models) | Opus solo | Each model gets ONE audience lens |

## The council-critique pattern (high-stakes pieces)

1. Fable 5 writes master draft (T0).
2. Fan out in parallel, one lens each:
   - GPT-5: "You are a skeptical HN commenter. Find every claim you'd flag."
   - Grok: "Is this take already saturated on X? Who said it first and better?"
   - Gemini: "You are the newly-AI-enabled reader. Mark every sentence that loses you."
3. Fable 5 synthesizes: accept/reject each finding with rationale, revise.
4. `/content-review` gate, then Mitchell.

Cost: ~$0.30-0.60 per pillar piece. Worth it for Substack/HN; skip for daily X posts.

## What NEVER gets delegated
- Final voice pass (Fable 5 + make-it-sound-like-mitchell skill only)
- Publishing decisions (Mitchell only)
- Claims about Mitchell's own experience (his words, verified against his corpus)

How to refresh this: T1. Queries: "<vendor> model lineup <current quarter>", "<model> API pricing"; cross-check IDs against career-ops lib/council.mjs PROVIDERS (the runtime source of truth). Refresh whenever a council call errors on a model ID or a vendor ships a new flagship.
