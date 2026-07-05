# Skill Adoption Ledger

Every skill adopted into `.claude/skills/` or authored locally gets one row. No row = not promoted. Append-only.

Schema: date | skill | source (URL or "authored") | evidence (stars/downloads/ratings, verified how) | Qodo verdict (PASS / PASS-with-notes / REJECT+reason) | smoke test (what was run, result) | status (PROMOTED / REJECTED / INBOX)

| Date | Skill | Source | Evidence | Qodo verdict | Smoke test | Status |
|---|---|---|---|---|---|---|
| 2026-07-05 | superpowers | github.com/obra/superpowers | ★246,807 live gh API 2026-07-05; pushed 2026-07-05; pre-scan clean (0 risk patterns in executables) | PASS-with-notes (PR #2: no security concerns; 2 quality nits in upstream helper scripts) | 14 SKILL.md extracted, MIT-attributed | INBOX |
| 2026-07-05 | spec-kit | github.com/github/spec-kit | ★118,145 live gh API 2026-07-05; pushed 2026-07-02; pre-scan clean | n/a (tool adoption — documented install, not vendored) | n/a | TOOL-DOCUMENTED |
| 2026-07-05 | tdd-guard | github.com/nizos/tdd-guard | ★2,241 live gh API 2026-07-05; pushed 2026-06-23; pre-scan clean | n/a (tool adoption — documented install) | n/a | TOOL-DOCUMENTED |
| 2026-07-05 | planning-with-files | github.com/OthmanAdi/planning-with-files | ★24,663 live gh API 2026-07-05; pre-scan clean | n/a (pattern reference; encoded in authored skills) | n/a | REFERENCE |
| 2026-07-05 | agent-architecture | authored (BUILD verdict, phase 2) | wraps BMAD role-separation thinking + career-ops bug-class lessons | PASS-with-notes (PR #1: no security concerns) | PASS — E2E run produced docs/specs/story-14-harness-pipeline-design.md, 6/6 sections, reuse audit correctly concluded zero new surfaces | INBOX |
| 2026-07-05 | prompt-eval | authored (BUILD verdict, phases 3+7; wraps promptfoo ★22,943 + deepeval ★16,652) | libs verified live gh API | PASS-with-notes (PR #1: env-path nit FIXED in follow-up commit) | PASS — promptfoo 2 prompts × 2 models (haiku/gemini-flash), 4/4 asserts green incl. em-dash + banned-word gates | INBOX |
| 2026-07-05 | mcp-debug | authored (BUILD verdict, phase 4; wraps inspector ★10,282 + fastmcp ★25,981) | libs verified live gh API | PASS-with-notes (PR #1: no security concerns) | PASS — Inspector tools/list green vs known-good server-everything; correctly isolated dashboard-mcp connection failure as server-side | INBOX |
| 2026-07-05 | kb-build | authored (BUILD verdict, phase 6; wraps LlamaIndex; council's graphify claim did not resolve) | lib verified | PASS-with-notes (PR #1: no security concerns) | PASS — freshness census over 11 KB docs, surfaced 4 without markers (real finding) | INBOX |
| 2026-07-05 | deploy-scheduled-agent | authored (BUILD verdict, phase 9 — no credible public skill for macOS launchd) | encodes career-ops Tahoe runbook (3 landmine classes) | PASS-with-notes (PR #1: portability note = by-design Tahoe scoping) | PASS — full cycle: wrapper+plist+bootstrap+kickstart, log written, exit 0, clean teardown | INBOX |
| 2026-07-05 | regression-wire | authored (BUILD verdict, phase 10; wraps langfuse ★30,468 + promptfoo CI) | libs verified live gh API | PASS-with-notes (PR #1: no security concerns) | PASS — baseline JSON written + zero-delta compare; promptfoo assert layer exercised earlier (4/4) | INBOX |
| 2026-07-05 | platform-playbook-refresh | authored (BUILD verdict, phase 11 — council found only weak skills, blacktwist ★305) | freshness-discipline design | PASS-with-notes (PR #1: no security concerns) | PASS — T1 spot refresh on hackernews.md; claims re-confirmed, honesty rule (nothing-changed is valid) exercised, last_verified stamped | INBOX |

Merge state 2026-07-05: PRs #1 + #2 Qodo-reviewed clean (no security concerns), smoke tests all PASS; MERGE = Mitchell approval (self-merge blocked by policy). On merge: flip INBOX rows to PROMOTED.
