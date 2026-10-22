#!/bin/zsh
set -e

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required."
  exit 1
fi

if [[ ! -x node_modules/.bin/electron-packager ]]; then
  npm ci
fi

ARCH="$(node -p 'process.arch')"
ELECTRON_VERSION="$(node -p 'require("electron/package.json").version')"

# Reuse Electron's local download when available, so rebuilding works offline.
ZIP_OPTIONS=()
for ZIP in "$HOME/Library/Caches/electron"/*/electron-v${ELECTRON_VERSION}-darwin-${ARCH}.zip(N); do
  ZIP_OPTIONS=(--electron-zip-dir="${ZIP:h}")
  break
done

./node_modules/.bin/electron-packager . "Sand" \
  --platform=darwin \
  --arch="$ARCH" \
  --electron-version="$ELECTRON_VERSION" \
  "${ZIP_OPTIONS[@]}" \
  --app-bundle-id=work.mikeb.sand \
  --ignore='^/dist($|/)' \
  --out=dist \
  --overwrite \
  --prune=true

APP="dist/Sand-darwin-$ARCH/Sand.app"

echo ""
echo "Built: $APP"
