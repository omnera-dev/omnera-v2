# Copyright Header Automation

This document explains how copyright headers are managed in the Omnera codebase.

## Required Header Format

All `.ts` and `.tsx` files in `src/`, `scripts/`, and `tests/` must include:

```typescript
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */
```

## Automation Methods

### 1. Manual Script Execution (Current)

Run after creating new files:

```bash
bun run license
```

**When to use:**

- After creating new source files
- Before committing changes
- As part of your pre-commit checklist

**Slash command:** Type `/license` in Claude Code for quick access

### 2. Claude Code Hook (Auto-magic for AI)

Automatically run license script after Claude Code creates files.

See [`claude-code-hooks.md`](./claude-code-hooks.md) for complete setup guide.

**Quick setup:**

1. Open Claude Code Settings
2. Add post-write hook:

```json
{
  "hooks": {
    "post-write-hook": "if echo \"$CLAUDE_FILE_PATH\" | grep -E '(src|scripts|tests)/.*\\.tsx?$' > /dev/null 2>&1; then cd /Users/thomasjeanneau/Codes/omnera-v2 && bun run license 2>&1 | grep 'Added header' || true; else true; fi"
  }
}
```

**Benefits:**

- Zero effort - happens automatically
- Catches files as they're created
- Works for all AI agents using Claude Code

### 3. Git Pre-Commit Hook (Recommended)

Install husky and automate header addition before every commit:

```bash
# Install husky
bun add -d husky

# Initialize husky
bunx husky init

# Create pre-commit hook
echo "bun run license" > .husky/pre-commit
chmod +x .husky/pre-commit
```

**Benefits:**

- Automatic - runs before every commit
- Prevents committing files without headers
- Zero mental overhead

### 4. ESLint Plugin (Optional - Additional Safety)

For real-time feedback in your editor, install `eslint-plugin-header`:

```bash
bun add -d eslint-plugin-header
```

Add to `eslint.config.ts`:

```typescript
import header from 'eslint-plugin-header'

export default defineConfig([
  // ... existing config
  {
    files: ['src/**/*.{ts,tsx}', 'scripts/**/*.ts', 'tests/**/*.{ts,tsx}'],
    plugins: {
      header,
    },
    rules: {
      'header/header': [
        'error',
        'block',
        [
          '*',
          ' * Copyright (c) 2025 ESSENTIAL SERVICES',
          ' *',
          ' * This source code is licensed under the Sustainable Use License',
          ' * found in the LICENSE.md file in the root directory of this source tree.',
          ' ',
        ],
      ],
    },
  },
])
```

**Benefits:**

- Real-time feedback in VS Code/editor
- Red squiggles for missing headers
- Integrates with existing lint workflow

### 5. CI/CD Check (Optional - Additional Safety)

Add to GitHub Actions workflow:

```yaml
- name: Check copyright headers
  run: |
    bun run license
    # Check if any files were modified
    if [[ -n $(git status --porcelain) ]]; then
      echo "❌ Missing copyright headers detected"
      git diff
      exit 1
    fi
```

**Benefits:**

- Catches missing headers in CI
- Prevents merging PRs without headers
- Works as final safety net

## For Agents (Claude Code, Copilot, etc.)

**IMPORTANT**: When creating new `.ts` or `.tsx` files, ALWAYS:

1. Create the file with your implementation
2. Run `bun run license` to add headers
3. Verify headers were added correctly

Example workflow:

```bash
# Agent creates new file
# Agent runs license command
bun run license
# Agent verifies and proceeds
```

## Troubleshooting

### Headers not added after running script

Check that:

1. File has `.ts` or `.tsx` extension
2. File is in `src/`, `scripts/`, or `tests/` directory
3. File doesn't already have a header (script skips files with headers)

### Shebang files

For scripts with shebang (`#!/usr/bin/env bun`), the header is automatically placed after the shebang:

```typescript
#!/usr/bin/env bun

/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

// Your code here
```

## Implementation Details

The header automation script is located at `scripts/add-license-headers.ts` and:

- Scans `src/`, `scripts/`, `tests/` directories recursively
- Skips files that already have headers (idempotent)
- Preserves shebangs when present
- Provides summary of files processed vs skipped
