# Knip Dead Code Detector

## Overview

**Version**: 5.65.0
**Purpose**: Comprehensive tool for detecting and removing unused code, dependencies, exports, and configuration issues. Helps maintain a clean, optimized codebase by identifying dead code that accumulates over time.

## What Knip Detects

1. **Unused Files** - Source files that aren't imported anywhere in the project
2. **Unused Dependencies** - Packages listed in `package.json` but never used in code
3. **Unused devDependencies** - Development tools that aren't actually referenced
4. **Unused Exports** - Functions, classes, or variables exported but never imported
5. **Unreachable Code** - Dead code paths that can never be executed
6. **Duplicate Exports** - Same identifier exported multiple times
7. **Unlisted Dependencies** - Imports that aren't declared in `package.json`
8. **Configuration Issues** - Missing or incorrect tool configurations

## Why Knip is Important

- Reduces bundle size by removing unused code
- Speeds up TypeScript compilation by eliminating unused files
- Identifies unused dependencies that can be removed
- Maintains codebase hygiene during refactoring
- Catches errors like missing dependencies early
- Provides visibility into actual code usage patterns

## Running Knip with Bun

```bash
# Auto-fix unused exports (recommended)
bun run clean
bunx knip --fix

# Detection only (no modifications)
bunx knip

# Check specific issues
bunx knip --dependencies      # Only check dependencies
bunx knip --exports           # Only check exports
bunx knip --files             # Only check unused files

# Generate detailed report
bunx knip --reporter json     # JSON output
bunx knip --reporter markdown # Markdown report

# Watch mode (continuous monitoring)
bunx knip --watch

# Include/exclude patterns
bunx knip --include "src/**/*"
bunx knip --exclude "**/*.test.ts"
```

## The --fix Flag

### What --fix Does Automatically

- Removes unused exports from source files
- Cleans up dead code that can be safely deleted
- Auto-fixes simple issues without manual intervention

### What --fix Does NOT Do

Requires manual action:

- Remove unused dependencies from `package.json` (suggests removal)
- Delete unused files (reports them but doesn't delete)
- Modify complex export patterns (reports issues)
- Fix configuration problems (reports recommendations)

## Understanding Knip Output

### Example Output

```bash
Unused files (2)
  src/old-module.ts
  src/deprecated.ts

Unused dependencies (1)
  lodash

Unused devDependencies (1)
  @types/jest

Unused exports (3)
  src/utils.ts: helperFunction, CONSTANT_VALUE
  src/types.ts: OldInterface

Unlisted dependencies (1)
  date-fns (imported in src/formatter.ts)
```

## Addressing Knip Findings

1. **Unused Files**: Review and delete if truly unused, or add imports if needed
2. **Unused Dependencies**: Run `bun remove <package>` to remove from `package.json`
3. **Unused Exports**: Run `bun run clean` to auto-remove, or keep if part of public API
4. **Unlisted Dependencies**: Run `bun add <package>` to add to `package.json`

## Integration with Bun

- Command: `bun run clean` (runs `knip --fix`)
- Execution: Knip runs via `bunx` (Bun's package executor)
- Speed: Fast analysis leveraging Bun's performance
- Compatibility: Works seamlessly with Bun's module resolution

## Configuration

Knip can be configured via:

- `knip.json` - Dedicated configuration file (used in this project)
- `knip.config.ts` - TypeScript configuration file
- `package.json` - `"knip"` field for inline config

### Active Configuration (knip.json)

```json
{
  "entry": ["src/index.ts"],
  "project": ["src/**/*.ts"],
  "ignore": ["**/*.test.ts", "**/*.spec.ts", "scripts/**", "tests/**"],
  "ignoreDependencies": [],
  "ignoreExportsUsedInFile": true
}
```

### Configuration Breakdown

- **entry**: `["src/index.ts"]` - Main application entry point
- **project**: `["src/**/*.ts"]` - Analyze all TypeScript files in src directory
- **ignore**: Exclude files that should not be checked for dead code:
  - `**/*.test.ts` - Unit test files (Bun Test)
  - `**/*.spec.ts` - E2E test files (Playwright)
  - `scripts/**` - Utility scripts (e.g., update-license-date.js)
  - `tests/**` - E2E test directory
- **ignoreDependencies**: No dependencies ignored (empty array)
- **ignoreExportsUsedInFile**: `true` - Ignore exports used in the same file

### Why Test Files and Scripts Are Excluded

**Test Files** (`*.test.ts`, `*.spec.ts`):

- Tests often have intentional "unused" exports for testing purposes
- Test utilities and fixtures may not be imported across test files
- Knip would incorrectly flag test-specific code as dead code
- Tests are validated by running them, not by dead code detection

**Scripts Directory** (`scripts/**`):

- Contains utility scripts run directly (not imported)
- Scripts like `update-license-date.js` are executed by semantic-release
- Not part of the main application import graph
- Would be incorrectly flagged as unused files

**Tests Directory** (`tests/**`):

- Playwright E2E tests are not imported, they're executed directly
- Test files may have setup code not shared across tests
- Separate from main application source code

### Common Configuration Options

- `entry`: Entry point files (where analysis starts)
- `project`: Files to include in analysis
- `ignore`: Files/patterns to exclude (glob syntax)
- `ignoreDependencies`: Dependencies to skip checking
- `ignoreExportsUsedInFile`: Ignore exports used in same file

## When to Run Knip

1. **Weekly Maintenance** (recommended):

   ```bash
   bun run clean  # Regular cleanup
   ```

2. **Before Major Releases** (critical):

   ```bash
   bunx knip  # Full report before release
   ```

3. **During Refactoring** (helpful):

   ```bash
   bunx knip --watch  # Monitor changes in real-time
   ```

4. **After Dependency Updates** (recommended):

   ```bash
   bunx knip  # Verify no unused dependencies
   ```

5. **When Bundle Size Matters** (optimization):
   ```bash
   bunx knip  # Identify code to remove
   ```

## Knip vs Other Tools

| Tool                 | Purpose                       | When to Run             | Auto-Fix               |
| -------------------- | ----------------------------- | ----------------------- | ---------------------- |
| **Knip**             | Find unused code/dependencies | Weekly, before releases | Partial (exports only) |
| **TypeScript (tsc)** | Type checking                 | Before commits, CI/CD   | No                     |
| **Prettier**         | Code formatting               | Before commits, on save | Yes (full)             |
| **Bun Test**         | Functionality testing         | After changes, CI/CD    | No                     |

## Knip is NOT

- A linter (doesn't check code style or patterns)
- A type checker (doesn't validate types)
- A formatter (doesn't modify code style)
- A pre-commit check (too slow for every commit)

## Knip IS

- A maintenance tool (run periodically)
- A dead code detector (finds unused code)
- A dependency auditor (checks package usage)
- A codebase cleaner (helps remove cruft)

## Common Scenarios

### Scenario 1: After Refactoring

```bash
# You removed a feature and want to clean up leftover code
bunx knip --fix
# Review unused files and dependencies
# Remove unused dependencies: bun remove <package>
# Delete unused files manually
```

### Scenario 2: Optimizing Bundle Size

```bash
# Find what's not being used
bunx knip --reporter markdown > knip-report.md
# Review report and remove unused code
# Measure bundle size improvement
```

### Scenario 3: Dependency Audit

```bash
# Check if all dependencies are actually used
bunx knip --dependencies
# Remove unused ones: bun remove <package>
# Add missing ones: bun add <package>
```

### Scenario 4: Before Release

```bash
# Full cleanup before shipping
bunx knip
# Address all findings
# Run again to verify: bunx knip
# Proceed with release if clean
```

## Performance Considerations

- Knip analyzes the entire codebase (can be slow on large projects)
- First run may take time as Knip builds dependency graph
- Subsequent runs are faster due to caching
- Use `--include`/`--exclude` to focus analysis on specific areas

## False Positives

Knip may report false positives in these cases:

- **Dynamic imports**: `import(dynamicPath)` may not be detected
- **Side-effect imports**: `import './side-effects'` without exports
- **Type-only exports**: Exports used only in type positions
- **Build-time usage**: Code used by build tools but not in source

### Handling False Positives

```typescript
// Ignore specific exports
export const keepThis = 'value' // @knip-ignore

// Ignore entire file
// @knip-ignore-file
```

## Integration with CI/CD (Optional)

```yaml
# Example GitHub Actions workflow
- name: Check for unused code
  run: bunx knip --reporter json
  continue-on-error: true # Don't fail build, just report
```

## Best Practices

1. **Run regularly** - Don't let dead code accumulate
2. **Review before auto-fixing** - Understand what will be removed
3. **Commit Knip config** - Share configuration with team
4. **Use in combination with other tools** - Knip complements TypeScript/Prettier
5. **Document exceptions** - Use comments to explain ignored items
6. **Start with detection only** - Run without `--fix` first to understand findings
7. **Clean incrementally** - Don't try to fix everything at once

## Troubleshooting

### Knip reports too many false positives

- Configure entry points correctly in `knip.json`
- Use `ignoreDependencies` for known good dependencies
- Add `@knip-ignore` comments for specific cases

### Knip is too slow

- Use `--include` to focus on specific directories
- Enable `skipLibCheck` in `tsconfig.json`
- Run on subsets of codebase rather than everything

### Knip removes code I need

- Review changes before committing (use `bunx knip` first)
- Add exports to public API if they're meant to be used externally
- Use `ignoreExportsUsedInFile: true` for utility functions

## References

- Knip documentation: https://knip.dev/
- Configuration guide: https://knip.dev/reference/configuration
- Rules reference: https://knip.dev/reference/rules
