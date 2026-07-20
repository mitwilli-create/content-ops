---
name: prompt-eval
description: Batch-evaluate prompt variants and agent outputs across models with promptfoo (and deepeval for golden-set regression). Use whenever tuning a drafting prompt, comparing hook variants, deciding between models for a content task, validating that a prompt change did not regress quality, or any time the user asks "which prompt/model is better", "A/B this", "eval this prompt", or ships a prompt change without evidence. Prompts tuned by vibes regress silently. This skill is the measurement layer.
---

# Prompt Eval

Wraps [promptfoo](https://github.com/promptfoo/promptfoo) (★22.9k, verified 2026-07-05) for prompt-variant comparison and [deepeval](https://github.com/confident-ai/deepeval) (★16.6k) for golden-set regression. Use promptfoo by default; reach for deepeval only when you need LLM-graded metrics (faithfulness, relevance) over a fixed golden set.

## Workflow

1. **Define the comparison:** what varies (prompt wording, model, temperature) and what "better" means for THIS task. For content work, "better" is usually: hook strength, voice fidelity, platform-format compliance, factual grounding. Write the rubric down before running anything; post-hoc rubrics rationalize.
2. **Scaffold:** `npx promptfoo@latest init` in a scratch dir, then write `promptfooconfig.yaml`:
   - `prompts:` the variants (file refs, not inline, so they are diffable)
   - `providers:` the models under test. Keys come from this repo's `.env` if present, else `~/Documents/career-ops/.env` (the shared key store until content-ops carries its own). Use `anthropic:messages:claude-sonnet-5`, `openai:gpt-5`, `google:gemini-2.5-pro` style IDs. Verify current IDs against the provider docs, they drift.
   - `tests:` cases with `vars` (the story idea / platform / audience) and `assert` blocks. Prefer deterministic asserts (`contains`, `not-contains`, regex for banned phrases, `javascript` for length windows) over `llm-rubric`; add ONE `llm-rubric` assert per dimension that genuinely needs judgment.
3. **Run:** `npx promptfoo@latest eval` then `npx promptfoo@latest view` (or `--output results.json` headless).
4. **Read it honestly:** report the losing variant's wins too; a 55/45 split is noise, not a verdict. Record the verdict + config path in the calling task's notes so the eval is reproducible.

## Content-ops standard asserts

Every content-prompt eval includes these deterministic asserts (they encode the house voice gates):
- `not-contains: "\u2014"` (rejects the em dash character)
- no standalone banned word "kill" (regex `\bkill`)
- platform length window (JS assert reading `knowledge/platforms/<platform>.md` limits)

## Cost control

Start with ≤10 test cases × ≤3 providers. A full grid across 7 models on 50 cases costs real money and rarely changes the decision. Scale up only when two variants are genuinely tied.
