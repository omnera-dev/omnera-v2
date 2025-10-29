#!/bin/bash
# Copyright (c) 2025 ESSENTIAL SERVICES
#
# This source code is licensed under the Business Source License 1.1
# found in the LICENSE.md file in the root directory of this source tree.

# Script to run e2e tests with proper Docker configuration
# Prevents "spawn docker-credential-desktop ENOENT" errors

# Create temporary Docker config without credential store for tests
TEMP_DOCKER_CONFIG=$(mktemp -d)
echo '{"auths": {}}' > "$TEMP_DOCKER_CONFIG/config.json"

# Run tests with temporary Docker config
DOCKER_CONFIG="$TEMP_DOCKER_CONFIG" bun test:e2e "$@"
TEST_EXIT_CODE=$?

# Clean up
rm -rf "$TEMP_DOCKER_CONFIG"

exit $TEST_EXIT_CODE