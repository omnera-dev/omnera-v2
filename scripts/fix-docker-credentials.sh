#!/bin/bash
# Copyright (c) 2025 ESSENTIAL SERVICES
#
# This source code is licensed under the Business Source License 1.1
# found in the LICENSE.md file in the root directory of this source tree.

# Script to fix Docker credential provider errors
# Run this if you're getting "spawn docker-credential-desktop ENOENT" errors

echo "🔧 Docker Credential Fix Script"
echo "================================"
echo ""

# 1. Check Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop first."
  exit 1
fi
echo "✅ Docker is running"

# 2. Stop any existing test containers
echo "🧹 Cleaning up old test containers..."
docker ps -a --filter "ancestor=postgres:16-alpine" -q | xargs -r docker rm -f > /dev/null 2>&1
echo "✅ Old containers cleaned"

# 3. Clear Docker credential cache
echo "🧹 Clearing Docker credential cache..."
rm -rf ~/.docker/config.json.backup 2>/dev/null
if [ -f ~/.docker/config.json ]; then
  cp ~/.docker/config.json ~/.docker/config.json.backup
  echo '{"auths": {}}' > ~/.docker/config.json
  echo "✅ Docker config temporarily simplified (backup created)"
fi

# 4. Pull the required image
echo "📥 Pulling postgres:16-alpine image..."
if docker pull postgres:16-alpine > /dev/null 2>&1; then
  echo "✅ Image pulled successfully"
else
  echo "⚠️  Image pull had issues, but this might be okay"
fi

# 5. Restore original config if backup exists
if [ -f ~/.docker/config.json.backup ]; then
  mv ~/.docker/config.json.backup ~/.docker/config.json
  echo "✅ Original Docker config restored"
fi

echo ""
echo "✨ Fix complete! Try running your tests now:"
echo "   bun test:e2e"
echo ""
echo "Note: The global-setup.ts file now creates a temporary Docker config"
echo "automatically, so this error should not occur anymore."