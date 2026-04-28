#!/usr/bin/env bash

# This script is a temporary patch to fix the incorrect module entry in @echoit/itui.css
# It should be run after git submodule update and before pnpm install.

set -e

UI_PKG_JSON="packages/ui/package.json"

if [ -f "$UI_PKG_JSON" ]; then
    echo "📦 Patching $UI_PKG_JSON..."
    # Replace dist/index.mjs with dist/index.js as tsup generates .js files
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/dist\/index.mjs/dist\/index.js/g' "$UI_PKG_JSON"
    else
        sed -i 's/dist\/index.mjs/dist\/index.js/g' "$UI_PKG_JSON"
    fi
    echo "✅ Patch applied successfully."
else
    echo "⚠️ $UI_PKG_JSON not found. Skipping patch."
fi
