# Web-search + clock check before actioning an instance-starting input

last-verified: 2026-07-18

**Rule (two parts):**

1. **At instance start.** Before the first substantive action on any input that begins an instance (new session, resumed handoff, first task of a fresh context): (a) run a **web search** to confirm the most up-to-date facts on the topic/task (platform behavior, model/API availability, product names, prices, all of which decay in weeks); (b) establish the **current Pacific time and date** from the real OS clock: run `date`, cross-check against a freshly-`touch`ed file's mtime, because the sandbox `date` can be frozen/stale. July = PDT (UTC-7); winter = PST (UTC-8). Mitchell says "PST" generically, so honor the actual seasonal offset.

2. **After any >3h output gap.** If more than 3 hours elapsed between the last output and the next, **re-check the current time and date** before continuing. A session can span days; treat any prior "do this today / by 3pm" framing as stale until re-confirmed against a fresh clock.

**Why:** This session (2026-07-16 → 2026-07-18) literally spanned two days. An early reading showed 2026-07-16 14:55, later readings 2026-07-18 12:07, and a timing claim ("~2:49pm, past your 2-3pm DM window") was made on the stale opening day. Separately, a Google-tools API reconciliation FLIPPED on a web search: Veo, nano-banana-2 (`gemini-3.1-flash-image`), and Antigravity ARE reachable via `GEMINI_API_KEY`; only NotebookLM is enterprise/manual-only, the opposite of the pre-search assumption.

**How to apply:** Web-search the volatile facts and confirm the Pacific clock BEFORE promising any dated action or asserting API/model/price facts, and re-verify the clock on resume after any gap ≥3h. Extends `freshness-discipline.md` (platform mechanics) and the global freshness protocol.

**Note:** the canonical `.claude/projects/.../memory/` auto-memory store is sandbox-blocked from writes in headless/non-interactive sessions, so this rule was persisted to the git-tracked repo store instead. To mirror it into the auto-memory, add it from an interactive `claude` session.
