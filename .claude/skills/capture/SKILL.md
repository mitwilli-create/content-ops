---
name: capture
description: Use the moment Mitchell voices a story idea, topic, or angle outside a drafting flow - "note this idea", "add this to the list", "story idea:", "capture this for later", a pasted list of topics, or any passing thought that should not be lost. Also use from ANY other project's session when a content idea surfaces mid-unrelated-work (route it here, do not absorb it into that session's scope).
---

# Capture

Zero-friction intake. One idea in, one line stored, zero questions asked. Capture and execution run on different clocks: capture must cost seconds and work from anywhere; triage stays with `/story-scout`, drafting with `/draft-post`, on whatever timeline Mitchell wants (near or far - ideas persist indefinitely).

## Procedure

1. Append ONE line per idea to `data/inbox.md` (create from the template at the bottom of this file if missing; the file is gitignored personal data):
   `- YYYY-MM-DD | <idea, verbatim or lightly compressed> | src: <chat|email|voice> | aud? <1-4 guess or ?>`
2. Confirm in five words or fewer ("captured to inbox"). Do NOT triage, research, rank, or expand at capture time; the whole value is zero friction. Audience guess is optional and never worth a question.
3. That is the entire skill. Draining happens elsewhere: `/story-scout` step 0 triages inbox lines into `data/story-ledger.md` with full audience/platform mapping.

## Remote capture (phone, away from any session)

Mitchell emails himself (mitwilli@gmail.com) with subject starting `IDEA:`. The `/story-scout` sweep (its step 0) searches the connected Gmail MCP for `subject:IDEA newer_than:14d`, appends unswept ones to the inbox with `src: email`, and records the swept message dates in the inbox's `<!-- swept-through: YYYY-MM-DD -->` marker line so nothing is double-ingested. If the Gmail MCP is unavailable in the running context (headless/cron), skip with a printed notice, never fail; the next interactive run catches up.

## Rules

- Never discard a captured idea for quality reasons; the inbox is judgment-free. Values filters (no K-12-AI-deployment advocacy) apply at TRIAGE, not capture, and a filtered idea gets a note, not silent deletion.
- Ideas are never lost to time: an inbox or ledger row with no activity for months is dormant, not dead. No expiry, no auto-purge.

## data/inbox.md template

```markdown
# Idea Inbox
<!-- swept-through: never -->
One line per idea; /story-scout drains into the ledger. Judgment-free zone.

```
