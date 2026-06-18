#!/usr/bin/env bash
# Render a blog thumbnail SVG to cover.webp (1200x630, OG card ratio).
#
# Usage:
#   ./generate.sh <input.svg> [output.webp]
#
# Defaults output to <input dir>/cover.webp
# Requires: rsvg-convert + cwebp (both confirmed present on this machine).
# Fallback: sharp via node if rsvg-convert is missing.

set -euo pipefail

IN="${1:?usage: generate.sh <input.svg> [output.webp]}"
OUT="${2:-$(dirname "$IN")/cover.webp}"
TMP="$(dirname "$OUT")/.thumb_tmp.png"

if command -v rsvg-convert >/dev/null; then
  rsvg-convert -w 1200 -h 630 "$IN" -o "$TMP"
  cwebp -quiet -q 90 "$TMP" -o "$OUT"
  rm -f "$TMP"
elif node -e "require.resolve('sharp')" >/dev/null 2>&1; then
  node -e "require('sharp')('$IN',{density:200}).resize(1200,630).webp({quality:90}).toFile('$OUT').then(()=>console.log('ok'))"
else
  echo "No renderer found (need rsvg-convert or node+sharp)" >&2
  exit 1
fi

echo "Wrote $OUT"
