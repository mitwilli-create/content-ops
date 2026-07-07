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

# Validate names up front: a skill name is a single path segment, never a path.
# (A name containing / or .. would let rsync read or write outside the inbox/skills dirs.)
for name in "$@"; do
  if [[ ! "$name" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ || "$name" == *..* ]]; then
    echo "invalid skill name: $name (single directory name only, no slashes or ..)"; exit 2
  fi
  [[ -d ".claude/skills-inbox/$name" ]] || { echo "not in inbox: $name"; exit 2; }
done

# NOTE: the suffix must be computed in a plain if, not inline as
# BRANCH="...$( [[ $# -gt 1 ]] && ... )" — under set -e a failing command
# substitution in an assignment aborts the script, which made every
# single-skill invocation exit 1 before doing anything.
SUFFIX=""
if [[ $# -gt 1 ]]; then SUFFIX="-and-$(( $# - 1 ))-more"; fi
BRANCH="promote/$1$SUFFIX"
START_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
git checkout -b "$BRANCH"

abort() { git checkout "$START_BRANCH"; git branch -D "$BRANCH"; exit 2; }

PROMOTED=0
for name in "$@"; do
  SRC=".claude/skills-inbox/$name"
  # Copy only skill content (SKILL.md + scripts/references/assets), never a full vendored repo.
  if [[ -f "$SRC/SKILL.md" ]]; then
    mkdir -p ".claude/skills/$name"
    rsync -a --exclude='.git' "$SRC/" ".claude/skills/$name/"
  else
    echo "SKIP $name: no SKILL.md at repo root — extract specific skill dirs manually"; continue
  fi
  git add ".claude/skills/$name"
  PROMOTED=$(( PROMOTED + 1 ))
done

if [[ $PROMOTED -eq 0 ]] || git diff --cached --quiet; then
  echo "nothing to promote (no SKILL.md found, or files identical to what is already promoted)"
  abort
fi

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
