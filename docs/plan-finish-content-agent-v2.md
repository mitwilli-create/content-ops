# Finish the content-ops agent system build — v2 (gate-aware revision, 2026-07-05)

Revision of the interrupted-session resume plan. v1 was written before the builder-skill layer shipped; this version routes every step through the toolchain that now exists. Read `AGENTS.md` before starting — it governs how anything enters `.claude/skills/`.

## Corrected premises (v1 is stale on all of these)

- The repo is NOT uncommitted: main has commits, a private remote (github.com/mitwilli-create/content-ops), and merged PRs #1-2. Do NOT plan an "initial commit" or create a `.gitignore` — one exists (data/, drafts/, memory/accounts.md, .claude/skills-inbox/ already ignored; `data/performance-log.md` is covered by `data/`).
- `.claude/skills/` is not empty scaffolding: **21 promoted skills live there** (7 authored builder skills + 14 superpowers SDLC skills, MIT-attributed). The 5 content-agent dirs (story-scout, draft-post, platform-adapt, timing-check, content-review) are the only empty ones.
- Governance exists: `AGENTS.md` (SDLC matrix + sourcing policy), `docs/skill-adoption-ledger.md` (append a row per new skill), `scripts/promote-skill.sh` (promotion PR flow), `scripts/run-council-content.sh` (7-model fan-out wrapper — use this, not a raw run-council.mjs call).
- Qodo reviews every PR on this repo automatically (repo is connected). Note: `/review` is deprecated in favor of `/agentic_review` if a manual trigger is ever needed.
- A design-doc precedent exists: `docs/specs/story-14-harness-pipeline-design.md` (produced by `/agent-architecture`) — match its shape.
- Known KB debt from the kb-build census: `knowledge/audiences.md`, `knowledge/llm-routing.md`, `knowledge/platforms/discord.md`, `knowledge/platforms/github.md` lack freshness markers. Fix in step 3.

## Step 0 — Design first (use `/agent-architecture`)

One design doc, `docs/specs/content-agent-skills-design.md`, covering the 5 skills + 4 subagents TOGETHER. Its reuse audit must answer, at minimum:
- **trend-monitor vs story-scout overlap** — both do X/HN/Reddit pulse. Likely verdict: one subagent with two modes, or trend-monitor folded into story-scout. Don't ship both without the audit saying why.
- **timing-check vs `/platform-playbook-refresh` boundary** — timing-check = per-post live verify (T1/T2, reads the playbook, checks TODAY's window); playbook updates flow through `/platform-playbook-refresh` (already promoted), NOT timing-check writing into playbooks directly. This replaces v1's "self-healing baselines" wording — one writer per file class.
- **content-review vs `/prompt-eval` asserts** — content-review's greps (em dash, banned word, idioms) must be the SAME checks as the prompt-eval standard asserts; define once (a tiny shared script or identical regex list), referenced by both.

## Step 1 — Author the 5 skills (use superpowers `writing-skills` + house conventions)

Author each SKILL.md following the `writing-skills` skill (promoted) + the structure of the 7 authored builder skills (pushy trigger descriptions, imperative body, explain-the-why, lean). Scope per v1, with the Step-0 boundary corrections:
- **story-scout** — mine X (Grok pulse via `scripts/run-council-content.sh` with `xai:grok-4-x-search` only), HN/Reddit front pages, news → append to `data/story-ledger.md`
- **draft-post** — ledger idea → `drafts/<slug>/master.md` + adaptations; council-critique pattern for pillar pieces; final pass via global `make-it-sound-like-mitchell`
- **platform-adapt** — content → N platform-native versions, reading the matching playbook (and refusing if playbook `last_verified` > 30 days → tell user to run `/platform-playbook-refresh` first)
- **timing-check** — live T1/T2 verify of TODAY's window for a specific post; reports findings; playbook edits deferred to `/platform-playbook-refresh`
- **content-review** — pre-publish gate; verdict READY / PARTIAL + gaps; shares its deterministic checks with the prompt-eval assert list

## Step 2 — Subagent definitions per the Step-0 design (likely 3, not 4)

`.claude/agents/<name>.md` for whatever the design doc ratifies (story-scout researcher, platform-adapter, engagement-analyst; trend-monitor only if the audit justifies it). Subagent prompts: question + context only, no inline methodology (house rule).

## Step 3 — Supporting files + KB debt

- `data/performance-log.md` template (gitignored — local only, no commit)
- `README.md` quickstart
- Freshness markers on the 4 flagged KB docs (per `/kb-build` rules: `last_verified:` header + "How to refresh this" line each)

## Step 4 — Test before ship (use `/prompt-eval` + superpowers `verification-before-completion`)

- Golden mini-suite: run `/prompt-eval` on draft-post's core prompt with 2-3 ledger ideas × 2 models; standard asserts (em dash = 0, banned word = 0, platform length windows) must be green. Config lives in scratch; verdict recorded in the ledger row.
- Exercise content-review once on a deliberately-dirty fixture (contains an em dash + a banned word) — it must return PARTIAL with both gaps named.
- `verification-before-completion` checklist pass before opening the PR.

## Step 5 — Ship through the gate (replaces v1's "git add + initial commit")

- Feature branch `feat/content-agent-skills` → commit skills + agents + docs (NOT data/ or drafts/) → push → PR.
- Qodo auto-reviews (repo connected). HIGH security finding = fix before merge; advisory nits = fix or record, reviewer's call.
- Merge needs Mitchell's approval (self-merge is policy-blocked — surface the PR link).
- Append one ledger row per skill/agent in `docs/skill-adoption-ledger.md` (source = authored, Qodo verdict, smoke evidence), flip to PROMOTED on merge.
- Cross-session memory: `project_content_ops_builder_layer.md` already exists in the career-ops memory dir and says these 5 skills are the next work item — UPDATE it (and its MEMORY.md line) to "content agent complete"; only add a separate `reference_content_ops_system.md` if there's usage guidance that doesn't fit the existing file.

## Reuse (unchanged from v1, plus the new layer)

- LLM fan-out: `scripts/run-council-content.sh` (wraps career-ops council with explicit models — never an empty --models)
- Voice: global `make-it-sound-like-mitchell` + `mitchells-voice-style`
- Deep research: `/deep-research` + career-ops `researcher` agent
- NEW: `/agent-architecture`, `writing-skills`, `/prompt-eval`, `/kb-build` rules, `/platform-playbook-refresh`, `/regression-wire` (wire the content-review asserts as a golden suite + note the seeded `data/baselines/kb-freshness.json`), superpowers TDD/verification skills, `/mcp-debug` if any connector misbehaves

## Acceptance test (v1's, upgraded)

1. Design doc exists with the three overlap questions answered explicitly.
2. Every new SKILL.md / agent .md has valid frontmatter; census via `find .claude/skills .claude/agents -name "*.md"` — zero empty dirs remain.
3. Golden mini-suite green (prompt-eval output attached) AND content-review correctly fails the dirty fixture.
4. PR merged with clean Qodo review; ledger rows PROMOTED for every new skill/agent.
5. Grep census: 0 banned patterns outside rules files that name them.
6. 4 KB docs carry freshness markers (kb-freshness baseline count moves 7 → 11; update `data/baselines/kb-freshness.json` with a provenance note per `/regression-wire` rules).
7. Career-ops memory updated (existing file, not a duplicate).
