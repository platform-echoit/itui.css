#!/usr/bin/env bash

# Deployment script for @echoit/itui.css
# This script handles building, versioning, and publishing to npm.

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment for @echoit/itui.css...${NC}"

# Ensure we are in the package directory
cd "$(dirname "$0")/.."

# 1. Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
pnpm build

# 2. Patch package.json (ensure the module path is correct before publishing)
echo -e "${YELLOW}🩹 Patching package.json entry...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's/dist\/index.mjs/dist\/index.js/g' package.json
else
    sed -i 's/dist\/index.mjs/dist\/index.js/g' package.json
fi

# 3. Increment Version
if [ -z "$1" ]; then
    echo -e "${YELLOW}❓ No version bump type provided (patch, minor, major). Defaulting to patch.${NC}"
    BUMP="patch"
else
    BUMP=$1
fi

echo -e "${YELLOW}🔢 Bumping version ($BUMP)...${NC}"
pnpm version $BUMP --no-git-tag-version

# 4. Publish to npm
echo -e "${YELLOW}📦 Publishing to npm...${NC}"
# Use --no-git-checks because this is likely inside a monorepo which might have other changes
pnpm publish --access public --no-git-checks

echo -e "${GREEN}✅ Successfully deployed @echoit/itui.css!${NC}"
