#!/usr/bin/env bash
# Builds the showcase into _site/ from site/projects.json.
# vite projects -> built with relative base; static projects -> copied as-is.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=_site
rm -rf "$OUT"
mkdir -p "$OUT/demos"
cp -r site/index.html site/style.css site/app.js site/projects.json site/thumbs "$OUT/"

while IFS=$'\t' read -r -u 3 slug type src; do
  echo "::group::$slug"
  if [ "$type" = vite ]; then
    (cd "$src" && npm ci --no-audit --no-fund && npx vite build --base=./)
    cp -r "$src/dist" "$OUT/demos/$slug"
  else
    cp -r "$src" "$OUT/demos/$slug"
  fi
  echo "::endgroup::"
done 3< <(node -e '
  for (const m of require("./site/projects.json").modules)
    for (const p of m.projects) console.log([p.slug, p.type, p.source].join("\t"))')
