# Claude Code Hooks for Copyright Headers

This guide shows how to configure Claude Code to automatically add copyright headers after creating new files.

## What are Claude Code Hooks?

Claude Code hooks are shell commands that execute automatically in response to events like:

- After writing files (`post-write-hook`)
- Before submitting prompts (`user-prompt-submit-hook`)
- After tool calls

## Setup: Auto-License Hook

### Option 1: Post-Write Hook (Recommended)

This hook runs `bun run license` after any file write operation.

**Steps:**

1. **Open Claude Code Settings** (via Command Palette or Settings UI)

2. **Add Post-Write Hook:**

```json
{
  "hooks": {
    "post-write-hook": "cd \"$CLAUDE_CWD\" && bun run license 2>&1 | grep -v 'Files already with headers' || true"
  }
}
```

**What this does:**

- Runs after every file write
- Changes to project directory
- Runs license script
- Filters out noise (files already with headers)
- Always succeeds (doesn't block Claude)

### Option 2: Conditional Post-Write Hook (Smart)

Only run the license script when TypeScript files are created:

```json
{
  "hooks": {
    "post-write-hook": "if echo \"$CLAUDE_FILE_PATH\" | grep -q '\\.tsx\\?$'; then cd \"$CLAUDE_CWD\" && bun run license --quiet 2>&1 | head -5; fi || true"
  }
}
```

**What this does:**

- Checks if file is `.ts` or `.tsx`
- Only runs license script for TypeScript files
- Quieter output
- More efficient

### Option 3: Manual Trigger via Custom Prompt

Add a slash command that Claude can call:

Create `.claude/commands/license.md`:

```markdown
Run the copyright header script:

\`\`\`bash
bun run license
\`\`\`

Show a summary of files processed.
```

**Usage:** Type `/license` in Claude Code (requires reload/restart after creating the command file)

## Available Hook Variables

Claude Code provides these environment variables in hooks:

- `$CLAUDE_FILE_PATH` - Path to the file being written
- `$CLAUDE_CWD` - Current working directory
- `$CLAUDE_TOOL` - Name of the tool being used

## Testing Your Hook

1. **Create a test file** through Claude Code:

   ```
   Create a new file: src/test-hook.ts with a simple function
   ```

2. **Check if hook ran**:

   ```bash
   head -5 src/test-hook.ts
   ```

   You should see the copyright header.

3. **Clean up**:
   ```bash
   rm src/test-hook.ts
   ```

## Troubleshooting

### Hook not running

- Check hook syntax in settings
- Verify path to project directory
- Test command manually in terminal
- Check Claude Code logs

### Hook blocking Claude

- Add `|| true` at the end to always succeed
- Use `2>&1` to capture errors
- Keep hook commands fast (<1 second)

### Too much output

- Use `--quiet` flag if available
- Pipe to `grep` to filter output
- Use `head` to limit lines
- Redirect to `/dev/null` for silent mode

## Best Practices

1. **Keep hooks fast** - Slow hooks block Claude's workflow
2. **Always succeed** - Use `|| true` to prevent blocking
3. **Filter output** - Only show relevant information
4. **Test thoroughly** - Ensure hook works in all scenarios
5. **Document in project** - Keep this file updated

## Alternative: VSCode Extension

If Claude Code hooks are too noisy, consider using a VSCode extension:

- **File Templates** - Auto-insert headers on file creation
- **File Header Comment** - Add headers with keyboard shortcut
- **Auto Header** - Configure project-specific headers

## Complete Example

Here's a complete Claude Code settings configuration:

```json
{
  "hooks": {
    "post-write-hook": "if echo \"$CLAUDE_FILE_PATH\" | grep -E '(src|scripts|tests)/.*\\.tsx?$' > /dev/null 2>&1; then cd \"$CLAUDE_CWD\" && bun run license 2>&1 | grep 'Added header' || true; else true; fi"
  },
  "terminal": {
    "shell": "/bin/bash"
  }
}
```

**This hook:**

- Only runs for `.ts`/`.tsx` files in `src/`, `scripts/`, `tests/`
- Shows only when headers are added (filters noise)
- Always succeeds
- Uses bash for consistent behavior

## Integration with Other Tools

This hook works alongside:

- **Husky pre-commit** - Catches missed files before commit
- **ESLint** - Real-time feedback in editor
- **CI/CD** - Final check before merge

Together they create a defense-in-depth strategy.
