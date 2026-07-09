---
name: publish
description: Use when an approved draft is ready to go live - the user says "publish the [slug] pillar", "get this into Substack", "ship the essay", "cross-post to LinkedIn", or a drafts/<slug>/ has a content-review READY verdict and needs to reach Substack + LinkedIn. Refreshes the Substack editor from the canonical draft, places media at the markers, sets SEO/category/social-preview, then the LinkedIn cross-post. NEVER auto-publishes; Mitchell presses every send button.
---

# Publish

Take an approved draft from its canonical file to a live Substack post plus a LinkedIn cross-post. This skill is path-generalized: pass the canonical draft file and its dir; nothing here is specific to any one piece. Every step stages or previews. **The send button is always Mitchell's.**

Inputs you need up front: the canonical draft file (e.g. `drafts/<slug>/master.md` or the draft's `voiceos-final-vN.md`), its dir, and the live Substack editor URL for the post.

## Preconditions (gate BEFORE touching the editor)

Run all four; do not proceed past a failure.

1. **Voice + published length:** `node scripts/voice-gates.mjs <canonical-draft> --platform substack --published` exits 0. The `--published` flag counts the true body (::: marker blocks stripped); a raw count false-trips the ceiling.
2. **Adaptations current:** `node scripts/check-adaptation-staleness.mjs <draft-dir> --master <canonical-draft-filename>` exits 0. Any STALE / LIKELY-STALE adaptation means the platform version was built from an older essay: regenerate it via `/platform-adapt` before promoting the cross-post. This is the guard against shipping an old-essay LinkedIn promo.
3. **Review verdict:** `/content-review` has recorded READY for the canonical draft.
4. **Assets present:** every image referenced by a `:::image` block exists in `<draft-dir>/assets/`.

## Part A - Substack

1. **Render + load the clipboard in the correct order:** `scripts/load-clipboard.sh <canonical-draft> [--screenshot]`. This renders the mockup first (optionally screenshots it), then loads the rich-text clipboard LAST. Never run a headless render after this - it clobbers the clipboard. Preview the layout by opening `<draft-dir>/.render/mockup.html` in real Chrome (`open -a "Google Chrome" ...`; the Chrome MCP mangles `file://`).
2. **Refresh the editor body** (it is almost always stale): click into the post body, Cmd+A, Delete, Cmd+V. The clean body appears with N numbered `⛳` marker lines. N is auto-counted by the paste-body builder from the draft's media blocks - it is correct by construction, no hand-edited total.
3. **Place each media at its `⛳` marker**, then delete that instruction line. Video/tweet: paste the raw URL on its own line. Image: drag in at ~1456px wide, add caption + alt. Follow `<draft-dir>/MEDIA-EMBED-GUIDE.md` for per-type rules and the tweet screenshot-fallback.
4. **Sweep:** Cmd+F for `⛳` and for `:::` - both must return zero before publishing.
5. **SEO / social description:** paste the description staged in the draft's runbook/NOTES, or write one (<=200 chars, lead with what the reader gets).
6. **Social preview image:** set it to the lead/pullquote image.
7. **Tags + Publication Category:** set the post tags, and set the publication Category to Technology (add AI if offered) in publication settings - that category is the real discovery surface, and it is a one-time publication setting, not a per-post field.
8. **Publish** (Mitchell presses it). Then copy the live URL - Part B needs it.

## Part B - LinkedIn cross-post (right after)

1. **Timing:** run `/timing-check` for the current LinkedIn window before scheduling. Do not hardcode a posting time; platform windows decay in weeks.
2. **Use the CURRENT adaptation file** (the one the precondition guard verified fresh) - never an older `linkedin*.md`.
3. **Link in the first comment, not the body.** Post the body text; put the Substack link in the FIRST COMMENT immediately after. LinkedIn suppresses reach on posts with an outbound link in the body. Confirm this link-in-comment rule is still current against `knowledge/platforms/linkedin.md` (or a quick T1 check) before relying on it - it is a mechanics claim and mechanics change.
4. **Engage:** reply to every comment in the first 60-90 minutes. Early engagement is the single biggest lever on a first post, bigger than the exact posting minute.

## Part C - Portfolio (optional, after the sprint)

- Add a Writing card/link on storytellermitch.com pointing to the live URL.
- If you repost the full essay text on the site, add `<link rel="canonical" href="<SUBSTACK_URL>">` in that page's head so Google keeps Substack as the original and the SEO does not split.

## Rules

- **Never publish autonomously.** Draft, stage, preview, schedule-propose. Mitchell presses send.
- After it is live, log the URL and any early numbers to `data/performance-log.md` (the canonical performance log named in CLAUDE.md; `data/` is gitignored, so this analytics stays local and is never committed). Performance data is the flywheel.
- Everything is parameterized by the draft path. If a step needs a Krieger-specific value, that is a bug: read it from the draft/runbook instead.
