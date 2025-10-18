# Quick Start: Copyright Headers

**TL;DR**: Run `bun run license` after creating new `.ts`/`.tsx` files.

## For Humans

### Option 1: Manual (Current) ✅

```bash
bun run license
```

### Option 2: Automated (Recommended)

**Claude Code Hook** - Auto-runs after file creation:

```json
// Add to Claude Code Settings > Hooks
{
  "hooks": {
    "post-write-hook": "if echo \"$CLAUDE_FILE_PATH\" | grep -E '(src|scripts|tests)/.*\\.tsx?$' > /dev/null 2>&1; then cd /Users/thomasjeanneau/Codes/omnera-v2 && bun run license 2>&1 | grep 'Added header' || true; else true; fi"
  }
}
```

**Husky Pre-Commit** - Auto-runs before commit:

```bash
bun add -d husky
bunx husky init
echo "bun run license" > .husky/pre-commit
chmod +x .husky/pre-commit
```

## For AI Agents

When creating `.ts`/`.tsx` files, ALWAYS run:

```bash
bun run license
```

Or use slash command after reload:

```
/license
```

## Header Format

```typescript
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */
```

## Detailed Guides

- **Full Automation Options**: [`copyright-headers.md`](./copyright-headers.md)
- **Claude Code Hooks Setup**: [`claude-code-hooks.md`](./claude-code-hooks.md)
