---
name: timing-check
description: Use before recommending WHEN to post anything - a draft is staged and needs a post window, the user asks "when should this go out", "is now a good time", "should I wait on this", or a scheduling recommendation is about to be made from playbook baselines alone. Playbook timing claims decay in weeks; an unverified window is a guess wearing a timestamp.
---

# Timing Check

Live-verify TODAY's posting window for a specific staged post on a specific platform. This skill READS playbooks and never writes them: playbook updates are `/platform-playbook-refresh`'s job exclusively (design doc Q2, one writer per file class).

## Procedure

1. **Staleness gate.** Read `knowledge/platforms/<platform>.md`. If `last_verified` (or the dated BASELINE line) is older than 30 days: STOP and instruct running `/platform-playbook-refresh <platform>` first. A timing check layered on a stale playbook validates against fiction.
2. **T1 verify** (1-3 WebSearch queries): confirm the playbook's window claims still hold this quarter for this platform + content type. Cheap, mandatory.
3. **T2 pulse when the piece is topical**: run `/story-scout` pulse mode on the take. A news-cycle window (model release, outage, AI drama) overrides clock-time windows; a `crowded` verdict may argue for waiting or for the unsaid angle.
4. **Mitchell-context pass**: the first hour of engagement is load-bearing on LinkedIn/X/HN. A "perfect" window when he cannot reply to comments loses to a decent window when he can. Ask for (or read from the calendar connector) his availability; recommend windows he can attend.
5. **Output** (into the draft's `NOTES.md` and to the user): recommended window with timezone, the evidence for it (playbook claim + today's verification + pulse verdict), a fallback window, and the verification date. Never present a baseline claim as verified.

## Discrepancy handling

Live checks contradicting the playbook: report the discrepancy in the output and recommend `/platform-playbook-refresh` for that platform. Do NOT edit the playbook here, even for a one-line fix; two writers into the playbooks means silent overwrites of dated claims.

## Rules

- Never recommend a window for autonomous posting; windows are recommendations for Mitchell's hand (publishing gate).
- Cross-post cascades: when timing a multi-platform rollout, check the sequencing notes in each playbook; one platform's window shift moves the whole cascade.
- Cost: T1 is near-free; the Grok pulse is ~$0.02-0.05. Always cheaper than a mistimed pillar post.
