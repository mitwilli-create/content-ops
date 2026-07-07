# GitHub Playbook

last_verified: 2026-07-06
notes: refreshed 2026-07-06 via T1 web sweep; zero claims contradicted (slowest-decay platform as predicted); gists/clones/releases/pin-limit claims carry [unverified since 2026-01] flags pending a month-by-month changelog pass
length_window: null

**Role in the system:** Proof-of-work surface. Not a "posting" platform: it's where dev-audience content gets verified. Every technical claim in essays should be one click from runnable evidence. Audience 1-2 + hiring managers.

## What works as content
- READMEs written as essays: the repo IS the blog post (architecture rationale, tradeoffs, cost data). Reconfirmed 2026-06 (creator-reported; GitHub's own 2026 profile-refresh push uses the same framing, platform official).
- Public build logs: CHANGELOG/journal files that narrate decisions (his career-ops Session Notes pattern, sanitized).
- Awesome-list / template repos: "harness-starter" or "memory-files-template" repos give audiences 2-3 something to clone. Note: clone counts are owner-visible traffic insights only (14-day window), never public social proof — clones measure usefulness, not visible engagement.
- Gists for post-sized code: every X/Substack code snippet links to a gist [unverified since 2026-01 whether gists remain a live discovery surface vs. legacy].
- Good release notes on tagged releases; devs subscribe to releases [unverified since 2026-01, long-stable feature].

## Repo ideas from the ledger
- #14 harness → `harness-101` template repo (companion to the essay)
- #10/#16 memory files → `ai-memory-starter` with example MEMORY.md structures
- #15 skills/MCPs/tools → glossary repo with runnable examples per term
- This content engine itself → sanitized `content-ops-template` (meta build-in-public)

## Mechanics
- Profile README = landing page: current focus, best repos, where to find the writing (reconfirmed 2026-06, platform official).
- Pin the repos that tell the journalist→builder story [6-item pin limit unverified since 2026-01].
- Star/watch genuine dependencies; the social graph is small and visible [unverified since 2026-01].
- Issues/discussions on his repos are audience touchpoints: answer fast, tag good first issues. NEW (2026-06, platform official): Discussions are now first-class in the gh CLI (`gh discussion list/view/create`, CLI v2.94.0+) — discussion triage can be scripted into content-ops.
- Trending algorithm remains unpublished; community consensus is star-velocity vs. baseline + engagement, per-language thresholds (creator-reported, as of 2026).

## Cadence
- Push publicly visible work 3-5 days/week (the green graph read as a heartbeat is folklore, never a platform mechanic, but costless to maintain).
- Companion repo ships SAME DAY as any technical essay (HN/X will look for it within minutes).

How to refresh this: T1. Queries: "GitHub profile README features <year>", "GitHub discussions/releases changes changelog" (github.blog/changelog is authoritative). GitHub mechanics decay slowest of the 9 platforms; refresh quarterly or when a companion repo underperforms expectations.
