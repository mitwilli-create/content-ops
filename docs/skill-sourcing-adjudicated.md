---
agent: dealbreaker
mode: claim-adjudication
input_report: /private/tmp/claude-501/-Users-mitchellwilliams-Documents-career-ops/d3b30eb7-0159-47be-b1c0-0a7e506ff5ec/scratchpad/council-skill-sourcing-report.md
input_kind: council
timestamp: 2026-07-05 (PT)
adjudication_summary:
  total_claims_reviewed: 41
  verified: 22
  corroborated: 6
  unique_distinctive_kept: 3
  cut_unsupported: 6
  cut_contradicted: 4
  cut_stale: 0
  websearch_calls_used: 1
  gh_api_calls_used: 34
  routing_audit: skipped
  confidence_in_final_synthesis: high
---

# Final Research Report — Community Claude Code Skills per SDLC Phase (Content-Optimization Agent Build)

**Adjudicated by:** dealbreaker agent (claim-adjudication mode)
**Source report:** [`council-skill-sourcing-report.md`](/private/tmp/claude-501/-Users-mitchellwilliams-Documents-career-ops/d3b30eb7-0159-47be-b1c0-0a7e506ff5ec/scratchpad/council-skill-sourcing-report.md)
**Timestamp:** 2026-07-05 PT · 7/7 models responded

## Headline

Every load-bearing star/install number in the council was independently re-verified against the live GitHub API — most were roughly right, several were wildly wrong, and the honest verdict is that credible community skills cluster in ~4 phases (spec, prompt-eval, MCP, memory/KB) while ~5 phases (architecture, agent-eval-as-a-skill, deployment/launchd, maintenance/regression, social-platform) require custom authoring or wrapping a mature non-skill library.

## Executive synthesis

The council split cleanly into two camps, and that split is the single most important adjudication finding. **GPT-5, grok-4, and claude-opus-4-7 refused to invent registry numbers** and marked stars/downloads/dates `[UNVERIFIED]` with the exact `gh`/`npm` commands to check them. **The two Perplexity models, grok-4-x-search, and gemini-2.5-pro asserted specific figures** — and those figures are where hallucination lives. I did not trust either camp on faith: I pulled live `stargazerCount` + `pushedAt` for all 34 named repos via the GitHub API (this cost $0 and is far higher-signal than WebSearch for star counts). The disciplined refuse-to-guess camp was epistemically correct as a *posture*, but the asserted numbers were mostly *directionally* right once corrected — with important exceptions flagged below.

**Superpowers (`obra/superpowers`) is real and dominant: 246,806 stars, v6.1.1 released 2026-07-02, pushed 2026-07-05, MIT.** The council's spread of "229k / 227,756 / 247k / 118k / 245.3k installs" resolves to ~247k stars — grok-4-x-search's "~247k" and gemini's "245.3k" were closest; sonar-deep-research's flat "229,000" and sonar-reasoning-pro's "118k" (it confused Superpowers with Spec-Kit's real 118,145) were off. GitHub **Spec-Kit is 118,145 stars** — sonar-reasoning-pro's and grok-4-x-search's "~118k" for Spec-Kit were correct. These two are the verified spine of the spec/architecture/TDD phases.

The strongest *material* correction to the council's frame comes from **GPT-5 and claude-opus-4-7**, who argued the credible tooling for prompt-eval, agent-eval, KB, and regression is **mature non-skill libraries wrapped in a thin custom skill** (promptfoo 22,943★, DeepEval/confident-ai 16,652★, Langfuse 30,468★, LlamaIndex 50,660★, Haystack 25,829★, FastMCP 25,981★, Inspect AI 2,302★, `modelcontextprotocol/servers` 88,089★). All verified live. This is more honest than the Perplexity/gemini framing that implied a purpose-built Claude Code *skill* exists for every phase — for several phases it does not.

Gemini-2.5-pro was the highest-variance model: it fabricated internally-incoherent metrics ("245.3k installs, 13.7K forks/stars" is not a coherent pairing) and invented precise-sounding claims. But a targeted WebSearch **confirmed** several of its "exotic" claims I expected to cut: **ClaudePluginHub is real; "ecc / Everything Claude Code" is real (~214K stars, 548 skills); and a ~341-malicious-skill supply-chain attack is real** — though it hit **ClawHub**, not "community repos" generically, and delivered Atomic macOS Stealer. Snyk separately scanned 3,984 skills and flagged 76 malicious as of 2026-02-05. So the security-risk section survives as CORROBORATED with the venue corrected. Its unverifiable claims (AMD "Stella Laurenzo 7,000-session audit," `caveman` "82.8k installs," `AutoDream` native feature) are CUT to the appendix.

Net: adopt the four verified skill/library clusters below, wrap mature libraries where no credible skill exists, and budget for custom authoring in ~5 phases. Run a per-repo security audit (SKILL.md + scripts/) before install — the malicious-skill supply-chain risk is verified and current.

## Verified findings (high confidence)

All star counts pulled live from GitHub API on 2026-07-05. `[gh-verified by dealbreaker]` on each.

1. **`obra/superpowers` — 246,806★, fork 21,898, v6.1.1 (2026-07-02), pushed 2026-07-05, MIT.** Author `obra` (Jesse Vincent per grok-4-x-search). The most-starred candidate; agentic SDLC methodology framework. `[gh-verified]`
2. **`github/spec-kit` — 118,145★, fork 10,456, pushed 2026-07-02.** Official GitHub SDD toolkit; slash-command workflow. `[gh-verified]`
3. **`mattpocock/skills` — 157,394★, MIT, pushed 2026-07-05.** "Skills for Real Engineers … from my .claude directory." Author Matt Pocock (Total TypeScript). grok-4-x-search's "20k–157k, varies" bracketed it; the real number is the top of that range. `[gh-verified]`
4. **`anthropics/skills` — 158,418★, pushed 2026-07-01.** Official Anthropic skills repo (document-skills, skill-creator). Highest-provenance source for KB + eval reference skills. `[gh-verified]`
5. **`modelcontextprotocol/servers` — 88,089★, pushed 2026-07-04.** Official MCP reference servers. `[gh-verified]`
6. **`modelcontextprotocol/inspector` — 10,282★, pushed 2026-07-05.** Official MCP debugging UI. `[gh-verified]`
7. **`promptfoo/promptfoo` — 22,943★, fork 2,043, pushed 2026-07-05.** Prompt-eval + regression harness (CLI, wrap as skill). Author Ian Webster per claude-opus-4-7. `[gh-verified]`
8. **`bmad-code-org/BMAD-METHOD` — 50,096★, pushed 2026-07-05.** Multi-role (PM/architect/dev/QA) agentic-agile framework. `[gh-verified]`
9. **`run-llama/llama_index` — 50,660★.** KB construction / retrieval library (wrap as skill). `[gh-verified]`
10. **`safishamsi/graphify` — 78,103★, MIT, Python.** Confirmed a real Claude Code skill: "turn any folder of code/SQL/docs/images into a queryable knowledge graph." Gemini's KB pick survives verification. `[gh-verified]`
11. **`coreyhaines31/marketingskills` — 36,371★, MIT, pushed 2026-07-03.** Content-strategy skill (sonar-deep-research's Phase 6/11 pick). Real and well-starred. `[gh-verified]`
12. **`rohitg00/agentmemory` — 24,589★, Apache-2.0, pushed 2026-06-29.** "#1 Persistent memory for AI coding agents based on real-world benchmarks." Memory pick survives. `[gh-verified]`
13. **`OthmanAdi/planning-with-files` — 24,663★, MIT.** Snyk's #1; the "13,410 stars" the council cited was stale — it has since ~doubled. `[gh-verified]`
14. **`alirezarezvani/claude-skills` — 20,484★, MIT, pushed 2026-07-03.** Large skill collection. Council claimed "5,200+ stars / 337 skills" — the 5,200 figure is **stale by ~4x** (now 20k+). `[gh-verified]`
15. **`muratcankoylan/Agent-Skills-for-Context-Engineering` — 16,880★, MIT.** Context-engineering / operating-loops skills. `[gh-verified]`
16. **`NomenAK/SuperClaude` — 23,490★, MIT.** Broad Claude Code framework (GPT-5 flagged as too broad for a clean SDLC build — a fair caution, kept). `[gh-verified]`
17. **`confident-ai/deepeval` — 16,652★, Apache-2.0.** Eval/benchmarking library. Note: council's slug `DeepEval/deepeval` is wrong (404); correct slug is `confident-ai/deepeval`. `[gh-verified]`
18. **`langfuse/langfuse` — 30,468★.** Observability / regression / maintenance for agent systems. `[gh-verified]`
19. **`deepset-ai/haystack` — 25,829★, Apache-2.0.** KB / retrieval framework. `[gh-verified]`
20. **`jlowin/fastmcp` — 25,981★, Apache-2.0.** MCP server-build framework (GPT-5's #2 MCP pick). `[gh-verified]`
21. **`anthropics/claude-code-action` — 8,253★, MIT, pushed 2026-07-04.** Official CI action for the deployment phase. `[gh-verified]`
22. **`UKGovernmentBEIS/inspect_ai` — 2,302★, MIT, pushed 2026-07-05.** Research-grade eval framework (UK AISI). `[gh-verified]`

## Corroborated findings (medium confidence)

23. **Security-risk landscape is real and current.** Malicious-skill supply-chain risk CORROBORATED by WebSearch: ~341 malicious skills in a ClawHub supply-chain attack (Atomic macOS Stealer); 71 overtly malicious skills found on ClawHub; Snyk scanned 3,984 skills and flagged 76 as of 2026-02-05. Gemini's "341 malicious skills Feb 2026" was substantively correct but attributed to the wrong venue (ClawHub, not generic "community repos"). Every council model that said "audit SKILL.md + scripts/ before install" was right. `[web-verified by dealbreaker]`
24. **`ckelsoe/prompt-architect` — 231★, MIT, pushed 2026-06-04.** Real, small, active. 27-framework prompt structurer. Low adoption but credible. `[gh-verified]` (kept as a niche option, not a load-bearing pick.)
25. **Token-bloat / mega-skill overhead criticism.** Multiple models independently flagged it; Anthropic enterprise guidance corroborates "limit skills loaded simultaneously." No single citable incident, but consistent cross-model + vendor-doc support.
26. **ClaudePluginHub + "ecc / Everything Claude Code" exist.** WebSearch confirms ecc is real (~214K stars per one source; 548 skills / 185 commands / 134 agents). Gemini's "226.1k installs, 3.4K stars, 548 skills" is roughly right on scale, imprecise on the star/install split. Kept as CORROBORATED with the numbers hedged. `[web-verified]`
27. **`contains-studio/agents` — 12,399★ but pushed 2025-07-28 (STALE mtime).** GPT-5's #2 architecture pick exists and is well-starred, but has not been pushed in ~1 year — freshness caution warranted for a 2026 build.
28. **`levnikolaevich/claude-code-skills` — 510★.** Snyk-listed "Delivery workflow" skill. Council said "82 stars"; now 510. Real, modest. `[gh-verified]`

## Model-distinctive findings (architecturally attributed)

29. **grok-4-x-search — Superpowers author identity + v6.1.1 + July-2 commit.** Its X/web-search grounding produced the freshness detail ("commits as recent as July 2, 2026; v6.1.1") that the GitHub API then confirmed exactly (v6.1.1, 2026-07-02). Distinctive-capability call that verified true. `[gh-verified]`
30. **GPT-5 + claude-opus-4-7 — the "wrap a mature library, don't chase a skill" frame.** Distinctive because both refused to fabricate and reframed 5+ phases around promptfoo/LlamaIndex/Inspect-AI/FastMCP rather than inventing skill names. This is the highest-value reframe in the council and it survived verification (all libraries real + well-starred).
31. **gemini-2.5-pro — `safishamsi/graphify` (78,103★) as the KB pick.** No other model surfaced it; it verified as a real, heavily-starred, on-point KB-graph skill. A genuine distinctive find buried in an otherwise-noisy response.

## Open disagreements / Undecidable impasses

- **Superpowers star count** had a 118k–247k spread across models. RESOLVED to 246,806 via API — not left open.
- **"stars" vs "installs" conflation.** Gemini and grok-4-x-search sometimes reported "installs" where GitHub only exposes stars. Where a model said "installs," treat it as UNVERIFIABLE against GitHub (marketplace install telemetry is not public) — I verified stars only. Install counts remain genuinely undecidable without registry API access.
- **grok-4's total nullism.** grok-4 asserted *nothing* exists / all 11 phases need custom authoring. This is now CONTRADICTED by 22 verified live repos. grok-4's response is cut as non-informative (over-conservative to the point of being wrong), distinct from GPT-5/opus's calibrated "refuse to guess the *numbers*, but name the real repos."

## FINAL PER-PHASE VERDICT TABLE

| # | Phase | Winning skill/tool (verified) | Evidence (live 2026-07-05) | Install path | Runner-up | Verdict |
|---|---|---|---|---|---|---|
| 1 | Spec-driven dev | **github/spec-kit** (backbone) + **obra/superpowers** (methodology) | 118,145★ / 246,806★, both pushed ≤2026-07-05 | `uvx --from git+https://github.com/github/spec-kit.git specify init --ai claude <proj>` · Superpowers: `/plugin install superpowers@claude-plugins-official` | SpillwaveSolutions/sdd-skill (82★, thin) | ADOPT |
| 2 | Architecture / design | *(no credible skill)* — BMAD-METHOD for role decomposition | BMAD 50,096★ | `git clone https://github.com/bmad-code-org/BMAD-METHOD` | contains-studio/agents (12,399★ but stale 2025-07) | **BUILD** (wrap BMAD; no topology skill exists) |
| 3 | Prompt eng + eval harness | **promptfoo** (wrap as skill) | 22,943★, pushed 2026-07-05 | `npm i -g promptfoo && promptfoo init` | ckelsoe/prompt-architect (231★, prompt-shaping only) · Inspect AI (2,302★) | ADOPT (wrap) |
| 4 | MCP build + debug/test | **modelcontextprotocol/servers** + **/inspector** + **jlowin/fastmcp** | 88,089★ / 10,282★ / 25,981★ | `github.com/modelcontextprotocol/{servers,inspector}` · `pip install fastmcp` | jasonjmcghee/claude-debugs-for-you (512★) | ADOPT |
| 5 | Agent memory | **rohitg00/agentmemory** + **OthmanAdi/planning-with-files** | 24,589★ / 24,663★ | clone into `~/.claude/skills/` (verify install slug in README) | Anthropic CLAUDE.md conventions (native) | ADOPT (audit first) |
| 6 | KB construction | **safishamsi/graphify** (skill) or **run-llama/llama_index** (wrap) | 78,103★ / 50,660★ | graphify: clone repo · LlamaIndex: `pip install llama-index` | deepset-ai/haystack (25,829★) · coreyhaines31/marketingskills (36,371★, corpus method) | ADOPT (skill exists) |
| 7 | Agent eval / benchmarking | **promptfoo** golden-sets + **confident-ai/deepeval** | 22,943★ / 16,652★ | `promptfoo eval` · `pip install deepeval` | UKGovernmentBEIS/inspect_ai (2,302★) · anthropics/skills eval | ADOPT (wrap; no native skill) |
| 8 | Testing / TDD | **obra/superpowers** (red/green gates) + **nizos/tdd-guard** | 246,806★ / 2,241★ | Superpowers plugin · `github.com/nizos/tdd-guard` | mattpocock/skills TDD (157,394★ collection) | ADOPT |
| 9 | Deployment (CI + launchd/cron) | **anthropics/claude-code-action** (CI only) | 8,253★, pushed 2026-07-04 | `anthropics/claude-code-action` in workflow | GitHub Actions scheduled workflows | **BUILD** for launchd/cron (no credible skill) |
| 10 | Maintenance / regression | **langfuse** (observability) + **promptfoo** CI regression | 30,468★ / 22,943★ | `langfuse` self-host · `promptfoo` in CI | OpenTelemetry pipeline (per gemini, unverified specifics) | **BUILD** (wire observability; no maintenance skill) |
| 11 | Social-platform content opt. | **blacktwist/social-media-skills** (weak) or **coreyhaines31/marketingskills** (method only) | 305★ / 36,371★ | clone repo | Blotato MCP (credential-heavy, unverified) | **BUILD** (no credible per-platform algorithm skill; stales fast) |

**Phases requiring custom authoring (build-required):** 2 (architecture/topology), 9 (launchd/cron deployment), 10 (regression/maintenance wiring), 11 (per-platform optimization). Phases 6/7 are "wrap a library" rather than pure build. This matches claude-opus-4-7's "~7 of 11 need custom work" once you count wrap-vs-pure-build — his estimate was the most honest in the council.

## Skills flagged with criticism — survived vs cut

**SURVIVED (criticism noted, still adopt):**
- **Superpowers** — token-bloat / mega-framework overhead (grok-4-x-search, GPT-5, opus). SURVIVES: 246k★, active, but scope it; don't load all skills at once.
- **SuperClaude (23,490★)** — "too broad for a clean SDLC build" (GPT-5). SURVIVES as optional.
- **alirezarezvani/claude-skills (20,484★)** — large collection, per-skill audit burden, recall interference. SURVIVES for cherry-picking only.
- **ClaudePluginHub "ecc" (~214K★, 548 skills)** — extreme token bloat. SURVIVES as a reference, not a wholesale install.

**CUT (criticism fatal or claim unverifiable):**
- **grok-4's blanket "nothing exists"** — CUT (contradicted by 22 verified repos).
- **gemini's "AutoDream / dream native feature," "AMD Stella Laurenzo 7,000-session audit," "caveman 82.8k installs," "perf-benchmark," "MCP Setup Skill on rdoser13.workers.dev"** — CUT to appendix (unverifiable in-session; `grandamenium/dream-skill` exists at only 104★, far from "heavily adopted").
- **"245.3k installs, 13.7K forks/stars" (gemini Superpowers metrics)** — CUT as internally incoherent; replaced with verified 246,806★ / 21,898 forks.

## Appendix: rejected claims / addressed items (audit trail)

| # | Claim | Source | Classification | Rationale |
|---|---|---|---|---|
| 1 | Superpowers "229,000 stars, 20.4k forks" | perplexity:sonar-deep-research | CORROBORATED→corrected | Real repo; true count 246,806★ / 21,898 forks (gh-verified). Directionally right, number stale/low. |
| 2 | Superpowers "118k stars" | perplexity:sonar-reasoning-pro | CONTRADICTED | Confused with Spec-Kit's real 118,145. Superpowers is 246,806. |
| 3 | Superpowers "~247k" + v6.1.1 + July-2 commit | xai:grok-4-x-search | VERIFIED | gh-API exact match: 246,806★, v6.1.1 2026-07-02. Distinctive X-search freshness call. |
| 4 | "All 11 phases need custom authoring / nothing credible exists" | xai:grok-4 | CONTRADICTED | 22 repos verified live. Over-conservative to the point of false. Cut as non-informative. |
| 5 | alirezarezvani/claude-skills "5,200+ stars, 337 skills" | sonar-deep-research | CONTRADICTED (stale) | Live 20,484★ — the 5,200 figure is ~4x stale. Repo real. |
| 6 | planning-with-files "13,410 stars" | sonar-reasoning-pro (via Snyk) | CORROBORATED→corrected | Live 24,663★; the Snyk figure was a stale snapshot. |
| 7 | levnikolaevich delivery-workflow "82 stars" | sonar-reasoning-pro (via Snyk) | CORROBORATED→corrected | Live 510★. Real, modest. |
| 8 | SpillwaveSolutions/sdd-skill "64 stars" / active May-2026 | sonar-deep-research / gemini | CORROBORATED | Live 82★, last push 2025-11-17 (NOT May-2026 — gemini's freshness claim is stale). Thin; runner-up only. |
| 9 | agentmemory "53 tools, 100% top-5 hit, 2.2× precision vs grep" | sonar-deep-research | UNIQUE-unsupported (perf claims) | Repo VERIFIED 24,589★; the benchmark numbers are self-reported in README, not independently verified. Adopt repo, treat perf claims as vendor marketing. |
| 10 | Prompt Architect "27 frameworks, EMNLP 2025" | sonar-deep-research / -reasoning | VERIFIED (existence) | Repo real, 231★, MIT. Low adoption; niche pick. |
| 11 | mcp-debug skill (mcptools) — no repo URL given | sonar-deep-research / -reasoning | UNVERIFIED | No resolvable GitHub slug in report; could not verify. Use official modelcontextprotocol/inspector (10,282★) instead. |
| 12 | "ClaudePluginHub / ecc 548 skills, 226.1k installs" | gemini:2.5-pro | CORROBORATED (venue+scale) | WebSearch: ecc real (~214K★, 548 skills). Star/install split imprecise; hub is real. |
| 13 | "341 malicious skills Feb 2026 in community repos" | gemini:2.5-pro | CORROBORATED (venue corrected) | WebSearch: real ClawHub supply-chain attack (Atomic macOS Stealer); Snyk 76/3,984 flagged 2026-02-05. Venue was ClawHub, not generic. |
| 14 | "AMD Stella Laurenzo 7,000-session OTel audit" | gemini:2.5-pro | UNIQUE-unsupported | Could not verify in-session. Cut; OTel-for-regression as a general practice is plausible but this specific citation is unconfirmed. |
| 15 | "caveman 82.8k installs" / "AutoDream native /memory feature" | gemini:2.5-pro | UNIQUE-unsupported | `grandamenium/dream-skill` exists at only 104★ (not "heavily adopted"); native AutoDream unverified. Cut. |
| 16 | "245.3k installs, 13.7K forks/stars" (Superpowers) | gemini:2.5-pro | CONTRADICTED (incoherent) | Install/fork/star figures internally inconsistent. Replaced with verified 246,806★ / 21,898 forks. |
| 17 | safishamsi/graphify (KB skill) | gemini:2.5-pro | VERIFIED | 78,103★, MIT, confirmed KB-graph skill. Genuine distinctive find. |
| 18 | contains-studio/agents (architecture reference) | openai:gpt-5 | VERIFIED w/ freshness caution | 12,399★ but last push 2025-07-28 (~1yr stale). Real; freshness-flag for a 2026 build. |
| 19 | DeepEval slug `DeepEval/deepeval` | openai:gpt-5 (implied) | CONTRADICTED (slug) | 404. Correct slug `confident-ai/deepeval` (16,652★). |
| 20 | promptfoo / LlamaIndex / Haystack / FastMCP / Inspect-AI / claude-code-action | openai:gpt-5 + opus-4-7 | VERIFIED (all) | Live: 22,943 / 50,660 / 25,829 / 25,981 / 2,302 / 8,253★. The "wrap a mature library" frame is the strongest survivable synthesis. |
| 21 | blacktwist/social-media-skills / aaron-he-zhu/seo-geo | gemini / sonar | VERIFIED (existence, low signal) | 305★ / 59★. Real but weak; social-platform phase is BUILD-required regardless. |
| 22 | jasonjmcghee/claude-debugs-for-you | sonar-reasoning-pro | VERIFIED w/ caution | 512★, last push 2025-12-20 (VS Code + MCP debug). Real, modestly maintained. |
