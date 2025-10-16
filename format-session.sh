#!/bin/bash
# Format all changed files in the current git session

echo "🎨 Formatting modified files..."

# Get list of modified TypeScript/JavaScript files
MODIFIED_FILES=$(git diff --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx|json|md)$')

if [ -z "$MODIFIED_FILES" ]; then
  echo "✅ No files to format"
else
  echo "Formatting files:"
  echo "$MODIFIED_FILES"
  echo "$MODIFIED_FILES" | xargs bunx prettier --write --log-level error
  echo "✅ Formatting complete!"
fi

# Also run the full format command to catch any other files
echo "Running full format check..."
bun run format

echo "🎉 Session formatting complete!"