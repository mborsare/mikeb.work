#!/bin/zsh
set -e

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required."
  exit 1
fi

npm install

ARCH="$(node -p 'process.arch')"

rm -rf dist

npx electron-packager . "Sand" \
  --platform=darwin \
  --arch="$ARCH" \
  --out=dist \
  --overwrite \
  --prune=true

APP="dist/Sand-darwin-$ARCH/Sand.app"

echo ""
echo "Built: $APP"
open "$APP"
