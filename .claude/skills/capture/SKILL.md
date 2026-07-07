---
name: capture
description: Use when Mitchell voices a story idea, topic, or angle outside a drafting flow - "note this idea", "add this to the list", "story idea:", "capture this for later", a pasted list of topics, or any passing thought that should not be lost. Also use from ANY other project's session when a content idea surfaces mid-unrelated-work (route it here, do not absorb it into that session's scope).
---

# Capture

Zero-friction intake. One idea in, one line stored, zero questions asked. Capture and execution run on different clocks: capture must cost seconds and work from anywhere; triage stays with `/story-scout`, drafting with `/draft-post`, on whatever timeline Mitchell wants (near or far - ideas persist indefinitely).

## Procedure

1. Append ONE line per idea to `data/inbox.md` (create from the template at the bottom of this file if missing; the file is gitignored personal data):
   `- YYYY-MM-DD | <idea, verbatim or lightly compressed> | src: <chat|email|voice> | aud? <1-4 guess or ?>`
2. Confirm in five words or fewer ("captured to inbox"). Do NOT triage, research, rank, or expand at capture time; the whole value is zero friction. Audience guess is optional and never worth a question.
3. That is the entire skill. Draining happens elsewhere: `/story-scout` step 0 triages inbox lines into `data/story-ledger.md` with full audience/platform mapping.

## Remote capture (phone, away from any session)

Mitchell emails himself, at the address the connected Gmail MCP is authenticated to (recorded in gitignored `memory/accounts.md`, never in committed files), with subject starting `IDEA:`. The `/story-scout` sweep (its step 0) searches the connected Gmail MCP for `from:me subject:IDEA` (the `from:me` term is load-bearing: without it, ANY external sender who titles an email `IDEA:` gets their text swept into the pipeline; self-sent capture is the only trusted channel) scoped by the inbox cursor (`after:` the marker date; a `never` marker means NO date filter, sweep full history), appends unswept ones to the inbox with `src: email`, and advances the marker. Cursor grammar (exactly two accepted forms): `<!-- swept-through: never id:none -->` (the sentinel: no sweep has completed yet) OR `<!-- swept-through: <RFC3339 timestamp> id:<gmail message id> -->`. Sentinel semantics: on `never` (or a missing/unparseable cursor, which is treated as `never`), ingest full history with gmail-id dedupe against inbox AND ledger, then write the cursor as the newest swept message's RFC3339 timestamp + id. Timestamp semantics: ingest messages strictly greater on the tuple (timestamp, message id); skip the marker id and any gmail id already present in the inbox or ledger; advance the marker to the newest swept message. Email-sourced inbox lines carry their `id:<gmail id>` token so dedupe works even if the cursor is lost. No fixed time window anywhere: an idea email from six months ago is swept on the first run that sees it. If the Gmail MCP is unavailable in the running context (headless/cron), skip with a printed notice, never fail; the next interactive run catches up.

## Rules

- Never discard a captured idea for quality reasons; the inbox is judgment-free. Values filters (no K-12-AI-deployment advocacy) apply at TRIAGE, not capture, and a filtered idea gets a note, not silent deletion.
- Ideas are never lost to time: an inbox or ledger row with no activity for months is dormant, not dead. No expiry, no auto-purge.

## data/inbox.md template

```markdown
# Idea Inbox
<!-- swept-through: never id:none -->
One line per idea; /story-scout drains into the ledger. Judgment-free zone.

```
