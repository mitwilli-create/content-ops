#!/bin/bash
# run-council-content.sh - thin wrapper over career-ops' council runner for content-ops work.
# Usage: bash scripts/run-council-content.sh <prompt-file> <out-json> <models-csv|full7>
# The models argument is REQUIRED (Qodo PR #3 finding 3): an omitted/empty models list must
# never silently fall back. Pass the literal keyword "full7" to explicitly request the full
# 7-model lineup. NEVER call run-council.mjs with an empty --models (silently degrades to Sonnet-only).

set -u
PROMPT="${1:?usage: run-council-content.sh <prompt-file> <out-json> <models-csv|full7>}"
OUT="${2:?missing out path}"
MODELS="${3:?models list required (csv of provider:model, or the keyword full7); refusing to run with an implicit default}"

if [[ "$MODELS" == "full7" ]]; then
  MODELS="perplexity:sonar-deep-research,perplexity:sonar-reasoning-pro,xai:grok-4,xai:grok-4-x-search,openai:gpt-5,google:gemini-2.5-pro,anthropic:claude-opus-4-7"
fi

exec node "$HOME/Documents/career-ops/scripts/run-council.mjs" \
  --prompt "$PROMPT" --out "$OUT" --models "$MODELS"
