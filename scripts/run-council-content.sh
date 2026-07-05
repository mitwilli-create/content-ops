#!/bin/bash
# run-council-content.sh — thin wrapper over career-ops' council runner for content-ops work.
# Usage: bash scripts/run-council-content.sh <prompt-file> <out-json> [models-csv]
# Default lineup = the full 7. NEVER call run-council.mjs with an empty --models (silently degrades to Sonnet-only).

set -u
PROMPT="${1:?usage: run-council-content.sh <prompt-file> <out-json> [models-csv]}"
OUT="${2:?missing out path}"
MODELS="${3:-perplexity:sonar-deep-research,perplexity:sonar-reasoning-pro,xai:grok-4,xai:grok-4-x-search,openai:gpt-5,google:gemini-2.5-pro,anthropic:claude-opus-4-7}"

exec node "$HOME/Documents/career-ops/scripts/run-council.mjs" \
  --prompt "$PROMPT" --out "$OUT" --models "$MODELS"
