---
name: deploy-scheduled-agent
description: Deploy a scheduled or background agent job on this macOS Tahoe machine: launchd plists, the Tahoe KeepAlive nohup-wrapper workaround, log placement, kill switches, and post-deploy verification. Use whenever scheduling anything recurring (daily digests, scans, refresh jobs), converting a manual script to a scheduled one, or when a scheduled job is flapping/silent. Council research (2026-07-05) confirmed nothing credible exists publicly for macOS launchd agent deployment. This skill encodes the hard-won career-ops runbook.
---

# Deploy Scheduled Agent (macOS Tahoe)

Scheduling on this machine has three landmines that cost real debugging days in career-ops. This skill exists so they are never re-discovered.

## The three Tahoe landmines

1. **KeepAlive bug**: launchd on Tahoe mishandles KeepAlive daemons. Wrap the real command in a nohup wrapper script and set `AbandonProcessGroup=true`. Direct KeepAlive on the target process flaps.
2. **TCC blocks `~/Documents/`**: launchd jobs cannot exec scripts inside `~/Documents/` (silent exit 126) and should not write logs there. Wrappers live in `~/.local/<project>-wrappers/`; ALL plist logs go to `~/Library/Logs/<project>/`.
3. **Interpreter mismatch**: `ProgramArguments[0]` must be the interpreter that matches the script (`/bin/bash` for .sh, never a node path invoking a bash wrapper; node parses the shebang line as JS and exits 1, which then gets misread as a data-quality signal).

## Deploy sequence

1. Write the wrapper in `~/.local/content-ops-wrappers/<job>.sh` (mkdir if needed), exec'ing the real script with its env. `chmod +x`.
2. Write the plist to `~/Library/LaunchAgents/com.mitchell.content-ops.<job>.plist`: label matching filename, `ProgramArguments` = `[/bin/bash, <wrapper-path>]`, `StartCalendarInterval` (or `StartInterval`), `StandardOutPath`/`StandardErrorPath` under `~/Library/Logs/content-ops/`.
3. Add a kill switch: the script checks an env var (`<JOB>_ENABLED`, default on) and exits 0 when disabled. Document this in AGENTS.md the same commit.
4. Load: `launchctl bootstrap gui/$(id -u) <plist-path>` then verify `launchctl print gui/$(id -u)/<label>` shows `state = waiting` (not repeated respawns).
5. **Smoke-fire it now, don't wait for the schedule**: `launchctl kickstart -k gui/$(id -u)/<label>`, then tail the log and check the exit status in `launchctl print` output. "It loaded" is not "it works".
6. Record in AGENTS.md: label, cadence, kill switch, log path, what it writes.

## Ship LOADED-BUT-DISABLED when the job spends money or mutates data

`launchctl disable gui/$(id -u)/<label>` after bootstrap; enable only after reviewing one manual run. Every career-ops incident of a runaway scheduled job traces to skipping this.

## Flapping triage

`launchctl print` shows `runs = N` climbing → read the LAST stderr lines in `~/Library/Logs/` first (the actual error), check the interpreter mismatch (landmine 3), then TCC paths (landmine 2). Exit 1 from an auditor-style script may be a designed data signal, not a crash. Check the script's exit-code contract before "fixing" it.
