# Skill Adoption Ledger

Every skill adopted into `.claude/skills/` or authored locally gets one row. No row = not promoted. Append-only.

Schema: date | skill | source (URL or "authored") | evidence (stars/downloads/ratings, verified how) | Qodo verdict (PASS / PASS-with-notes / REJECT+reason) | smoke test (what was run, result) | status (PROMOTED / REJECTED / INBOX)

| Date | Skill | Source | Evidence | Qodo verdict | Smoke test | Status |
|---|---|---|---|---|---|---|
| 2026-07-05 | superpowers | github.com/obra/superpowers | ★246,807 live gh API 2026-07-05; pushed 2026-07-05; pre-scan clean (0 risk patterns in executables) | PR review pending | pending | INBOX |
| 2026-07-05 | spec-kit | github.com/github/spec-kit | ★118,145 live gh API 2026-07-05; pushed 2026-07-02; pre-scan clean | PR review pending | pending | INBOX |
| 2026-07-05 | tdd-guard | github.com/nizos/tdd-guard | ★2,241 live gh API 2026-07-05; pushed 2026-06-23; pre-scan clean | PR review pending | pending | INBOX |
| 2026-07-05 | planning-with-files | github.com/OthmanAdi/planning-with-files | ★24,663 live gh API 2026-07-05; pre-scan clean | PR review pending | pending | INBOX |
| 2026-07-05 | agent-architecture | authored (BUILD verdict, phase 2) | wraps BMAD role-separation thinking + career-ops bug-class lessons | PR review pending | PASS — E2E run produced docs/specs/story-14-harness-pipeline-design.md, 6/6 sections, reuse audit correctly concluded zero new surfaces | INBOX |
| 2026-07-05 | prompt-eval | authored (BUILD verdict, phases 3+7; wraps promptfoo ★22,943 + deepeval ★16,652) | libs verified live gh API | PR review pending | PASS — promptfoo 2 prompts × 2 models (haiku/gemini-flash), 4/4 asserts green incl. em-dash + banned-word gates | INBOX |
| 2026-07-05 | mcp-debug | authored (BUILD verdict, phase 4; wraps inspector ★10,282 + fastmcp ★25,981) | libs verified live gh API | PR review pending | pending | INBOX |
| 2026-07-05 | kb-build | authored (BUILD verdict, phase 6; wraps LlamaIndex; council's graphify claim did not resolve) | lib verified | PR review pending | pending | INBOX |
| 2026-07-05 | deploy-scheduled-agent | authored (BUILD verdict, phase 9 — no credible public skill for macOS launchd) | encodes career-ops Tahoe runbook (3 landmine classes) | PR review pending | pending | INBOX |
| 2026-07-05 | regression-wire | authored (BUILD verdict, phase 10; wraps langfuse ★30,468 + promptfoo CI) | libs verified live gh API | PR review pending | pending | INBOX |
| 2026-07-05 | platform-playbook-refresh | authored (BUILD verdict, phase 11 — council found only weak skills, blacktwist ★305) | freshness-discipline design | PR review pending | pending | INBOX |
