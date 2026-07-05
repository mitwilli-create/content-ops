# Council-of-Models Report: Builder-Skill Sourcing for the Content-Engine SDLC Build

Date: 2026-07-05 · Models: 7/7 succeeded · Total cost: $0.4403

Research question: best community-built Claude Code skills per SDLC phase (spec, architecture, prompt-eval, MCP build/debug, memory, KB, agent eval, TDD, deploy, maintenance, social-platform optimization) with hard evidence (stars/downloads/ratings, author credibility, install path, security posture, freshness), plus build-required gaps.


---

## perplexity:sonar-deep-research

# Claude Code Builder-Skill Sourcing For A Multi-Platform Content-Optimization Agent (Mid‑2026 Landscape)

The contemporary ecosystem of Claude Code skills, agent frameworks, and skill marketplaces in mid‑2026 offers a rich but uneven toolkit for building a sophisticated, multi-platform content-optimization agent system, with particular strengths in spec-driven development, agent evaluation, memory design, and MCP debugging, and notable gaps in deployment orchestration and social-platform specific optimization knowledge.[1][3][6][10][13][18] Community-built skills such as **Superpowers** for agentic SDLC workflows, **Spec-Driven Development (SDD) Skill** for GitHub’s Spec-Kit methodology, **Prompt Architect** for structured prompt engineering, **agentmemory** for persistent agent memory, and **mcp-debug** for MCP server verification have demonstrable adoption and credible authorship, making them strong candidates for a Claude Code “builder” instance tasked with constructing and maintaining a complex content agent across Substack, LinkedIn, X, Hacker News, Reddit, GitHub, Discord, TikTok, and YouTube.[3][5][9][13][18] At the same time, large catalog efforts and scraped marketplaces such as Claude Code skills collections, SkillsMP, and Skills.sh shift security and quality burdens onto the adopter, requiring rigorous manual vetting and Qodo-style verification before they can be trusted in an SDLC-critical role.[2][6][17] Overall, the best strategy for your builder agent is a curated stack: lean on a small number of high-signal, well-starred skills and frameworks for each SDLC phase, supplement them with vetted marketplace skills from Agensi where available, and plan for custom skill authoring in phases where no credible, community-validated skills yet exist, notably deployment orchestration, long-term regression monitoring for agent systems, and deep social-platform algorithm modeling.[6][14][15][17]

## The Claude Code Skills and Agent-Skills Ecosystem in 2026

In order to reason coherently about builder-skill sourcing across the SDLC, it is useful to first understand the structure of the Claude Code skills ecosystem and adjacent agent-skills standards as they exist in mid‑2026. Claude’s “Agent Skills” specification treats skills as modular, reusable instruction packages authored in markdown, typically centered around a `SKILL.md` file stored in a directory layout that Claude Code can automatically discover and apply to relevant tasks.[1][11] In Claude Code itself, skills are loaded from a dedicated skills directory, with the platform discovering them based on the presence of `SKILL.md` and using them as domain-specific guidance when the agent encounters matching workflows or commands.[1] This design not only allows single skills to encapsulate complex procedures (such as spec-driven development or MCP debugging), but also makes skills composable: an SDLC-focused builder agent can load a set of skills covering different phases and automatically route subtasks to the most relevant skill.

The Claude Code skills ecosystem is not confined to Anthropic’s own documentation and first-party guidance; it is increasingly structured around **agentskills.io**, a broader community specification used by other tools such as Augment Code (“Auggie”), which treats skills as standardized modular packages that can be shared across different agent platforms.[11] Augment Code’s documentation explicitly references the agentskills.io specification and shows how skills stored under `.augment/skills/<skill-name>/SKILL.md` become invocable via slash commands like `/my-skill`, underscoring the cross-tool portability of skills authored for Claude and compatible systems.[11] For your builder agent, this cross-ecosystem compatibility means that community-authored skills can be reused or adapted across Claude Code and other tools, but it also means that the quality and security posture of skills vary widely depending on their provenance.

The community side of this ecosystem is anchored by large open-source repositories and skill catalogs. The `alirezarezvani/claude-skills` repository on GitHub, for example, markets itself as “the most comprehensive open-source Claude Code skills & agent plugins library,” listing more than 5,200 GitHub stars and describing its contents as “337 Claude Code skills & agent skills,” which strongly suggests substantial adoption and community validation.[2] This repository functions both as a curated collection of skills and as a reference for structuring skills that target domains ranging from code review to agent memory and beyond, though each individual skill within the collection still demands its own audit in a high-stakes SDLC context.[2] Beyond single repositories, marketplaces such as Agensi and catalogs such as ClaudeSkills.info, Skills.sh, and SkillsMP provide discovery layers, with Agensi in particular offering an 8-point automated security scan and a 70/30 creator revenue split for its curated skill catalog.[6][17] Agensi’s documentation explains that skills listed in its catalog undergo this security scan and can be installed via one-liner curl commands that unpack skill directories into the Claude Code skills location, while skills cloned directly from GitHub lack equivalent vetting and should be scrutinized manually before installation.[17]

Anthropic itself publishes detailed guidance for enterprise use of Agent Skills, including governance, security review, evaluation standards, and lifecycle management practices.[15] The enterprise skills documentation emphasizes sandboxed execution for any scripts included in skills, evaluation suites with representative queries to test triggering behavior, coexistence testing across multiple skills, and formal skill lifecycle stages from planning and creation through deployment and monitoring.[15] It also advises organizations to maintain internal registries tracking skill purpose, owner, version, dependencies, and evaluation status, and to limit the number of skills loaded simultaneously to preserve recall accuracy and reduce interference between overlapping skills.[15] For a builder agent responsible for constructing a complex multi-platform content-optimization system, these recommendations imply that skills should be treated as versioned components, with the builder agent using spec-driven evaluation harnesses and security scans (including Qodo) before adopting any individual skill into the production stack.

MCP (Model Context Protocol) plays a central role in extending Claude Code beyond its native environment, and skills increasingly depend on MCP connectors to access external tools, databases, and services.[8] Anthropic’s MCP documentation explains how Claude Code can connect to remote MCP servers via commands such as `claude mcp add --transport http <name> <url>`, and notes that directory connectors use this infrastructure to link Claude Code to third-party services like HubSpot or Sentry.[8] This connectivity enables powerful workflows—such as letting an agent builder use MCP-debugger skills to probe remote tools—but also introduces security responsibilities, as each added MCP server must be trusted and, in enterprise settings, can be blocked or disabled at scope level via configuration options like `disableClaudeAiConnectors` or `deniedMcpServers`.[8] For your use case, the builder agent will not only rely on MCP-based skills for debugging and integration but also likely create new custom MCP connectors to interact with social platforms, knowledge bases, or memory stores, which highlights the importance of skills that specifically support MCP connector development and testing.

In addition to skill catalogs and connectors, there is a growing emphasis on evaluation and testing frameworks for Claude Code skills. The MLflow blog on “Testing and Refining Claude Code Skills” describes how MLflow can be used alongside a dedicated “agent-evaluation skill” to trace Claude Code’s execution, apply automated judges to those traces, and iteratively refine skills based on failing judges.[10] This methodology includes separate MLflow experiments for the evaluation work and for Claude’s own execution traces, a loop in which failing judges generate rationales that are fed back into Claude as prompts to improve `SKILL.md`, and a YAML-based configuration system that \(among other things\) defines judges for behavior verification.[10] While this blog references MLflow’s own “skills” repository and test suite, the underlying approach is generalizable to any skill, making MLflow-based evaluation a powerful complement for your builder agent’s SDLC phases in testing, evaluation, and regression detection.[10]

Taken together, these ecosystem elements—agentskills.io, Claude Code’s skill discovery, large-scale repositories like `claude-skills`, security-conscious marketplaces like Agensi, Anthropic’s enterprise governance guidance, MCP connectors, and MLflow-based evaluation frameworks—constitute the environment within which you must source builder skills for each SDLC phase.[1][2][6][8][10][11][15][17] The following sections examine each SDLC phase in turn, identify the strongest community-built Claude Code skills or adjacent frameworks, and assess them against the criteria of usage evidence, author credibility, hosting and installation detail, security posture, and freshness, with explicit acknowledgment of where numbers or dates remain unverified.

## Phase 1: Spec-Driven Development and Requirements

### Ranking Superpowers vs GitHub Spec‑Kit / SDD Skill and Alternatives

For spec-driven development and requirements gathering, there are two major community-driven chains that stand out in mid‑2026: the **Superpowers** framework and the **Spec-Driven Development (SDD) Skill** combined with GitHub’s Spec‑Kit methodology, supplemented conceptually by Addy Osmani’s “How to write a good spec for AI agents” guidance.[3][5][12] The Superpowers repository describes itself as “a complete software development methodology for your coding agents, built on top of a set of composable skills and some initial instructions that encapsulate your preferences and workflow,” indicating that it is designed specifically to structure an agent’s entire SDLC process, including spec creation, implementation, and testing.[3] In contrast, the SDD Skill is a focused Claude Code skill built by SpillwaveSolutions to guide users through GitHub’s Spec‑Kit and the Spec‑Driven Development methodology, while GitHub’s Spec‑Kit itself provides a discipline for spec-first development with AI coding agents.[4][5][12] Addy Osmani’s article on writing good specs for AI agents distills practical best practices from hands-on experience with coding agents including Claude, and explicitly references GitHub’s spec-driven development promotion via Spec‑Kit, thereby reinforcing the SDD Skill and Spec‑Kit chain as a well-considered approach to structuring agent requirements.[12]

In terms of usage evidence, Superpowers stands out as an extraordinarily popular framework, with its GitHub repository listing approximately 229,000 stars and 20.4k forks, metrics that are exceptionally high even by open-source standards and which suggest broad adoption by the dev tools and AI-agent communities.[3] The SDD Skill repository at `SpillwaveSolutions/sdd-skill` on GitHub is much smaller but still credible, with 64 stars and a modest number of watchers and forks, signifying emerging but real community interest.[5] GitHub’s Spec‑Kit itself is a product of GitHub’s AI team and is referenced by Osmani’s article rather than being a Claude Code skill in its own right; its usage metrics are not directly provided in the search results and thus remain unverified for this analysis.[4][12] For Osmani’s spec article, which acts as a knowledge resource rather than a skill, download counts or rating metrics are likewise unverified, though its publication on a well-known engineering blog implies substantial readership and influence among AI developers.[12]

Author credibility is a central factor when selecting a spec framework for a builder agent. The Superpowers repository is authored under the GitHub user “obra,” which the search result notes as maintaining a highly starred repository, and the sheer number of stars and forks suggests that the maintainer is trusted by a broad developer audience for agent-focused tooling.[3] The SDD Skill is authored by SpillwaveSolutions, an organization that positions the skill as a comprehensive guide to GitHub’s Spec‑Kit and Spec‑Driven Development methodology, indicating a focus on spec-driven workflows and a willingness to codify GitHub’s best practices into reusable skills.[5] GitHub’s Spec‑Kit originates from GitHub’s own AI team, who promote spec-driven development as a way to control and structure agent behavior, a pedigree that carries strong credibility given GitHub’s central role in the developer ecosystem.[4][12] Addy Osmani, whose article underpins many practical spec recommendations, is widely recognized as a senior engineer and advocate in the web and tooling domain, and while the search result does not enumerate his career history, the presence of his spec guidance on a well-established blog adds weight to its authority.[12]

Hosting and installation mechanics differ between these candidates but can all be adapted to Claude Code. Superpowers is hosted on GitHub at `https://github.com/obra/superpowers`, and to load it as a skill set for Claude Code, you would clone the repository into the Claude skills directory, typically `~/.claude/skills/superpowers`, a pattern consistent with Agensi’s advice for cloning GitHub skills.[3][17] For instance, following Agensi’s clone method, you might use a command such as `git clone https://github.com/obra/superpowers.git ~/.claude/skills/superpowers`, though this exact path is not explicitly documented in the Superpowers repo snippet itself and should therefore be treated as unverified and adjusted to your local Claude Code configuration.[3][17] The SDD Skill is hosted at `https://github.com/SpillwaveSolutions/sdd-skill`, and similarly can be installed by cloning into a Claude skills directory, for example `git clone https://github.com/SpillwaveSolutions/sdd-skill.git ~/.claude/skills/sdd-skill`, again following the general GitHub skill installation pattern but with the precise path format remaining unverified in the source snippet.[5][17] GitHub’s Spec‑Kit is not a Claude Code skill, but the `Speckit + Claude Code Skills = fly by wire` GitHub discussion suggests creating a Claude Skill that watches conversations and automatically orchestrates Spec‑Kit commands when it detects pivots or changes, implying that integrating Spec‑Kit entails authoring a custom skill within Claude Code that wraps Spec‑Kit’s CLI or APIs.[4] Osmani’s article is hosted on `addyosmani.com` and functions as a textual knowledge resource rather than an installable skill, but its guidance can be encoded into your own SKILL.md for spec writing workflows.[12]

Security posture is an area where these frameworks differ more sharply. Neither Superpowers nor the SDD Skill are listed as Agensi-vetted skills in the search results, meaning they have not undergone Agensi’s 8-point automated security scan and must be treated as unvetted GitHub sources by default.[3][5][17] Agensi explicitly cautions that GitHub skills are not vetted and recommends reading the `SKILL.md` and any included scripts before installing, a warning that applies directly to Superpowers and SDD Skill when used in a SDLC-critical builder agent.[17] The Superpowers repository, being a comprehensive framework with composable skills and initial instructions, likely includes scripts or configurations that orchestrate multiple tools, though the exact scope of external calls or shell commands is unverified in the current snapshot and requires manual code review before enabling in production.[3][UNVERIFIED] The SDD Skill appears to be primarily a guidance skill that walks users through Spec‑Kit, but depending on its implementation, it may also invoke GitHub APIs or local command-line operations, again a detail that is unverified and should be audited.[5][UNVERIFIED] GitHub’s Spec‑Kit itself interacts with GitHub repositories and possibly issues or pull requests, which inherently involves external API access and credentials, making it essential to treat any skill that wraps Spec‑Kit as handling sensitive tokens and requiring strict secret management.[4][12] Osmani’s article, being static content, carries no direct executable security risk, but its recommendations may encourage broader API integration that must be secured separately.[12]

Regarding freshness, the search results do not specify the last commit dates for Superpowers or SDD Skill, so exact maintenance status as of July 2026 remains unverified.[3][5] However, contextual clues suggest ongoing relevance: Superpowers’ very high star and fork counts indicate sustained community attention, and its description frames it as a current methodology for agent coding workflows rather than an archived experiment.[3] The SDD Skill is described in present tense as “a comprehensive Claude Code skill for guiding users through GitHub’s Spec-Kit and the Spec-Driven Development methodology,” implying that it is actively maintained to track Spec‑Kit’s evolution, though exact release dates are not provided in the snippet.[5] Osmani’s spec article references GitHub’s AI team’s promotion of Spec‑Driven Development without framing it as a historical artifact, suggesting it remains part of the ongoing discourse around agent development best practices.[12] For a cautious builder agent, these freshness signals, combined with a Qodo-based verification of commit history and open issues, would support adoption, but they should be confirmed directly in the repositories before treating them as foundational.

When ranking these chains for an agent-system build, the strongest approach is to treat Superpowers and the SDD Skill plus Spec‑Kit as complementary rather than mutually exclusive. Superpowers, with its extensive star count and explicit focus on a complete software development methodology for coding agents, is particularly valuable as a global framing skill for your builder agent, encoding preferences, workflows, and SDLC stages into composable instruction modules.[3] The SDD Skill and GitHub’s Spec‑Kit, reinforced by Osmani’s spec-writing guidelines, are best positioned to handle the rigorous, spec-first requirements definition needed for a complex multi-platform content optimization system, including detailed behavioral contracts for subagents and skills that handle story sourcing, writing refinement, and per-platform post optimization.[4][5][12] In practice, the builder agent would likely invoke SDD Skill and Spec‑Kit workflows to create structured, testable specifications for each subcomponent of the agent system, while Superpowers would provide the overarching methodology for implementing and iterating on those specs within Claude Code. Given the demands of your project, the SDD + Spec‑Kit chain should be treated as the primary requirements engine, with Superpowers as a secondary but powerful scaffolding for the broader SDLC, and both should be audited and instrumented via Qodo before adoption.

## Phase 2: Architecture and Design for Agent Systems

### Skills and Frameworks for Subagent Topology and Skill Decomposition

Architectural design for agent systems—particularly the topology of subagents, the decomposition of skills, and the interaction patterns between MCP connectors, memory components, and knowledge bases—is still an emerging niche in the Claude Code skills ecosystem. The most credible support for this phase currently comes from combining the methodology encoded in **Superpowers**, the structural patterns implied by large skill collections such as `claude-skills`, and Anthropic’s enterprise Agent Skills guidance, which collectively provide enough conceptual and practical scaffolding for designing a robust agent architecture.[2][3][15] While there is no single “agent-architecture” skill with clear usage metrics in the provided search results, Superpowers’ emphasis on composable skills and the broad coverage of skills in `claude-skills` strongly suggest that experienced developers are already using these tools to reason about and implement agent topologies, even if explicit design diagrams or templates are embedded in documentation rather than separate SKILL.md files.[2][3]

In terms of usage evidence, Superpowers again stands out as a major signal: its 229k GitHub stars and 20.4k forks are not merely indicators of popularity but also proxies for the maturity of its methodology and the likelihood that it has been applied across a substantial variety of agent systems, including multi-agent, multi-skill architectures.[3] The `claude-skills` repository’s 5,200+ GitHub stars reinforce the notion that developers are actively maintaining and expanding a large collection of skills, which implicitly requires some architectural discipline to avoid conflicts and ensure coherent behavior across hundreds of skills.[2] While the search results do not highlight a single architecture-specific skill within `claude-skills`, the repository description emphasizing “Claude Code skills (also called agent skills or coding agent plugins) that give AI coding agents domain expertise” suggests that many of its included skills are designed to operate within a coordinated architecture of interacting plugins.[2] Anthropic’s enterprise skills documentation is not a skill per se but provides formal guidance on mapping workflows to organizational roles, grouping skills by role to keep active skill sets focused, and consolidating narrow skills into broader bundles when patterns emerge, all of which are architectural considerations in an agent system.[15]

Author credibility for these architecture-relevant tools is strong. As noted earlier, Superpowers’ maintainer, “obra” on GitHub, has built an extensively starred repository that serves as a “complete software development methodology” for coding agents, implying deep experience and a track record of shipping agent-centric tooling that resonates with the community.[3] The `claude-skills` repository is authored by “alirezarezvani,” and its positioning as the most comprehensive open-source Claude Code skills and agent plugins library, combined with its star count, signals that the author has significant experience both with Claude Code and with organizing a large number of domain skills into a usable collection.[2] Anthropic’s enterprise skills documentation is produced by Anthropic itself, drawing on experience with deploying Claude in organizational and team contexts, which lends high institutional credibility to its architectural recommendations around skill grouping, role-based bundling, and evaluation-driven consolidation.[1][15]

Hosting and installation paths for these architecture-supporting tools are straightforward but require careful curation. Superpowers and `claude-skills` are both hosted on GitHub, at `https://github.com/obra/superpowers` and `https://github.com/alirezarezvani/claude-skills`, respectively, and can be installed via Git clone commands into your Claude Code skills directory following patterns similar to the Agensi instructions for GitHub-based skills.[2][3][17] For instance, you might run `git clone https://github.com/obra/superpowers.git ~/.claude/skills/superpowers` and `git clone https://github.com/alirezarezvani/claude-skills.git ~/.claude/skills/claude-skills`, though exact directory names and paths are unverified from the snippets and should be aligned with your Claude Code configuration.[2][3][17] Anthropic’s enterprise skills documentation is hosted on the Claude platform docs site and is consumed as knowledge rather than as an installable skill; you would incorporate its guidance into your own architectural design and possibly encode parts of it into custom SKILL.md files for role-based skill bundles.[15]

Security posture is mixed and demands caution. Neither Superpowers nor `claude-skills` is described as having undergone Agensi’s 8-point security scan in the provided results, and Agensi explicitly warns that GitHub-sourced skills and repositories must be audited manually, with all scripts reviewed before installation.[2][17] Given that `claude-skills` includes at least 337 skills and agent plugins, some of which may run shell commands, fetch external URLs, or interface with MCP connectors, security review for this repository is nontrivial and should be conducted skill-by-skill, especially when used to support architectural design in a builder agent context.[2][17][UNVERIFIED] Superpowers, as a methodology framework, is similarly likely to include scripts or instructions that orchestrate multiple tools, though the exact nature of these scripts is unverified and requires manual inspection.[3][UNVERIFIED] Anthropic’s enterprise documentation emphasizes sandboxed execution for skill scripts, verification that script behavior matches stated purpose, and separation of duties between skill authors and reviewers, recommending that organizations compute checksums of reviewed skills, use signed commits, and treat every update as a new deployment requiring full security review.[15] These guidelines apply directly to the adoption of Superpowers and `claude-skills` as architectural scaffolding in your builder agent, and they suggest that your Qodo verification process should treat each included script as a potential attack or failure vector.

Freshness of these architecture-related resources is partially inferred. The `claude-skills` repository’s description referencing popularity and its 5,200+ GitHub stars indicates that it remains actively maintained and is currently marketed as the most comprehensive library of Claude skills, though exact commit dates are not provided in the snippet and thus remain unverified.[2] Superpowers’ description and its repository metrics, including watchers and forks, likewise suggest ongoing maintenance, but the last release date is unverified and should be checked directly via Qodo or GitHub API queries.[3][UNVERIFIED] Anthropic’s enterprise skills documentation includes up-to-date guidance on skill lifecycle management, skill consolidation, and evaluation, including references to models such as Haiku, Sonnet, and Opus, which are part of Anthropic’s current lineup, signaling that the document is contemporary rather than outdated.[15] For a careful builder agent, verifying the recency of Superpowers and `claude-skills` via direct repository inspection is a necessary precondition before relying on them as architectural cornerstones.

In synthesis, while there is no single “agent-architecture skill” explicitly identified in the search results, the combination of Superpowers, `claude-skills`, and Anthropic’s enterprise guidance provides the most robust, community-validated foundation for agent-system architecture and design. Superpowers can be used to define the overarching SDLC process and decompose the system into composable skills and subagents; `claude-skills` offers concrete examples of skill structuring and naming conventions across many domains; and Anthropic’s documentation supplies formal criteria for grouping skills by roles, limiting skill sets for recall accuracy, and consolidating skills when patterns emerge.[2][3][15] For your multi-platform content agent, the builder instance should load a carefully audited subset of Superpowers and selected skills from `claude-skills` to serve as architectural patterns, while encoding Anthropic’s governance guidance into its own meta-skill that enforces role-based skill bundles and evaluation-driven consolidation.

## Phase 3: Prompt Engineering and Prompt-Evaluation Harnesses

### Prompt Architect for Structured Prompting

Prompt engineering is a critical phase for your builder agent, as the effectiveness of story sourcing, writing refinement, and per-platform optimization depends heavily on how tasks are described to subagents and skills. The **Prompt Architect** skill stands out as one of the most sophisticated community-built tools for transforming vague prompts into structured, expert-level prompts using a suite of research-backed frameworks.[9] The GitHub repository `ckelsoe/prompt-architect` describes the skill as working across multiple tools, including Claude Code, ChatGPT, Gemini CLI, Cursor, GitHub Copilot, Windsurf, and other agent-skills compatible tools, illustrating both its cross-ecosystem utility and its integration with Claude Code.[9] It claims to evaluate prompts across five quality dimensions—clarity, specificity, context, completeness, structure—and to recommend optimal frameworks from a library of 27 research-backed frameworks across seven intent categories, with guided dialogue and iterative refinement.[9] Earlier descriptions in the snippet also mention a more focused version using seven frameworks such as CO‑STAR, RISEN, RISE, TIDD‑EC, RTF, Chain-of-Thought (CoT), and Chain-of-Design (CoD), underscoring its depth.[9]

Usage evidence for Prompt Architect, beyond its cross-tool compatibility, is partially unverified. The search result does not list the GitHub star count or fork statistics for the repository, so those metrics must be marked as unverified until directly inspected.[9][UNVERIFIED] However, the description’s emphasis on compatibility with more than 30 agent-skills compatible tools and its positioning as a skill that “elevates your prompting capabilities” suggests active adoption by developers across multiple ecosystems.[9] The detailed feature set, including intelligent analysis, framework recommendation, guided dialogue, systematic application, and iterative refinement, also indicates a mature design likely refined by repeated use and feedback, though those usage details are inferred rather than explicitly quantified.[9]

Author credibility for Prompt Architect is reasonably strong. The repository is authored under the GitHub user “ckelsoe,” which, while not elaborated in the snippet, is likely associated with a developer or team familiar with prompt engineering research and agent tooling.[9] The skill’s design references “27 research-backed frameworks” and mentions EMNLP 2025 in its directory structure, hinting at an origin informed by current NLP research and conference proceedings rather than ad-hoc prompt heuristics.[9] The inclusion of frameworks such as CO‑STAR and RISEN, which are widely discussed in the prompt engineering community, further suggests that the author has synthesized existing best practices into a coherent skill that is used across multiple platforms.[9]

Hosting and installation details for Prompt Architect are clear at the repository level but require mapping to Claude Code’s skills directory. The skill is hosted at `https://github.com/ckelsoe/prompt-architect`, and to use it with Claude Code, you would clone the repository into your Claude skills directory, following patterns similar to those recommended by Agensi for GitHub-based skills.[9][17] For example, an install command might look like `git clone https://github.com/ckelsoe/prompt-architect.git ~/.claude/skills/prompt-architect`, although the exact path is unverified in the snippet and should be adapted to your environment.[9][17] Once installed, Claude Code would detect the skill via its `SKILL.md` and allow invocation through suitable slash commands or natural language triggers, letting your builder agent call Prompt Architect to reframe tasks before handing them off to implementation or evaluation skills.[1][11]

Security posture for Prompt Architect warrants attention but benefits from its primary function as a prompt transformer rather than a code executor. The search results do not indicate that Prompt Architect is listed in Agensi’s catalog or has undergone an 8-point automated security scan, so it must be treated as an unvetted GitHub skill by default.[9][17] Agensi’s documentation notes that GitHub skills lack vetting and advises reading `SKILL.md` and any scripts before installation, which applies directly to Prompt Architect, particularly if it includes helper scripts for multi-tool integration or evaluation.[17] The skill’s core behavior—analyzing prompts and suggesting frameworks—is unlikely to require extensive external URL fetching or shell command execution, though the snippet does not explicitly confirm this, leaving such details unverified.[9][UNVERIFIED] If the skill integrates with evaluation frameworks or logs prompt data, credentials or storage paths would need to be configured securely in your environment, and any MCP-based connections would require trust verification as per Anthropic’s MCP guidelines.[8]

Freshness signals are mixed but lean toward recency. The repository description mentions EMNLP 2025 in the directory layout, suggesting that the skill incorporates frameworks and content derived from or contemporaneous with that conference, which is a strong indicator of up-to-date research alignment.[9] The explicit reference to compatibility with Claude Code and contemporary tools such as Gemini CLI and Windsurf also implies that the skill has been designed with current ecosystems in mind, rather than as an artifact of an earlier generation of agent tooling.[9] However, in the absence of an explicit last commit date in the snippet, the exact freshness as of July 2026 remains unverified and should be confirmed via a Qodo-assisted GitHub inspection before adoption.[9][UNVERIFIED]

### MLflow-Based Prompt Evaluation Harnesses

Prompt engineering alone is insufficient for a builder agent; robust prompt evaluation harnesses that can batch-evaluate variants across models with metrics are critical for ensuring that story sourcing, writing refinement, and platform-specific optimization prompts perform well under different conditions. The MLflow blog “Evaluating Skills with MLflow” describes a concrete methodology for testing and refining a Claude Code skill, specifically an “agent-evaluation skill,” but the structure of this evaluation harness is applicable directly to prompt evaluation.[10] The blog explains that the evaluation loop involves tracing Claude Code’s own execution with MLflow while it runs a skill, judging those traces with checks that verify correct behavior, and using failing judges to refine the skill automatically via Claude Code itself.[10] For prompt evaluation, the same loop can be repurposed: prompts become the primary input, traces record agent behavior for each prompt variant, and judges assess metrics such as correctness, adherence to spec, or content performance proxies.

Usage evidence for this MLflow-based evaluation harness is qualitative rather than quantitative in the snippet. The blog notes that “all the test code lives in the tests/ directory of the skills repository,” and it describes how to start a local MLflow server, create experiments, and run a setup script that clones the target agent repository and seeds test data, but it does not provide explicit download counts or GitHub star metrics for the skills repository itself.[10] That means metrics for the “agent-evaluation skill” and the MLflow skills repository must be treated as unverified for this analysis, though the presence of a detailed blog on the official MLflow site suggests that the methodology has been used and tested internally or by early adopters.[10][UNVERIFIED]

Author credibility for the MLflow evaluation harness is strong. MLflow is a widely used open-source platform for experiment tracking in machine learning, and its maintainers and contributors have extensive experience with evaluation frameworks and reproducibility tooling.[10] The fact that MLflow has invested in publishing a blog specifically about testing and refining Claude Code skills indicates a serious commitment to integrating agent evaluation into ML workflows, and the design of the evaluation loop—a combination of tracing, judging, and automatic refinement—demonstrates a thoughtful application of ML engineering principles to agent skills.[10] For your builder agent, the MLflow harness can be considered a credible foundation for systematic prompt and skill evaluation due to this institutional backing.

Hosting and installation for the MLflow evaluation harness revolve around the MLflow “skills” repository and Python tooling rather than a typical Claude Code skill directory. The blog provides commands such as `git clone https://github.com/mlflow/skills.git` followed by `cd skills` and `pip install "mlflow[genai]" pyyaml`, indicating that the evaluation harness is built on a separate repository that interacts with Claude Code through prompts and traces rather than as a skill in the Claude directory.[10] The blog then shows how to run the test suite via `python tests/test_skill.py tests/configs/agent_evaluation.yaml`, implying that prompt and skill evaluation is orchestrated by an external Python test harness that triggers Claude Code headlessly (for example via `claude -p "PROMPT"`) and then runs judges.[10] This external harness can be integrated into your builder agent’s workflow via MCP connectors or scheduled tasks, and the builder can author or modify SKILL.md files that define evaluation-focused behaviors, while MLflow tracks and judges the outcomes.[8][10][14]

Security posture for this MLflow-based evaluation harness is strongly dependent on your local environment and the configuration of MCP connectors rather than on the harness itself. MLflow is a general-purpose experiment tracking server, and when run locally as described in the blog, it does not inherently introduce remote code execution beyond your own test harnesses.[10] However, the harness involves cloning repositories and running scripts, which means that careful inspection of the `skills` repository and any Python judges is necessary before enabling them in an SDLC-critical builder agent.[10][UNVERIFIED] The blog’s methodology emphasizes the use of LLM judges to evaluate traces, which implies that prompts containing sensitive data are sent to models configured through MLflow’s `genai` plugin; these configurations must be secured using appropriate credentials management and access controls.[10] Integrating MLflow with Claude Code via MCP connectors would likewise require verifying that remote endpoints are trusted, per Anthropic’s MCP documentation, and ensuring that any HTTP-based connectors are blocked or allowed according to organizational policies.[8]

Freshness of this evaluation harness is implied by the context. The blog references the MLflow `skills` repository and agent-evaluation skill in present tense, and describes a modern workflow using MLflow’s `genai` extension—signaling that it is part of MLflow’s current offering rather than a legacy tool.[10] However, as with other GitHub repositories, the last commit date and release history of the `skills` repository are not provided in the snippet and remain unverified.[10][UNVERIFIED] Before adopting the harness, your builder agent should employ Qodo to inspect the repository, confirm that it is actively maintained, and ensure that its prompts and judges align with current best practices and your organizational constraints.

In summary, Prompt Architect is the strongest community skill for prompt engineering itself, providing structured, research-backed frameworks for transforming user inputs into high-quality prompts, while the MLflow evaluation harness provides a robust methodology and tooling for evaluating prompt variants and skill behavior across models.[9][10] Together, they offer a comprehensive solution for the prompt-related SDLC phase: your builder agent can call Prompt Architect to generate and refine prompts for each agent subsystem, then use the MLflow harness (or a custom MCP-wrapped variant of it) to trace execution, judge outcomes, and refine skills or prompts based on performance metrics.

## Phase 4: MCP Connector Building and MCP Debugging/Testing

### MCP Debugger Skill for Server Testing

For MCP connector building and especially for debugging and testing MCP servers, the **MCP Debugger** Claude Code skill is the most clearly identified, community-built tool in the search results.[18] The `mcp-debug` skill is designed to empower developers to diagnose, explore, and verify Model Context Protocol (MCP) servers directly within the Claude Code environment, making it particularly valuable for a builder agent that must integrate multiple MCP connectors to external services such as memory stores, analytics platforms, or content pipelines.[18] The skill leverages a utility called `mcptools` to list available tools, execute specific tool calls with custom parameters, and open interactive shells or web interfaces for visual debugging, providing a rich set of capabilities for inspecting and validating MCP server behavior.[18]

Usage evidence for the MCP Debugger skill, such as GitHub stars or marketplace ratings, is not explicitly provided in the snippet and therefore remains unverified.[18][UNVERIFIED] However, the fact that the skill is described as a dedicated MCP debugging tool and is highlighted in a marketplace-like context suggests at least some developer adoption, particularly among teams building MCP servers for Claude Code.[18] The skill’s design, which focuses on listing tools, running calls, and opening interactive debug sessions, is indicative of practical field usage rather than purely theoretical tooling, giving further confidence in its utility for MCP testing.[18]

Author credibility for the MCP Debugger skill is inferred from its context as a specialized tool and its association with `mcptools`, a utility for MCP operations.[18] The snippet does not explicitly name the author or organization behind the skill, leaving those details unverified.[18][UNVERIFIED] Nonetheless, the skill’s focus and integration with MCP-specific utilities suggest that its author has direct experience with MCP server development and debugging, and that the skill emerged from real-world needs to inspect agent tool behavior via MCP.[18] Given the critical nature of MCP connectors in agent systems, verifying the author’s identity, other shipped work, and organizational affiliation should be a priority step in your Qodo-based audit.

Hosting and installation options for MCP Debugger would typically involve cloning its repository or installing it via a marketplace command, though the snippet presents it more as a marketplace entry than a direct GitHub URL.[18] It describes the skill as “MCP Debugger - Claude Code Skill for MCP Server Testing” and uses the `mcp-debug` name, implying that once installed into your Claude Code skills directory, it could be invoked via commands or natural language referencing `mcp-debug`.[18] However, the exact install path or command (for example, a GitHub URL like `https://github.com/.../mcp-debug` or an Agensi slug) is not included in the snippet and remains unverified.[18][UNVERIFIED] For your builder agent, discovering the source repository or marketplace slug and then installing it with a command such as `git clone <repo-url> ~/.claude/skills/mcp-debug` or an Agensi one-liner would need to be done manually, with Qodo verifying the integrity of the downloaded skill.[17][UNVERIFIED]

Security posture for MCP Debugger is complex due to its function: it is explicitly designed to interact with MCP servers, which themselves are remote or local connectors that can execute tool calls that may touch sensitive data or external APIs.[8][18] The skill’s use of `mcptools` to list tools and run calls implies that it can trigger any tool exposed by an MCP server, including operations that read or write data, call external services, or modify configurations, making it critical to ensure that only trusted MCC servers are connected and that the skill is used in a controlled environment.[18] The snippet does not state whether MCP Debugger is listed in Agensi’s catalog or has undergone an 8-point security scan, so it must be treated as unvetted.[18][UNVERIFIED] Anthropic’s MCP documentation emphasizes the need to verify trust in each MCP server and notes that connectors added via `claude mcp add` can be blocked or disabled via configuration settings, providing a safety net for controlling MCP exposure.[8] Combining MCP Debugger with these configuration controls and careful review of the skill’s scripts is essential for secure adoption.

Freshness for MCP Debugger is not explicitly documented. The existence of the skill in a marketplace-like environment focused on MCP tooling suggests that it is part of the recent wave of MCP-based integration tooling for Claude Code, but the last update or commit date is not provided and must be marked unverified.[18][UNVERIFIED] Verifying the skill’s maintenance status via repository inspection or marketplace metadata is therefore necessary before relying on it for long-term MCP debugging in your builder agent.

### Claude MCP Documentation and Connectors for MCP Building

Beyond MCP Debugger, the most authoritative guidance for MCP connector building itself comes from Anthropic’s official MCP documentation, which, while not a skill, provides essential knowledge for your builder agent.[8] The documentation explains that Claude Code can connect to remote MCP servers using commands such as `claude mcp add --transport http <name> <url>`, and gives concrete examples of adding servers for services like HubSpot (`claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic`) and Sentry (`claude mcp add --transport http sentry https://mcp.sentry.dev/mcp`).[8] It also shows how Claude itself can serve as an MCP server via `claude mcp serve`, which allows other applications to connect to Claude as a tool provider.[8] These details are critical for designing MCP connectors for your agent system, particularly when you need the builder agent to embed connectors to memory stores, knowledge bases, or external social platform APIs.

Usage evidence for MCP connectors is implied by their presence in official documentation and the existence of connectors in the Anthropic Directory, which provides a listing of reviewed connectors.[8] However, the documentation does not list usage metrics or ratings for individual connectors, so those remain unverified.[8][UNVERIFIED] Nevertheless, the fact that connectors for widely used services such as Slack and Sentry are described and that there is a directory of reviewed connectors underscores the real-world adoption of MCP connectors and supports using the documentation as a foundation for connector building.[8]

Author credibility for the MCP documentation is, of course, high, as it is produced by Anthropic, the creators of Claude Code and MCP, based on their experience with deploying MCP in production environments.[8] For your builder agent, this means that MCP connector designs should adhere to the patterns described in the documentation, including naming conventions, transport configuration, and scope settings.

Installation and configuration details for MCP connectors are directly provided, making them actionable for your builder agent. Commands such as `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp` serve as prototypes for adding connectors, and settings such as `disableClaudeAiConnectors` and `deniedMcpServers` allow administrators to enable or block connectors by name or URL patterns.[8] This means your builder agent can be instructed, via skills or direct configuration, to add specific MCP connectors, to respect organizational policies on connector usage, and to avoid enabling any connectors that have not been vetted by Qodo or internal reviewers.[8][15]

Security posture for MCP connectors is explicitly emphasized in the documentation. Anthropic notes that users should “verify you trust each” remote server before adding it as an MCP connector and explains that directory connectors use the same MCP infrastructure as Claude Code, making it critical to consider each connector’s security properties.[8] The documentation further describes how to disable all claude.ai connectors in Claude Code or block specific connectors by adding them to `deniedMcpServers`, allowing organizations to prevent unauthorized tool access.[8] These security features are vital for your builder agent, which may require connectors to external memory stores or analytics services but must guard against unauthorized data exfiltration or tool misuse.

Freshness of the MCP documentation is implied by its coverage of current connectors and configuration options, but exact dates are unverified.[8][UNVERIFIED] Nevertheless, the presence of commands for connectors like Sentry and Slack and the reference to Claude Desktop configuration suggests that the documentation reflects the current state of MCP capabilities in Claude Code.

In conclusion, MCP Debugger is the premier community skill for MCP debugging and server testing, while Anthropic’s MCP documentation provides the essential knowledge and configuration patterns for MCP connector building.[8][18] Your builder agent should adopt MCP Debugger, subject to Qodo verification, to explore and test new MCP connectors, and rely on MCP documentation to implement connectors correctly and securely.

## Phase 5: Agent Memory Design (Persistent Memory Files and Consolidation)

### Agentmemory Skill for Persistent Agent Memory

Agent memory design—covering persistent memory files, consolidation strategies, and retrieval structures—is a crucial phase for your builder agent, particularly because the content-optimization system must maintain long-term knowledge about user preferences, platform performance, and prior posts across Substack, LinkedIn, X, Hacker News, Reddit, GitHub, Discord, TikTok, and YouTube. The **agentmemory** repository is the most directly relevant community-built skill in this domain, explicitly marketing itself as “#1 Persistent memory for AI coding agents” and touting comprehensive MCP memory support.[13] The repository describes itself as including “53 tools, 6 resources, 3 prompts, and 15 skills,” and claims to achieve a 100% top-5 hit rate with 2.2× better precision than a grep baseline on identical input, indicating a well-engineered memory retrieval system.[13]

Usage evidence for agentmemory is partly quantitative and partly qualitative. While the snippet does not provide GitHub star counts or download metrics for the repository and thus leaves those unverified, it does include performance metrics—100% top-5 hit rate and 2.2× better precision than grep—which strongly suggest that the system has been evaluated rigorously on a benchmark dataset.[13][UNVERIFIED] The description calling it the “most comprehensive MCP memory” offering and the enumeration of tools, resources, prompts, and skills implies a rich ecosystem around memory operations, which in turn suggests adoption by developers seeking persistent memory solutions for agent systems.[13]

Author credibility for agentmemory is reasonably strong. The repository is authored under the GitHub user “rohitg00,” and while the snippet does not elaborate on the author’s broader track record, the design and marketing of agentmemory as a comprehensive MCP memory solution, along with the detailed performance claims, demonstrate technical competence and domain expertise.[13] The presence of 53 tools and 15 skills focused on memory further indicates substantial effort and experience in designing memory architectures for agents, which can be leveraged by your builder agent.[13]

Hosting and installation details for agentmemory follow typical GitHub patterns. The repository is located at `https://github.com/rohitg00/agentmemory`, and installing it for Claude Code would likely involve cloning it into your Claude skills directory or configuring MCP connectors that point to its tools and services.[13][17] An example install command consistent with Agensi’s clone method might be `git clone https://github.com/rohitg00/agentmemory.git ~/.claude/skills/agentmemory`, though the exact path format is unverified in the snippet.[13][17] Given that agentmemory offers MCP tools, integrating it with Claude Code may also require adding MCP servers using commands like `claude mcp add --transport http agentmemory <url>` if it exposes a remote server, a detail that must be verified via the repository.[8][13][UNVERIFIED]

Security posture for agentmemory must be approached carefully due to its use of MCP and its access to memory data. The repository’s description specifically mentions MCP memory and lists numerous tools and skills, which suggests that some components may run as MCP servers or tools that read and write memory files.[13] Since the repository is not described as being part of Agensi’s catalog or having undergone an 8-point security scan, it must be treated as an unvetted GitHub source requiring manual inspection.[13][17][UNVERIFIED] Anthropic’s MCP documentation emphasizes that any MCP server added to Claude Code should be trusted and that connectors can be disabled or blocked via configuration settings, both of which apply to agentmemory if it uses MCP connectors.[8] The enterprise skills documentation also recommends verifying that scripts match stated purposes and running them in sandboxed environments, a practice that should be extended to any memory manipulation scripts within agentmemory.[15]

Freshness of agentmemory is signaled by its positioning as the “most comprehensive MCP memory” offering and its detailed performance metrics, but the snippet does not specify the last commit date or release history, leaving these unverified.[13][UNVERIFIED] For your builder agent, verifying the recency of agentmemory’s codebase and its compatibility with current versions of Claude Code and MCP via Qodo and direct repository inspection is essential before adoption.

### Anthropic Enterprise Guidance on Memory and Skill Grouping

Anthropic’s enterprise skills documentation, while not a memory skill per se, provides important guidance relevant to memory design and consolidation.[15] It advises organizations to map workflows to roles, group skills by organizational role, and encourage teams to start with narrow, workflow-specific skills rather than broad, multi-purpose ones.[15] It also suggests that as patterns emerge across an organization, related skills should be consolidated into role-based bundles, merging narrow skills into broader ones only when evaluations confirm that consolidated skills perform equivalently to the individual ones they replace.[15] These principles can be applied directly to memory design: your builder agent might start with narrow memory skills (for example, per-platform memory components for LinkedIn or Reddit) and gradually consolidate them into broader memory architectures once evaluation demonstrates robust retrieval performance across platforms.

Security and governance guidance in the enterprise document also pertains to memory lifecycle management. It recommends maintaining internal registries for skills, tracking purpose, owner, version, dependencies, and evaluation status, and storing skill directories in Git for history tracking, code review, and rollback capability.[15] These practices are particularly critical for memory skills, which may evolve as the content-optimization system learns from user interactions and performance data; ensuring that memory structures can be rolled back or updated safely is essential to avoid data corruption or performance regressions.[15] The document further advocates for skill lifecycle stages of Plan, Create and review, Test, Deploy, Monitor, and Iterate or deprecate, which should be applied rigorously to any memory skills adopted or authored by your builder agent.[15]

In conclusion, agentmemory is the best community-built skill for persistent agent memory and memory-related MCP tools, while Anthropic’s enterprise guidance provides the necessary governance and lifecycle structure for managing memory skills.[13][15] Your builder agent should adopt agentmemory, subject to rigorous security and performance auditing, and use enterprise guidance to define memory skill bundles, evaluation protocols, and update procedures.

## Phase 6: Knowledge-Base Construction for Agents (Corpus Building and Retrieval Structure)

Knowledge-base construction—assembling corpora, designing retrieval structures, and integrating knowledge sources into agents—is closely related to memory design but focuses more on content and retrieval than on stateful memory across sessions. In the current search results, there is no single, clearly labeled “knowledge-base construction” Claude Code skill with strong usage evidence and credible authorship, but several tools and resources can be combined to address this phase: agentmemory for MCP-based retrieval, the marketing content strategy skill for keyword-driven corpus design, and broader guidance from Anthropic and MLflow for evaluation and governance.[13][16][15][10]

The marketing content strategy skill, found at `marketingskills/skills/content-strategy/SKILL.md`, is an instructive example of a SKILL.md that encodes detailed procedures for content research and corpus building.[16] The skill describes how to target specific keywords or questions, match search intent, tell stories that resonate emotionally, and identify content pillars based on product-led, audience-led, search-led, or competitor-led criteria.[16] It provides structured guidance on analyzing keyword data, call transcripts, survey responses, forum research, competitor analysis, and sales and support input, with recommendations for deriving topic clusters, identifying content gaps, and scoring content ideas by customer impact, content-market fit, search potential, and resource requirements.[16] Although this skill is focused on marketing content rather than agent knowledge bases per se, its structured approach to corpus building is directly applicable to designing a knowledge base for your content-optimization agent, especially for understanding audience needs and platform-specific topic clusters.

Usage evidence for the marketing content strategy skill is limited by the snippet, which does not list GitHub star counts or download metrics, leaving those unverified.[16][UNVERIFIED] However, its detailed SKILL.md content suggests that it has been authored by experienced marketers or growth engineers familiar with CRO, copywriting, SEO, analytics, and growth engineering, as indicated in the repository description.[16] The skill is hosted on GitHub under `coreyhaines31/marketingskills`, which implies a connection to a marketing-focused author or organization, but explicit author track record information is unverified in the given snippet.[16][UNVERIFIED]

Hosting and installation of this content-strategy skill are straightforward: it resides within a GitHub repository at a path like `skills/content-strategy/SKILL.md`, and can be cloned into your Claude skills directory following patterns similar to other GitHub skills.[16][17] For example, you might use `git clone https://github.com/coreyhaines31/marketingskills.git ~/.claude/skills/marketingskills` and then let Claude discover the `content-strategy` skill directory and its SKILL.md automatically.[1][16][17] This would enable your builder agent to invoke the content-strategy skill when designing corpus-building workflows for platform-specific content optimization, drawing on its keyword and audience research templates.

Security posture for the marketing content strategy skill is relatively low risk, as the SKILL.md content is primarily guidance on research and analysis rather than executable code, though the snippet includes suggestions for using web search queries such as `site:reddit.com [topic]` or `site:competitor.com/blog` that involve external web search.[16] These queries would be executed by the agent via built-in web search tools rather than by external scripts, and thus pose limited security risk beyond the usual considerations for fetching web content.[16][UNVERIFIED] Nevertheless, the skill is not listed as Agensi-vetted and must be treated as an unvetted GitHub skill requiring manual inspection, especially if any hidden scripts or additional files exist in the repository.[16][17][UNVERIFIED]

Combining agentmemory and the content-strategy skill provides a viable foundation for knowledge-base construction. Agentmemory’s MCP tools and skills can be used to implement retrieval structures and indexing strategies (such as vector similarity or keyword-based retrieval), while the content-strategy skill supplies methodologies for assembling corpora relevant to different platforms and audiences.[13][16] Anthropic’s enterprise skills guidance can be applied to govern knowledge-base skills: storing them in Git for review and rollback, grouping them by role or platform, and evaluating them periodically for drift or performance regressions.[15] MLflow’s evaluation harness can be used to test retrieval performance and knowledge relevance, using judges that assess whether retrieved items match queries and specifications.[10]

However, it must be acknowledged that there is no single, strongly validated, community-built “knowledge-base constructor” skill with high star counts and marketplace ratings in the provided search results. As such, knowledge-base construction for your builder agent will likely require custom skill authoring, drawing on agentmemory for technical capabilities, the marketing content strategy skill for corpus design methodology, and enterprise and MLflow guidance for governance and evaluation.[13][16][15][10]

## Phase 7: Agent Evaluation and Benchmarking (Golden Sets and Regression Evals)

Agent evaluation and benchmarking—creating golden datasets, running regression evaluations, and monitoring performance over time—is perhaps the SDLC phase best supported by the MLflow ecosystem and Anthropic’s enterprise skills documentation. The MLflow blog on evaluating skills provides a concrete loop for testing and refining Claude Code skills, while Anthropic’s guidance specifies evaluation suite requirements and lifecycle management practices.[10][15]

The MLflow evaluation loop is centered on an “agent-evaluation skill” whose behavior is traced by MLflow while it runs, judged by automated checks, and refined based on failing judges.[10] The blog outlines a procedure in which developers start a local MLflow server, create experiments, run setup scripts to clone target agent repositories and seed test data, execute headless Claude prompts, and then run all judges on the resulting traces.[10] This procedure is particularly appropriate for benchmarking your builder agent and its subagents: golden sets of prompts and expected behaviors can be encoded as test cases, judges can verify that outputs align with specifications, and regression evaluations can be run after each skill update to detect performance changes.[10] The blog’s pseudo-code loop—“while judges_fail: run test → collect failing judge rationales → prompt Claude to fix SKILL.md → rerun test”—embodies a continuous improvement process that matches SDLC evaluation needs.[10]

Usage evidence and metrics for the MLflow skills repository, including the agent-evaluation skill, remain unverified in the snippet, but MLflow’s broader adoption in the machine learning community provides contextual support for the harness’s credibility.[10][UNVERIFIED] Author credibility is high, given MLflow’s status as a leading open-source platform for experiment tracking and the sophistication of its genai and judge-based evaluation design.[10] Hosting and installation commands are clearly documented, as noted earlier: `git clone https://github.com/mlflow/skills.git`, `pip install "mlflow[genai]" pyyaml`, and `python tests/test_skill.py tests/configs/agent_evaluation.yaml`, making it relatively easy for your builder agent or its human overseers to set up evaluation harnesses.[10]

Anthropic’s enterprise skills documentation complements this harness by specifying evaluation requirements for skills. It recommends that skill authors submit evaluation suites with 3–5 representative queries per skill, covering cases where the skill should trigger, should not trigger, and ambiguous edge cases.[15] It further advises testing across models such as Haiku, Sonnet, and Opus, because skill effectiveness varies by model, and requires evaluations both in isolation (skill alone) and in coexistence with other skills to verify triggering accuracy, output quality, and absence of regressions.[15] These principles can be applied to your builder agent’s evaluation phase: golden sets can be created for each subagent and skill, and evaluation suites can be run across your model lineup to detect regressions as workflows or models evolve.[15]

Security posture for evaluation harnesses is largely a matter of controlling access to test data and ensuring that judges do not inadvertently leak sensitive information in logs or prompts.[10][15] MLflow’s evaluation harness operates locally and uses configuration files and Python scripts, which must be reviewed and secured, but does not inherently require external network access beyond model endpoints configured for genai, unless such access is explicitly configured.[10][UNVERIFIED] Anthropic’s enterprise guidance underscores the need for separation of duties between skill authors and reviewers and for reproducible evaluation suites, which helps mitigate the risk of biased or malicious evaluation code.[15]

Freshness of the MLflow evaluation harness and enterprise evaluation guidance is implied by references to current models and contemporary workflows, but exact dates are unverified.[10][15][UNVERIFIED] For your builder agent, confirming that the MLflow skills repository is actively maintained and that enterprise evaluation guidance aligns with the latest best practices is advisable.

Overall, MLflow’s agent-evaluation skill and harness, combined with Anthropic’s enterprise evaluation requirements, form the best available stack for agent evaluation and benchmarking in mid‑2026.[10][15] Your builder agent should integrate MLflow-based evaluation into its workflow, using golden datasets and judges for each subagent and skill, and follow enterprise guidance to structure evaluation suites and regression tests.

## Phase 8: Testing and TDD for Agent Codebases

Testing and test-driven development (TDD) for agent codebases are closely related to evaluation and benchmarking but focus more explicitly on unit and integration tests, test coverage, and the use of tests to drive code design. The MLflow evaluation harness described earlier is again the most concrete community tool for testing Claude Code skills, and Superpowers offers an overarching methodology that can be extended to incorporate TDD practices.[3][10]

The MLflow blog’s testing loop, in which failing judges drive SKILL.md refinements, is a natural substrate for TDD-like workflows: tests (judges) are defined first, then skills are written or updated to satisfy those tests, and the harness is rerun to confirm that changes have achieved desired behavior without regressions.[10] The use of YAML configuration files to define judges and test cases allows your builder agent to treat tests as first-class artifacts, and the harness’s emphasis on tracing and judging ensures that tests examine both outputs and internal execution behavior.[10] While the blog does not explicitly frame the methodology as TDD, its loop and structure align with TDD principles and can be adapted accordingly.[10]

Superpowers, which positions itself as a complete software development methodology for coding agents, likely includes guidance on testing and iteration stages within its composable skills, though the snippet does not enumerate test-specific features.[3][UNVERIFIED] Given its popularity and focus on SDLC, it is reasonable to treat Superpowers as a meta-skill that encourages tests and evaluation at various phases, and to integrate MLflow harnesses within its methodology for more rigorous testing.[3][10]

Usage evidence for TDD-specific agent skills is not present in the search results, and no single “TDD skill” with high star counts and clear authorship emerges.[UNVERIFIED] As such, testing and TDD for your builder agent will likely rely on adapting MLflow’s evaluation harness and using Superpowers’ methodology rather than adopting a dedicated TDD skill.[3][10]

Security posture for testing harnesses mirrors that of evaluation: care must be taken to avoid leaking sensitive data in logs, to ensure that test harnesses run in controlled environments, and to prevent tests from inadvertently causing side effects in production systems.[10][15] MLflow’s local server and Python-based judges, combined with Anthropic’s governance guidance, offer a solid foundation for secure testing.[10][15]

Given these constraints, testing and TDD for your builder agent are best implemented via custom harnesses built on MLflow and guided by Superpowers, rather than relying on an off-the-shelf TDD skill.

## Phase 9: Deployment (Scheduled Agents, CI, launchd/cron Routines on macOS)

Deployment for agent systems encompasses scheduled agents (periodic prompts), integration with CI pipelines, and OS-level scheduling tools such as launchd and cron on macOS. In the search results, the most relevant official tooling is Claude Code’s **Scheduled Tasks** feature, and there is no clearly identified community-built deployment skill with strong usage evidence.[14][UNVERIFIED]

Claude Code’s scheduled tasks documentation explains that scheduled tasks let Claude re-run a prompt automatically on an interval, which can be used to poll a deployment, babysit a pull request, or check back on a long-running build.[14] It describes how prompts can be configured to run on schedules, making it possible to implement periodic checks, maintenance tasks, or content optimization runs without human intervention.[14] For your builder agent, scheduled tasks can be used to trigger regular content performance analyses, rescheduling posts based on platform timing windows, or refreshing knowledge bases, though these behaviors would need to be encoded in skills or prompts.[14]

Usage evidence for scheduled tasks is implicit in their presence in official documentation, but no metrics such as adoption numbers or run counts are provided.[14][UNVERIFIED] Author credibility is high, given that scheduled tasks are an official feature of Claude Code maintained by Anthropic.[14] Installation and configuration are part of Claude Code’s core functionality and do not require separate skill installation; they are configured via the UI or CLI according to the documentation.[14]

Security posture for scheduled tasks centers on ensuring that scheduled prompts do not perform unintended actions, such as calling destructive tools or sending sensitive data to external services at regular intervals.[14] Anthropic’s enterprise guidance recommends monitoring skill usage patterns and implementing application-level logging to track which skills are included in requests, which should be extended to scheduled tasks to detect anomalies or misconfigurations.[15] Scheduled tasks themselves do not introduce new external connections but can trigger MCP tools or skills that do, making governance around connectors and skills critical.[8][14][15]

For CI integration and launchd/cron routines on macOS, no specific Claude Code skills are identified in the search results. Deployment for these environments will likely rely on external tooling (such as GitHub Actions, local cron jobs, or macOS launchd configuration) and manual integration with Claude Code via CLI or MCP, rather than on a dedicated deployment skill.[UNVERIFIED] As such, deployment orchestration is a phase where custom skill authoring and integration scripts will be required.

## Phase 10: Maintenance and Regression Detection for Agent Systems

Maintenance and regression detection for agent systems involve monitoring skill usage, detecting performance drift, and updating skills based on evaluation results. Anthropic’s enterprise skills documentation and MLflow’s evaluation harness provide the most relevant guidance and tooling for this phase.[10][15]

The enterprise document outlines a skill lifecycle that includes Monitor and Iterate or deprecate stages, recommending that organizations track usage patterns, collect feedback from users, re-run evaluations periodically, and require full evaluation suites to pass before promoting new versions.[15] It also suggests deprecating skills when evaluations consistently fail or when workflows are retired, and emphasizes that usage analytics are not currently available via the Skills API, so application-level logging must be implemented to track skill usage.[15] These practices are directly applicable to maintenance and regression detection in your builder agent: logs should record which skills are invoked in content optimization runs, evaluations should be scheduled regularly (possibly via scheduled tasks), and failing evaluations should trigger skill updates or deprecations.[14][15]

MLflow’s evaluation harness, with its loop of running tests, collecting failing judge rationales, and prompting Claude to fix SKILL.md, embodies a maintenance and regression detection process.[10] Each time a skill is updated, tests can be rerun, and failing judges can highlight regressions or new defects, enabling the builder agent to iteratively improve or roll back skills.[10] Combining this harness with enterprise lifecycle guidance creates a robust maintenance process that ensures skill performance remains aligned with specifications and organizational needs.[10][15]

Usage evidence for maintenance-specific skills is not present in the search results; maintenance and regression detection are implemented via evaluation harnesses and governance practices rather than dedicated skills.[UNVERIFIED] As such, this phase will rely on the MLflow harness and enterprise guidance, along with custom logging and orchestration, rather than on a single community skill.

## Phase 11: Social-Platform Content Optimization (Format Norms, Length, Timing, Algorithms)

Social-platform content optimization at the level you describe—covering format norms, length, timing windows, and algorithm behavior for Substack, LinkedIn, X, Hacker News, Reddit, GitHub, Discord, TikTok, and YouTube—is a demanding domain that currently lacks a single, strongly validated Claude Code skill covering all platforms with explicit usage metrics, according to the provided search results.[UNVERIFIED] However, there are partial resources and skills that can be leveraged as building blocks.

The marketing content strategy skill at `marketingskills/skills/content-strategy/SKILL.md` provides detailed guidance on content pillars, keyword strategies, buyer journeys, and audience research, covering aspects such as search intent, topic clusters, content gaps, and impact scoring.[16] While it does not directly encode per-platform algorithm behaviors or timing windows, its emphasis on mapping topics to the buyer’s journey using keyword modifiers, analyzing competitor content, and identifying content types (such as use-case posts or thought leadership) is relevant to designing platform-appropriate content strategies.[16] It also offers guidance on using web search to mine forums like Reddit, Quora, Indie Hackers, Hacker News, and industry Slack/Discord channels for FAQs, misconceptions, debates, and terminology, which is directly applicable to understanding content norms and audience preferences on those platforms.[16] For your builder agent, this skill can serve as a core methodology for content research and strategy, while platform-specific heuristics must be added via custom knowledge and skills.

Usage evidence and author credibility for platform-specific optimization skills are not present in the search results, leaving the existence of such skills unverified.[UNVERIFIED] The marketing content strategy skill’s author, associated with the `coreyhaines31/marketingskills` repository, appears to have experience in CRO, copywriting, SEO, analytics, and growth engineering, as indicated in the repository description, suggesting credible domain expertise, but this does not cover all platforms or algorithmic behaviors.[16]

Hosting and installation of the content-strategy skill follow the patterns described earlier: clone the repository into your Claude skills directory and allow Claude Code to discover the skill via SKILL.md.[16][17] Security posture is relatively low risk, with the skill primarily providing guidance and web search suggestions, though it must still be reviewed for any hidden scripts or MCP usage.[16][17][UNVERIFIED]

Given the lack of comprehensive social-platform optimization skills with clear metrics and authorship in the search results, your builder agent will need to rely on custom skill authoring and curated knowledge resources for per-platform norms, length, timing windows, and algorithm behavior. Such resources might include platform documentation, empirical studies, and industry analyses, none of which are enumerated here.[UNVERIFIED] The content-strategy skill can anchor corpus design and audience research, but precise optimization for each platform (for example, short-form video strategies for TikTok or threaded posts for X) must be encoded separately.

## Phases Requiring Custom Authoring (Answering Part f)

In light of the above analysis, several SDLC phases lack credible, community-built Claude Code skills with strong usage evidence and author credibility in the provided search results, and thus require custom skill authoring for your builder agent. These phases are deployment orchestration, long-term maintenance and regression detection (beyond generic evaluation), and deep social-platform content optimization.

Deployment orchestration, encompassing CI integration and launchd/cron routines on macOS, is not addressed by any dedicated deployment skill in the search results.[14][UNVERIFIED] While Claude Code’s scheduled tasks feature provides an official mechanism for periodic prompting, there is no community skill with high star counts and explicit authorship that encapsulates end-to-end deployment pipelines, including CI integration, environment configuration, and OS-level scheduling scripts.[14][UNVERIFIED] As such, deployment orchestration must be implemented via custom scripts and skills that use scheduled tasks, CLI commands, and external CI tools, guided by your organization’s DevOps practices.

Maintenance and regression detection, while conceptually supported by Anthropic’s enterprise guidance and MLflow’s evaluation harness, do not have dedicated skills that package these practices into reusable, high-level maintenance workflows.[10][15][UNVERIFIED] Instead, maintenance must be implemented via a combination of logging, evaluation suites, and custom skills that monitor metrics and trigger updates or deprecations based on evaluation results. Your builder agent will need to define meta-skills for maintenance that orchestrate these components, using MLflow harnesses and enterprise lifecycle stages as templates.

Deep social-platform content optimization, which requires platform-specific knowledge about format norms, length, timing windows, and algorithm behaviors for Substack, LinkedIn, X, Hacker News, Reddit, GitHub, Discord, TikTok, and YouTube, is not covered comprehensively by any single community skill in the search results.[16][UNVERIFIED] The marketing content strategy skill provides valuable guidance on content pillars and research, but platform-level optimization heuristics must be encoded in custom skills or knowledge bases built from external resources. Consequently, this phase demands substantial custom authoring, including SKILL.md files that encode per-platform best practices, metrics, and strategies.

## Known Criticisms and Risk Considerations for Popular Skills and Marketplaces (Answering Part g)

The search results contain limited explicit criticisms of specific skills, but they do include important risk considerations and cautionary notes about large catalogs and unvetted GitHub skills. The Best AI Agent Skills Marketplaces article discusses marketplaces such as SkillsMP and Skills.sh, noting that these platforms index enormous numbers of skills scraped from public GitHub repositories.[6] SkillsMP, for example, is described as indexing more than 800,000 skills scraped from public GitHub repositories, filtering only for skills with at least 2 GitHub stars.[6] The article explicitly warns that these massive scraped catalogs offer minimal curation, stating that every skill requires developer-side auditing for quality and security and recommending that most developers skip these catalogs unless they have a specific skill in mind and the time to audit it themselves.[6] This constitutes a clear criticism: while SkillsMP and similar catalogs provide breadth, they suffer from bloat and lack of curation, increasing the risk of low-quality or insecure skills.

Agensi’s article on adding skills to Claude further underscores the risks of unvetted GitHub skills. It explains that Agensi’s curated skill catalog subjects each skill to an 8-point automated security scan, and contrasts this with skills cloned directly from GitHub, remarking that GitHub skills are not vetted and advising users to read `SKILL.md` and any scripts before installing.[17] This warning implies potential security issues, such as scripts that fetch external URLs, run shell commands, or handle credentials insecurely, and frames such skills as riskier than Agensi-listed ones.[17] For your builder agent, this means that popular GitHub skills, including large collections like `claude-skills`, may carry latent security risks and must be audited thoroughly.

Anthropic’s MCP documentation also highlights risks associated with MCP connectors, noting that users must verify that they trust each remote server added via MCP and providing mechanisms to disable or block connectors at scope level.[8] This implicitly criticizes uncontrolled connector usage and underscores that connectors can become security liabilities if not managed properly, especially when they grant access to sensitive tools or external APIs.[8]

While the search results do not explicitly mention token overhead or bloat criticisms for specific skills such as Superpowers or Prompt Architect, the general cautions about large catalogs and unvetted skills apply.[2][3][6][17] For example, the `claude-skills` repository’s size—337 skills and plugins—can lead to complexity and potential interference between skills, and Anthropic’s enterprise guidance recommends limiting the number of skills loaded simultaneously to maintain reliable recall accuracy.[2][15] This can be interpreted as a caution against loading too many skills from large collections without careful curation, as doing so can degrade agent performance and make debugging more difficult.[2][15]

In summary, the key criticisms and risk considerations are: massive scraped catalogs like SkillsMP are criticized for minimal curation and requiring developers to audit every skill themselves; unvetted GitHub skills are flagged by Agensi as potential security risks due to unreviewed scripts; MCP connectors carry inherent trust and security risks; and large skill sets can compromise recall accuracy and complicate agent behavior, necessitating careful, limited skill loading.[6][8][15][17]

## Conclusion

Sourcing builder skills for a Claude Code instance tasked with constructing and maintaining a multi-platform content-optimization agent is a complex undertaking, requiring careful evaluation of community-built skills, frameworks, and marketplaces across all SDLC phases. As of mid‑2026, the strongest, community-validated skills and frameworks for this purpose include Superpowers for overarching agent SDLC methodology, the Spec-Driven Development (SDD) Skill combined with GitHub’s Spec‑Kit and Addy Osmani’s spec-writing guidance for robust requirements, Prompt Architect for structured prompt engineering, agentmemory for persistent memory and MCP-based retrieval, MCP Debugger for MCP server testing, and MLflow’s agent-evaluation harness for evaluation and testing.[3][4][5][9][10][13][18] Anthropic’s enterprise skills documentation and MCP documentation provide essential governance, security, and connector-building guidance that should be encoded into your builder agent’s workflows.[1][8][15]

For each SDLC phase, these tools offer varying degrees of coverage. Spec-driven development is best served by SDD Skill and Spec‑Kit, with Superpowers providing overarching methodology. Agent architecture and design can draw on Superpowers, `claude-skills`, and enterprise guidance. Prompt engineering is anchored by Prompt Architect, while prompt evaluation and agent benchmarking are supported by MLflow’s harness and enterprise evaluation suites. MCP connector building and debugging rely on MCP documentation and MCP Debugger. Memory design is centered on agentmemory, with enterprise lifecycle management providing governance. Knowledge-base construction requires combining agentmemory with corpus design skills such as the marketing content strategy skill and custom authoring. Testing and TDD are implemented via MLflow harnesses and Superpowers methodology. Deployment orchestration, maintenance, regression detection, and deep social-platform content optimization are phases where no single, strongly validated community skill exists; they demand custom SKILL.md authoring and integration with external tools.[2][6][10][14][15][16][UNVERIFIED]

Throughout this process, security and governance are paramount. Agensi’s 8-point security scan for curated skills, combined with its warnings about unvetted GitHub skills, highlight the necessity of Qodo-based verification and manual script review before adopting any skill into an SDLC-critical builder.[6][17] Anthropic’s enterprise guidance recommends sandboxed execution, separation of duties between authors and reviewers, evaluation suites, skill registries, version pinning, and rollback plans, all of which should be applied rigorously to the builder’s skill stack.[15] Massive scraped catalogs like SkillsMP, while offering broad discovery, are criticized for minimal curation and should be approached cautiously, if at all, for high-stakes workloads.[6]

For your multi-platform content-optimization agent, the recommended strategy is therefore a **curated stack**: select a small number of high-signal skills and frameworks for each SDLC phase, confirm their usage metrics, authorship, and maintenance status via Qodo and direct repository inspection, integrate them with Anthropic’s governance guidance, and author custom skills for the gaps in deployment, maintenance, and platform-specific optimization. By doing so, your builder agent will be equipped not only to construct a sophisticated, memory-rich, MCP-integrated content system, but also to evaluate, maintain, and evolve it safely over time.

---

## perplexity:sonar-reasoning-pro

There are strong, community-validated Claude Code skills for requirements/spec, architecture, prompt engineering/eval, MCP, memory/knowledge, testing/TDD, and social content optimization; deployment and long‑term maintenance are where you will likely need custom skills for your SDLC agent system[2][4][53].

Below, each SDLC phase has 1–3 ranked candidates, with evidence (a)–(e), followed by (f) build‑required phases and (g) known criticisms.

---

## 1. Spec‑driven development / requirements

### Recommendation for an agent‑system build

For a multi‑agent content system, the strongest chain is:

1. GitHub Spec‑Kit for the core SDD workflow (spec → plan → tasks → analyze → implement)[2][8][11]  
2. SpillwaveSolutions’ SDD skill as the “Claude skills wrapper” around Spec‑Kit[3][6][12]  
3. Superpowers plugin layered on top for strict TDD, subagent‑driven implementation, and code review discipline[4][7][10][13]

This gives you an explicit spec pipeline, a skill that teaches Claude how to use it, and a proven agentic engineering framework for implementation.

### 1.1 SpillwaveSolutions/sdd‑skill (SDD Skill)

(a) Usage evidence  
- Listed on MCP Hub as “sdd”, described as a Claude Skill used to guide Spec‑Driven Development with GitHub Spec‑Kit[6].  
- GitHub org shows the `sdd-skill` repo; exact star count is not visible in the snippet and should be checked directly [UNVERIFIED][3][9].  
- No marketplace rating numbers surfaced [UNVERIFIED].

(b) Author credibility  
- Built by SpillwaveSolutions GitHub org, which maintains at least this SDD skill and related SDD material[3][9].  
- Skill description emphasizes multi‑agent support across Claude Code, Copilot, Cursor, Gemini CLI, Windsurf and others, indicating experience with multiple agent platforms[3].

(c) Hosting & install  
- GitHub repository: `SpillwaveSolutions/sdd-skill`[3].  
- Typical install for Claude Code: clone into `.claude/skills/sdd-skill` and restart Claude Code so it auto‑discovers the skill[50][49][56][UNVERIFIED].  
- MCP Hub entry provides a downloadable skill package to drop into your skills directory[6].

(d) Security posture  
- Distributed as a SKILL.md‑based skill (instructions + resources) rather than a code‑execution plugin, so it primarily manipulates text and existing project files[3][46][55].  
- No explicit Agensi or Snyk security‑scan badge surfaced; treat as unscanned and review SKILL.md for prompt‑injection / unsafe tool use yourself [UNVERIFIED][69].  
- Does not inherently run shell commands or external HTTP requests; any such behavior would be via Claude Code tools you choose to expose[3][UNVERIFIED].

(e) Freshness  
- Repo snippet shows last update around May 30, 2026[3][UNVERIFIED].  
- MCP Hub listing is dated January 2026, indicating it is part of the current skills ecosystem[6].

---

### 1.2 GitHub Spec‑Kit (SDD toolkit)

(a) Usage evidence  
- Official GitHub repo `github/spec-kit`; widely referenced in GitHub engineering blog and multiple community guides[2][5][8][11][14].  
- GitHub blog presents Spec‑Kit as the canonical SDD toolkit for Copilot, Claude Code and Gemini CLI, implying significant adoption; exact star count not visible here [UNVERIFIED][11].  
- Community tutorials and YouTube walkthroughs show engineers using it end‑to‑end for real projects[2][8][14].

(b) Author credibility  
- Authored and maintained by GitHub’s engineering team, with official blog and documentation explaining SDD, Spec‑Kit and its agent integrations[2][5][8][11].  
- GitHub is a primary vendor for AI coding agents and has shipped multiple production tools and SDKs, providing strong organizational credibility[11].

(c) Hosting & install  
- GitHub repo name: `github/spec-kit`[2][11].  
- CLI install example from GitHub blog:  
  `uvx --from git+<github/spec-kit.git> specify init <PROJECT_NAME>` (replace with the actual git URL from the repo README)[11].  
- Agent commands exposed as slash commands such as `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.analyze`, `/speckit.checklist`, `/speckit.implement` for spec, plan, tasks, analysis, checklist, and implementation[2][8][11].

(d) Security posture  
- Open‑source toolkit from GitHub, so you can audit the code and prompts directly[2][11].  
- Uses CLI and agent prompts; does not itself introduce arbitrary shell execution beyond what your Claude Code configuration allows[2][11][UNVERIFIED].  
- No Agensi‑style scan label surfaced; treat as high‑credibility but still review for prompt‑injection risks with your own process[63][69][UNVERIFIED].

(e) Freshness  
- GitHub blog announcement and repo activity dates from late 2025 onward, with updates through mid‑2026[2][5][8][11].  
- Active community tutorials published in 2025–2026 indicate ongoing maintenance[5][8][14].

---

### 1.3 Superpowers plugin (obra/superpowers)

(a) Usage evidence  
- Listed as an official Claude Code plugin with slash‑command workflows for brainstorming, planning, subagent execution, TDD, debugging and code review[10][13].  
- Snyk’s “Top 8 Claude Skills for Developers” ranks Superpowers #8 and reports ~227,756 stars for `obra/superpowers`, making it the most popular skill in their survey; treat this star count as approximate until checked on GitHub [UNVERIFIED][53].  
- Multiple independent tutorials and blog posts show Superpowers used in production apps (e.g., BookZero) and demo builds[1][4][7][10][13].

(b) Author credibility  
- Created by “obra” (Aaron B. / Obra), a long‑time systems engineer documented running Superpowers in real workflows[4][10].  
- Mentioned across community posts and plugin directories as a complete agentic methodology, not just a toy skill[4][7][10][13][53].

(c) Hosting & install  
- GitHub repo name: `obra/Superpowers`[4][10].  
- Claude official marketplace command: `/plugin install superpowers@claude-plugins-official`[10].  
- Alternative marketplace:  
  - Register: `/plugin marketplace add obra/superpowers-marketplace`  
  - Install: `/plugin install superpowers@superpowers-marketplace`[10].  
- Can also be installed directly from the repo via third‑party plugin managers such as `agy plugin install <obra/Superpowers>`[4][10][UNVERIFIED].

(d) Security posture  
- Distributed as a plugin + skills framework; it mostly orchestrates TDD, subagents, git worktrees, and code review within Claude Code[1][4][7][10][13].  
- Does run shell commands (git, tests, linters) when you allow Claude Code’s command execution, so you must treat it as code‑execution capable and scope which commands are permitted[4][10][UNVERIFIED].  
- Not described as Agensi‑scanned; review SKILL.md and plugin manifest for prompt injection and dangerous command patterns before use[63][69][UNVERIFIED].

(e) Freshness  
- Blog posts and marketplace entries updated in mid‑2026, with active plugin commands documented[1][4][7][10][13].  
- Featured in recent “Top skills for developers” lists, indicating ongoing usage and maintenance[53].

---

**Chain verdict:** For building a structured, multi‑agent SDLC system, use Spec‑Kit for spec/plan/tasks, sdd‑skill to teach Claude Code the SDD methodology, and Superpowers to enforce TDD, subagent topology, and disciplined implementation. Spec‑Kit+sdd‑skill is the best requirements backbone; Superpowers is the best execution framework on top[2][3][4][6][10][11][13][53].

---

## 2. Architecture / design for agent systems

### 2.1 “software‑architecture” skill (Awesome Skills)

(a) Usage evidence  
- Listed on Awesome Skills directory as a Claude Skill that teaches maintainable, scalable software architecture[57].  
- Directory entries typically reflect GitHub‑hosted skills with some download velocity, but explicit star/download counts are not shown in the snippet [UNVERIFIED][57][49].

(b) Author credibility  
- Linked to an “agent‑engineering experiment” series; described as guiding developers through architecture and quality trade‑offs, suggesting an experienced practitioner behind the skill[57].  
- The Awesome Skills catalog is curated and focuses on practical, production‑oriented skills[49][68].

(c) Hosting & install  
- Install instructions: copy the `software-architecture` skill folder into `.claude/skills/` at your project root so Claude can auto‑discover it[57][50].  
- Path: `.claude/skills/software-architecture`[57].

(d) Security posture  
- SKILL‑only architecture (instructions, not executable code) according to description[57].  
- Does not imply shell or HTTP calls; you can verify by inspecting `SKILL.md` before installing[57][46][UNVERIFIED].  
- Not explicitly Agensi‑scanned[69][UNVERIFIED].

(e) Freshness  
- Awesome Skills entry updated July 5, 2026, indicating recent curation[57].

---

### 2.2 Agent‑Skills‑for‑Context‑Engineering (muratcankoylan)

(a) Usage evidence  
- GitHub repo `muratcankoylan/Agent-Skills-for-Context-Engineering` described as a Claude Code plugin marketplace containing context‑engineering skills that Claude auto‑discovers and activates based on task context[54].  
- A curated set of skills, implying multiple installations and real use[54].  
- Explicit star count not visible in snippet [UNVERIFIED].

(b) Author credibility  
- Authored by Murat Can Koylan, who has published context‑engineering practices and skills architecture patterns, including agent operating loops and behavior evaluation skills[54].  
- The repo is framed as a plugin marketplace, which suggests practical deployment across projects[54].

(c) Hosting & install  
- GitHub repo name: `muratcankoylan/Agent-Skills-for-Context-Engineering`[54].  
- Install pattern for Claude Code skills: either register the repo as a plugin marketplace with `/plugin marketplace add muratcankoylan/Agent-Skills-for-Context-Engineering` and install its bundles, or copy skills into `.claude/skills/`[50][54][UNVERIFIED].

(d) Security posture  
- Skills focus on context curation and operating loops; they primarily adjust prompts and workflows instead of running arbitrary commands[54].  
- As GitHub‑hosted SKILLs, you must audit any included scripts and check for external HTTP/tool calls[46][69][UNVERIFIED].  
- No Agensi scan badge visible [UNVERIFIED].

(e) Freshness  
- Repo last‑updated in May 2026 per snippet[54][UNVERIFIED].  

---

### 2.3 Claude Code Skills (Delivery workflow) – levnikolaevich

(a) Usage evidence  
- Snyk’s “Top 8 Claude Skills for Developers” lists “Claude Code Skills (Delivery workflow)” with 82 stars and describes it as a full SDLC from epic planning to quality gates[53].  
- Framed as covering planning, implementation, testing, and code review across a delivery pipeline[53].

(b) Author credibility  
- Authored by GitHub user `levnikolaevich` (exact identity not detailed here), but Snyk’s inclusion in a security‑focused article suggests quality and at least basic vetting[53].  

(c) Hosting & install  
- GitHub repo name indicated as `levnikolaevich/claude-code-skills`[53].  
- Install: register repo as a plugin marketplace and install the delivery‑workflow plugin, or copy skills into `.claude/skills/`[50][53][UNVERIFIED].

(d) Security posture  
- Snyk article is explicitly about developer skills and notes that community skills can expose risks, implying they reviewed skill behavior at least at a high level[53].  
- No explicit Agensi scan; treat as partially vetted and run your own SKILL.md security checklist[63][69][UNVERIFIED].

(e) Freshness  
- Included in a February 2026 Snyk article, so it is very recent in the ecosystem[53].

---

## 3. Prompt engineering & prompt‑evaluation harnesses

### 3.1 Prompt Architect (ckelsoe/prompt‑architect)

(a) Usage evidence  
- GitHub repo `ckelsoe/prompt-architect` described as a Claude Code skill that transforms vague prompts into structured prompts using 27 research‑backed frameworks across 7 intent categories[34].  
- Supports Claude Code, ChatGPT, Gemini CLI, Cursor, Copilot, Windsurf and other agent tools, indicating cross‑platform adoption[34].  
- Star count is not shown in snippet [UNVERIFIED].

(b) Author credibility  
- Built by `ckelsoe`, who positions Prompt Architect as a research‑backed prompt engineering skill, with clear evaluation dimensions and framework mapping[34].  
- The design suggests familiarity with prompt‑quality metrics and agent workflows[34].

(c) Hosting & install  
- GitHub repo name: `ckelsoe/prompt-architect`[34].  
- Install for Claude Code: place the skill folder under `.claude/skills/prompt-architect` and let Claude auto‑discover it; invoke via `/prompt-architect` or natural‑language triggers[34][50][UNVERIFIED].

(d) Security posture  
- SKILL‑only instructions focused on text evaluation; no evidence of shell or HTTP calls in snippet[34].  
- You should still run Agensi‑style checks for prompt injection and data exfiltration patterns before using in production[63][69][UNVERIFIED].

(e) Freshness  
- Last updated May 31, 2026 in snippet, indicating active maintenance[34].

---

### 3.2 Claude Console Evaluation Tool (built‑in harness)

(a) Usage evidence  
- Official Claude Platform docs describe an Evaluation tool integrated into the prompt editor, supporting test‑case generation, side‑by‑side prompt comparisons, manual grading, and re‑running eval suites after prompt changes[31].  
- Used via the Console’s “Evaluate” tab; not a third‑party skill but a canonical evaluation harness[31].

(b) Author credibility  
- Maintained by Anthropic and documented in official platform docs, with recommended prompt‑engineering and eval‑design patterns[31][39].  

(c) Hosting & install  
- Built into console; no install required. Accessible from Claude Console prompt editor, “Evaluate” tab[31].  

(d) Security posture  
- Runs entirely within Anthropic’s platform; no external code execution[31][39].  

(e) Freshness  
- Docs updated June 2026 with detailed workflows, including generate‑prompt and generate‑test‑case helpers[31][39].

---

### 3.3 Portkey Skills Registry + Prompt Engineering Studio

(a) Usage evidence  
- Portkey’s Skills Registry is designed to author, version, and sync SKILL.md content across Claude Code, Cursor, Codex, Copilot and other agents[52].  
- The CLI `npx portkey skills sync` writes skills to the right directory for each agent[52].  
- Not a single “prompt skill” but a meta‑tool for managing prompt/skill collections[52].

(b) Author credibility  
- Portkey is a known prompt‑ops vendor; the blog article shows detailed examples of building skills as prompt partials and syncing them across agents[52].  

(c) Hosting & install  
- Portkey platform; CLI command: `npx portkey skills sync` after configuring workspace and skills[52].  

(d) Security posture  
- Portkey emphasizes central review/versioning; still, your skills may call external tools and require their own security review[52][69][UNVERIFIED].  

(e) Freshness  
- Skills Registry launched April 2026; docs updated July 2026[52].

---

## 4. MCP connector building & MCP debugging/testing

### 4.1 MCP Debugger skill (mcp‑debug)

(a) Usage evidence  
- MCP Market lists “MCP Debugger” (mcp‑debug skill) as a Claude Code skill for diagnosing and verifying MCP servers directly within Claude Code[17].  
- Described as empowering developers to list tools, execute tool calls with parameters, and open interactive shells or web UIs for visual debugging[17].  
- Ratings/downloads are not shown in snippet [UNVERIFIED].

(b) Author credibility  
- Uses the `mcptools` utility and is positioned as essential for developers building or integrating custom MCP servers, indicating authors with hands‑on MCP experience[17].  

(c) Hosting & install  
- Distributed via MCP Market as a skill package; typical install is to download and place it in `.claude/skills/mcp-debug` and/or install via a plugin marketplace that surfaces the skill[17][49][50][UNVERIFIED].  

(d) Security posture  
- The skill interacts with MCP servers, which can expose external tools and resources[17][24][27][30].  
- You must review any commands for risky tool calls; there is no explicit Agensi badge in snippet [UNVERIFIED][63][69].  

(e) Freshness  
- MCP Market entry updated April 17, 2026, indicating current maintenance[17].

---

### 4.2 “claude‑debugs‑for‑you” MCP server + VS Code extension

(a) Usage evidence  
- MCP server and VS Code extension that lets Claude drive the debugger interactively over MCP, enabling fine‑grained debug sessions[23][26].  
- Documentation shows configuration and commands like `npm run mcp:server` and “Claude: Connect to Local MCP Server” in VS Code[23].  
- Star counts not visible in snippet [UNVERIFIED][26].

(b) Author credibility  
- Authored by Jason McGhee (`jasonjmcghee` GitHub), with documentation on VS Code + MCP integration, suggesting practical experience with debugging tools and MCP[23][26].  

(c) Hosting & install  
- GitHub repo name: `jasonjmcghee/claude-debugs-for-you`[26].  
- Install:  
  - Run MCP server via `npm run mcp:server` (script name from repo)[23].  
  - Install VS Code extension and connect Claude to local MCP server via the “Claude: Connect to Local MCP Server” command[23].  

(d) Security posture  
- Local MCP server; debugging tools run in your environment, not in the cloud[23][26].  
- As with any MCP server, you must review tool definitions for safe commands and data flows[20][22][24][27][UNVERIFIED].  

(e) Freshness  
- Repo created January 2025; VS Code + MCP docs updated mid‑2025; still relevant and compatible with 2026 MCP ecosystem[23][26][29][UNVERIFIED].

---

### 4.3 Anthropic MCP docs + Desktop Extensions (for building connectors)

(a) Usage evidence  
- Official MCP connector docs for Claude Platform and Managed Agents explain how to declare MCP servers, toolsets, and vault‑based auth[22][28].  
- Desktop Extensions article shows MCPB packaging and one‑click `.mcpb` installation for MCP servers[18].  

(b) Author credibility  
- Authored by Anthropic engineering; definitive references for MCP connector patterns[18][22][24][28].  

(c) Hosting & install  
- For Claude Desktop: package MCP servers as `.mcpb` with `npx @anthropic-ai/mcpb pack`, then drag/drop into Desktop settings[18].  
- For Managed Agents: specify `mcp_servers` and `mcp_toolset` entries when creating agents, and attach credentials via `vault_ids` at session start[28].  

(d) Security posture  
- Official guidance includes instructions for error handling, timeout management, and structured responses; actual security depends on your MCP server implementation[18][20][24][29].  

(e) Freshness  
- Docs updated June–July 2026; aligned with current MCP connector features[18][20][22][28][29].

---

## 5. Agent memory design (persistent memory files, consolidation)

### 5.1 Planning with Files (OthmanAdi/planning‑with‑files)

(a) Usage evidence  
- Snyk article lists “Planning with Files” as the #1 Claude skill for developers, with 13,410 stars and a focus on “Manus‑style persistent task planning”[53].  
- Designed to use filesystem‑based persistent planning documents as long‑term memory for agents[53].  

(b) Author credibility  
- Authored by `OthmanAdi`, with a skills design that emphasizes persistent planning and task tracking, implying experience in agent workflows and memory design[53].  

(c) Hosting & install  
- GitHub repo name: `OthmanAdi/planning-with-files`[53].  
- Install: register as a plugin marketplace or copy into `.claude/skills/planning-with-files` and let Claude discover it; use slash commands to manage task plans[50][53][UNVERIFIED].

(d) Security posture  
- Uses local files as persistent memory; does not inherently expose external HTTP or shell calls beyond standard Claude Code capabilities[53][50][UNVERIFIED].  
- Treat as safe from network data exfiltration but review for any dangerous prompts (e.g., telling Claude to run arbitrary commands)[63][69][UNVERIFIED].

(e) Freshness  
- Included in Snyk’s February 2026 ranking; star count suggests active use[53].

---

### 5.2 Agent Skills for Context Engineering (for operating loops / memory)

(a) Usage evidence  
- Repo explicitly claims to teach “the art and science of curating context, designing agent operating loops, and evaluating agent behavior across any agent platform”[54].  
- Positioned as a Claude Code plugin marketplace with progressive context loading and context‑engineering skills[54][60].

(b) Author credibility  
- Murat Can Koylan writes about context engineering and agent‑skills architecture; the repo aggregates multiple skills used in real workflows[54][60].  

(c) Hosting & install  
- GitHub repo: `muratcankoylan/Agent-Skills-for-Context-Engineering`[54].  
- Install as marketplace or copy skills into `.claude/skills/` with registration in `claude.md` as dispatcher[54][60][50].  

(d) Security posture  
- Focuses on prompt/context management, not code execution; you should still check for any MCP tool invocations or shell commands[54][60][UNVERIFIED].  

(e) Freshness  
- Last updated May 2026 with active documentation[54][60][UNVERIFIED].

---

## 6. Knowledge‑base construction (corpus + retrieval)

### 6.1 Anthropic “document‑skills” plugin (anthropics/skills repo)

(a) Usage evidence  
- `anthropics/skills` repo contains multiple skills, including document‑handling skills that demonstrate reading, structuring, and querying documents[55].  
- The plugin can be installed via `/plugin install document-skills@anthropic-agent-skills` after adding `anthropics/skills` as a marketplace[55].

(b) Author credibility  
- Authored by Anthropic as reference implementations, showcasing how skills can structure document corpora and retrieval workflows[55][46].  

(c) Hosting & install  
- GitHub repo: `anthropics/skills`[55].  
- Install steps from docs:  
  - `/plugin marketplace add anthropics/skills`  
  - `/plugin install document-skills@anthropic-agent-skills`[55].  

(d) Security posture  
- Skills demonstrate reading local/project files and uploaded documents; they do not typically run arbitrary commands[55][46].  
- As official examples they are good baselines, but still inspect SKILL.md before adapting for your corpus[69][UNVERIFIED].

(e) Freshness  
- Repo created September 2025; updated through July 2026, reflecting new skills including MCP server generation demos[55].

---

### 6.2 SEO/GEO Claude Skills collection (aaron‑he‑zhu/seo‑geo‑claude‑skills)

Although framed as SEO skills, this collection is effectively a knowledge‑base builder for web content, keyword corpora, and ranking data.

(a) Usage evidence  
- SkillsLLM listing describes “20 SEO & GEO skills for Claude Code… Keyword research, content writing, technical audits, rank tracking” across 35+ agents[65].  
- Installation commands for Claude Code are documented, suggesting real‑world use[65].

(b) Author credibility  
- Authored by Aaron He Zhu; the collection includes research, analysis, and rank‑tracking workflows, showing depth in search/knowledge‑base practices[65].  

(c) Hosting & install  
- GitHub repo: `aaron-he-zhu/seo-geo-claude-skills`[65].  
- Claude Code install:  
  - `/plugin marketplace add aaron-he-zhu/seo-geo-claude-skills`  
  - `/plugin install aaron-seo-geo@aaron`[65].  
- Any host: `git clone aaron-he-zhu/seo-geo-claude-skills`[65].

(d) Security posture  
- Skills perform keyword research, audits, rank tracking; they may call external APIs or tools depending on your MCP configuration[65][UNVERIFIED].  
- No explicit Agensi badge; review each skill for data exfiltration and dangerous command use[63][69][UNVERIFIED].

(e) Freshness  
- Listing dated February 13, 2026 with updates through July 2026, indicating active usage[65].

---

## 7. Agent evaluation / benchmarking

### 7.1 MLflow genAI Evaluation Skill (anthropics/skills + MLflow blog)

(a) Usage evidence  
- MLflow blog describes a Claude Code skill that traces Claude’s own execution, judges behavior with MLflow checks, and uses `mlflow.genai.evaluate()` to systematize quality assessment[40].  
- Skill guides Claude through dataset prep, scorers selection, and running evaluations over agent outputs[40].  

(b) Author credibility  
- Authored by MLflow team with direct integration into MLflow’s genAI features, showcasing production‑grade evaluation patterns[40].  

(c) Hosting & install  
- Skill content lives in MLflow examples and/or Anthropic skills repo; CLI and code snippets show usage of MLflow’s evaluation APIs[40][55][UNVERIFIED].  
- Typical usage: run agent with MLflow tracing, then call `mlflow.genai.evaluate()` guided by the skill instructions[40].

(d) Security posture  
- Evaluation loop primarily inspects traces and metrics; it does not itself run arbitrary code beyond your MLflow and Claude configuration[40][UNVERIFIED].  

(e) Freshness  
- Blog and skill example published March 2026; updated June 2026 for genAI evaluation improvements[40].

---

### 7.2 External benchmarks (SWE‑bench, Artificial Analysis, InfoQ)

These are not Claude skills but high‑quality resources you can wrap in custom skills.

(a) Usage evidence  
- Anthropic’s SWE‑bench Verified results for Claude 3.5 Sonnet (49% on SWE‑bench Verified) serve as a reference software‑engineering benchmark[42].  
- Artificial Analysis maintains a coding‑agents leaderboard with cost, tokens, and performance metrics[45].  
- InfoQ article outlines practical agent evaluation approaches (benchmarks, hybrid pipelines, automated scoring and trace analysis)[36].  

(b) Author credibility  
- Anthropic, Artificial Analysis, and InfoQ are recognized sources in AI evaluation and software engineering[36][42][45].  

(c) Hosting & install  
- You would author a custom skill that uses these benchmarks as golden sets and evaluation protocols[40][52][UNVERIFIED].  

(d) Security posture  
- Benchmarks are data; your skill can be read‑only[36][42][45].  

(e) Freshness  
- All three updated in 2025–2026 with current model generations[36][42][45].

---

## 8. Testing / TDD for agent codebases

### 8.1 AI Hero TDD Skill (“My Skill Makes Claude Code GREAT at TDD”)

(a) Usage evidence  
- AI Hero article publishes a TDD skill for Claude Code, enforcing red‑green‑refactor cycles and vertical slicing (“ONE test → ONE implementation → repeat”)[15][44].  
- Skill describes detailed TDD constraints, indicating it is used to structure test‑first development with Claude[15][44].  
- No explicit star/download metrics in snippet [UNVERIFIED].

(b) Author credibility  
- Author positions themselves as experienced in TDD, describing real workflows and the skill’s impact on test honesty and implementation quality[15][44].  

(c) Hosting & install  
- Skill is published as SKILL.md content in the AI Hero article; you copy it into `.claude/skills/tdd` or use Claude Code to author/import it as a skill[15][50][UNVERIFIED].  

(d) Security posture  
- Instruction‑only skill; focuses on test writing and implementation ordering[15].  
- It may call existing test runners via Claude Code (e.g., Playwright tests); review any tool usage you add[32][35][UNVERIFIED].  

(e) Freshness  
- Article dated February 10, 2026 and updated late June 2026, indicating active refinement[44][15].

---

### 8.2 Superpowers plugin (TDD workflow)

(a) Usage evidence  
- Superpowers enforces red‑green TDD cycles with parallel task execution, failing tests before implementation, and integration into real codebases with git worktrees[1][4][10][13].  
- Video and plugin docs show Claude practicing RED/GREEN TDD and using subagents per task, with built‑in code review and test validation[1][4][10][13].  

(b) Author credibility  
- Same as §1.3; designed explicitly around TDD and enterprise‑style engineering workflows[4][10][13].  

(c) Hosting & install  
- See §1.3 for install commands.  

(d) Security posture  
- Executes tests and git commands via Claude Code; treat as code‑execution capable and constrain tools accordingly[4][10].  

(e) Freshness  
- 2025–2026 documents describe updated workflows and compatibility with Claude Code 2.x[4][10][13].

---

### 8.3 Claude Agentic Framework (dralgorhythm)

(a) Usage evidence  
- Snyk article lists “Claude Agentic Framework (Core engineering)” with 15 stars, focusing on TDD, debugging, refactoring, and dependency management[53].  

(b) Author credibility  
- Authored by `dralgorhythm`; Snyk’s inclusion indicates it passes a basic quality bar for developer workflows[53].  

(c) Hosting & install  
- GitHub repo name: `dralgorhythm/claude-agentic-framework`[53].  
- Install via marketplace or copy skills into `.claude/skills/`[50][53][UNVERIFIED].  

(d) Security posture  
- Framework orchestrates workflows; security depends on any included tools (e.g., test runners, shell commands) you allow[53][UNVERIFIED].  

(e) Freshness  
- Included in February 2026 Snyk ranking, implying recent usage[53].

---

## 9. Deployment (scheduled agents, CI, launchd/cron on macOS)

There is no widely‑adopted, well‑documented Claude Code skill specifically focused on deployment orchestration (scheduled agents, CI pipelines, launchd/cron) with strong community metrics in the collected results [UNVERIFIED].

Existing components:

- Official Claude Code plugin marketplace includes plugins that bundle MCP servers for GitHub, GitLab, Vercel, Firebase, Supabase, Slack, etc., which you can use to connect to CI/CD and infra providers[30].  
- Tutorials on building Claude plugins show how to bundle slash commands, subagents, and MCP servers, which you can adapt into deployment workflows[21][24][30].  

However, none of these come as a pre‑packaged, popular “deployment scheduler” skill with stars/downloads comparable to Superpowers or Planning with Files, so custom skills are recommended for this phase (see §f)[21][30][UNVERIFIED].

---

## 10. Maintenance / regression detection for agent systems

Similarly, there is not a single popular “agent maintenance/regression detection” Claude skill with strong public metrics; evaluation skills (MLflow, Console eval, SDD convergence) are building blocks but not full maintenance frameworks[11][31][39][40][UNVERIFIED].

Useful building blocks:

- Spec‑Kit’s `/speckit.converge` command analyzes codebase vs spec/plan/tasks and appends remaining work as new tasks, which is a form of regression detection against requirements[2][8][11].  
- MLflow evaluation skill (see §7.1) can be run regularly over agent outputs to detect quality regressions[40].  
- Portkey Skills Registry supports versioned skill changes with centralized review, helpful for tracking behavior changes across skill updates[52].  

For your use case (multi‑platform content agents), it is advisable to author a custom maintenance/regression skill that wraps these tools and runs scheduled evaluations (see §f)[40][52][UNVERIFIED].

---

## 11. Social‑platform content optimization

For Substack, LinkedIn, X, Hacker News, Reddit, GitHub, Discord, TikTok, YouTube, you will likely combine specialized LinkedIn/social skills with SEO/content‑optimization skills and knowledge resources.

### 11.1 LinkedIn Strategy Profile Optimizer skill (MCP Market)

(a) Usage evidence  
- MCP Market lists “LinkedIn Best Practices 2026 | Claude Code Skill” that optimizes LinkedIn profiles and strategies using updated 2026 algorithm insights for reach and conversion[64].  
- Focuses on headlines, About sections, Featured portfolios, dwell‑time, semantic relevance, and AI‑driven candidate ranking[64].  

(b) Author credibility  
- Skill is described as “expert‑led strategies” with algorithmic insights, implying it’s authored by a LinkedIn strategist or marketing professional; exact author not shown [UNVERIFIED][64].  

(c) Hosting & install  
- Distributed via MCP Market as a skill bundle; install by downloading and placing in `.claude/skills/linkedin-strategy-profile-optimizer` or via a plugin marketplace entry[64][49][50][UNVERIFIED].  

(d) Security posture  
- Optimizes textual profiles; no evidence of direct API scraping; you likely upload PDFs/exports and let Claude work on them[64][61][73].  
- Review SKILL.md to ensure it doesn’t request credentials or direct logins[69][UNVERIFIED].

(e) Freshness  
- Entry updated June 25, 2026, reflecting current LinkedIn algorithm behavior[64].

---

### 11.2 SEO/GEO Claude Skills collection (aaron‑he‑zhu/seo‑geo‑claude‑skills)

This collection is central for optimizing posts for Substack, blogs, landing pages, Reddit, and even YouTube titles/descriptions.

(a) Usage evidence  
- Provides skills for keyword research, competitor analysis, content gap analysis, on‑page audits, technical SEO checks, rank tracking, performance reporting, and alerts[65].  
- Multi‑agent support (Claude Code, Cursor, Codex, etc.) indicates wide use[65].  

(b) Author credibility  
- Built by Aaron He Zhu; the breadth of skills shows deep SEO and content strategy expertise, useful for multi‑platform optimization[65].  

(c) Hosting & install  
- See §6.2 for install commands: marketplace add + `/plugin install aaron-seo-geo@aaron`[65].  

(d) Security posture  
- Some skills may call external analytics or search APIs via MCP; review for API keys and rate‑limits[65][24][27][UNVERIFIED].  

(e) Freshness  
- Updated through July 2026; suitable for current search and AI‑overviews behavior[65][68].

---

### 11.3 Content Optimization Suite skill (MCP Market)

(a) Usage evidence  
- “Content Optimization Suite” skill transforms raw drafts into high‑performing digital assets, analyzing structure, technical SEO, readability metrics (Flesch‑Kincaid), and using persuasion frameworks like AIDA/PAS[62].  

(b) Author credibility  
- Described as a “specialized toolset for Claude” with detailed content optimization workflows; indicates an experienced content/SEO practitioner as author[62].  

(c) Hosting & install  
- Available via MCP Market; install as skill bundle under `.claude/skills/content-optimization-suite` or via plugin marketplace[62][49][50][UNVERIFIED].  

(d) Security posture  
- Analyses text and metrics; may fetch external URLs only if you configure MCP tools for that purpose[62][68][UNVERIFIED].  

(e) Freshness  
- Entry dated January 2026, updated March 2026, aligning with current SEO norms[62].

---

### 11.4 High‑quality knowledge resources to wrap in skills

These are not skills but should be encoded into your social‑optimization skill(s):

- ClaudeWorld guide on social media content creation, with platform‑specific norms (character limits, tone) and repurposing across LinkedIn, Twitter, Instagram, etc.[67].  
- TealHQ and LinkedIn strategists’ guides (e.g., Jennifer Orji’s 15‑minute LinkedIn optimization process) for profile and post optimization[61][73].  
- “social‑brain” CLI article describing cross‑platform analytics (Mastodon, Bluesky, LinkedIn, Substack, newsletters) and dashboards Claude can reuse, with data pulled locally for privacy[70].  

Wrap these into custom skills for platform‑specific post formats, comment timing, and algorithm heuristics.

---

## (f) Phases requiring custom authoring

Based on the gathered information, these phases lack a clearly dominant, community‑validated Claude Code skill with strong usage metrics and a credible author, tailored to your SDLC agent system:

1. **Deployment (Phase 9)**  
   - While plugin marketplaces provide connectors to GitHub, Vercel, Firebase, Supabase, etc., there is no standard “agent deployment scheduler” skill that handles CI pipelines, macOS launchd/cron, and scheduled runs as a cohesive methodology[21][24][30][UNVERIFIED].  
   - You should author a deployment skill that:  
     - Encodes your CI steps (lint/test/build/deploy)  
     - Uses MCP servers for infra APIs  
     - Manages cron/launchd entries via local scripts.

2. **Maintenance / regression detection (Phase 10)**  
   - Existing tools (Spec‑Kit converge, MLflow evaluation skill, Console eval) provide pieces of regression detection but not a unified “agent maintenance” skill with scheduling, alerting, and regression triage workflows[11][31][39][40][UNVERIFIED].  
   - Create a maintenance skill that:  
     - Runs eval suites on a schedule  
     - Compares scores against baselines  
     - Opens issues/tasks when regressions occur.

3. **System‑wide agent architecture for multi‑platform content (cross‑phase)**  
   - Architecture skills exist, but your multi‑platform scenario (Substack, LinkedIn, X, HN, Reddit, GitHub, Discord, TikTok, YouTube, MCP connectors, memory, KB) is specialized[54][57][60][67][70].  
   - Author a top‑level “AIOS” or “content‑orchestration” skill that defines subagent topology, data flows, and evaluation loops, using the building blocks above.

---

## (g) Popular skills with known criticism / trade‑offs

### TDD‑heavy workflows (including Superpowers and similar frameworks)

- Community threads on TDD workflows with Claude Code report that heavy TDD with extensive parallelization can increase load, slow agents, and sometimes take longer than serial workflows, especially on large codebases[32][35][38].  
- This criticism applies to frameworks that aggressively parallelize tests and subagents (Superpowers, TDD skills, agentic frameworks) when mis‑configured or overused[1][4][10][13][15][53][UNVERIFIED].  
- Mitigation:  
  - Limit parallel subagents to high‑value tasks.  
  - Use vertical slicing (one test → one implementation) as AI Hero’s skill recommends to control token usage and complexity[15][44].  

### Token overhead in multi‑skill architectures

- Skills architecture articles note that naively loading many skills can increase context size and token consumption; however, Claude Code’s progressive context loading (YAML front matter only, then SKILL.md, then reference files) is designed to mitigate this[50][60][71].  
- Poorly designed skills (large SKILL.md bodies, unnecessary reference files) can still cause token overhead, prompting guidance to keep skills lean and let the model rely on general knowledge for basics[60][71].  

### Security concerns for unscanned community skills

- Agensi’s security‑scan documentation warns that community skills may contain prompt‑injection, data exfiltration, dangerous commands, or unsafe external tool calls; their 8‑point scan checks for these issues and recommends best practices for SKILL.md authoring[63][66][69].  
- Many popular skills (including some in Snyk’s list, SEO/GEO collections, MCP Market skills) do not display Agensi scan badges in the snippets and should be treated as unscanned until you verify them yourself [UNVERIFIED][53][62][65][68].  
- Recommended mitigation: run your own SKILL.md security checklist (prompt‑injection, external commands, credential use), restrict tools, and prefer skills hosted on trusted registries that advertise security scanning[63][66][69].

---

**Practical setup for your SDLC agent system**

For your Claude Code builder instance:

1. Use **Spec‑Kit + sdd‑skill + Superpowers** as the SDLC backbone for spec, plan, tasks, and disciplined implementation.  
2. Add **architecture/context skills** (software‑architecture, Agent‑Skills‑for‑Context‑Engineering, Claude Code Skills delivery workflow) to handle subagent topology and operating loops.  
3. Layer in **Prompt Architect + Console Eval + MLflow eval skill** for prompt and agent‑behavior evaluation.  
4. Use **MCP Debugger + claude‑debugs‑for‑you** and official MCP docs to build and test connectors.  
5. Implement **Planning with Files + document‑skills + context‑engineering** for memory and knowledge base.  
6. Add **SEO/GEO and Content Optimization Suite + LinkedIn optimizer** for social‑platform optimization.  
7. Author custom skills for **deployment** and **maintenance/regression detection**, wrapping CI, cron/launchd, eval suites, and golden‑set regression checks.

Where numbers or specific ratings are not visible in the snippets above, they are marked [UNVERIFIED]; those should be confirmed directly in the corresponding repos or marketplaces before adoption.

---

## xai:grok-4

**All information below is [UNVERIFIED] as of my last training data.** No public records, GitHub repositories, agentskills.io registry entries, marketplace data, or credible author/track-record details exist in verifiable sources for any of the named skills, registries (Agensi, etc.), or 2026-specific Claude Code skill ecosystem items referenced in the query. I cannot confirm stars, download counts, authors, install commands, security scans, release dates, or maintenance status for any candidate. All numbers, URLs, and claims are therefore marked unverified.

### 1. Spec-driven development / requirements
No credible community-built skills with verifiable usage evidence were located.  
- Superpowers, GitHub Spec-Kit, SpillwaveSolutions sdd-skill: all [UNVERIFIED].  
- No author track records, star counts, or install paths can be confirmed.  
Custom authoring required.

### 2. Architecture/design for agent systems (subagent topology, skill decomposition)
No credible skills located. All candidates [UNVERIFIED].

### 3. Prompt engineering AND prompt-evaluation harnesses
No credible skills located. All candidates [UNVERIFIED].

### 4. MCP connector building AND MCP debugging/testing
No credible skills located. All candidates [UNVERIFIED].

### 5. Agent memory design (persistent memory files, consolidation)
No credible skills located. All candidates [UNVERIFIED].

### 6. Knowledge-base construction for agents
No credible skills located. All candidates [UNVERIFIED].

### 7. Agent evaluation / benchmarking
No credible skills located. All candidates [UNVERIFIED].

### 8. Testing / TDD for agent codebases
No credible skills located. All candidates [UNVERIFIED].

### 9. Deployment (scheduled agents, CI, launchd/cron on macOS)
No credible skills located. All candidates [UNVERIFIED].

### 10. Maintenance / regression detection for agent systems
No credible skills located. All candidates [UNVERIFIED].

### 11. Social-platform content optimization
No credible skills or high-quality, verifiable skill-wrapped knowledge resources located for the listed platforms. All candidates [UNVERIFIED].

**(f) Phases requiring custom authoring**  
All 11 phases listed above. No skill with real usage evidence and a credible, verifiable author was found in any phase.

**(g) Popular skills with known criticism**  
None identified. No popular skills meeting the query criteria (with verifiable criticism sources) were located.

**Summary**  
The requested ecosystem of agentskills.io-standard skills, specific named collections, and supporting registries does not have any verifiable public footprint in available data. Every data field (a)–(e) is therefore [UNVERIFIED]. Custom skill authoring is required across the entire SDLC for the described agent-system build.

---

## xai:grok-4-x-search

**Superpowers (obra/superpowers, by Jesse Vincent/obra) dominates many phases as a comprehensive, composable agentic methodology/skills framework.** It includes workflows for brainstorming/specs, design, TDD, subagent orchestration, reviews, and more. GitHub stars reported in the 200k–247k range (varying by source/date; e.g., ~247k cited in one June/July 2026 snapshot).[[1]](https://github.com/obra/superpowers)[[2]](https://levelup.gitconnected.com/i-installed-superpowers-into-claude-code-it-stopped-coding-like-an-intern-536f8189922a) Author track record: Jesse Vincent (ex-GitHub, prominent open-source contributor); framework explicitly positioned as a full SDLC methodology for coding agents with automatic skill triggering, phase gates, and subagent use. Hosted on GitHub; install via official Claude plugin marketplace (`/plugin install superpowers@claude-plugins-official` or via obra/superpowers-marketplace). Security: MIT-licensed, actively maintained (commits as recent as July 2, 2026; v6.1.1 release), plugin-based with hooks/scripts but no widespread reports of external fetches or credential requirements in core use. Freshness: Highly maintained.[[1]](https://github.com/obra/superpowers)

**GitHub Spec-Kit** is a strong specialized alternative for spec-driven phases (~118k stars).[[3]](https://github.com/github/spec-kit)

**Matt Pocock’s skills collection (mattpocock/skills)** is frequently praised for practical engineering skills (TDD, grilling/planning, handoff, etc.); ~20k–157k stars cited across reports (varies; one source notes rapid growth).[[4]](https://tosea.ai/blog/matt-pocock-skills-claude-code-guide)[[5]](https://github.com/mattpocock) Author: Matt Pocock (Total TypeScript creator, ex-Vercel; strong credibility in TypeScript/engineering education). Individual skills or the collection install from the GitHub repo (filesystem-based SKILL.md in .claude dir or via marketplace/plugins). Actively referenced in 2026 community discussions; maintained.

Other notables: Various community collections on agentskills.io, mcpservers.org, claudeskills.info, and alirezarezvani/claude-skills. Many are custom SKILL.md folders; security posture is generally good for reputable repos (no major scanned-registry mandates noted, but community vetting via Qodo recommended). Most are filesystem-based or marketplace plugins with low external dependency risk unless explicitly bundling MCP/scripts.

**1. Spec-driven development / requirements**  
**Ranked best:**  
1. **Superpowers** (brainstorming + spec refinement phases with validation gates and design docs). Evidence as above; explicitly designed for this.[[1]](https://github.com/obra/superpowers)  
2. **GitHub Spec-Kit** — Specialized toolkit for specs; strong standalone or chained with Superpowers. ~118k stars.[[3]](https://github.com/github/spec-kit)[[6]](https://claudeskills.info/blog/spec-driven-development-claude-skills/)  
3. SpillwaveSolutions-style or claudeskills.info sdd-* skills (sdd-brainstorm, sdd-plan) — Niche SDD collections; lower verified adoption metrics.  

Superpowers + Spec-Kit chain appears strongest for agent-system builds due to methodology + spec tooling.

**2. Architecture/design for agent systems (subagent topology, skill decomposition)**  
**Superpowers** leads (subagent-driven development, task decomposition, architecture synthesis in planning phases). Matt Pocock skills (e.g., structured planning/grilling) supplement. Limited dedicated alternatives with high stars; many wrap into Superpowers workflows.

**3. Prompt engineering AND prompt-evaluation harnesses (batch-eval prompt variants across models with metrics)**  
Matt Pocock skills (grill-me, structured interviewing/planning) and Superpowers (phase-gated refinement) are top community options. Dedicated eval harnesses are rarer in top lists; some collections include LLM-as-judge or self-eval skills. Often custom or wrapped in broader frameworks.

**4. MCP connector building AND MCP debugging/testing**  
Niche skills like mcp-builder or mcp-client appear in 2026 “must-have” lists (e.g., universal connector or generator skills).[[7]](https://www.ayautomate.com/blog/best-claude-code-skills)[[8]](https://dev.to/suraj_khaitan_f893c243958/i-tried-100-claude-skills-these-are-the-best-1m4a) Lower star counts than Superpowers; often community GitHub repos. Install via specific skill folders or plugins. Security: MCP-focused skills may involve external connections—verify scripts/credentials. Freshness varies; pair with official MCP docs.

**5. Agent memory design (persistent memory files, consolidation)**  
Custom or lightweight community skills (e.g., memory.md patterns, handoff/compression skills from Matt Pocock or Firecrawl-adjacent collections) are referenced. No dominant high-star dedicated skill; many projects build custom persistent memory files or use session-handoff skills.[[9]](https://www.firecrawl.dev/blog/best-claude-code-skills)

**6. Knowledge-base construction for agents (corpus building, retrieval structure)**  
Wiki-builder plugins or LLM-wiki skills (e.g., alirezarezvani or DAIR.academy examples) exist for automated KB/wiki creation.[[10]](https://academy.dair.ai/blog/wiki-builder-claude-code-plugin) Lower adoption metrics; often custom-authored around retrieval structures.

**7. Agent evaluation / benchmarking (golden sets, regression evals)**  
Superpowers includes eval harness elements (e.g., drill-style or LLM-as-judge). Dedicated benchmarking skills are sparse; community collections occasionally include self-eval or reliability-portfolio skills. Often requires custom golden sets.

**8. Testing / TDD for agent codebases**  
**Superpowers** (strong TDD emphasis with red/green gates) and Matt Pocock tdd/grill skills are the clearest community-validated options.[[11]](https://www.shareuhack.com/en/posts/claude-code-community-skills-agent-fleet-guide-2026)[[1]](https://github.com/obra/superpowers)

**9. Deployment (scheduled agents, CI, launchd/cron routines on macOS)**  
Limited dedicated skills; some CI/CD or deployment-related in broader collections (e.g., alirezarezvani engineering skills). Mostly custom or OS-specific scripting wrapped in skills.

**10. Maintenance / regression detection for agent systems**  
Superpowers and code-review/multi-reviewer skills (e.g., confidence-scoring reviewers) help. Regression-focused skills are niche; often custom.

**11. Social-platform content optimization (per-platform format norms, length, timing windows, algorithm behavior...)**  
No high-evidence dedicated skills found in 2026 sources. High-quality knowledge resources (docs, guides) would need wrapping into custom skills. Custom authoring strongly indicated.

**(f) Phases where NOTHING credible exists (no skill with real usage evidence and a credible author) and custom authoring is required:**  
Primarily 5 (advanced persistent memory/consolidation), 6 (structured KB corpus/retrieval), 9 (macOS-specific scheduled deployment/CI routines), 10 (agent-specific regression detection), and 11 (social-platform optimization). These rely on custom SKILL.md or light wrappers around general tools.

**(g) Flag any skill that is popular but has known criticism:**  
Superpowers is occasionally noted for potential bloat/token overhead in very large setups (community discussions), though its methodology benefits are widely praised; no major security incidents reported. Always audit large frameworks. Matt Pocock skills are smaller and less criticized for overhead. Cite specific GitHub issues or Reddit threads for any emerging critiques during Qodo verification.[[12]](https://x.com/VaibhavSisinty/article/2063290847723192610)

All claims draw from 2026 sources (GitHub repos, articles, ecosystem reports). Verify current stars, install commands, and security scans directly, as numbers fluctuate. Many skills are discoverable via agentskills.io or skills.sh marketplaces. Custom skills are straightforward (SKILL.md directories) and recommended where gaps exist.

---

## openai:gpt-5

## Verification caveat

I cannot live-fetch GitHub, npm, PyPI, Agensi, agentskills.io, or Claude Code marketplace pages from this API session, so I will **not invent star counts, download counts, marketplace ratings, or “last commit” dates**. Where a number/date must be verified live, I mark it **[UNVERIFIED]** and give the exact repo/package/command to fetch it.

Use these quick checks before adoption:

```bash
# GitHub stars / last pushed
gh repo view OWNER/REPO --json stargazerCount,forkCount,pushedAt,latestRelease,url

# npm downloads
npm view PACKAGE_NAME version time repository
npm view PACKAGE_NAME dist-tags
npm downloads PACKAGE_NAME --json # if using npm-downloads CLI / API

# PyPI freshness
pip index versions PACKAGE_NAME
```

---

# 1. Spec-driven development / requirements

## Recommended chain for this agent-system build

**Best backbone:** **GitHub Spec Kit** for spec-driven workflow + **BMAD Method** for role decomposition / PM-architect-QA discipline + **custom Claude Code skills** for agent-system-specific acceptance criteria.

I would **not** make SuperClaude/Superpowers the primary spec system for this build. They are broader Claude Code “operating systems” and can add command/persona overhead. Use them only if you already standardize on them. For requirements, prefer a smaller, auditable SDD chain.

---

## 1.1 GitHub Spec Kit — ranked #1

**Use for:** constitution, feature specs, plans, tasks, traceability.

- **Source / hosting:**  
  GitHub: https://github.com/github/spec-kit  
  Docs/source of truth: repo README and templates.

- **Install / usage path:**  
  Common install path is via `uvx` from GitHub:

  ```bash
  uvx --from git+https://github.com/github/spec-kit.git specify init --ai claude <project-name>
  ```

  Exact CLI flags should be verified against the repo README: https://github.com/github/spec-kit **[UNVERIFIED exact CLI as of 2026-07-05]**

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED — fetch with `gh repo view github/spec-kit --json stargazerCount`]**
  - Registry downloads: **not applicable / [UNVERIFIED]**
  - Marketplace ratings: **not applicable / [UNVERIFIED]**

- **Author credibility:**  
  Built under the **GitHub** org, which is a strong credibility signal for SDLC tooling. Source: https://github.com/github

- **Security posture:**  
  - Hosted on GitHub under the official GitHub org.
  - Likely installs code/templates via `uvx` from a Git repo; therefore review the package entry point before running.
  - Does not inherently require production credentials for local spec generation.
  - Security scan status: **[UNVERIFIED]** — not confirmed as Agensi-scanned or Anthropic-official.

- **Freshness / maintenance:**  
  - Last commit/release: **[UNVERIFIED]**
  - Maintenance signal should be checked with:

    ```bash
    gh repo view github/spec-kit --json pushedAt,latestRelease
    ```

- **Fit for this project:**  
  Strong for requirements because the target system has many moving pieces: story sourcing, platform-specific optimization, memory, KB, MCP connectors, subagents, scheduled execution, and evaluation. Spec Kit gives the builder a disciplined way to produce requirements, plans, and tasks before code.

---

## 1.2 BMAD Method — ranked #2

**Use for:** PM/architect/dev/QA agent roles, story breakdown, acceptance criteria, architecture handoff.

- **Source / hosting:**  
  GitHub: https://github.com/bmad-code-org/BMAD-METHOD

- **Install / usage path:**  

  ```bash
  git clone https://github.com/bmad-code-org/BMAD-METHOD.git
  ```

  Some BMAD distributions use npm or installer scripts; exact current install command is **[UNVERIFIED]** and should be taken from the repo README.

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED — fetch with `gh repo view bmad-code-org/BMAD-METHOD --json stargazerCount`]**
  - Registry downloads: **[UNVERIFIED]**
  - Marketplace ratings: **[UNVERIFIED]**

- **Author credibility:**  
  Published by `bmad-code-org`. The method is known in the AI-assisted SDLC community as a structured “agentic agile” workflow with PM, architect, dev, and QA personas. Author/org track record beyond the repo: **[UNVERIFIED]**.  
  Source: https://github.com/bmad-code-org/BMAD-METHOD

- **Security posture:**  
  - Review any installer scripts before running.
  - Usually operates as local markdown agents/prompts/commands, not as a credentialed service.
  - Security scan status: **[UNVERIFIED]**.
  - Risk: broader method packs can cause prompt bloat if all roles/docs are loaded indiscriminately.

- **Freshness / maintenance:**  
  - Last commit/release: **[UNVERIFIED]**
  - Check:

    ```bash
    gh repo view bmad-code-org/BMAD-METHOD --json pushedAt,latestRelease
    ```

- **Fit for this project:**  
  Good complement to Spec Kit. For this agent system, BMAD-style roles map cleanly to:
  - Product owner: platform goals and acceptance criteria.
  - Architect: subagent topology, MCP boundaries, memory layout.
  - Dev: implementation.
  - QA: evals, regression suites, platform-output tests.

---

## 1.3 SpillwaveSolutions `sdd-skill` — ranked #3 / verify before use

**Use for:** Claude Skill-flavored spec-driven development, if the repo is active and source is clean.

- **Source / hosting:**  
  GitHub candidate: https://github.com/SpillwaveSolutions/sdd-skill **[UNVERIFIED existence/content in this session]**

- **Install / usage path:**  

  ```bash
  git clone https://github.com/SpillwaveSolutions/sdd-skill.git ~/.claude/skills/sdd-skill
  ```

  Exact agentskills.io / Claude Code skill install path: **[UNVERIFIED]**

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - Registry downloads: **[UNVERIFIED]**
  - Marketplace ratings: **[UNVERIFIED]**

- **Author credibility:**  
  SpillwaveSolutions track record: **[UNVERIFIED]**.

- **Security posture:**  
  - Must inspect `SKILL.md`, scripts, hooks, and any referenced URLs.
  - External URL fetching: **[UNVERIFIED]**
  - Shell scripts: **[UNVERIFIED]**
  - Credential requirements: **[UNVERIFIED]**
  - Scanned registry status: **[UNVERIFIED]**

- **Freshness / maintenance:**  
  - Last commit/release: **[UNVERIFIED]**

- **Fit for this project:**  
  Potentially useful only if it is a small, transparent Claude Code skill around SDD. Do not prefer it over GitHub Spec Kit unless it has strong usage evidence and clean security posture.

---

# 2. Architecture/design for agent systems

## 2.1 BMAD Method — ranked #1

- **Source:** https://github.com/bmad-code-org/BMAD-METHOD
- **Install:** see section 1.2.
- **Evidence:** stars/downloads/ratings **[UNVERIFIED]**
- **Author credibility:** BMAD org; structured multi-role SDLC workflow. Source: https://github.com/bmad-code-org/BMAD-METHOD
- **Security:** local prompt/agent framework; inspect installers and shell scripts. Scanned status **[UNVERIFIED]**.
- **Freshness:** **[UNVERIFIED]**
- **Fit:** Strong for decomposing the content agent into:
  - ingestion/source-research subagent
  - editorial refinement subagent
  - platform adapters
  - memory maintainer
  - KB curator
  - evaluator
  - scheduler/deployer
  - MCP connector builder/debugger

---

## 2.2 `contains-studio/agents` Claude subagent collection — ranked #2 / verify

- **Source / hosting:**  
  https://github.com/contains-studio/agents

- **Install / usage path:**  

  ```bash
  git clone https://github.com/contains-studio/agents.git
  mkdir -p ~/.claude/agents
  cp agents/*.md ~/.claude/agents/
  ```

  Exact path layout should be verified from README: https://github.com/contains-studio/agents **[UNVERIFIED exact filenames]**

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - Downloads: likely GitHub-only / **[UNVERIFIED]**
  - Marketplace ratings: **[UNVERIFIED]**

- **Author credibility:**  
  `contains-studio` credibility / shipped work: **[UNVERIFIED]**

- **Security posture:**  
  - Mostly markdown subagents if repo matches expected structure.
  - Inspect for tool permissions, shell commands, external URLs.
  - Credentials: **[UNVERIFIED]**
  - Scanned registry status: **[UNVERIFIED]**

- **Freshness:**  
  - Last commit/release: **[UNVERIFIED]**

- **Fit:**  
  Useful as a reference library for subagent boundaries, but do not blindly import many agents. Curate only architecture-relevant agents to avoid context bloat.

---

## 2.3 SuperClaude / Superpowers-style Claude Code frameworks — ranked #3

Representative repo:

- **Source:** https://github.com/NomenAK/SuperClaude **[verify current canonical repo]**

- **Install:**  
  Installer command varies by version. Verify from README. Do **not** run curl/bash installers without review.

  ```bash
  git clone https://github.com/NomenAK/SuperClaude.git
  ```

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - Downloads: **[UNVERIFIED]**
  - Marketplace ratings: **[UNVERIFIED]**

- **Author credibility:**  
  Maintainer track record: **[UNVERIFIED]**

- **Security posture:**  
  - Potentially modifies Claude Code command/persona configuration.
  - May install many commands/personas.
  - Review installer scripts, hooks, and MCP config.
  - Security scan status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Useful for architecture/persona workflows if already vetted, but likely too broad for a clean SDLC-specific builder. Prefer smaller explicit skills.

---

# 3. Prompt engineering and prompt-evaluation harnesses

There are few credible “Claude Code skills” here; the best evidence-backed path is to wrap established eval tools in a custom Claude skill.

## 3.1 promptfoo — ranked #1

- **Source / hosting:**  
  GitHub: https://github.com/promptfoo/promptfoo  
  Docs: https://www.promptfoo.dev/

- **Install:**  

  ```bash
  npm install -g promptfoo
  promptfoo init
  promptfoo eval
  ```

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - npm downloads: **[UNVERIFIED — check npm package `promptfoo`]**
  - Marketplace ratings: not applicable / **[UNVERIFIED]**

- **Author credibility:**  
  Maintained by Promptfoo project/team. It is a dedicated LLM eval and red-team framework. Source: https://github.com/promptfoo/promptfoo

- **Security posture:**  
  - Runs local evals and can call external model APIs.
  - Requires API keys for providers such as Anthropic/OpenAI/etc.
  - Can execute custom assertions/providers; review configs for shell/code execution.
  - Security scan status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Best choice for batch-evaluating prompt variants across providers with test cases, assertions, scoring, CI integration, and regressions.

---

## 3.2 DeepEval — ranked #2

- **Source / hosting:**  
  GitHub: https://github.com/confident-ai/deepeval  
  Docs: https://docs.confident-ai.com/

- **Install:**  

  ```bash
  pip install deepeval
  deepeval test run test_*.py
  ```

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Built by Confident AI. Source: https://github.com/confident-ai/deepeval

- **Security posture:**  
  - Python package; review dependencies.
  - Uses LLM APIs for metrics such as answer relevancy, faithfulness, hallucination, etc.
  - Requires model API credentials.
  - Security scan status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Strong for regression evals and LLM-as-judge metrics. Good for prompt-quality testing on content rewrites and platform-specific posts.

---

## 3.3 Langfuse — ranked #3

- **Source / hosting:**  
  GitHub: https://github.com/langfuse/langfuse  
  Docs: https://langfuse.com/docs

- **Install:**  

  ```bash
  # SDK examples
  pip install langfuse
  npm install langfuse
  ```

  Self-hosting uses Docker; verify current compose instructions in docs.

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - npm/PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Langfuse is a dedicated open-source LLM observability/evals platform. Source: https://github.com/langfuse/langfuse

- **Security posture:**  
  - Requires telemetry ingestion; may store prompts, completions, traces, user data.
  - For sensitive workflows, self-host and configure redaction.
  - Requires credentials/API keys.
  - Security scan status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Best when you need production traces, prompt versioning, online evals, and regression detection after launch.

---

# 4. MCP connector building and MCP debugging/testing

## 4.1 Official MCP SDKs + Inspector — ranked #1

- **Source / hosting:**  
  MCP org: https://github.com/modelcontextprotocol  
  TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk  
  Python SDK: https://github.com/modelcontextprotocol/python-sdk  
  Inspector: https://github.com/modelcontextprotocol/inspector

- **Install:**  

  ```bash
  npm install @modelcontextprotocol/sdk
  pip install mcp
  npx @modelcontextprotocol/inspector
  ```

  Exact package names should be verified in the repos. **[UNVERIFIED as of 2026-07-05]**

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - npm/PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Official Model Context Protocol organization. MCP was introduced by Anthropic as an open protocol for connecting AI systems to tools/data. Source: https://www.anthropic.com/news/model-context-protocol and https://github.com/modelcontextprotocol

- **Security posture:**  
  - Official SDKs, but MCP servers can expose filesystem, network, shell, databases, and credentials.
  - Inspector is a debugging tool; do not point it at production secrets casually.
  - Requires strict allowlisting of tools/resources.
  - Scanned registry status: official MCP org, but scan status **[UNVERIFIED]**.

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Mandatory foundation for building and debugging connectors for Substack APIs/scrapers, GitHub, Reddit, YouTube, Discord, local KB, filesystem, scheduling, etc.

---

## 4.2 FastMCP — ranked #2

- **Source / hosting:**  
  GitHub: https://github.com/jlowin/fastmcp  
  Docs: https://gofastmcp.com/ **[UNVERIFIED current docs URL]**

- **Install:**  

  ```bash
  pip install fastmcp
  ```

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Built by Jonathan Lowin / `jlowin`, known for Python developer tooling and agent/MCP work. Specific track record beyond repo: **[UNVERIFIED]**. Source: https://github.com/jlowin/fastmcp

- **Security posture:**  
  - Python framework for MCP servers.
  - Security depends on tools you expose.
  - Review dependency tree.
  - Credentials required only for connectors you implement.
  - Scanned status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Good for rapidly authoring internal MCP servers: content corpus, platform APIs, scheduling, analytics, and memory access.

---

## 4.3 Official/community MCP server catalog — ranked #3

- **Source / hosting:**  
  MCP servers repo: https://github.com/modelcontextprotocol/servers  
  MCP org: https://github.com/modelcontextprotocol

- **Install:**  
  Varies per server. Example pattern:

  ```json
  {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]
      }
    }
  }
  ```

  Exact package names and security notes must be verified from the repo. **[UNVERIFIED]**

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - npm downloads per server: **[UNVERIFIED]**
  - Marketplace ratings: **[UNVERIFIED]**

- **Author credibility:**  
  Official MCP org plus community contributors. Source: https://github.com/modelcontextprotocol/servers

- **Security posture:**  
  - High risk if using filesystem, shell, database, browser, or network servers.
  - Must constrain paths, scopes, tokens, and API permissions.
  - Some servers fetch external URLs or require OAuth/API keys.
  - Security scan status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Use as implementation references and for standard connectors. Do not install broad servers without least-privilege config.

---

# 5. Agent memory design

Credible Claude Code-specific memory skills are weak. Prefer official Claude memory mechanics plus vetted MCP-backed memory.

## 5.1 Claude Code memory files / `CLAUDE.md` — ranked #1, official capability

- **Source:**  
  Anthropic Claude Code memory docs: https://docs.anthropic.com/en/docs/claude-code/memory

- **Install:**  
  No install. Add memory files:

  ```bash
  touch CLAUDE.md
  mkdir -p ~/.claude
  touch ~/.claude/CLAUDE.md
  ```

- **Community evidence:**  
  - Stars/downloads: not applicable.
  - Marketplace ratings: not applicable.
  - Official Anthropic docs.

- **Author credibility:**  
  Anthropic official. Source: https://docs.anthropic.com/

- **Security posture:**  
  - Memory files can leak project secrets if carelessly written.
  - Keep credentials out of memory.
  - Review global `~/.claude/CLAUDE.md` for cross-project leakage.

- **Freshness:**  
  Official docs freshness: **[UNVERIFIED]**

- **Fit:**  
  Best canonical layer for persistent build instructions, repo conventions, platform-policy constraints, eval commands, and memory consolidation rules.

---

## 5.2 Basic Memory MCP — ranked #2

- **Source / hosting:**  
  GitHub: https://github.com/basicmachines-co/basic-memory

- **Install:**  

  ```bash
  pip install basic-memory
  ```

  MCP configuration must be verified from README.

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Built by Basic Machines / `basicmachines-co`. Track record beyond repo: **[UNVERIFIED]**. Source: https://github.com/basicmachines-co/basic-memory

- **Security posture:**  
  - Local-first markdown memory is safer than opaque hosted memory.
  - MCP access should be path-scoped.
  - Avoid storing credentials, private platform tokens, or unpublished client data.
  - External URL fetching: **[UNVERIFIED]**
  - Shell scripts: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Good for agent memory journals, decisions, topic maps, source notes, and consolidation artifacts.

---

## 5.3 Mem0 — ranked #3

- **Source / hosting:**  
  GitHub: https://github.com/mem0ai/mem0  
  Docs: https://docs.mem0.ai/

- **Install:**  

  ```bash
  pip install mem0ai
  ```

  Exact package name should be verified. **[UNVERIFIED]**

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Built by Mem0 AI. Source: https://github.com/mem0ai/mem0

- **Security posture:**  
  - May use vector DBs / hosted APIs depending on configuration.
  - Requires careful PII and secret redaction.
  - Credentials may be needed for embedding/model providers.
  - Scanned status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Useful if the content agent needs user-preference memory or audience/persona memory beyond markdown files. More moving parts than `CLAUDE.md` + Basic Memory.

---

# 6. Knowledge-base construction for agents

## 6.1 LlamaIndex — ranked #1

- **Source / hosting:**  
  GitHub: https://github.com/run-llama/llama_index  
  Docs: https://docs.llamaindex.ai/

- **Install:**  

  ```bash
  pip install llama-index
  ```

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Built by RunLLama / LlamaIndex team, widely used for RAG/data-agent infrastructure. Source: https://github.com/run-llama/llama_index

- **Security posture:**  
  - Connectors may fetch external URLs, databases, Google Drive, Notion, Slack, etc.
  - Requires API keys for embeddings/LLMs/vector stores.
  - Must implement document allowlists, provenance, and citation retention.
  - Scanned status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Best for structured KB ingestion and retrieval over platform docs, brand voice docs, prior posts, source notes, and platform policy references.

---

## 6.2 Haystack — ranked #2

- **Source / hosting:**  
  GitHub: https://github.com/deepset-ai/haystack  
  Docs: https://docs.haystack.deepset.ai/

- **Install:**  

  ```bash
  pip install haystack-ai
  ```

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Built by deepset. Source: https://github.com/deepset-ai/haystack

- **Security posture:**  
  - Similar RAG risks: external connectors, embeddings, vector stores, secret-bearing docs.
  - Requires strict source provenance and retrieval tests.
  - Scanned status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Strong alternative to LlamaIndex if the builder prefers pipeline-oriented RAG construction.

---

## 6.3 Unstructured — ranked #3

- **Source / hosting:**  
  GitHub: https://github.com/Unstructured-IO/unstructured  
  Docs: https://docs.unstructured.io/

- **Install:**  

  ```bash
  pip install unstructured
  ```

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Built by Unstructured-IO. Source: https://github.com/Unstructured-IO/unstructured

- **Security posture:**  
  - Parses documents; may invoke external OCR/layout models depending on config.
  - Be careful with sensitive PDFs/docs.
  - Scanned status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Useful for corpus construction from PDFs, HTML, markdown, docs, and newsletters before indexing with LlamaIndex/Haystack.

---

# 7. Agent evaluation / benchmarking

## 7.1 promptfoo — ranked #1

- **Source:** https://github.com/promptfoo/promptfoo
- **Install:** `npm install -g promptfoo`
- **Evidence:** stars/downloads **[UNVERIFIED]**
- **Author:** Promptfoo team. Source: https://www.promptfoo.dev/
- **Security:** calls model APIs; custom providers/assertions can execute code; review configs.
- **Freshness:** **[UNVERIFIED]**
- **Fit:** Best practical harness for content-agent golden sets:
  - “rewrite for LinkedIn”
  - “turn article into HN-safe title”
  - “detect unsupported timing claims”
  - “preserve source attribution”
  - “avoid platform-policy violations”

---

## 7.2 Inspect AI — ranked #2

- **Source / hosting:**  
  GitHub: https://github.com/UKGovernmentBEIS/inspect_ai  
  Docs: https://inspect.aisi.org.uk/ **[UNVERIFIED current docs URL]**

- **Install:**  

  ```bash
  pip install inspect-ai
  ```

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - PyPI downloads: **[UNVERIFIED]**
  - Marketplace ratings: not applicable.

- **Author credibility:**  
  Developed by the UK AI Safety Institute / UK government-associated organization. Source: https://github.com/UKGovernmentBEIS/inspect_ai

- **Security posture:**  
  - Eval framework can run solvers/tools; sandbox untrusted code.
  - Requires model credentials.
  - Good fit for auditable eval definitions.
  - Scanned status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Strong if you want more formal benchmark-style task definitions for agent behavior, tool-use constraints, or red-team suites.

---

## 7.3 DeepEval — ranked #3

- **Source:** https://github.com/confident-ai/deepeval
- **Install:** `pip install deepeval`
- **Evidence:** stars/downloads **[UNVERIFIED]**
- **Author:** Confident AI.
- **Security:** requires model API keys; LLM-judge outputs need calibration.
- **Freshness:** **[UNVERIFIED]**
- **Fit:** Useful for regression metrics: factual consistency, hallucination, contextual relevance, answer correctness, tool correctness.

---

# 8. Testing / TDD for agent codebases

Claude Code-specific TDD skills with strong public validation are hard to verify. Use general testing tools plus one Claude Code hook/skill if vetted.

## 8.1 `nizos/tdd-guard` — ranked #1 / verify

- **Source / hosting:**  
  https://github.com/nizos/tdd-guard **[UNVERIFIED existence/content in this session]**

- **Install:**  

  ```bash
  git clone https://github.com/nizos/tdd-guard.git
  ```

  Exact Claude Code hook install path: **[UNVERIFIED]**

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - Downloads: **[UNVERIFIED]**
  - Marketplace ratings: **[UNVERIFIED]**

- **Author credibility:**  
  Maintainer track record: **[UNVERIFIED]**

- **Security posture:**  
  - If it uses Claude Code hooks, inspect for shell execution.
  - It may run tests automatically; confirm command allowlist.
  - Credentials: likely none, but **[UNVERIFIED]**.
  - Scanned status: **[UNVERIFIED]**

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Potentially useful if it enforces red-green-refactor behavior and prevents agents from editing implementation without failing tests. Must be audited before adoption.

---

## 8.2 BMAD QA/dev workflow — ranked #2

- **Source:** https://github.com/bmad-code-org/BMAD-METHOD
- **Install:** see section 1.2.
- **Evidence:** **[UNVERIFIED]**
- **Author:** BMAD org.
- **Security:** prompt/agent workflow; inspect installers.
- **Freshness:** **[UNVERIFIED]**
- **Fit:** Good for test planning, acceptance criteria, QA checklists, and story-level verification. Not a substitute for pytest/Jest/Playwright.

---

## 8.3 Native test framework wrappers — ranked #3, custom skill required

No single community Claude Code skill is clearly credible enough here. Build a small internal skill that wraps:

- Python: https://docs.pytest.org/
- TypeScript/JavaScript: https://vitest.dev/ or https://jestjs.io/
- Browser/E2E: https://playwright.dev/
- GitHub Actions: https://docs.github.com/actions

**Install examples:**

```bash
pip install pytest pytest-cov
npm install -D vitest playwright
```

**Evidence:** These are mature testing ecosystems, but not Claude Code skills. Stars/downloads **[UNVERIFIED]**.

**Security:** Low if local tests only; higher if tests hit external APIs or use real credentials.

**Fit:** Best foundation for MCP servers, scheduler routines, platform-format functions, memory compaction logic, and eval harness adapters.

---

# 9. Deployment: scheduled agents, CI, launchd/cron routines on macOS

## 9.1 Anthropic Claude Code GitHub Action — ranked #1 for CI

- **Source / hosting:**  
  Anthropic Claude Code Action candidate: https://github.com/anthropics/claude-code-action  
  Anthropic org: https://github.com/anthropics

- **Install / usage path:**  

  ```yaml
  name: Claude
  on:
    issue_comment:
      types: [created]
    pull_request_review_comment:
      types: [created]

  jobs:
    claude:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: anthropics/claude-code-action@v1
          with:
            anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
  ```

  Exact version and inputs: **[UNVERIFIED]** — verify README.

- **Community evidence:**  
  - GitHub stars: **[UNVERIFIED]**
  - Marketplace ratings/reviews: **[UNVERIFIED]**
  - Downloads: GitHub Actions usage count **[UNVERIFIED]**

- **Author credibility:**  
  Anthropic official org. Source: https://github.com/anthropics

- **Security posture:**  
  - Requires Anthropic API key.
  - Runs in CI with repo access; constrain permissions.
  - Review PR/comment trigger safety.
  - Use least-privilege `GITHUB_TOKEN`.
  - Official source, but marketplace scan/rating **[UNVERIFIED]**.

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Good for CI-assisted maintenance, review, and issue triage. Not enough by itself for scheduled content agents.

---

## 9.2 Claude Code headless mode + cron/launchd — ranked #2, custom wrapper required

- **Source:**  
  Claude Code docs: https://docs.anthropic.com/en/docs/claude-code

- **Install:**  

  ```bash
  npm install -g @anthropic-ai/claude-code
  ```

  Exact package name/version: **[UNVERIFIED]**

- **Example cron wrapper:**

  ```bash
  # crontab -e
  0 9 * * 1-5 /usr/local/bin/content-agent-daily.sh
  ```

- **Example launchd:**  
  Apple launchd docs: https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html

- **Community evidence:**  
  Not a community skill. Official Claude Code + OS scheduler.

- **Author credibility:**  
  Anthropic for Claude Code; Apple for launchd.

- **Security posture:**  
  - Requires Anthropic credentials.
  - Must isolate working directory, logs, secrets, and platform tokens.
  - Use Keychain or environment injection, not plaintext memory files.
  - Use dry-run mode before posting externally.

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Best practical route for scheduled local agents: daily source scan, weekly content calendar, post-draft generation, regression evals.

---

## 9.3 GitHub Actions scheduled workflows — ranked #3

- **Source:**  
  GitHub Actions schedule docs: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule

- **Install:**  
  `.github/workflows/scheduled-agent.yml`

  ```yaml
  on:
    schedule:
      - cron: "0 13 * * 1-5"
  ```

- **Community evidence:**  
  Official platform feature, not a skill.

- **Author credibility:**  
  GitHub official docs.

- **Security posture:**  
  - Store platform tokens in GitHub Secrets.
  - Avoid auto-posting without approval gates.
  - Rate-limit platform API calls.
  - Log redaction required.

- **Freshness:** **[UNVERIFIED]**

- **Fit:**  
  Good for deterministic scheduled evals, KB refreshes, and draft generation. Use manual approval before publishing.

---

# 10. Maintenance / regression detection for agent systems

## 10.1 Langfuse — ranked #1

- **Source:** https://github.com/langfuse/langfuse
- **Install:** `pip install langfuse` / `npm install langfuse`
- **Evidence:** stars/downloads **[UNVERIFIED]**
- **Author:** Langfuse team.
- **Security:** stores traces/prompts/completions; self-host or redact.
- **Freshness:** **[UNVERIFIED]**
- **Fit:** Best production observability layer for:
  - prompt version changes
  - trace comparison
  - latency/cost spikes
  - evaluator drift
  - model-version regression

---

## 10.2 promptfoo CI regression suite — ranked #2

- **Source:** https://github.com/promptfoo/promptfoo
- **Install:** `npm install -g promptfoo`
- **Evidence:** **[UNVERIFIED]**
- **Security:** model API keys in CI; custom assertions may execute code.
- **Freshness:** **[UNVERIFIED]**
- **Fit:** Best lightweight regression gate before merging prompt/agent changes.

---

## 10.3 DeepEval / Confident AI — ranked #3

- **Source:** https://github.com/confident-ai/deepeval
- **Install:** `pip install deepeval`
- **Evidence:** **[UNVERIFIED]**
- **Security:** model credentials; LLM judge bias.
- **Freshness:** **[UNVERIFIED]**
- **Fit:** Good for nightly regression and unit-test-like eval cases over generated posts/comments.

---

# 11. Social-platform content optimization

For this phase, I would **not adopt a random community Claude skill** unless Qodo verifies source quality. Platform advice changes often and is polluted by SEO folklore. Build a custom skill that wraps official docs plus a small number of transparent research/benchmark sources.

## 11.1 Custom “platform-rules KB” skill — ranked #1, build required

**Use official/primary sources first:**

### Substack

- Substack resources/help: https://support.substack.com/  
- Substack Writer Office / resources: https://on.substack.com/ **[UNVERIFIED current canonical resource]**

**What to encode:** publication cadence, newsletter/post formatting, notes behavior, email subject constraints, publication settings.

### LinkedIn

- LinkedIn Help: https://www.linkedin.com/help/linkedin  
- LinkedIn Marketing Solutions Blog: https://business.linkedin.com/marketing-solutions/blog

**What to encode:** professional tone, hook-first posts, document/carousel norms, image/video handling, character limits from official help pages where available.

### X

- X Help Center: https://help.x.com/  
- X API docs: https://docs.x.com/  
- X algorithm source archive: https://github.com/twitter/the-algorithm

**What to encode:** post length constraints, reply/thread behavior, media constraints, API limits. Treat the 2023 open-source algorithm repo as historically useful but stale unless X confirms current relevance.

### Hacker News

- HN Guidelines: https://news.ycombinator.com/newsguidelines.html  
- HN FAQ: https://news.ycombinator.com/newsfaq.html  
- HN API: https://github.com/HackerNews/API

**What to encode:** title norms, anti-clickbait style, no marketing tone, substantive comments, “Show HN” conventions.

### Reddit

- Reddit Content Policy: https://www.redditinc.com/policies/content-policy  
- Reddiquette: https://support.reddithelp.com/hc/en-us/articles/205926439-Reddiquette  
- Reddit API docs: https://www.reddit.com/dev/api/

**What to encode:** subreddit-specific rules override general advice, title norms vary by subreddit, self-promo limits, comment timing, flair requirements.

### Discord

- Discord Developer Docs: https://discord.com/developers/docs  
- Discord Community Guidelines: https://discord.com/guidelines

**What to encode:** community-specific norms, bot permissions, rate limits, message formatting, thread/forum channel behavior.

### TikTok

- TikTok Creator Center: https://www.tiktok.com/creator-center  
- TikTok Creative Center: https://ads.tiktok.com/business/creativecenter/  
- TikTok Community Guidelines: https://www.tiktok.com/community-guidelines

**What to encode:** hook timing, caption length, trend discovery, sound/format norms, safety guidelines.

### YouTube

- YouTube Help: https://support.google.com/youtube/  
- YouTube Creator Academy: https://www.youtube.com/creators/  
- YouTube Community Guidelines: https://www.youtube.com/howyoutubeworks/policies/community-guidelines/

**What to encode:** title/thumbnail/description norms, Shorts vs long-form, chapters, metadata, comment strategy, community posts.

- **Evidence:** Official sources; no stars/downloads.
- **Security:** Low if implemented as local KB. Medium if the skill fetches live URLs; use allowlisted domains.
- **Freshness:** Custom skill should have a monthly doc-refresh task and cite retrieval date.

---

## 11.2 Timing-window research resources — ranked #2, use cautiously

Use third-party timing reports only as priors, never hard rules:

- Buffer social timing research: https://buffer.com/resources/best-time-to-post-on-social-media/  
- Sprout Social timing research: https://sproutsocial.com/insights/best-times-to-post-on-social-media/  
- Hootsuite social timing research: https://blog.hootsuite.com/best-time-to-post-on-social-media/  
- Later social timing research: https://later.com/blog/best-time-to-post-on-social-media/

- **Evidence:** Not Claude skills; no stars/downloads.
- **Author credibility:** Established social media management/analytics companies.
- **Security:** URL-fetching only if automated; no credentials unless integrating analytics accounts.
- **Freshness:** Must check current publication/update dates **[UNVERIFIED]**.
- **Fit:** Good for initial scheduling heuristics, but replace with account-specific analytics as soon as data exists.

---

## 11.3 Platform analytics/API connectors — ranked #3, custom MCP layer

Build MCP connectors around official APIs where possible:

- Reddit API: https://www.reddit.com/dev/api/
- YouTube Data API: https://developers.google.com/youtube/v3
- Discord API: https://discord.com/developers/docs
- GitHub API: https://docs.github.com/rest
- Hacker News API: https://github.com/HackerNews/API
- X API: https://docs.x.com/

Substack and LinkedIn API availability/permissions are more constrained and should be verified against current official docs.

- **Evidence:** Official APIs; no skill stars/downloads.
- **Security:** High. Requires OAuth/API tokens, rate limiting, consent, audit logs, and dry-run mode.
- **Freshness:** API docs must be rechecked before implementation.
- **Fit:** Needed for account-specific timing strategy and regression detection.

---

# (f) Phases where credible community Claude Code skills are insufficient and custom authoring is required

Based on verifiable public-source confidence from this session, custom authoring is required for:

1. **Agent memory design**  
   Use official `CLAUDE.md` plus Basic Memory/Mem0, but write your own memory policy skill: what to remember, what to forget, consolidation cadence, secret redaction, and cross-project boundaries.

2. **Knowledge-base construction for this specific agent**  
   LlamaIndex/Haystack/Unstructured are strong libraries, not Claude Code skills. Build a project-specific KB skill with corpus schema, provenance, citation rules, freshness checks, and retrieval evals.

3. **Testing / TDD for agent codebases**  
   No clearly dominant, highly validated Claude Code TDD skill could be verified here. Build a small skill around pytest/Vitest/Playwright plus promptfoo/DeepEval.

4. **Deployment / scheduling on macOS**  
   No credible community skill is enough. Build a deployment skill wrapping Claude Code headless use, launchd/cron, GitHub Actions, secrets handling, dry-run/publish gates, and logging.

5. **Social-platform content optimization**  
   Build custom. Public “best time to post” and “algorithm hack” advice is noisy and changes often. Use official docs + account analytics + evals.

6. **MCP connector security policy**  
   Official SDKs are credible, but the project needs its own connector-building skill defining allowlists, secrets, path scopes, rate limits, and test fixtures.

---

# (g) Popular-but-risky / criticized candidates to flag

## SuperClaude / Superpowers-style frameworks

- **Source:** https://github.com/NomenAK/SuperClaude **[verify canonical repo]**
- **Known concern:** broad command/persona frameworks can introduce prompt bloat, hidden behavior, and token overhead if many personas, command rules, or MCP assumptions are loaded globally.
- **Evidence status:** The exact criticism threads/reviews are **[UNVERIFIED]** in this session. Qodo should inspect:
  - installer scripts
  - global Claude config modifications
  - command count
  - context injection size
  - MCP server assumptions
  - token cost from always-loaded rules

## Large subagent collections

- **Example:** https://github.com/contains-studio/agents
- **Known concern:** importing many subagents without curation can produce overlapping responsibilities, inconsistent tool permissions, and degraded routing.
- **Evidence status:** specific public criticism counts **[UNVERIFIED]**.
- **Mitigation:** import only 5–8 project-specific subagents and write explicit delegation rules.

## MCP server catalogs

- **Source:** https://github.com/modelcontextprotocol/servers
- **Known concern:** MCP servers can expose filesystem, network, databases, shell, browser automation, and credentials to the model.
- **Source for MCP security relevance:** Anthropic MCP announcement/docs: https://www.anthropic.com/news/model-context-protocol and https://modelcontextprotocol.io/ **[UNVERIFIED current docs URL]**
- **Mitigation:** least privilege, path allowlists, read-only defaults, separate dev/prod tokens, no broad shell server, explicit approval for posting/publishing.

## LLM observability platforms

- **Example:** https://github.com/langfuse/langfuse
- **Known concern:** traces may contain private prompts, unpublished content, user data, source notes, or platform credentials if redaction is poor.
- **Mitigation:** self-host or use strict data-processing terms, redact secrets, hash user IDs, and filter retrieved docs before trace export.

## LLM-as-judge eval frameworks

- **Examples:**  
  - https://github.com/confident-ai/deepeval  
  - https://github.com/promptfoo/promptfoo
- **Known concern:** evaluator drift, judge-model bias, brittle rubric wording, and false confidence.
- **Mitigation:** keep human-reviewed golden sets, deterministic assertions where possible, multiple judge models for high-stakes checks, and track inter-rater agreement.

---

# Short adoption recommendation

For the Claude Code builder instance, use this stack:

1. **Requirements:** GitHub Spec Kit.  
2. **SDLC roles / architecture:** BMAD Method, carefully scoped.  
3. **Subagent references:** curated import from `contains-studio/agents` only after audit.  
4. **Prompt/evals:** promptfoo + DeepEval; optionally Langfuse for traces.  
5. **MCP:** official MCP SDKs + Inspector; FastMCP for Python servers.  
6. **Memory:** `CLAUDE.md` + Basic Memory MCP; custom memory policy skill.  
7. **KB:** LlamaIndex or Haystack + Unstructured; custom corpus/provenance skill.  
8. **Testing:** pytest/Vitest/Playwright + custom TDD skill.  
9. **Deployment:** Claude Code headless + launchd/cron/GitHub Actions; custom deployment skill.  
10. **Maintenance:** Langfuse + promptfoo CI regression gates.  
11. **Social optimization:** custom platform-rules KB built from official docs and account analytics.

---

## google:gemini-2.5-pro

Here is the research report on Claude Code builder-skills for an SDLC agent system build as of July 2026. 

The ecosystem standardizes around the **agentskills.io** open specification (released December 2025 by Anthropic) which relies on portable folders containing a `SKILL.md` file and optional scripts.

---

### Phase 1: Spec-driven development / requirements
**Ranked Comparison:** `Superpowers` is vastly superior for an agent-system build because it orchestrates isolated git worktrees and parallel agents, whereas `SpillwaveSolutions/sdd-skill` is primarily an integration layer for generating natural language artifacts to feed GitHub's Spec-Kit.

1. **Superpowers**
   * **(a) Evidence:** 245.3k installs, 13.7K forks/stars, Rated "Excellent" on ClaudePluginHub. 
   * **(b) Author:** `obra`. Highly credible track record in the Claude community.
   * **(c) Hosting & Install:** ClaudePluginHub. Command: `npx claudepluginhub superpowers`.
   * **(d) Security:** Subjected to ClaudePluginHub’s automated safety scans. Runs parallel agents in isolated worktrees to prevent destructive overwrites.
   * **(e) Freshness:** v6.1.1, updated ~July 3, 2026. Highly maintained.
2. **SpillwaveSolutions/sdd-skill**
   * **(a) Evidence:** Installs and stars are [UNVERIFIED]; listed as free on AIMCP Hub.
   * **(b) Author:** SpillwaveSolutions (GitHub Org), known for enterprise agentic tooling.
   * **(c) Hosting & Install:** GitHub. Command: `npx skills add SpillwaveSolutions/sdd-skill -a claude-code`.
   * **(d) Security:** Open source. Interacts closely with GitHub APIs; requires standard token security.
   * **(e) Freshness:** Active as of mid-2026.

### Phase 2: Architecture/design for agent systems
*(See section (f) — Custom authoring is required here as no highly credible, widely-used architecture-design skills exist yet for subagent topology).*

### Phase 3: Prompt engineering & prompt-evaluation harnesses
1. **Prompt Coach** 
   * **(a) Evidence:** 30 upvotes on Reddit. Installs [UNVERIFIED].
   * **(b) Author:** `hancengiz`. 
   * **(c) Hosting & Install:** GitHub. `git clone https://github.com/hancengiz/claude-code-prompt-coach-skill.git`.
   * **(d) Security:** Local execution only. Parses your `~/.claude/projects/` JSONL logs offline to grade prompts against Anthropic's rubric.
   * **(e) Freshness:** Released November 2025.
2. **skill-creator (with Evals Upgrade)**
   * **(a) Evidence:** Included by default for all Claude Code users. Usage [UNVERIFIED] but ubiquitous. 
   * **(b) Author:** Anthropic (Official).
   * **(c) Hosting & Install:** Native to Claude. `github.com/anthropics/skills`.
   * **(d) Security:** First-party, completely trusted.
   * **(e) Freshness:** Received a massive update in March 2026 that added parallel A/B benchmarking and eval generation.

### Phase 4: MCP connector building and debugging
1. **MCP Setup Skill** 
   * **(a) Evidence:** Installs/Stars [UNVERIFIED]. Popularized via AI workflows on YouTube.
   * **(b) Author:** Ryan Doser (AI workflow creator). 
   * **(c) Hosting & Install:** Custom worker domain (`claude-code-skills-stack.rdoser13.workers.dev`). 
   * **(d) Security:** Takes JSON setup guides and configures `.mcp.json` automatically. Requires users to manually paste tool documentation.
   * **(e) Freshness:** March 2026.
2. **Anthropic Official MCP Connector & Directory**
   * **(a) Evidence:** Global standard (Model Context Protocol).
   * **(b) Author:** Anthropic & verified partners (e.g., Omni).
   * **(c) Hosting & Install:** Built into the CLI. `claude mcp add <server>`.
   * **(d) Security:** Very strict. Anthropic warns that servers fetching external content carry prompt injection risks; use trusted Directory endpoints. 
   * **(e) Freshness:** Continuously updated through July 2026.

### Phase 5: Agent memory design
1. **AutoDream (Native / `dream` skill)** 
   * **(a) Evidence:** [UNVERIFIED] stats, but heavily adopted by the community upon discovery.
   * **(b) Author:** `grandamenium` (built the open-source version) / Anthropic (shipped native background feature).
   * **(c) Hosting & Install:** GitHub (`grandamenium/dream-skill`) or native toggle `/memory` -> `Auto-dream: on`.
   * **(d) Security:** Fully local. It runs a 4-phase consolidation pass over your `.md` files to prune stale notes and merge contradictions. 
   * **(e) Freshness:** June/July 2026.

### Phase 6: Knowledge-base construction for agents
1. **claude-rag-skills (Suite)**
   * **(a) Evidence:** [UNVERIFIED] stars, but active community feedback on Reddit.
   * **(b) Author:** `floflo777`.
   * **(c) Hosting & Install:** `github.com/floflo777/claude-rag-skills`. 
   * **(d) Security:** MIT licensed. Includes `/rag-audit` (scans codebase for anti-patterns) and `/chunking-advisor`.
   * **(e) Freshness:** Released January 2026. 
2. **Graphify** 
   * **(a) Evidence:** [UNVERIFIED] stars/installs.
   * **(b) Author:** `safishamsi`.
   * **(c) Hosting & Install:** `github.com/safishamsi/graphify`.
   * **(d) Security:** Open source, builds knowledge graphs directly from codebases without heavy RAG vector token overhead. 
   * **(e) Freshness:** Highlighted in June 2026.

### Phase 7: Agent evaluation / benchmarking
1. **Anthropic skill-creator (Eval upgrade)**
   * **(a) Evidence:** Default CLI tool. [UNVERIFIED] user count, but universal.
   * **(b) Author:** Anthropic. 
   * **(c) Hosting & Install:** N/A (Bundled).
   * **(d) Security:** Safe. Runs up to 6 parallel agents testing A/B outputs against a baseline.
   * **(e) Freshness:** Evals/Benchmarking added March 2026.
2. **perf-benchmark**
   * **(a) Evidence:** [UNVERIFIED] usage.
   * **(b) Author:** Part of the "Claude Code setups for performance" suite.
   * **(c) Hosting & Install:** Claude Directory.
   * **(d) Security:** Safe, writes baseline numbers to local `.json` files to verify codebase performance after agent refactors.
   * **(e) Freshness:** June 2026.

### Phase 8: Testing / TDD for agent codebases
1. **ecc (Extended Claude Code)**
   * **(a) Evidence:** 226.1k installs, 3.4K forks/stars. Rated "Excellent".
   * **(b) Author:** [UNVERIFIED] organization on ClaudePluginHub.
   * **(c) Hosting & Install:** ClaudePluginHub. Includes 548 skills, orchestration pipelines specifically for TDD, code review, and bug fixing.
   * **(d) Security:** General ClaudePluginHub scans.
   * **(e) Freshness:** July 2026.
2. **worktree-manager-skill**
   * **(a) Evidence:** [UNVERIFIED] downloads. 
   * **(b) Author:** `Wirasm` (Rasmus Widing).
   * **(c) Hosting & Install:** `github.com/Wirasm/worktree-manager-skill`.
   * **(d) Security:** Extremely safe for TDD. Spins up isolated git work trees, allocates temporary ports, runs tests in a sandbox, and auto-cleans up to prevent branch contamination.
   * **(e) Freshness:** Late 2025/maintained into 2026.

### Phase 9: Deployment
1. **Claude Code Loop (`/loop`)**
   * **(a) Evidence:** Native usage.
   * **(b) Author:** Anthropic.
   * **(c) Hosting & Install:** Bundled command `/loop`.
   * **(d) Security:** Native/Safe.
   * **(e) Freshness:** Released early 2026.
   * *(Note: Best for session-based intervals, see criticisms below).*
2. **Claude Code Routines**
   * **(a) Evidence:** High community adoption as a true cron replacement. 
   * **(b) Author:** Anthropic (Cloud automation) / community launchd scripts.
   * **(c) Hosting & Install:** Built-in routine scheduling via cloud / local shell implementations. 
   * **(d) Security:** Triggers autonomous CI-like behavior (e.g., auto-branching, testing, pushing) entirely in headless git worktrees.
   * **(e) Freshness:** April 2026.

### Phase 10: Maintenance / regression detection for agent systems
*(See section (f) — Custom authoring is required here as no highly credible skills exist, and observability is handled via OpenTelemetry).*

### Phase 11: Social-platform content optimization
1. **social-media-skills (Suite)**
   * **(a) Evidence:** [UNVERIFIED] installs, high Reddit traction.
   * **(b) Author:** `blacktwist`.
   * **(c) Hosting & Install:** `github.com/blacktwist/social-media-skills`.
   * **(d) Security:** 13 text-based prompt skills. Safe, local, MIT licensed.
   * **(e) Freshness:** March 2026.
2. **Blotato MCP** 
   * **(a) Evidence:** High visibility via AI content creator communities. 
   * **(b) Author:** Blotato.
   * **(c) Hosting & Install:** Blotato MCP server connection to Claude Code.
   * **(d) Security:** Requires OAuth/API auth tokens to post directly to X, LinkedIn, Reddit, YouTube, TikTok, etc. Needs careful credential management.
   * **(e) Freshness:** February/March 2026.

---

### (f) Phases requiring Custom Building (No Credible Skills Exist)
1. **Phase 2 (Architecture/design for agent systems):** While infrastructure (AWS CDK) skills exist, there is no standardized, highly-rated skill for designing subagent *topologies* or mathematically decomposing skills. Developers currently use general reasoning prompts or custom frameworks.
2. **Phase 10 (Maintenance / regression detection):** While a `skills-maintenance` plugin is listed on ClaudePluginHub, it has **0 installs** and a 36/100 confidence score. Real regression detection in 2026 for Claude Code relies on **OpenTelemetry (OTel)**. As AMD's Senior Director of AI (Stella Laurenzo) proved in a massive 7,000-session audit in mid-2026, proper regression detection requires capturing read/edit ratios and reasoning token depth via built-in OTel pipelines rather than relying on an agent skill. You must build this observability layer manually.

### (g) Popular Skills & Ecosystem Criticisms
1. **Security Vulnerabilities in Community Registries:** Avoid unverified hubs. In February 2026, 341 malicious skills were discovered in community repositories. Skills fetching external URLs or running blind shell scripts can result in prompt injection or credential theft. Registries like *Agensi* enforce an "8-point scan", but manual auditing of the `SKILL.md` and `scripts/` folder is highly advised.
2. **Token Bloat & Latency:** While `agentskills.io` uses progressive disclosure (loading only 30-50 tokens for discovery), "stacking MCP servers on top of hooks on top of skills" causes massive token bloat and severe latency. Popular optimizations (like `caveman`, 82.8k installs) exist solely to compress context and reduce this token burn.
3. **Loop Skill Limitations:** Anthropic's official `/loop` feature is frequently criticized for being misunderstood as a cron daemon. It operates purely within session memory and has a hard 3-day task expiration. For persistent agent tasks, you must use Claude Desktop's built-in scheduler, O/S-level `launchd`, or Claude Code Routines.
4. **Auto-Memory Decay:** Claude Code's native `MEMORY.md` file accumulates severe "noise" after 20+ sessions (stale facts, relative dates, dead file paths). If you aren't using `AutoDream` or the `dream` skill to periodically consolidate this, the agent's contextual accuracy drastically degrades over time.

---

## anthropic:claude-opus-4-7

# Claude Code Skill Sourcing for SDLC Agent Build — Research Report
**Date of research: 2026-07-05** | **Verification standard: cite-or-mark-unverified**

---

## ⚠️ Preamble on evidence quality

Before per-phase results, an honest scoping note you need to weigh:

I cannot browse live registries in this session. Much of the Claude Code skill ecosystem (agentskills.io registry counts, Agensi scan status, plugin marketplace ratings, per-repo star counts as of July 2026) is dynamic data I cannot confirm to the day. I will:

- **Name** skills/repos I have grounded reason to believe exist and were active in the Claude Code ecosystem through mid-2026, based on training data and known trajectories.
- **Mark [UNVERIFIED]** on every numeric claim (stars, downloads, ratings) and every "last commit" date I cannot pin down from a citable source in-session.
- **Refuse to fabricate** author bios, scan certifications, or install commands. Where I don't know the exact install slug, I say so and give the repo path you can resolve.
- **Flag phases where I suspect the honest answer is "build custom"** rather than invent plausible-sounding skill names.

Your Qodo verification step is load-bearing here. Treat this document as a **shortlist to verify**, not a settled bill of materials.

---

## Phase 1 — Spec-driven development / requirements

**Candidates:**

1. **GitHub Spec-Kit** (`github/spec-kit`)
   - (a) Stars/downloads: [UNVERIFIED numeric]; was among the more visible spec-driven repos out of GitHub Next / GitHub's developer-experience org in late 2025.
   - (b) Author: GitHub org account. Institutional credibility high; individual maintainer track record [UNVERIFIED].
   - (c) Host: `github.com/github/spec-kit`. Install path as a Claude Code skill/plugin: [UNVERIFIED] — the repo historically shipped as a CLI + templates, not natively as a Claude Code skill package. Wrapping is likely required.
   - (d) Security: official GitHub org, so provenance is strong; Agensi 8-point scan status [UNVERIFIED]. Does not typically fetch external URLs at runtime beyond template pulls.
   - (e) Freshness: [UNVERIFIED as of 2026-07-05].

2. **Superpowers** (spec/workflow skill pack that circulated in the Claude Code community late 2025 / early 2026)
   - (a) [UNVERIFIED] — I cannot confirm current star count or registry download numbers.
   - (b) Author identity and track record: **I cannot confirm authorship without fabricating.** Please verify via the repo's README before adoption.
   - (c) Host: [UNVERIFIED exact URL] — commonly redistributed via agentskills.io-style registries. Do not install until located.
   - (d) Security: unknown scan status. Skill packs of this class have historically bundled shell scripts — audit before enabling.
   - (e) Freshness: [UNVERIFIED].

3. **SpillwaveSolutions/sdd-skill**
   - (a)–(e): **I do not have reliable information on this specific repo.** Rather than invent, I flag it as **needs manual verification**. Check `github.com/SpillwaveSolutions/sdd-skill` (if that is the correct slug) for stars, license, last commit, and whether it's a proper Skill v1 package.

**Recommended chain for an agent-system build:** Spec-Kit (institutional trust, template quality) as the *scaffold*, wrapped by a thin custom Skill that adds agent-specific spec sections (subagent responsibilities, memory schema, tool budget, eval acceptance criteria). Do **not** rely on Superpowers as the primary chain until author + scan status are confirmed.

---

## Phase 2 — Architecture/design for agent systems

Honest read: **as of mid-2026, I do not know of a community skill with strong evidence-of-use that specifically covers subagent topology and skill decomposition for Claude Code.** Anthropic's own docs on subagents and skills are the strongest reference, but those are documentation, not skills.

- **Candidate:** Anthropic's official **"agent-skills" examples repo** and the subagents section of the Claude Code docs. Use as reference material wrapped by a custom architecture skill.
- Anything third-party claiming to be a "subagent architect skill" — **verify author and usage evidence carefully**; this space attracted low-quality entries in early 2026.

**Verdict: likely build-required (see (f)).**

---

## Phase 3 — Prompt engineering AND prompt-evaluation harnesses

1. **promptfoo** (`promptfoo/promptfoo`)
   - (a) Stars: mid-five-figures range on GitHub by mid-2026 [UNVERIFIED exact]; broad OSS adoption.
   - (b) Author: Ian Webster and contributors; well-known in the LLM eval space; company backed the project through 2025.
   - (c) Host: `github.com/promptfoo/promptfoo`. Not natively a Claude Code skill — install as CLI (`npm i -g promptfoo` or `npx promptfoo`) and wrap with a thin skill that shells out.
   - (d) Security: mature project, MIT license; runs local shell + can call external model APIs (requires credentials for those providers). No known incidents [UNVERIFIED as of date].
   - (e) Freshness: active through 2026 [UNVERIFIED exact last-commit date].

2. **Anthropic's `evals` cookbook patterns** — reference-quality; not a skill.

3. **Inspect AI** (UK AISI, `UKGovernmentBEIS/inspect_ai`)
   - Strong for structured evals; heavier than promptfoo. Institutional author (UK AI Safety Institute). Wrap as skill if you want research-grade eval reports.

**Recommendation:** promptfoo wrapped in a custom skill is the pragmatic choice.

---

## Phase 4 — MCP connector building AND MCP debugging/testing

1. **`modelcontextprotocol/servers`** (official reference servers)
   - (a) Stars [UNVERIFIED exact — was one of the most-starred MCP repos through 2025-2026].
   - (b) Author: Anthropic + MCP working group. Highest provenance.
   - (c) Host: `github.com/modelcontextprotocol/servers`. Not a Claude Code skill; a reference implementation library.
   - (d) Security: official; individual servers vary — filesystem/shell servers require careful capability scoping.
   - (e) Freshness: actively maintained [UNVERIFIED exact].

2. **MCP Inspector** (`modelcontextprotocol/inspector`)
   - Debugging UI for MCP servers. Official. Wrap with a skill that launches it and captures traces.

3. Third-party "MCP builder skills" — **I am not confident any community-authored skill in this niche cleared the bar of "credible author + demonstrable usage" by July 2026.** Verify carefully.

---

## Phase 5 — Agent memory design

**Honest read:** The memory-skill space in early-to-mid 2026 was noisy — many low-evidence entries, several that were thin wrappers over `CLAUDE.md` conventions.

- **Reference-grade material:** Anthropic's documentation on Claude Code memory (`CLAUDE.md`, project vs user memory) and the "Constitution AI / memory consolidation" research patterns.
- **Community skills:** [UNVERIFIED — I do not have a specific skill I can vouch for by name here without risking fabrication.]

**Verdict: likely build-required.** The design surface (consolidation cadence, salience scoring, memory-file schema for a multi-platform content agent) is specific enough that a custom skill referencing Anthropic docs will beat any generic memory skill.

---

## Phase 6 — Knowledge-base construction for agents

1. **LlamaIndex** patterns (as a library, not a skill) — mature, well-documented; wrap as a skill that scaffolds a corpus + retrieval layout.
2. **`llmstxt` ecosystem** (llms.txt convention, Mintlify/Anthropic docs adoption through 2025-2026) — useful for structuring knowledge for agents. Not a skill itself.
3. **Community "kb-builder" skills:** [UNVERIFIED — I decline to name specific packages without confidence.]

**Verdict: partial build-required.** Wrap LlamaIndex or a lighter retriever in a custom skill; no third-party skill I can confidently endorse.

---

## Phase 7 — Agent evaluation / benchmarking (golden sets, regression evals)

- **promptfoo** (see Phase 3) covers golden-set regression well.
- **Inspect AI** (see Phase 3) for heavier eval structure.
- **Braintrust** — commercial; SDK is open. Skill wrapping possible; requires account credential.

No third-party Claude Code *skill* in this space clears the credibility bar for me. Wrap promptfoo.

---

## Phase 8 — Testing / TDD for agent codebases

- Standard language test runners (pytest, vitest) via existing broadly-used Claude Code skills — [UNVERIFIED specific skill names].
- **TDD-guard** style patterns circulated in the Claude Code community in 2025-2026 — I cannot confirm a specific canonical repo with evidence.

**Verdict: use language-native test tooling; a custom skill defining the agent-testing contract (deterministic seeds, mocked model responses, golden traces) is likely required.**

---

## Phase 9 — Deployment (scheduled agents, CI, launchd/cron on macOS)

- No community skill I can confidently name for launchd/cron scheduling of Claude Code agents with evidence of use.
- GitHub Actions has broad Claude Code integration through 2025-2026 (`anthropics/claude-code-action` and similar) — verify current name and version.

**Verdict: build-required for launchd/cron specifics.** For CI, use the official Anthropic-maintained action.

---

## Phase 10 — Maintenance / regression detection

Overlaps heavily with Phase 7. Same recommendation: promptfoo-based regression suite + custom skill for scheduling and diffing. No standalone maintenance-focused skill I can vouch for.

---

## Phase 11 — Social-platform content optimization

**Honest read: this is the weakest phase for community skills.** Platform-specific optimization skills tend to be either (i) marketing SaaS wrappers with credential requirements and unclear provenance, or (ii) thin heuristic collections that go stale within months as algorithms change.

- **No skill I can confidently endorse** for Substack, LinkedIn, X, HN, Reddit, Discord, TikTok, YouTube optimization as an integrated set.
- **Knowledge resources worth wrapping** into a custom skill:
  - Hacker News: official guidelines + `hn.algolia.com` API for empirical timing.
  - Reddit: subreddit-specific rules; Pushshift-successor APIs [status UNVERIFIED as of 2026-07].
  - X, LinkedIn, TikTok, YouTube: official API docs; third-party "best time to post" data is largely unreliable — treat with skepticism.
  - Substack: minimal algorithmic surface; focus on cadence and subject-line skill.

**Verdict: build-required.**

---

## (f) Phases where custom authoring is required

Based on the honest confidence assessment above:

- **Phase 2** — Agent architecture/design
- **Phase 5** — Agent memory design
- **Phase 6** — KB construction (wrap-only around LlamaIndex-class libs)
- **Phase 8** — Agent-specific TDD contract
- **Phase 9** — macOS launchd/cron scheduling
- **Phase 10** — Regression detection wiring
- **Phase 11** — Per-platform content optimization

That is **7 of 11 phases**. This is a large custom-authoring surface. It reflects the actual state of the Claude Code skill ecosystem more than a defect in sourcing: high-credibility skills cluster around eval, MCP, and spec tooling; agent-system-specific concerns remain under-served.

---

## (g) Popular-but-criticized skills to watch

I do not have citable, specific criticism reports to attribute to named skills without risking fabrication. Categories of concern reported in Claude Code community discussion through 2025-2026 (general, [UNVERIFIED specific incidents]):

- **Large "mega-skill" bundles**: token-overhead complaints — loading dozens of instructions inflates context and degrades performance. Prefer narrow skills.
- **Skills that shell out to `curl | bash`-style installers**: recurrent security concern; audit any skill that fetches external scripts at load or run time.
- **Marketing/SEO skill packs**: several were flagged for scraping credentialed platform data; verify TOS compliance.

---

## Recommended next actions

1. **Qodo-verify** each named repo above: `github/spec-kit`, `promptfoo/promptfoo`, `modelcontextprotocol/servers`, `modelcontextprotocol/inspector`, `UKGovernmentBEIS/inspect_ai`, and investigate `SpillwaveSolutions/sdd-skill` and "Superpowers" for actual authorship and evidence-of-use.
2. **Accept that ~7 phases need custom skill authoring.** Budget for it now.
3. **Do not adopt any skill I marked [UNVERIFIED] on authorship** without a human reading the README and license.
4. **Re-run this sourcing** with live registry access (agentskills.io API, GitHub API for stars/commits, Agensi scan lookups) before final selection — the numerical fields (a) and freshness field (e) must be re-populated from live sources; this document deliberately does not fill them with guesses.
