---
name: platform-playbook-refresh
description: Refresh the per-platform playbooks in knowledge/platforms/ (Substack, LinkedIn, X, Hacker News, Reddit, GitHub, Discord, TikTok, YouTube) with current, evidence-dated intelligence on format norms, algorithm behavior, posting windows, and engagement mechanics. Use before any posting-strategy recommendation when the relevant playbook's last_verified date is older than 30 days, when engagement unexpectedly drops on a platform, when a platform ships a feature/algorithm change, or when the user asks "is this timing still right", "what works on <platform> now", "update the playbooks". Platform mechanics decay in weeks — council research (2026-07-05) found no credible community skill for this; freshness discipline is the whole game.
---

# Platform Playbook Refresh

The playbooks in `knowledge/platforms/` are the content agent's core KB. Every claim in them decays: algorithms change quarterly, feature sets monthly, cultural norms continuously. A playbook that reads confidently but was written three months ago is worse than no playbook — it produces confidently mistimed posts.

## Refresh workflow (per platform)

1. **Read the current playbook** and extract its dated claims into a checklist: format limits, algorithm notes, timing windows, engagement tactics.
2. **Research per the CLAUDE.md tier table:**
   - T1 (WebSearch, 1-3 queries): official changelog/creator-blog checks, "what changed on <platform> algorithm <current quarter>", format/length limit confirmations.
   - T2 (live pulse): `xai:grok-4-x-search` via `scripts/run-council-content.sh` for what's working RIGHT NOW on X; fetch HN front page / relevant subreddit tops directly for those platforms.
   - Do not use T3 deep research here — playbook refresh is breadth + recency, not depth.
3. **Update the playbook**: every changed claim gets `(as of YYYY-MM)` + source; every SURVIVING claim's date gets re-confirmed or the claim gets flagged `[unverified since YYYY-MM]` rather than silently kept. Update the header `last_verified:`.
4. **Separate mechanics from experience**: platform mechanics go in the playbook; what MITCHELL's posts actually did goes in `data/performance-log.md`. Never overwrite performance observations during a refresh.
5. **Cross-platform pass**: timing claims interact (a piece cascades Substack → X → LinkedIn); when one platform's windows move, check the cascade notes in the other playbooks that reference it.

## Honesty rules

- Engagement-mechanics claims from marketing blogs are hypotheses, not facts — label the source quality ("platform official", "creator-reported", "SEO-blog folklore").
- If research contradicts a tactic Mitchell has personally validated in `data/performance-log.md`, surface the conflict; his measured data outranks generic advice.
- A refresh that changes nothing is a valid result — record the re-verification date and stop. Do not invent updates to justify the run.

## Cadence

30-day staleness gate before any timing recommendation (hard rule). Full 9-platform sweep monthly or after any major platform news; single-platform spot refresh before a high-stakes post on that platform.
