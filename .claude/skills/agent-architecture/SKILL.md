---
name: agent-architecture
description: Design the architecture for a Claude Code agent system before building it: subagent topology, skill decomposition, memory schema, knowledge-base layout, and connector (MCP) inventory. Use this whenever adding a new capability to the content-ops agent, restructuring skills or memory, wiring a new platform connector, or any time a change touches more than one of (skills, agents, memory, knowledge, connectors). Also trigger when the user says "design", "architect", "how should this be structured", or proposes a feature with no spec yet.
---

# Agent Architecture

Produce a design doc BEFORE code. Agent systems rot from undesigned growth: skills that overlap, memory nobody reads, connectors wired for one task and abandoned. A one-page design catches that while it is still cheap.

## Output

Write `docs/specs/<slug>-design.md` with exactly these sections:

1. **Problem + audience:** what the capability does and for whom (one paragraph).
2. **Topology decision:** which of the five surfaces this lives in, with reasoning:
   - `SKILL.md` (repeatable workflow the orchestrator follows)
   - subagent in `.claude/agents/` (isolated context, parallel, or specialized system prompt needed)
   - `knowledge/` doc (facts the agent consults)
   - `memory/` file (learned state that accumulates across sessions)
   - MCP connector (external system access)
   A feature usually needs 1-2 of these, not all five. Justify each one you add; naming what you are NOT building is as valuable as what you are.
3. **Data flow:** inputs → transformations → outputs, naming actual file paths.
4. **Reuse audit:** which existing skills/agents/libs already cover part of this (read `.claude/skills/` and AGENTS.md first; duplicating an existing surface is a defect).
5. **Failure modes:** what breaks first, and the observable signal when it does.
6. **Acceptance test:** the concrete check that proves the built thing works.

## Design rules (learned the expensive way in career-ops)

- Subagents get question + context only, never inline methodology or 10+ file-path lists (prompts have limits and long prompts fail silently).
- Any agent that edits files in parallel needs worktree isolation; read-only agents can share the tree.
- Every background process needs a timeout and a heartbeat; never poll a file for completion.
- State files need a schema and an atomic write (tmp + rename); state written without a disk artifact to verify against WILL drift.
- Every new env var / kill switch gets documented in AGENTS.md the same commit it is born.

## Method reference

For large multi-role builds, the BMAD method (github.com/bmad-code-org/BMAD-METHOD, ★50k) is the mature reference for role decomposition (analyst/PM/architect/dev separation). Borrow its role-separation thinking; do not import its full ceremony for single-feature changes.
