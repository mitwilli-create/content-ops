---
name: platform-adapt
description: Use when existing content (a master draft, essay, video script, or published piece) needs versions for specific named platforms - the user says "adapt this for LinkedIn and X", "atomize the Substack piece", "make a TikTok script from this", or a drafts/ dir has a master.md without adaptations for its primary platforms.
---

# Platform Adapt

Turn one canonical piece into platform-native versions. Adaptation means re-expressing the SAME argument in the target platform's grammar, not writing a new take per platform (divergent takes fragment the idea and double the fact-surface).

## Procedure

1. **Freshness gate first.** For each target platform read `knowledge/platforms/<platform>.md` and check `last_verified` (or the dated BASELINE line). Older than 30 days: STOP for that platform and instruct running `/platform-playbook-refresh` on it first. Do not adapt against a stale playbook; this skill never edits playbooks itself (one writer per file class - the writer is `/platform-playbook-refresh`).
2. **Read the playbook's format section** and the audience register in `knowledge/audiences.md` for the platform's primary audience.
3. **Adapt.** One `platform-adapter` subagent per platform when doing 3+ in parallel (each gets the master text + one playbook + ONE explicit output path); inline for 1-2 platforms. Every adaptation keeps: the core claim, the lived-experience anchor, and the concrete takeaway. Everything else (length, structure, hook style, link handling) obeys the playbook.
4. **Hooks:** 2-3 hook variants at the top of each adaptation, marked `HOOK A/B/C`, chosen for that platform's scroll context.
5. **Gate:** run `node scripts/voice-gates.mjs <file> --platform <platform>` on each output; fix violations before staging. Then the global `make-it-sound-like-mitchell` pass.

## Sequencing default (from the playbooks' cascade notes)

Substack first (owns the audience), YT longform second, Shorts/TikTok atomized third, X thread + LinkedIn excerpt after native traction, HN only for genuinely dev-substantive pieces and only per the hackernews playbook's submission discipline.

## Rules

- Never invent platform-specific claims ("this took off on X") that the master does not contain.
- Reddit and Discord adaptations are drafts for MITCHELL to post with per-community framing; flag the target sub/server's self-promo rules in the draft header.
- An adaptation that will not fit the platform without cutting the lived-experience anchor is a signal the piece is wrong for that platform: report that instead of shipping a hollow version.
