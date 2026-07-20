---
name: regression-wire
description: Wire regression detection and observability into an agent system: Langfuse tracing on LLM calls, promptfoo assertion suites as CI gates, and drift baselines for outputs that must stay stable (voice gates, format compliance, KB freshness). Use when an agent capability ships and needs to STAY working, when output quality degraded and nobody noticed for days, after any incident caused by silent drift, or when the user asks "how do we know this still works", "add monitoring", "did the prompt change break anything".
---

# Regression Wire

Agents degrade silently: a model version shifts, a prompt edit ripples, a KB doc goes stale, and output quality erodes with no stack trace. Detection must be structural, not vigilance-based.

## The three layers (wire in this order)

1. **Traces: know what actually ran.** [Langfuse](https://github.com/langfuse/langfuse) (★30.5k, verified 2026-07-05): wrap LLM calls so every generation records prompt, model, tokens, cost, latency. Self-host via their docker compose, or cloud free tier. If full tracing is overkill for the job, the floor is an append-only JSONL ledger per run (timestamp, model, cost, input hash, output path). Career-ops runs entirely on this pattern, and it is enough to answer "what changed".
2. **Assertion suite: know it still behaves.** A promptfoo config (see the prompt-eval skill) over a FIXED golden set of inputs, run on every prompt/model change and on a schedule. For content-ops the non-negotiable asserts: zero em dashes, zero banned words, platform length windows, voice-gate pass. Deterministic asserts catch 90% of drift for ~$0.
3. **Baselines: know when the environment moved.** For metrics that should be stable (pass rate, avg cost per draft, KB freshness dates), write dated baseline JSONs; a scheduled job compares current vs baseline and surfaces deltas over threshold. Re-seed baselines ONLY on intentional change, with a provenance note (commit + reason). A stale baseline that no longer matches intentional reality poisons every future comparison, and an auto-reseeded one detects nothing.

## Rules

- Every detector needs a bypass switch env var + AGENTS.md row.
- Alert = a written artifact (report file / ledger row) a human will actually see, not a log line. Terminal-only alerts on scheduled jobs alert nobody.
- When a check fires, the report must include the failing input + the diff vs baseline: "check failed" without reproduction material just schedules a debugging session.
- Budget-cap any detector that calls LLMs; a runaway checker is itself a regression.
