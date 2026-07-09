#!/usr/bin/env bash
# load-clipboard.sh - render a draft's mockup + paste-body, then load the rich-text clipboard LAST.
#
# THE FOOTGUN THIS EXISTS TO STOP (retro 2026-07-09): headless Chrome (used to screenshot the mockup)
# CLOBBERS the macOS clipboard. If you load the rich-text clipboard and THEN run a headless render, the
# clipboard you carefully built is gone and the Substack paste is empty/stale. So the clipboard load MUST
# be the final step. This script enforces that order: it renders (optionally screenshots) FIRST, and only
# then loads the HTML clipboard. Never run a headless render after calling this.
#
# Usage:  scripts/load-clipboard.sh <draft-file.md> [--screenshot] [--dry-run]
#   --screenshot  also headless-render the mockup to <draft-dir>/.render/mockup.png (the clobbering step,
#                 done BEFORE the clipboard load, which is the whole point)
#   --dry-run     print the ordered steps without touching the clipboard or launching Chrome
#
# macOS only (uses osascript for the rich-text/HTML clipboard). No-ops with a clear message elsewhere.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DRAFT=""
SCREENSHOT=0
DRYRUN=0
for arg in "$@"; do
  case "$arg" in
    --screenshot) SCREENSHOT=1 ;;
    --dry-run) DRYRUN=1 ;;
    --*) echo "unknown flag: $arg" >&2; exit 2 ;;
    *) DRAFT="$arg" ;;
  esac
done

if [[ -z "$DRAFT" ]]; then
  echo "usage: scripts/load-clipboard.sh <draft-file.md> [--screenshot] [--dry-run]" >&2
  exit 2
fi
if [[ ! -f "$DRAFT" ]]; then
  echo "draft not found: $DRAFT" >&2
  exit 2
fi

DRAFT_DIR="$(cd "$(dirname "$DRAFT")" && pwd)"
RENDER_DIR="$DRAFT_DIR/.render"
MOCKUP_HTML="$RENDER_DIR/mockup.html"
PASTE_HTML="$RENDER_DIR/paste-body.html"
MOCKUP_PNG="$RENDER_DIR/mockup.png"

echo "== step 1/3: render mockup (safe; writes HTML only) =="
if [[ "$DRYRUN" == 1 ]]; then echo "  [dry-run] node $SCRIPT_DIR/build-mockup.mjs $DRAFT"; else
  node "$SCRIPT_DIR/build-mockup.mjs" "$DRAFT"
fi

if [[ "$SCREENSHOT" == 1 ]]; then
  echo "== step 2/3: headless screenshot (CLOBBERS clipboard - done BEFORE the load, on purpose) =="
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  if [[ "$DRYRUN" == 1 ]]; then
    echo "  [dry-run] \"$CHROME\" --headless --disable-gpu --hide-scrollbars --screenshot=$MOCKUP_PNG file://$MOCKUP_HTML"
  elif [[ -x "$CHROME" ]]; then
    "$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=980,14000 \
      --virtual-time-budget=9000 --screenshot="$MOCKUP_PNG" "file://$MOCKUP_HTML" >/dev/null 2>&1 || \
      echo "  (screenshot failed; continuing - the mockup HTML is still usable via 'open -a')"
    echo "  screenshot -> $MOCKUP_PNG"
  else
    echo "  (Google Chrome not found at the default path; skipping screenshot)"
  fi
else
  echo "== step 2/3: screenshot skipped (pass --screenshot to include it) =="
fi

echo "== step 3/3: build paste body + load rich-text clipboard (MUST be last) =="
if [[ "$DRYRUN" == 1 ]]; then
  echo "  [dry-run] node $SCRIPT_DIR/build-paste-body.mjs $DRAFT"
  echo "  [dry-run] osascript set the clipboard to «data HTML...» from $PASTE_HTML"
  echo "  [dry-run] clipboard NOT modified"
  exit 0
fi

node "$SCRIPT_DIR/build-paste-body.mjs" "$DRAFT"

if [[ "$(uname)" != "Darwin" ]]; then
  echo "  not macOS; wrote $PASTE_HTML but cannot load the rich-text clipboard here." >&2
  exit 0
fi
if ! command -v osascript >/dev/null 2>&1; then
  echo "  osascript unavailable; wrote $PASTE_HTML but cannot load the rich-text clipboard." >&2
  exit 0
fi

HEX="$(hexdump -ve '1/1 "%.2x"' "$PASTE_HTML")"
osascript -e "set the clipboard to «data HTML${HEX}»"
echo "  clipboard loaded with rich text from $PASTE_HTML"
echo "  DO NOT run a headless render now - it will clobber this. Go straight to the Substack editor: Cmd+A, Delete, Cmd+V."
