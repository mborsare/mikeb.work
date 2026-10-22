#!/bin/zsh
set -e
cd "${0:A:h}"

npm run pack
ARCH="$(node -p 'process.arch')"
APP="$HOME/Applications/Sand.app"
mkdir -p "$HOME/Applications"
INSTALL_STAGE="$(mktemp -d "$HOME/Applications/.sand-install.XXXXXX")"
trap 'if [[ ! -d "$APP" && -d "$INSTALL_STAGE/Previous.app" ]]; then mv "$INSTALL_STAGE/Previous.app" "$APP"; fi; rm -rf "$INSTALL_STAGE"' EXIT
ditto "dist/Sand-darwin-$ARCH/Sand.app" "$INSTALL_STAGE/Sand.app"
if [[ -d "$APP" ]]; then mv "$APP" "$INSTALL_STAGE/Previous.app"; fi
mv "$INSTALL_STAGE/Sand.app" "$APP"
echo "Installed: $APP"
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$APP" || echo "Open Sand.app in Finder to register it with macOS."
open "$APP" || echo "Automatic launch failed. Open $APP in Finder."
