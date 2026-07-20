# Playbook-refresh queue

Setup-observed platform mechanics captured during account setup, queued for the next
`/platform-playbook-refresh` run. Do NOT edit the platform playbooks directly; that skill
owns them. This file is the intake for observations that should graduate into
`knowledge/platforms/<platform>.md` once verified.

## Substack (observed 2026-07-06)
- Custom domain = one-time $50/publication fee (not a subscription) + own registrar cost + CNAME edit, up to 36h propagation; requires a subdomain (e.g. `read.`), not the bare root.
- Sections now support per-section email opt-in.
- Onboarding order (2026-07): create account + reader profile → Choose URL (subdomain, labeled "changeable later") → import mailing list (skippable) → add first subscribers (skippable) → recommend other Substacks → dashboard.
- Publication name defaults to "<Name>'s Substack"; rename in Settings → Basics. Settings fields use a per-field Save button, NOT autosave on blur (a rename typed without clicking Save is silently discarded).
- No "who can comment" audience control in Settings → Community (only enable/disable, bans, moderation, sort order, restacks). Commenting is subscriber-gated by default; there is no Everyone/Subscribers/Paid toggle.
- About page + welcome emails are edited in a full rich-text editor (Settings → About "Edit page"; Settings → Emails → Welcome emails → Edit) with their own Save button; the welcome-email editor's top H1 is the email subject (titleField), body below.
