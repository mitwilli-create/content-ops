---
name: mcp-debug
description: Test and debug MCP connectors in isolation (tool signatures, auth flows, resource listings, error responses) before wiring them into an agent. Use whenever an MCP server misbehaves, a new connector is being added, a tool call returns confusing errors, or the user says "the connector is broken", "test this MCP", "why isn't <server> working". Debugging MCP through the full agent loop wastes tokens and hides the actual failure. Isolate first.
---

# MCP Debug

Two verified tools (2026-07-05): [MCP Inspector](https://github.com/modelcontextprotocol/inspector) (★10.3k, official) for interactive/CLI probing of ANY server, and [FastMCP](https://github.com/PrefectHQ/fastmcp) (★26k) when the server under test is one we are building in Python.

## Isolate before you integrate

An MCP failure inside an agent session has three suspects: the server, the harness wiring, or the prompt. Inspector removes two of them.

1. **Probe the server directly:**
   ```bash
   npx @modelcontextprotocol/inspector --cli <server-command-or-url> --method tools/list
   npx @modelcontextprotocol/inspector --cli <server> --method tools/call --tool-name <name> --tool-arg key=value
   ```
   No `--cli` flag opens the browser UI (better for OAuth flows and eyeballing schemas).
2. **Read the actual schema:** most "agent can't use the tool" bugs are schema mismatches: required params the description doesn't mention, enums the agent guesses wrong, string-typed numbers. Compare `tools/list` output against what the agent sent.
3. **Auth failures**: reproduce OUTSIDE the agent. If Inspector can't auth either, it's the server/credentials; if Inspector works, it's harness config (check the MCP registration and env vars).
4. **Only then** re-test inside a minimal agent session with the single tool loaded.

## Building our own servers

Scaffold with FastMCP (`pip install fastmcp`; decorate functions with `@mcp.tool`) and test with `fastmcp dev server.py` (bundles Inspector). Every tool gets: a description that says when NOT to use it, typed params with constraints, and an error message that names the fix (agents retry blind on vague errors and burn tokens).

## Record what you find

A debugged connector gets a short note in `docs/specs/` or the connector's README: symptom → actual cause → fix. MCP failure modes repeat; the second debugging session should take five minutes.
