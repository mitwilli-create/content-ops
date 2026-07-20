---
name: kb-build
description: Construct or restructure an agent knowledge base: deciding what becomes a knowledge doc vs memory vs retrieval index, keeping every claim dated and sourced, and scaling from flat markdown to LlamaIndex retrieval only when the corpus demands it. Use whenever adding a new knowledge domain to the agent, when knowledge docs have grown stale or contradictory, when the agent keeps re-researching known facts, or the user says "add this to the knowledge base", "the agent doesn't know X", "organize what we know about Y".
---

# KB Build

The knowledge base is what keeps the agent from re-researching the world every session. Its enemy is staleness presented as fact.

## Flat markdown first

Stay with flat `knowledge/*.md` files until BOTH are true: the corpus exceeds ~50 docs AND the agent demonstrably fails to find things it has (grep misses, wrong-doc reads). Below that threshold, an index adds infrastructure without adding retrieval quality. Claude greps and reads markdown extremely well. When the threshold is crossed, build a [LlamaIndex](https://github.com/run-llama/llama_index) (~50.7k★) index over the corpus and expose it as a query tool; keep the markdown as source of truth and the index as a derived artifact (rebuildable, never hand-edited).

## Rules for every knowledge doc

1. **Date every claim that can decay.** Platform mechanics, algorithm behavior, pricing, model capabilities: each gets `(as of YYYY-MM)` inline. An undated claim about a moving target is a future bug. The doc header carries `last_verified: YYYY-MM-DD`.
2. **Separate observation from inference.** "LinkedIn reach dropped for external links (measured on 3 posts, 2026-06)" is worth ten "LinkedIn punishes links" assertions.
3. **One domain per file**, named for retrieval: `platforms/linkedin.md`, not `notes-3.md`. The filename is the index.
4. **Facts vs learned state**: stable domain knowledge → `knowledge/`; what WE learned from OUR runs (performance data, what worked) → `memory/` or `data/`. Mixing them means refreshes overwrite hard-won experience.
5. **Refresh path per doc**: every knowledge doc ends with a "How to refresh this" line naming the research tier (see CLAUDE.md T0-T3) and queries to re-run. A doc that can't say how to refresh itself becomes permanent stale weight.

## Anti-pattern

Do not paste research-report prose into the KB wholesale. Distill to claims + dates + sources; link the full report from `docs/`. The agent reads the KB on every relevant task. Every redundant sentence is a recurring token tax.
