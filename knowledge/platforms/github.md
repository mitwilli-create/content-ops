# GitHub Playbook

last_verified: 2026-01-31
notes: baseline from model knowledge at authoring (2026-07-05); mechanics here are slow-decay but unverified live

**Role in the system:** Proof-of-work surface. Not a "posting" platform: it's where dev-audience content gets verified. Every technical claim in essays should be one click from runnable evidence. Audience 1-2 + hiring managers.

## What works as content
- READMEs written as essays: the repo IS the blog post (architecture rationale, tradeoffs, cost data).
- Public build logs: CHANGELOG/journal files that narrate decisions (his career-ops Session Notes pattern, sanitized).
- Awesome-list / template repos: "harness-starter" or "memory-files-template" repos give audiences 2-3 something to clone, and clones = durable engagement.
- Gists for post-sized code: every X/Substack code snippet links to a gist (comment thread + stars = discovery).
- Good release notes on tagged releases; devs subscribe to releases.

## Repo ideas from the ledger
- #14 harness → `harness-101` template repo (companion to the essay)
- #10/#16 memory files → `ai-memory-starter` with example MEMORY.md structures
- #15 skills/MCPs/tools → glossary repo with runnable examples per term
- This content engine itself → sanitized `content-ops-template` (meta build-in-public)

## Mechanics
- Profile README = landing page: current focus, best repos, where to find the writing.
- Pin the 6 repos that tell the journalist→builder story.
- Star/watch genuine dependencies; the social graph is small and visible.
- Issues/discussions on his repos are audience touchpoints: answer fast, tag good first issues.

## Cadence
- Push publicly visible work 3-5 days/week (the green graph is read as a heartbeat by hiring managers and devs alike).
- Companion repo ships SAME DAY as any technical essay (HN/X will look for it within minutes).

How to refresh this: T1. Queries: "GitHub profile README features <year>", "GitHub discussions/releases changes changelog". GitHub mechanics decay slowest of the 9 platforms; refresh quarterly or when a companion repo underperforms expectations.
