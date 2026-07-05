#!/bin/bash
# promote-skill.sh — promotion gate v2 (Qodo PR-review flow).
# The original gate used the Qodo CLI, which Qodo discontinued (backend refuses all calls
# as of 2026-07-05). The working Qodo product is automatic PR review on a connected Git
# provider, so promotion is now a PR: skill files enter .claude/skills/ on a branch, Qodo
# reviews the diff at app.qodo.ai (repo must be connected once), merge = promoted.
#
# Usage: bash scripts/promote-skill.sh <inbox-skill-name> [<inbox-skill-name>...]
# Creates branch promote/<first-name>[-etc], copies each skill's SKILL.md dir from
# .claude/skills-inbox/ into .claude/skills/, commits, pushes, opens a PR.
# After Qodo review passes: merge the PR, update docs/skill-adoption-ledger.md, and
# copy the promoted files back into the working tree via git pull.

set -euo pipefail
cd "$(dirname "$0")/.."

[[ $# -lt 1 ]] && { echo "usage: $0 <inbox-skill-name> [...]"; exit 2; }

BRANCH="promote/$1$( [[ $# -gt 1 ]] && echo "-and-$(( $# - 1 ))-more" )"
git checkout -b "$BRANCH"

for name in "$@"; do
  SRC=".claude/skills-inbox/$name"
  [[ -d "$SRC" ]] || { echo "not in inbox: $name"; git checkout -; exit 2; }
  mkdir -p ".claude/skills/$name"
  # Copy only skill content (SKILL.md + scripts/references/assets), never a full vendored repo.
  if [[ -f "$SRC/SKILL.md" ]]; then
    rsync -a --exclude='.git' "$SRC/" ".claude/skills/$name/"
  else
    echo "SKIP $name: no SKILL.md at repo root — extract specific skill dirs manually"; continue
  fi
  git add ".claude/skills/$name"
done

git commit -m "promote: $* into .claude/skills/ (pending Qodo PR review)

Evidence + pre-scan in docs/skill-adoption-ledger.md. Qodo reviews this PR
automatically once the repo is connected at app.qodo.ai.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push -u origin "$BRANCH"
gh pr create --repo "$(gh repo view --json nameWithOwner -q .nameWithOwner)" \
  --title "Promote skill(s): $*" \
  --body "Moves skill(s) from quarantine into .claude/skills/. Gate: Qodo auto-review on this PR + smoke-test evidence in docs/skill-adoption-ledger.md. Merge only after Qodo review is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
git checkout -
