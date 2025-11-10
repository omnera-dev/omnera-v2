#!/bin/bash
# Update Playwright snapshots in Linux environment using Docker
# This ensures snapshots match CI environment exactly

set -e

echo "🐳 Generating Linux snapshots using Docker..."
echo ""

# Playwright Docker image (should match CI)
PLAYWRIGHT_VERSION="1.50.0"
DOCKER_IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble"

# Pull latest image
echo "📥 Pulling Playwright Docker image..."
docker pull "$DOCKER_IMAGE"

# Detect Docker socket path (macOS with Colima or standard Docker)
DOCKER_SOCKET="/var/run/docker.sock"
if [ -S "$HOME/.colima/default/docker.sock" ]; then
  DOCKER_SOCKET="$HOME/.colima/default/docker.sock"
elif [ -S "$HOME/.docker/run/docker.sock" ]; then
  DOCKER_SOCKET="$HOME/.docker/run/docker.sock"
fi

# Run snapshot update in Docker container
echo ""
echo "🔄 Running snapshot update in Linux container..."
echo "   Using Docker socket: $DOCKER_SOCKET"
echo "   This may take several minutes..."
echo ""

docker run --rm \
  -v "$(pwd)":/work \
  -v "$DOCKER_SOCKET:/var/run/docker.sock" \
  -w /work \
  -e UPDATE_SNAPSHOTS=true \
  -e CI=true \
  "$DOCKER_IMAGE" \
  /bin/bash -c "
    # Install dependencies
    corepack enable
    corepack prepare bun@1.3.2 --activate || npm install -g bun@1.3.2
    bun install --frozen-lockfile

    # Update snapshots
    bun test:e2e:update-snapshots
  "

echo ""
echo "✅ Linux snapshots updated successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Review the updated snapshots: git status"
echo "   2. Commit the changes: git add . && git commit -m 'test: update Linux snapshots'"
echo "   3. Push to trigger CI"
