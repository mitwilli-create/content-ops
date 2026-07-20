---
name: routing-experiment-runner
description: Run a reproducible 3-tier model-routing experiment (frontier direct / cheap cloud via OpenRouter / local Ollama) graded against a real git commit as ground truth. Use when deciding which model tier a real task class should route to, when producing field-report data for a routing/cost story, when validating a cheap or local model before wiring it into CCR, or when the user says "run the routing experiment", "test the tiers on this task", "which tier can handle X", "grade the cheap model against what we shipped". Encodes the proven pattern from drafts/china-llm-routing/experiment/ (2026-07-16): pick a shipped commit, replay the same prompt per tier, apply to a scratch copy, grade file-by-file, log cost/wall-clock/failure-mode. Preflight-gates the local tier on RAM so a 30B model does not thrash swap for an hour and produce nothing.
---

# Routing Experiment Runner

Model-routing decisions ("route the menial tier to a cheap open model, reserve frontier for judgment") are only as good as the evidence under them. This skill turns that claim into a reproducible experiment: take work a frontier model already shipped, replay the identical task through each candidate tier, and grade every tier against the shipped commit. The output is a results table you can route by and a field report you can publish from.

Proven end to end 2026-07-16. Reference implementation and subagent spec: `drafts/china-llm-routing/experiment/` (`tasks.md`, `log.md`, `outputs/<task>-<tier>/`).

## The tiers

| Tier | What | Example (locked 2026-07-16) |
|---|---|---|
| 1 (frontier) | the model that shipped the ground-truth commit; the baseline both others are graded against, not re-run | Fable 5, Anthropic direct |
| 2 (cheap cloud) | an open-weight model via OpenRouter, provider PINNED | qwen3-coder-30b-a3b-instruct, `allow_fallbacks:false` |
| 3 (local) | the same model class on this machine, free but RAM-bound | qwen3-coder:30b-a3b-q4_K_M via Ollama |

Web-verify every model slug and price at run time (they drift in weeks); record the verification date in `log.md`. Pin the cloud provider with `allow_fallbacks:false` so a silent provider swap cannot change the quant under you mid-run.

## Procedure

### 1. Pick ground truth and extract it read-only

- Choose a REAL, already-merged commit that represents the task class you want to route. Prefer a commit with a clear diff and an unambiguous "correct" answer.
- Extract the before / reference / after state with `git show` only. Never mutate the real repo:
  - `git show <gt>^:<file>` = the BEFORE state each tier starts from.
  - `git show <gt>:<file>` = the AFTER state (ground truth to grade against).
  - the diff `git show <gt>` = the exact change expected.
- Each tier runs on a fresh branch off `<gt>^` (or on a scratch copy of the before-state files), so its diff is directly comparable to `git show <gt>`.

### 2. Design tasks that separate mechanics from judgment

Write each task prompt ONCE, verbatim, in `tasks.md`. The same bytes go to every tier; only the model / provider / location changes. Include at least:
- one **pure-mechanical** task (e.g. insert the same markup across N files): the "route it and forget it" case.
- one **judgment / exception** task with deliberate traps (a rule to apply everywhere EXCEPT two files where it would break something). The held-in-tension exceptions are the sharpest test of whether a cheap model reads the constraints or pattern-matches past them.

For each task record, up front, the "what breaks, to watch for" list: the specific failure modes to grade against. Predicting them before the run is what makes the grading honest.

### 3. Run each tier, apply to a scratch copy, grade file-by-file

For every (task, tier):
1. Feed the verbatim prompt to that tier's model.
2. Apply the returned output to a scratch copy of the before-state files (never the live repo).
3. Grade each output file against ground truth:
   - **pass** = byte-exact / semantically-exact match to the ground-truth file.
   - **partial** = right change, wrong position / formatting / a dropped conditional clause.
   - **fail** = missed file, or an exception inverted (applied the change where the task said do not).
   - count files: "13/13 exact", "1 pass / 5 partial / 1 fail".
4. Log cost, wall-clock, files-correct, and the failure mode in plain language to the results table in `log.md`. The failure-mode sentence is the reusable asset: it is the field-report material and the routing rationale.

### 4. Write every artifact to disk INCREMENTALLY

This is a hard discipline, not a nicety. Write each artifact the moment it exists to `outputs/<task>-<tier>/`:

```
outputs/<task>-<tier>/
  prompt.md            # the verbatim prompt sent
  response_raw.json    # full API/runner response (usage, cost, finish_reason)
  response_content.md  # the model's text output
  applied/             # the scratch files after applying the output
  grading.md           # per-file verdict + method + friction notes
  meta.json            # tier, model, provider_requested/used, wall_clock_s, usage, cost_usd, http_status, finish_reason
```

Because the reference run survived a mid-session CCR process restart with zero lost work: everything was already on disk, so resume-from-transcript recovered it. A run that holds results in memory until the end loses the whole run on any restart. If a subagent drives the run, its prompt must say "write each artifact to disk immediately."

Guard against a duplicate runner: a restart can leave a second process writing the SAME `outputs/<task>-<tier>/` dir. Before launching a tier, check the output dir is not already being written; stop cleanly rather than let two runners race.

## Local-tier RAM preflight (HARD GATE, do this before launching tier 3)

The 2026-07-16 run aborted the local tier at ~60 minutes elapsed with ZERO output: an ~18GB q4 model plus the OS on a 24GB M2 MacBook Air drove swap to 11.8GB of 13.3GB used, the Ollama runner's CPU collapsed from ~305% (computing) to ~11% (waiting on page I/O), and it never finished. "Run it locally for free" is a mirage when the model does not fit resident in RAM: the free model costs an hour and delivers nothing.

Preflight before every local tier, and REFUSE (or warn hard) when it will not fit:

1. **Model resident size** = from `ollama list` (the model's on-disk size ≈ its resident footprint; a q4 30B is ~18-19GB).
2. **Physical RAM** = `sysctl -n hw.memsize` (bytes; divide by 1024^3 for GB).
3. **Currently available** = `memory_pressure` (look at "System-wide memory free percentage") or `vm_stat` (free + inactive pages × page size).
4. **Gate:**
   - if `model_size_GB > physical_RAM_GB - HEADROOM` (HEADROOM default ~6-8GB for OS + apps) → **REFUSE**. The model cannot fit resident; it will thrash swap. Route the "local" tier to cheap cloud instead, or pick a smaller / more-quantized model that fits, and say so.
   - else if `model_size_GB > available_free_GB` → **WARN HARD**: it may fit only after closing other apps. Tell the user to free RAM first, or proceed at their own risk.
   - else → clear to run.
5. **No-stream caveat:** if the runner does not stream (the reference `call_ollama.py` only returned on HTTP completion), you get no partial output and no progress signal. Set an explicit wall-clock abort (e.g. 15-20 min) and treat a swap-thrash signature (CPU dropping while pageins climb) as an immediate stop, not a "wait longer".

A refused or aborted local tier is itself a finding, not a gap: on constrained consumer hardware the realistic menial tier is cheap CLOUD (cents, seconds), not a local 30B. Record that in `log.md` and move on.

## Cost / spend privacy

Cost figures in `log.md` and `meta.json` are PRIVATE grounding. Per the no-absolute-spend rule (`memory/`, `NOTES.md`), never put absolute dollar amounts in any published artifact: public copy uses relative comparisons and percentages only, computed from the real figures kept in the draft's `NOTES.md`. See the `no-absolute-spend-disclosure` memory.

## Definition of done

- `tasks.md` with verbatim per-tier prompts + a "what breaks" watchlist per task.
- `outputs/<task>-<tier>/` populated incrementally for every tier that ran, with `meta.json` + `grading.md`.
- `log.md` results table: per (task, tier) cost, wall-clock, files-correct, failure mode; tier/provider key with the price-verification date; any refused/aborted tier logged with its reason.
- A one-line routing verdict per task class ("route mechanical X to cheap cloud; keep judgment Y on frontier").
- Absolute costs stay in `NOTES.md`; nothing with a dollar figure leaves the draft dir.
