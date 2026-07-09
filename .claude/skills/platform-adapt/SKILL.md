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
4. **Stamp provenance.** Each adaptation file opens with frontmatter recording what it was built from, so staleness is later detectable:
   ```yaml
   ---
   source: <master filename, e.g. master.md or voiceos-final-v5.md>
   source_hash: sha256:<sha256 of the master file's current contents>
   adapted: <YYYY-MM-DD>
   ---
   ```
   Compute the hash with `shasum -a 256 <master>` (or `node -e "import('node:crypto').then(c=>import('node:fs').then(f=>console.log(c.createHash('sha256').update(f.readFileSync(process.argv[1])).digest('hex'))))" <master>`). Without this, the staleness guard falls back to weaker mtime comparison.
5. **Hooks:** 2-3 hook variants at the top of each adaptation (below the frontmatter), marked `HOOK A/B/C`, chosen for that platform's scroll context.
6. **Voice pass:** run the global `make-it-sound-like-mitchell` pass on each adaptation. Do this BEFORE the gate, since it is the last text mutation and can reintroduce an em dash or banned term.
7. **Gate (runs after the final mutation):** run `node scripts/voice-gates.mjs <file> --platform <platform>` on each output; fix violations before staging. If the voice pass or a fix edits the text again, re-run the gate, so what stages is exactly what passed.
8. **Confirm freshness:** run `node scripts/check-adaptation-staleness.mjs <draft-dir> --master <master filename>`; it must exit 0. This is the same guard `/publish` runs before any cross-post.

## Sequencing default (from the playbooks' cascade notes)

Substack first (owns the audience), YT longform second, Shorts/TikTok atomized third, X thread + LinkedIn excerpt after native traction, HN only for genuinely dev-substantive pieces and only per the hackernews playbook's submission discipline.

## Rules

- Never invent platform-specific claims ("this took off on X") that the master does not contain.
- Reddit and Discord adaptations are drafts for MITCHELL to post with per-community framing; flag the target sub/server's self-promo rules in the draft header.
- An adaptation that will not fit the platform without cutting the lived-experience anchor is a signal the piece is wrong for that platform: report that instead of shipping a hollow version.
- **When the master changes materially, its adaptations are stale until regenerated.** `check-adaptation-staleness.mjs` catches this (STALE on a source_hash mismatch). To clear a STALE flag, re-run this skill to regenerate the adaptation from the new master, which re-stamps `source_hash` as a side effect of the rebuild. Do NOT hand-edit `source_hash` to match without regenerating: a re-stamp with no rebuild is exactly how a stale adaptation gets marked fresh, which is the 2026-07-09 near-miss where a LinkedIn promo was nearly shipped on a pre-rewrite essay. The hash is a record of a real rebuild, not a checkbox.
