# CLAUDE.md - Omnera V2 Project Documentation

This document provides comprehensive technical documentation for the Omnera V2 project, designed to give Claude Code and other AI assistants complete context for accurate code generation.

## Project Overview

**Project Name**: Omnera V2
**Version**: 0.0.1
**License**: BSL-1.1 (Business Source License 1.1)
**Created with**: Bun v1.3.0 (via `bun init`)
**Primary Runtime**: Bun (NOT Node.js)
**Package Manager**: Bun (NOT npm, yarn, or pnpm)
**Test Runners**:
  - Bun Test (built-in) - Unit tests
  - Playwright ^1.56.0 - End-to-end (E2E) tests
**Code Formatter**: Prettier 3.6.2
**Module System**: ES Modules (type: "module")
**Entry Point**: src/index.ts

## Core Technologies

### Bun Runtime (v1.3.0)

**Purpose**: All-in-one JavaScript/TypeScript runtime replacing Node.js
**Key Features**:
- Native TypeScript execution without compilation
- Built-in JSX/TSX support
- Fastest JavaScript runtime (uses JavaScriptCore engine)
- Built-in package manager and test runner
- Native Web API support (fetch, WebSocket, etc.)

**Execution Pattern**:
```bash
# Direct TypeScript execution - NO compilation step needed
bun run index.ts
bun run src/any-file.ts

# Script execution from package.json
bun run <script-name>
```

**Why Bun over Node.js**:
- 4x faster cold starts
- Native TypeScript without build step
- Unified toolchain (runtime + package manager + test runner + bundler)
- Better memory efficiency
- Modern JavaScript features by default

### TypeScript Configuration

**Version**: ^5 (peer dependency)
**Configuration**: Optimized for Bun's bundler mode with strict type safety

**Critical Distinction - Execution vs Type Checking**:
- **Bun Runtime**: Executes TypeScript directly WITHOUT type checking (fast, for performance)
- **TypeScript Compiler (tsc)**: Validates types WITHOUT emitting files (slow, for correctness)
- **Both are needed**: Bun for execution speed, tsc for type safety validation

**Key tsconfig.json Settings**:
```json
{
  "compilerOptions": {
    // Environment & Features
    "lib": ["ESNext"],           // Latest JavaScript features
    "target": "ESNext",          // No downleveling needed
    "module": "Preserve",        // Preserves original module syntax
    "moduleDetection": "force",  // Treat all files as modules
    "jsx": "react-jsx",          // JSX support (if React is added)
    "allowJs": true,             // Allow JavaScript files

    // Bundler Mode (Bun-specific)
    "moduleResolution": "bundler", // Bun's resolution algorithm
    "allowImportingTsExtensions": true, // Can import .ts files directly
    "verbatimModuleSyntax": true, // Explicit import/export syntax
    "noEmit": true,              // CRITICAL: Bun handles execution, not tsc

    // Type Safety (Strict Mode)
    "strict": true,              // Enable all strict type-checking options
    "skipLibCheck": true,        // Skip type checking of declaration files
    "noFallthroughCasesInSwitch": true, // Prevent switch fallthrough bugs
    "noUncheckedIndexedAccess": true,   // Array/object access returns T | undefined
    "noImplicitOverride": true,  // Explicit override keyword required

    // Optional Strictness (disabled for flexibility)
    "noUnusedLocals": false,     // Allow unused local variables
    "noUnusedParameters": false, // Allow unused function parameters
    "noPropertyAccessFromIndexSignature": false // Allow obj['prop'] syntax
  }
}
```

**Import Conventions**:
```typescript
// CORRECT - Bun allows .ts extensions
import { something } from "./module.ts"

// CORRECT - Type-only imports must be explicit
import type { SomeType } from "./types.ts"

// INCORRECT - Don't omit extensions
import { something } from "./module"  // ❌
```

**Why noEmit is Critical**:
- `noEmit: true` prevents tsc from generating JavaScript files
- Bun executes TypeScript directly at runtime (no compilation needed)
- tsc is ONLY used for static type validation, not for building
- This separation allows: Fast execution (Bun) + Comprehensive type checking (tsc)

## Development Tools

### Bun Package Manager

**Lock File**: `bun.lock` (binary format, not human-readable)
**Manifest**: `package.json` (standard npm format)

**Essential Commands**:
```bash
# Install all dependencies
bun install
bun i  # shorthand

# Add dependencies
bun add <package>           # runtime dependency
bun add -d <package>        # dev dependency
bun add --peer <package>    # peer dependency

# Remove dependencies
bun remove <package>

# Update dependencies
bun update <package>        # update specific
bun update                  # update all

# Clean install
rm -rf node_modules bun.lock && bun install

# Run scripts
bun run <script>           # from package.json
bun run --bun <script>     # force Bun runtime
```

**Performance Notes**:
- Install speed: 10-100x faster than npm
- Uses hardlinks when possible (saves disk space)
- Global cache shared across projects
- Binary lockfile for faster parsing

### TypeScript Type Checker (tsc v2.0.4)

**Purpose**: Provides comprehensive static type checking for TypeScript code without emitting JavaScript files. This is a critical development tool that catches type errors before runtime, complementing Bun's fast but unchecked execution.

**Package Structure**:
- **tsc package**: v2.0.4 (wrapper that executes TypeScript compiler)
- **TypeScript peer dependency**: ^5 (the actual TypeScript compiler)
- **Configuration**: Uses `tsconfig.json` with `noEmit: true`

**Why Type Checking is Separate from Execution**:

Bun's execution model prioritizes speed by skipping type checking:
```typescript
// When you run: bun run index.ts
// Bun does: Parse TypeScript → Execute JavaScript (NO TYPE CHECKING)
// This is FAST but won't catch type errors until runtime

// When you run: bun run typecheck (or tsc --noEmit)
// tsc does: Parse TypeScript → Validate all types → Report errors (NO EXECUTION)
// This is SLOW but catches all type errors before runtime
```

**The Two-Phase Workflow**:
1. **Development/Execution**: `bun run index.ts` - Fast execution, no type checking
2. **Validation**: `bun run typecheck` - Slow type checking, no execution

**Running Type Checks**:
```bash
# Via npm script (recommended)
bun run typecheck

# Direct tsc command (equivalent)
bun tsc --noEmit

# With bunx (alternative)
bunx tsc --noEmit

# Watch mode for continuous type checking during development
bunx tsc --noEmit --watch

# Check specific files/directories
bunx tsc --noEmit src/
bunx tsc --noEmit src/**/*.ts
```

**Understanding --noEmit Flag**:
- **Critical for Bun projects**: Prevents tsc from generating .js files
- **Why it matters**: Bun executes TypeScript directly; tsc-generated files would be redundant
- **Type checking only**: tsc validates types but doesn't produce output
- **Configuration**: Set in tsconfig.json (`"noEmit": true`) and reinforced via CLI flag

**Type Checking vs Execution Comparison**:

| Aspect | Bun Runtime | TypeScript Compiler (tsc) |
|--------|-------------|---------------------------|
| **Speed** | Very fast (~4x faster than Node.js) | Slow (type analysis is expensive) |
| **Type Checking** | None (skipped for performance) | Comprehensive (all type rules enforced) |
| **Purpose** | Execute code, run application | Validate types, catch errors |
| **Output** | Program execution, side effects | Error messages, type diagnostics |
| **When to Use** | Development, production, testing | Pre-commit, CI/CD, manual checks |
| **Files Generated** | None | None (with --noEmit) |
| **Typical Time** | Milliseconds | Seconds (depends on project size) |

**Integration with Bun**:
- Bun and tsc are **complementary**, not competing tools
- Bun handles **runtime execution** with maximum performance
- tsc handles **static validation** with maximum type safety
- Together they provide: Fast iteration + Comprehensive error detection

**Common Type Errors Caught by tsc**:
```typescript
// Example type errors tsc will catch that Bun runtime won't:

// 1. Type mismatches
const num: number = "string"  // Error: Type 'string' not assignable to 'number'

// 2. Missing properties
interface User { name: string; age: number }
const user: User = { name: "Alice" }  // Error: Property 'age' is missing

// 3. Undefined access (with noUncheckedIndexedAccess)
const items = [1, 2, 3]
const item = items[10]  // Type: number | undefined (must handle undefined)

// 4. Incorrect function calls
function greet(name: string) {}
greet(42)  // Error: Argument of type 'number' not assignable to 'string'

// 5. Type inference issues
const value = Math.random() > 0.5 ? "text" : 42
const length = value.length  // Error: Property 'length' does not exist on 'number'
```

**When to Run Type Checks**:

1. **During Development** (optional, for real-time feedback):
   ```bash
   bunx tsc --noEmit --watch
   ```

2. **Before Committing** (recommended):
   ```bash
   bun run typecheck  # Part of pre-commit checklist
   ```

3. **In CI/CD Pipeline** (critical):
   ```bash
   bun run typecheck  # Fail builds if type errors exist
   ```

4. **After Adding Dependencies** (recommended):
   ```bash
   bun run typecheck  # Verify type compatibility
   ```

5. **Before Production Deployment** (critical):
   ```bash
   bun run typecheck  # Final validation before release
   ```

**Type Check Failure Handling**:

When `bun run typecheck` fails:
```bash
# Example output:
src/index.ts:10:5 - error TS2322: Type 'string' is not assignable to type 'number'.

10     const age: number = "25"
       ~~~

Found 1 error in src/index.ts:10
```

**Resolution steps**:
1. **Read the error message carefully** - tsc provides detailed diagnostics
2. **Locate the file and line number** - Navigate to the error location
3. **Understand the type mismatch** - Identify what types conflict
4. **Fix the code** - Update types, add type guards, or adjust logic
5. **Re-run type check** - Verify the fix: `bun run typecheck`

**IDE Integration**:

Most IDEs use TypeScript's language server for real-time type checking:

**VS Code** (built-in TypeScript support):
- Type errors appear as red squiggles
- Hover over code to see inferred types
- Uses same tsconfig.json as tsc command
- Real-time type checking as you type
- No additional configuration needed

**WebStorm/IntelliJ IDEA** (built-in TypeScript support):
- Enable TypeScript Language Service in settings
- Automatic type checking on file save
- Type errors highlighted inline
- Uses project's tsconfig.json automatically

**Vim/Neovim** (via Language Server Protocol):
```vim
" Using coc-tsserver or typescript-language-server
" Install: :CocInstall coc-tsserver
" Type checking happens automatically
```

**Configuration Reference**:

The `tsc` command respects all settings in `tsconfig.json`:
- **Type strictness**: `strict`, `noUncheckedIndexedAccess`, etc.
- **Module resolution**: `moduleResolution: "bundler"`
- **File inclusion**: Defaults to all .ts/.tsx files in project
- **Exclusions**: Respects `exclude` patterns (node_modules, dist, etc.)

**Performance Considerations**:

Type checking large projects can be slow:
```bash
# Skip library type checks for faster validation (already in tsconfig.json)
# "skipLibCheck": true

# Check only specific directories
bunx tsc --noEmit src/

# Incremental mode (caches previous results)
bunx tsc --noEmit --incremental

# Project references (for monorepos/large projects)
# Configure in tsconfig.json for faster rebuilds
```

**Why tsc v2.0.4 Package**:
- Provides consistent tsc executable across environments
- Wrapper around TypeScript peer dependency (^5)
- Allows `bun tsc` command without global TypeScript installation
- Respects project's TypeScript version (via peer dependency)
- Ensures compatibility between tsc wrapper and TypeScript compiler

**Type Checking Best Practices**:
1. **Run type checks frequently** - Don't wait until pre-commit
2. **Use watch mode during development** - Catch errors immediately
3. **Never commit with type errors** - Fix all errors before committing
4. **Include typecheck in CI/CD** - Prevent type errors from reaching production
5. **Trust the type checker** - If tsc reports an error, there's likely a real issue
6. **Fix root causes, not symptoms** - Use proper types instead of `any` or `@ts-ignore`

### Knip Dead Code Detector (v5.65.0)

**Purpose**: Comprehensive tool for detecting and removing unused code, dependencies, exports, and configuration issues. Helps maintain a clean, optimized codebase by identifying dead code that accumulates over time.

**What Knip Detects**:

1. **Unused Files** - Source files that aren't imported anywhere in the project
2. **Unused Dependencies** - Packages listed in `package.json` but never used in code
3. **Unused devDependencies** - Development tools that aren't actually referenced
4. **Unused Exports** - Functions, classes, or variables exported but never imported
5. **Unreachable Code** - Dead code paths that can never be executed
6. **Duplicate Exports** - Same identifier exported multiple times
7. **Unlisted Dependencies** - Imports that aren't declared in `package.json`
8. **Configuration Issues** - Missing or incorrect tool configurations

**Why Knip is Important**:
- Reduces bundle size by removing unused code
- Speeds up TypeScript compilation by eliminating unused files
- Identifies unused dependencies that can be removed
- Maintains codebase hygiene during refactoring
- Catches errors like missing dependencies early
- Provides visibility into actual code usage patterns

**Running Knip with Bun**:
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

**The --fix Flag**:

**What --fix Does Automatically**:
- Removes unused exports from source files
- Cleans up dead code that can be safely deleted
- Auto-fixes simple issues without manual intervention

**What --fix Does NOT Do** (requires manual action):
- Remove unused dependencies from `package.json` (suggests removal)
- Delete unused files (reports them but doesn't delete)
- Modify complex export patterns (reports issues)
- Fix configuration problems (reports recommendations)

**Understanding Knip Output**:
```bash
# Example output when running: bunx knip

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

**Addressing Knip Findings**:

1. **Unused Files**: Review and delete if truly unused, or add imports if needed
2. **Unused Dependencies**: Run `bun remove <package>` to remove from `package.json`
3. **Unused Exports**: Run `bun run clean` to auto-remove, or keep if part of public API
4. **Unlisted Dependencies**: Run `bun add <package>` to add to `package.json`

**Integration with Bun**:
- Command: `bun run clean` (runs `knip --fix`)
- Execution: Knip runs via `bunx` (Bun's package executor)
- Speed: Fast analysis leveraging Bun's performance
- Compatibility: Works seamlessly with Bun's module resolution

**Configuration**:

Knip can be configured via:
- `knip.json` - Dedicated configuration file
- `knip.config.ts` - TypeScript configuration file
- `package.json` - `"knip"` field for inline config

**Example Configuration** (knip.json):
```json
{
  "entry": ["index.ts", "src/main.ts"],
  "project": ["src/**/*.ts"],
  "ignore": ["**/*.test.ts", "**/*.spec.ts"],
  "ignoreDependencies": ["@types/*"],
  "ignoreExportsUsedInFile": true
}
```

**Common Configuration Options**:
- `entry`: Entry point files (where analysis starts)
- `project`: Files to include in analysis
- `ignore`: Files/patterns to exclude
- `ignoreDependencies`: Dependencies to skip checking
- `ignoreExportsUsedInFile`: Ignore exports used in same file

**When to Run Knip**:

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

**Knip vs Other Tools**:

| Tool | Purpose | When to Run | Auto-Fix |
|------|---------|-------------|----------|
| **Knip** | Find unused code/dependencies | Weekly, before releases | Partial (exports only) |
| **TypeScript (tsc)** | Type checking | Before commits, CI/CD | No |
| **Prettier** | Code formatting | Before commits, on save | Yes (full) |
| **Bun Test** | Functionality testing | After changes, CI/CD | No |

**Knip is NOT**:
- A linter (doesn't check code style or patterns)
- A type checker (doesn't validate types)
- A formatter (doesn't modify code style)
- A pre-commit check (too slow for every commit)

**Knip IS**:
- A maintenance tool (run periodically)
- A dead code detector (finds unused code)
- A dependency auditor (checks package usage)
- A codebase cleaner (helps remove cruft)

**Common Scenarios**:

**Scenario 1: After Refactoring**
```bash
# You removed a feature and want to clean up leftover code
bunx knip --fix
# Review unused files and dependencies
# Remove unused dependencies: bun remove <package>
# Delete unused files manually
```

**Scenario 2: Optimizing Bundle Size**
```bash
# Find what's not being used
bunx knip --reporter markdown > knip-report.md
# Review report and remove unused code
# Measure bundle size improvement
```

**Scenario 3: Dependency Audit**
```bash
# Check if all dependencies are actually used
bunx knip --dependencies
# Remove unused ones: bun remove <package>
# Add missing ones: bun add <package>
```

**Scenario 4: Before Release**
```bash
# Full cleanup before shipping
bunx knip
# Address all findings
# Run again to verify: bunx knip
# Proceed with release if clean
```

**Performance Considerations**:
- Knip analyzes the entire codebase (can be slow on large projects)
- First run may take time as Knip builds dependency graph
- Subsequent runs are faster due to caching
- Use `--include`/`--exclude` to focus analysis on specific areas

**False Positives**:

Knip may report false positives in these cases:
- **Dynamic imports**: `import(dynamicPath)` may not be detected
- **Side-effect imports**: `import './side-effects'` without exports
- **Type-only exports**: Exports used only in type positions
- **Build-time usage**: Code used by build tools but not in source

**Handling False Positives**:
```typescript
// Ignore specific exports
export const keepThis = 'value' // @knip-ignore

// Ignore entire file
// @knip-ignore-file
```

**Integration with CI/CD** (optional):
```yaml
# Example GitHub Actions workflow
- name: Check for unused code
  run: bunx knip --reporter json
  continue-on-error: true  # Don't fail build, just report
```

**Best Practices**:
1. **Run regularly** - Don't let dead code accumulate
2. **Review before auto-fixing** - Understand what will be removed
3. **Commit Knip config** - Share configuration with team
4. **Use in combination with other tools** - Knip complements TypeScript/Prettier
5. **Document exceptions** - Use comments to explain ignored items
6. **Start with detection only** - Run without `--fix` first to understand findings
7. **Clean incrementally** - Don't try to fix everything at once

**Troubleshooting**:

**Knip reports too many false positives**:
- Configure entry points correctly in `knip.json`
- Use `ignoreDependencies` for known good dependencies
- Add `@knip-ignore` comments for specific cases

**Knip is too slow**:
- Use `--include` to focus on specific directories
- Enable `skipLibCheck` in `tsconfig.json`
- Run on subsets of codebase rather than everything

**Knip removes code I need**:
- Review changes before committing (use `bunx knip` first)
- Add exports to public API if they're meant to be used externally
- Use `ignoreExportsUsedInFile: true` for utility functions

### ESLint Code Linter (v9.37.0)

**Purpose**: Static code analysis tool that identifies and catches potential bugs, code quality issues, and enforces coding standards. ESLint complements TypeScript by catching logic errors and anti-patterns that type checking alone cannot detect.

**What ESLint Provides**:
1. **Bug Detection** - Catches logic errors TypeScript's type system misses (unused variables, unreachable code, etc.)
2. **Code Quality Rules** - Enforces best practices and identifies anti-patterns
3. **Consistency Enforcement** - Ensures coding standards across the codebase
4. **TypeScript Integration** - Type-aware linting via typescript-eslint v8.46.1
5. **Auto-Fixing** - Many issues can be automatically fixed with `--fix` flag

**ESLint v9.37.0 Features**:
- New flat configuration system (eslint.config.ts)
- Improved TypeScript support via typescript-eslint v8
- Better performance and more intuitive configuration
- Unified package for TypeScript ESLint integration

**ESLint vs Other Tools**:

| Tool | Purpose | What It Catches | Auto-Fix | When to Run |
|------|---------|-----------------|----------|-------------|
| **ESLint** | Code quality & logic errors | Unused variables, logic bugs, anti-patterns, best practice violations | Partial (many rules) | Before commits, during dev, CI/CD |
| **TypeScript (tsc)** | Type checking | Type mismatches, missing properties, incorrect function calls | No | Before commits, CI/CD |
| **Prettier** | Code formatting | Style inconsistencies, formatting issues | Yes (full) | Before commits, on save |
| **Knip** | Dead code detection | Unused files, exports, dependencies | Partial (exports only) | Weekly, before releases |

**Why ESLint is Complementary**:
- **TypeScript**: Catches type errors (e.g., `string` assigned to `number`)
- **ESLint**: Catches logic errors (e.g., unused variable, unreachable code, `==` instead of `===`)
- **Prettier**: Formats code appearance (quotes, semicolons, indentation)
- **Together**: Comprehensive code quality (types + logic + style)

**Running ESLint with Bun**:
```bash
# Lint all files in the project
bun run lint
bunx eslint .

# Lint and auto-fix issues
bunx eslint . --fix

# Lint specific files or directories
bunx eslint src/
bunx eslint "src/**/*.ts"
bunx eslint index.ts

# Lint with detailed output
bunx eslint . --format=stylish
bunx eslint . --format=json > eslint-report.json

# Lint only TypeScript files
bunx eslint "**/*.{ts,tsx}"

# Check specific rule
bunx eslint . --rule "no-unused-vars: error"
```

**The --fix Flag**:

**What --fix Automatically Corrects**:
- Unused imports and variables (removes them)
- Spacing and formatting issues (quotes, semicolons - though Prettier handles this better)
- Simple logic fixes (prefer `const` over `let`, sort imports, etc.)
- Most stylistic rules
- Array/object formatting issues
- Import/export ordering

**What --fix Cannot Fix** (requires manual intervention):
- Complex logic errors (infinite loops, incorrect conditionals)
- Missing error handling (try/catch blocks)
- Security vulnerabilities
- Type-related issues (those are TypeScript's domain)
- Architectural problems
- Performance issues requiring algorithmic changes

**Understanding ESLint Output**:
```bash
# Example output when running: bunx eslint .

/Users/user/project/src/utils.ts
  10:7   error    'unusedVar' is defined but never used              @typescript-eslint/no-unused-vars
  15:3   warning  Unexpected console statement                       no-console
  22:5   error    'variable' is never reassigned. Use 'const'        prefer-const
  28:10  error    Expected '===' and instead saw '=='                eqeqeq

/Users/user/project/index.ts
  5:1    warning  Fast refresh only works when a file only exports components  react-refresh/only-export-components

✖ 5 problems (3 errors, 2 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

**Addressing ESLint Findings**:
1. **Run with --fix first**: `bunx eslint . --fix` (auto-fixes many issues)
2. **Review remaining errors**: Read error messages and locate issues
3. **Fix manually**: Address logic errors and complex issues
4. **Re-run ESLint**: Verify all issues resolved: `bun run lint`
5. **Never ignore errors**: Fix root causes instead of using `// eslint-disable`

**Configuration**: `eslint.config.ts` (Flat Config Format)

**Active Configuration**:
```typescript
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
])
```

**Configuration Breakdown**:
- **Files**: Lints all JavaScript and TypeScript files (including module variants)
- **Plugins**: Uses `@eslint/js` for JavaScript rule definitions
- **Extends**: Applies ESLint's recommended JavaScript rules
- **Language Options**: Defines browser globals (window, document, etc.)
- **TypeScript Config**: Applies typescript-eslint's recommended rules for TypeScript files

**Key Dependencies**:
- **eslint v9.37.0**: Core ESLint linter engine
- **@eslint/js v9.37.0**: ESLint's recommended JavaScript rules (flat config)
- **typescript-eslint v8.46.1**: TypeScript-specific rules and parser
- **globals v16.4.0**: Global variable definitions for different environments (browser, Node.js, Bun)

**typescript-eslint Integration**:
- Parses TypeScript syntax correctly (understands TS-specific features)
- Provides TypeScript-specific rules (e.g., `@typescript-eslint/no-unused-vars`)
- Type-aware linting rules that leverage TypeScript's type checker
- Replaces deprecated `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- Unified package for better maintenance and compatibility

**Common ESLint Rules Enabled**:

| Rule | What It Catches | Example |
|------|-----------------|---------|
| `no-unused-vars` | Variables declared but never used | `const unused = 42` (remove it) |
| `no-undef` | Using undefined variables | `console.log(undefinedVar)` |
| `no-unreachable` | Code after return/throw/break | `return 1; console.log('never runs')` |
| `eqeqeq` | Using `==` instead of `===` | `if (x == null)` (use `===`) |
| `no-console` | Console statements in production | `console.log('debug')` (remove or use proper logging) |
| `prefer-const` | Variables that could be `const` | `let x = 5` (use `const` if never reassigned) |
| `no-var` | Using `var` instead of `let/const` | `var x = 1` (use `let` or `const`) |
| `@typescript-eslint/no-explicit-any` | Using `any` type | `const x: any = 42` (use proper types) |
| `@typescript-eslint/no-unused-vars` | TypeScript unused variables | Catches unused function parameters, destructured values |

**ESLint Catches (Examples TypeScript Misses)**:

```typescript
// 1. Unused variables (ESLint: error, TypeScript: optional)
const unusedVariable = 42  // ESLint: Remove this
const { used, unused } = obj  // ESLint: Remove 'unused'

// 2. Logic errors TypeScript allows
if (x == null) {}  // ESLint: Use === instead of ==
return value; console.log('unreachable')  // ESLint: Unreachable code

// 3. Anti-patterns TypeScript doesn't care about
var oldStyle = 1  // ESLint: Use let/const
let neverReassigned = 2  // ESLint: Use const

// 4. Code quality issues
console.log('debug')  // ESLint: Remove console in production
if (true) { doSomething() }  // ESLint: Constant condition

// 5. Best practices
const obj: any = {}  // ESLint: Avoid 'any', use proper types
```

**Integration with Bun**:
- Command: `bun run lint` (runs `eslint .`)
- Execution: ESLint runs via Bun runtime (native TypeScript support)
- Speed: Fast analysis leveraging Bun's performance
- Compatibility: Works seamlessly with Bun's module resolution

**When to Run ESLint**:

1. **During Development** (recommended):
   ```bash
   bunx eslint . --fix  # Auto-fix on the fly
   ```

2. **Before Committing** (critical):
   ```bash
   bun run lint  # Part of pre-commit checklist
   ```

3. **In CI/CD Pipeline** (critical):
   ```bash
   bun run lint  # Fail builds if linting errors exist
   ```

4. **After Dependency Updates** (recommended):
   ```bash
   bun run lint  # Verify no new linting issues
   ```

5. **Before Code Reviews** (helpful):
   ```bash
   bunx eslint . --fix  # Clean up before submitting PR
   ```

**IDE Integration**:

**VS Code** (ESLint extension):
1. Install "ESLint" extension by Microsoft
2. Add to `.vscode/settings.json`:
```json
{
  "eslint.enable": true,
  "eslint.format.enable": false,  // Prettier handles formatting
  "eslint.lintTask.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```
- Linting errors appear as squiggles in editor
- Auto-fix on save (if configured)
- Uses project's eslint.config.ts automatically

**WebStorm/IntelliJ IDEA** (built-in ESLint support):
1. Go to Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
2. Enable "Automatic ESLint configuration"
3. Check "Run eslint --fix on save"
4. ESLint errors highlighted inline
5. Quick-fixes available via Alt+Enter

**Vim/Neovim** (via ALE or coc-eslint):
```vim
" Using ALE (Asynchronous Lint Engine)
let g:ale_linters = {'typescript': ['eslint']}
let g:ale_fixers = {'typescript': ['eslint']}
let g:ale_fix_on_save = 1

" Or using coc-eslint
:CocInstall coc-eslint
```

**Performance Considerations**:
- ESLint analyzes entire codebase (can be slow on large projects)
- Type-aware rules are slower (leverage TypeScript's type checker)
- First run builds cache, subsequent runs are faster
- Use `--cache` flag to speed up: `bunx eslint . --cache`
- Use `--max-warnings 0` in CI to fail on warnings

**ESLint vs TypeScript Comparison**:

```typescript
// TypeScript CATCHES:
const num: number = "text"  // Type error
interface User { name: string }
const user: User = {}  // Missing property

// TypeScript ALLOWS (ESLint CATCHES):
const unused = 42  // Unused variable
if (x == null) {}  // Using == instead of ===
var oldStyle = 1  // Using var
let neverChanged = 2  // Should be const

// BOTH CATCH:
undefinedVariable  // TypeScript: Cannot find name, ESLint: no-undef

// NEITHER CATCH (logic bugs):
if (x = 10) {}  // Assignment in condition (ESLint: no-cond-assign catches this!)
```

**Configuration Customization** (when needed):

```typescript
// Add custom rules to eslint.config.ts
export default defineConfig([
  // ... existing config
  {
    rules: {
      'no-console': 'warn',  // Warn on console.log
      'prefer-const': 'error',  // Enforce const usage
      '@typescript-eslint/no-explicit-any': 'error',  // Disallow 'any' type
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',  // Allow unused args starting with _
      }],
    },
  },
])
```

**Ignoring Files**: Create `.eslintignore` (optional):
```
# Dependencies
node_modules/

# Build output
dist/
build/

# Lock files
bun.lock

# Configuration
*.config.js
*.config.ts
```

**Troubleshooting**:

**ESLint reports too many errors**:
- Run `bunx eslint . --fix` first to auto-fix simple issues
- Review and adjust rule severity in eslint.config.ts
- Focus on errors first, then warnings

**ESLint conflicts with Prettier**:
- Ensure Prettier runs after ESLint
- ESLint handles logic, Prettier handles formatting
- Don't enable ESLint formatting rules that conflict with Prettier

**ESLint is too slow**:
- Use `--cache` flag: `bunx eslint . --cache`
- Lint specific directories during development: `bunx eslint src/`
- Run full lint only in CI/CD

**False positives**:
- Use inline comments sparingly: `// eslint-disable-next-line rule-name`
- Configure rules in eslint.config.ts rather than disabling everywhere
- Document why rules are disabled

**Best Practices**:
1. **Run ESLint before commits** - Catch issues early
2. **Use --fix liberally** - Auto-fix simple issues quickly
3. **Don't disable rules without reason** - Fix root causes instead
4. **Combine with TypeScript** - Both are necessary for quality code
5. **Configure IDE integration** - Get real-time feedback while coding
6. **Include in CI/CD** - Prevent linting errors from reaching production
7. **Review ESLint output** - Learn from caught issues to avoid them
8. **Keep configuration simple** - Start with recommended rules, customize gradually

### Playwright E2E Testing Framework (v1.56.0)

**Purpose**: Modern end-to-end testing framework for testing complete user workflows, UI interactions, and application behavior across real browsers. Playwright complements Bun's unit tests by verifying full application functionality from a user's perspective.

**What Playwright Provides**:
1. **Cross-Browser Testing** - Tests run on Chromium, Firefox, and WebKit (Safari)
2. **Real Browser Automation** - Interacts with actual browser engines, not simulations
3. **User Workflow Validation** - Verifies complete user journeys and interactions
4. **Visual Testing** - Screenshots, videos, and traces for debugging
5. **API Testing** - Can test HTTP APIs without browser UI
6. **Network Control** - Intercept and mock network requests
7. **Auto-Wait** - Smart waiting for elements to be ready before interactions
8. **Parallel Execution** - Fast test execution across multiple workers

**Playwright vs Bun Test Comparison**:

| Aspect | Bun Test (Unit) | Playwright (E2E) |
|--------|-----------------|------------------|
| **Purpose** | Test isolated functions, classes, utilities | Test complete user workflows, UI, full app behavior |
| **Speed** | Very fast (milliseconds) | Slower (seconds to minutes) |
| **Scope** | Single units of code | Entire application stack |
| **Browser** | No browser required | Real browsers (Chromium, Firefox, WebKit) |
| **Dependencies** | Tests pure logic, mocked dependencies | Tests real integrations, actual dependencies |
| **When to Run** | Frequently (every change) | Less frequently (before commits, in CI/CD) |
| **Test Files** | `*.test.ts`, `*.spec.ts` (outside tests/ dir) | `tests/**/*.spec.ts` |
| **Command** | `bun test` (native command) | `playwright test` or `bun test:e2e` |
| **Feedback Loop** | Immediate (watch mode) | Slower (full app startup) |
| **What It Catches** | Logic bugs, function correctness | UI bugs, integration issues, user experience problems |

**Why Both Test Types Are Needed**:
- **Unit Tests (Bun)**: Fast feedback on code correctness, test edge cases, validate logic
- **E2E Tests (Playwright)**: Verify real user workflows, catch integration issues, ensure UI works
- **Complementary**: Unit tests catch most bugs quickly, E2E tests ensure everything works together
- **Cost-Effectiveness**: Fast unit tests run constantly, expensive E2E tests run selectively

**Test Strategy**:

**When to Use Unit Tests (Bun Test)**:
- Testing individual functions, classes, utilities
- Validating business logic and algorithms
- Testing edge cases and error handling
- Verifying data transformations
- Testing pure functions (no side effects)
- Fast iteration during development
- TDD (Test-Driven Development) workflow

**When to Use E2E Tests (Playwright)**:
- Testing complete user workflows (login, checkout, form submission)
- Verifying UI interactions (buttons, forms, navigation)
- Testing across multiple browsers
- Validating visual appearance and layout
- Testing API endpoints with real HTTP calls
- Ensuring integrations work correctly
- Testing authentication and authorization flows
- Verifying production-like scenarios

**Running Playwright Tests**:
```bash
# Run all E2E tests
bun test:e2e
playwright test

# Run all tests (unit + E2E)
bun test:all

# Run specific test file
playwright test tests/example.spec.ts

# Run tests in specific browser
playwright test --project=chromium
playwright test --project=firefox
playwright test --project=webkit

# Run tests in headed mode (visible browser)
playwright test --headed

# Run tests in debug mode
playwright test --debug

# Run tests in UI mode (interactive)
playwright test --ui

# Generate code (record interactions)
playwright codegen http://localhost:3000

# Show test report
playwright show-report

# Run specific test by name
playwright test -g "test name pattern"

# Run tests matching pattern
playwright test tests/auth/

# Parallel execution (default)
playwright test --workers 4

# Run tests in serial
playwright test --workers 1
```

**Playwright Configuration**: `playwright.config.ts`

**Active Configuration**:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',              // E2E tests directory
  fullyParallel: true,             // Run tests in parallel for speed
  forbidOnly: !!process.env.CI,    // Prevent test.only in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Serial in CI, parallel locally
  reporter: 'html',                // HTML test report

  use: {
    trace: 'on-first-retry',       // Capture trace on retry
    // baseURL: 'http://localhost:3000', // Uncomment when server added
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // webServer: { // Uncomment to auto-start dev server
  //   command: 'bun run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
```

**Configuration Breakdown**:
- **testDir**: `./tests` - All E2E tests must be in the `tests/` directory
- **fullyParallel**: `true` - Tests run concurrently for faster execution
- **forbidOnly**: Prevents accidentally committing `test.only()` in CI
- **retries**: Auto-retry failed tests in CI (flaky test handling)
- **workers**: 1 worker in CI (reliable), multiple locally (fast)
- **reporter**: `'html'` - Generates interactive HTML report at `playwright-report/`
- **trace**: Captures execution trace on test retry for debugging
- **projects**: Tests run on Chromium, Firefox, and WebKit browsers
- **webServer**: (Optional) Auto-start development server before tests

**Test File Structure**:

**Location**: All E2E tests must be in the `tests/` directory
**Naming**: `*.spec.ts` (Playwright convention)

**Example Test Structure**:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform user workflow', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:3000')

    // Interact with elements
    await page.click('button#login')
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Assertions
    await expect(page.locator('h1')).toHaveText('Dashboard')
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should handle errors gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.click('button[type="submit"]') // Submit without filling

    await expect(page.locator('.error')).toBeVisible()
    await expect(page.locator('.error')).toHaveText('Email is required')
  })
})
```

**Playwright Fixtures and APIs**:
```typescript
// Page fixture (most common)
test('test with page', async ({ page }) => {
  await page.goto('https://example.com')
})

// Browser context (for isolation)
test('test with context', async ({ context }) => {
  const page = await context.newPage()
})

// Browser instance (for low-level control)
test('test with browser', async ({ browser }) => {
  const context = await browser.newContext()
})

// Request fixture (API testing without browser)
test('API test', async ({ request }) => {
  const response = await request.get('https://api.example.com/users')
  expect(response.ok()).toBeTruthy()
})
```

**Common Playwright Patterns**:

**Selectors**:
```typescript
// CSS selectors
await page.click('.submit-button')
await page.locator('#username').fill('user')

// Text selectors
await page.click('text=Sign In')
await page.getByText('Welcome').isVisible()

// Role-based selectors (recommended - accessible)
await page.getByRole('button', { name: 'Submit' }).click()
await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com')

// Data-testid (recommended for stability)
await page.getByTestId('submit-button').click()
```

**Waiting and Assertions**:
```typescript
// Auto-waiting (built-in)
await page.click('button') // Waits for button to be actionable

// Explicit waits
await page.waitForSelector('.loaded')
await page.waitForURL('**/dashboard')
await page.waitForLoadState('networkidle')

// Assertions (auto-retry until timeout)
await expect(page.locator('h1')).toHaveText('Title')
await expect(page).toHaveURL(/dashboard/)
await expect(page.locator('.error')).toBeVisible()
await expect(page.locator('.spinner')).toBeHidden()
```

**Screenshots and Videos**:
```typescript
// Screenshot
await page.screenshot({ path: 'screenshot.png' })
await page.locator('.element').screenshot({ path: 'element.png' })

// Videos (configured in playwright.config.ts)
use: {
  video: 'on-first-retry', // Record video on failure
}
```

**Network Interception**:
```typescript
// Mock API responses
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: 1, name: 'User' }])
  })
})

// Abort requests (images, CSS)
await page.route('**/*.{png,jpg,jpeg}', route => route.abort())
```

**Test Isolation**:
```typescript
// Before each test
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
  // Set up authentication, state, etc.
})

// After each test
test.afterEach(async ({ page }) => {
  // Clean up data, log out, etc.
})

// Storage state (persist authentication)
await page.context().storageState({ path: 'auth.json' })
```

**Integration with Bun**:
- Command: `bun test:e2e` (runs `playwright test`)
- Combined: `bun test:all` (runs `bun test && bun test:e2e`)
- Execution: Playwright runs as separate process, uses Bun for TypeScript
- Compatibility: Works seamlessly with Bun's TypeScript support
- No compilation needed: Playwright executes TypeScript tests directly

**Test Execution Flow**:
```bash
# When running: bun test:all
# 1. Runs unit tests first: bun test (native command)
# 2. If unit tests pass, runs E2E tests: bun test:e2e (playwright test)
# 3. If either fails, entire test suite fails (fail-fast strategy)
```

**Why Unit Tests Run First** (Fail-Fast Strategy):
- **Speed**: Unit tests are faster (milliseconds vs seconds)
- **Early Feedback**: Catch obvious bugs before expensive E2E tests
- **Cost-Effective**: No point running slow E2E tests if unit tests fail
- **CI/CD Efficiency**: Fails build quickly if basic logic is broken
- **Resource Savings**: Avoids browser startup if code is fundamentally broken

**Debugging E2E Tests**:

**Debug Mode** (step through test):
```bash
playwright test --debug
```

**UI Mode** (interactive test runner):
```bash
playwright test --ui
```

**Trace Viewer** (inspect test execution):
```bash
# Traces captured automatically on retry (configured in playwright.config.ts)
playwright show-trace trace.zip
```

**Headed Mode** (see browser):
```bash
playwright test --headed
```

**Slow Motion** (see interactions clearly):
```typescript
test.use({ launchOptions: { slowMo: 1000 } }) // 1 second delay
```

**Console Logging**:
```typescript
page.on('console', msg => console.log(msg.text()))
```

**When to Run E2E Tests**:

1. **Before Committing** (recommended):
   ```bash
   bun test:all  # Runs both unit and E2E tests
   ```

2. **In CI/CD Pipeline** (critical):
   ```bash
   bun test:e2e  # Verify deployable code
   ```

3. **After Feature Development** (recommended):
   ```bash
   bun test:e2e tests/new-feature.spec.ts
   ```

4. **Before Releases** (critical):
   ```bash
   bun test:e2e  # Full E2E validation
   ```

5. **During Development** (optional, for specific tests):
   ```bash
   playwright test --headed --debug tests/auth.spec.ts
   ```

**DO NOT** run E2E tests as frequently as unit tests:
- E2E tests are slow (browser startup, navigation, rendering)
- Resource-intensive (CPU, memory for browser instances)
- Best for validating complete features, not every code change
- Use unit tests for fast feedback, E2E tests for validation

**Browser Support**:
Playwright tests run on three browser engines:
- **Chromium** - Chrome, Edge, Opera, Brave (most common)
- **Firefox** - Mozilla Firefox
- **WebKit** - Safari, iOS Safari (Apple browsers)

**Mobile Testing** (optional):
```typescript
// Uncomment in playwright.config.ts
{
  name: 'Mobile Chrome',
  use: { ...devices['Pixel 5'] },
},
{
  name: 'Mobile Safari',
  use: { ...devices['iPhone 12'] },
},
```

**CI/CD Integration**:
```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: bun install

- name: Install Playwright browsers
  run: bunx playwright install --with-deps

- name: Run unit tests
  run: bun test

- name: Run E2E tests
  run: bun test:e2e

- name: Upload test report
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

**Playwright Output Files** (ignored in .gitignore):
- `/test-results/` - Test execution results and artifacts
- `/playwright-report/` - HTML test reports (view with `playwright show-report`)
- `/blob-report/` - Binary reports for distributed testing
- `/playwright/.cache/` - Cached browser binaries
- `/playwright/.auth/` - Authentication state files

**Best Practices**:
1. **Keep E2E tests focused** - Test user workflows, not implementation details
2. **Use descriptive test names** - Clearly state what user action is being tested
3. **Prefer role-based selectors** - More resilient to UI changes
4. **Avoid testing third-party services** - Mock external APIs
5. **Use test data carefully** - Clean up after tests to avoid state pollution
6. **Run E2E tests less frequently** - Reserve for validation, not rapid iteration
7. **Leverage auto-waiting** - Trust Playwright's built-in waits, avoid manual timeouts
8. **Use screenshots/traces for debugging** - Visual feedback for failed tests
9. **Test critical paths first** - Authentication, checkout, core workflows
10. **Keep tests independent** - Each test should run in isolation

**Common Pitfalls**:
- **Too many E2E tests** - Slow test suite, long feedback loop
- **Testing implementation details** - Brittle tests that break on refactoring
- **Not using auto-wait** - Flaky tests with manual `setTimeout()`
- **Sharing state between tests** - Tests fail when run in isolation
- **Testing everything in E2E** - Unit tests are better for edge cases

**Playwright vs Other Tools**:

| Tool | Purpose | When to Run | Speed |
|------|---------|-------------|-------|
| **Playwright** | E2E testing (full workflows) | Before commits, in CI/CD | Slow (seconds-minutes) |
| **Bun Test** | Unit testing (isolated logic) | Continuously, during dev | Very fast (milliseconds) |
| **TypeScript (tsc)** | Type checking | Before commits, in CI/CD | Medium (seconds) |
| **ESLint** | Code quality | Before commits, in CI/CD | Fast (seconds) |
| **Prettier** | Code formatting | Before commits, on save | Very fast (milliseconds) |

**Example Workflow**:
```bash
# 1. Write code
# 2. Run unit tests continuously
bun test --watch

# 3. Before committing, run full test suite
bun run lint && bun run format && bun run typecheck && bun test:all

# 4. Commit code
git add . && git commit -m "feat: add feature"

# 5. In CI/CD, all tests run again
# - bun run lint
# - bun run typecheck
# - bun test (unit tests)
# - bun test:e2e (E2E tests)
```

**Troubleshooting**:

**Browsers not installed**:
```bash
bunx playwright install
bunx playwright install --with-deps  # Install system dependencies
```

**Tests timing out**:
- Increase timeout in `playwright.config.ts`: `timeout: 60000` (60 seconds)
- Use `test.setTimeout(120000)` for specific tests
- Check if application is slow to start

**Flaky tests**:
- Use auto-waiting instead of manual timeouts
- Increase retries in CI: `retries: 2`
- Use `test.fail()` to mark known flaky tests
- Investigate with trace viewer: `playwright show-trace`

**Selector not found**:
- Use `page.pause()` to inspect page state
- Try more robust selectors (role-based, test IDs)
- Verify element is visible: `await expect(locator).toBeVisible()`

### Prettier Code Formatter (v3.6.2)

**Purpose**: Enforces consistent code formatting across the entire codebase automatically, eliminating style debates and ensuring uniform code appearance.

**Why Prettier**:
- Zero-config opinionated formatter (minimal configuration needed)
- Supports TypeScript, JavaScript, JSX, TSX, JSON, Markdown, and more
- Integrates seamlessly with Bun via `bunx`
- Prevents formatting inconsistencies in version control
- Saves time during code reviews by eliminating style discussions

**Prettier vs ESLint**:
- **Prettier**: Code **formatting** (quotes, semicolons, spacing, line breaks)
- **ESLint**: Code **quality** (logic errors, unused variables, best practices)
- **Complementary**: Prettier makes code look good, ESLint makes code work correctly
- **Workflow**: ESLint first (fix logic), then Prettier (fix formatting)

**Running Prettier with Bun**:
```bash
# Format all files in the project
bunx prettier --write .

# Check formatting without modifying files
bunx prettier --check .

# Format specific files or directories
bunx prettier --write src/
bunx prettier --write "src/**/*.ts"
bunx prettier --write index.ts

# Check specific files
bunx prettier --check "src/**/*.{ts,tsx,json}"

# Format with custom config (if needed)
bunx prettier --write . --config .prettierrc.json
```

**Configuration File**: `.prettierrc.json`

**Active Configuration**:
```json
{
  "semi": false,                      // No semicolons
  "trailingComma": "es5",            // Trailing commas where valid in ES5
  "singleQuote": true,               // Single quotes for strings
  "tabWidth": 2,                     // 2 spaces per indentation level
  "useTabs": false,                  // Spaces, not tabs
  "printWidth": 100,                 // Wrap lines at 100 characters
  "singleAttributePerLine": true     // Each attribute on separate line (HTML/JSX)
}
```

**Configuration Impact on Code Generation**:
- **No Semicolons**: All statements should omit trailing semicolons
- **Single Quotes**: String literals use `'` instead of `"`
- **100 Character Line Width**: Break long lines at 100 characters
- **Trailing Commas**: Add trailing commas in arrays, objects, function parameters
- **2-Space Indentation**: Use 2 spaces for all indentation levels
- **Single Attribute Per Line**: JSX/TSX attributes each on their own line

**File Support**:
- TypeScript: `.ts`, `.tsx`
- JavaScript: `.js`, `.jsx`, `.mjs`
- JSON: `.json`
- Markdown: `.md`
- YAML: `.yml`, `.yaml`
- HTML: `.html`

**Integration with Development Workflow**:
1. **Pre-commit**: Run `bunx prettier --write .` before commits
2. **CI/CD**: Add formatting checks to continuous integration
3. **IDE/Editor**: Configure editor to format on save (see IDE Integration section)
4. **After ESLint**: Run Prettier after ESLint fixes logic issues

### Bun Test Runner (Unit Tests)

**Purpose**: Built-in fast test runner for unit testing isolated functions, classes, and utilities. Bun Test runs unit tests, while Playwright handles end-to-end (E2E) tests.

**Test File Patterns** (Unit Tests):
- `*.test.ts`, `*.test.tsx`
- `*.spec.ts`, `*.spec.tsx` (outside `tests/` directory)
- `*_test.ts`, `*_test.tsx`
- Files in `__tests__` directories

**IMPORTANT: Test File Location**:
- **Unit Tests (Bun)**: Place `*.test.ts` or `*.spec.ts` files alongside source code (e.g., `src/utils.test.ts`)
- **E2E Tests (Playwright)**: Place `*.spec.ts` files in `tests/` directory (e.g., `tests/login.spec.ts`)
- **Naming Convention**: Use `.test.ts` for unit tests, `.spec.ts` for E2E tests (optional but recommended)

**Test Commands**:

**IMPORTANT**: `bun test` is a **native Bun command**, not a package.json script. It directly invokes Bun's built-in test runner without any script wrapper.

```bash
# Run all unit tests (native command - excludes tests/ directory)
bun test

# Run specific file/pattern
bun test path/to/file.test.ts
bun test src/**/*.test.ts

# Watch mode (continuous testing)
bun test --watch

# Coverage
bun test --coverage

# Filtering
bun test --only "test name pattern"
bun test --grep "pattern"

# Bail on first failure
bun test --bail

# Timeout
bun test --timeout 5000  # 5 seconds
```

**Test Structure**:
```typescript
import { test, expect, describe, beforeEach, afterEach } from "bun:test"

describe("Feature", () => {
  beforeEach(() => {
    // Setup before each test
  })

  test("should do something", () => {
    expect(2 + 2).toBe(4)
    expect(value).toEqual(expectedObject)
    expect(fn).toThrow()
  })

  test.skip("skipped test", () => {})
  test.only("focused test", () => {})
  test.todo("future test")
})
```

**Assertions**: Built-in Jest-compatible matchers
**Mocking**: `bun:test` includes mock functions
**Snapshots**: Supported with `.toMatchSnapshot()`

**Test Execution Approach**:
- **`bun test`**: Native Bun command for unit tests (NOT a script - directly runs Bun's built-in test runner)
- **`bun test:all`**: Script that runs both unit and E2E tests sequentially (`bun test && bun test:e2e`)
- **`bun test:e2e`**: Script that runs Playwright E2E tests (`playwright test`)

**Unit vs E2E Test Execution**:
```bash
# Unit tests only (fast, run frequently) - NATIVE COMMAND
bun test

# E2E tests only (slow, run before commits) - SCRIPT
bun test:e2e

# Both tests sequentially (recommended before commits) - SCRIPT
bun test:all
```

## Infrastructure

### File Structure

```
omnera-v2/
├── src/
│   ├── index.ts         # Entry point (module: "src/index.ts" in package.json)
│   ├── components/      # UI components (if applicable)
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── **/*.test.ts     # Unit tests (alongside source code)
├── tests/
│   └── **/*.spec.ts     # E2E tests (Playwright tests only)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript config (Bun-optimized)
├── playwright.config.ts  # Playwright E2E testing configuration
├── eslint.config.ts      # ESLint linting configuration (flat config)
├── .prettierrc.json      # Prettier formatting configuration
├── .prettierignore       # Files to exclude from Prettier (optional)
├── .eslintignore         # Files to exclude from ESLint (optional)
├── bun.lock             # Lock file (binary)
├── README.md            # User documentation
├── CLAUDE.md            # This file - Technical documentation
├── test-results/        # Playwright test execution results (gitignored)
├── playwright-report/   # Playwright HTML test reports (gitignored)
├── playwright/.cache/   # Playwright browser binaries (gitignored)
└── playwright/.auth/    # Playwright authentication state (gitignored)
```

**File Organization Principles**:

**Entry Point**:
- **Location**: `src/index.ts` (moved from root `index.ts`)
- **Reference**: `package.json` specifies `"module": "src/index.ts"`
- **Rationale**: Cleaner project root, separates source code from configuration

**Test File Locations**:
- **Unit Tests**: Co-located with source code (e.g., `src/utils.test.ts` next to `src/utils.ts`)
- **E2E Tests**: Separate `tests/` directory (e.g., `tests/login.spec.ts`)
- **Rationale**: Unit tests stay close to code, E2E tests represent user workflows

**Ignored Directories**:
- **Playwright Artifacts**: `test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`, `playwright/.auth/`
- **Build Output**: `dist/`, `out/`, coverage reports
- **Dependencies**: `node_modules/`
- **Environment**: `.env`, `.env.local`

### Environment Variables

**Loading**: Bun automatically loads `.env` files
**Access**: Via `process.env` or `Bun.env`
```typescript
// Both work in Bun
console.log(process.env.API_KEY)
console.log(Bun.env.API_KEY)
```

**Priority Order**:
1. `.env.local`
2. `.env.[NODE_ENV]` (e.g., `.env.production`)
3. `.env`

## Coding Standards

### Code Formatting (Prettier)

**All code MUST follow Prettier formatting rules** defined in `.prettierrc.json`. These rules are enforced automatically and should never be manually overridden.

**Formatting Standards**:

1. **Quotes**: Always use single quotes for strings
```typescript
// CORRECT
const message = 'Hello world'
const path = './module.ts'

// INCORRECT
const message = "Hello world"  // ❌ Double quotes
```

2. **Semicolons**: Never use semicolons
```typescript
// CORRECT
const value = 42
const fn = () => console.log('done')

// INCORRECT
const value = 42;              // ❌ Semicolon
const fn = () => console.log('done');  // ❌ Semicolon
```

3. **Line Width**: Maximum 100 characters per line
```typescript
// CORRECT - Breaks at 100 characters
const longObject = {
  propertyOne: 'value',
  propertyTwo: 'another value',
  propertyThree: 'yet another value',
}

// INCORRECT - Exceeds 100 characters
const longObject = { propertyOne: 'value', propertyTwo: 'another value', propertyThree: 'yet another value' }  // ❌
```

4. **Trailing Commas**: Use trailing commas in multi-line structures
```typescript
// CORRECT
const array = [
  'item1',
  'item2',
  'item3',  // Trailing comma
]

const object = {
  key1: 'value1',
  key2: 'value2',  // Trailing comma
}

// INCORRECT
const array = [
  'item1',
  'item2',
  'item3'  // ❌ Missing trailing comma
]
```

5. **Indentation**: 2 spaces (no tabs)
```typescript
// CORRECT
function example() {
  if (condition) {
    return true
  }
}

// INCORRECT - Uses 4 spaces or tabs
function example() {
    if (condition) {  // ❌ Wrong indentation
        return true
    }
}
```

6. **JSX/TSX Attributes**: One attribute per line
```typescript
// CORRECT
<Component
  prop1="value1"
  prop2="value2"
  prop3="value3"
/>

// INCORRECT
<Component prop1="value1" prop2="value2" prop3="value3" />  // ❌
```

**Automatic Formatting**:
- Run `bunx prettier --write .` before committing code
- Configure your IDE to format on save (recommended)
- Prettier will automatically fix all formatting issues

### Module System

**Always use ES Modules**:
```typescript
// CORRECT
import { feature } from './module.ts'
export const myFunction = () => {}
export default MyComponent

// INCORRECT - CommonJS not recommended
const feature = require('./module')  // ❌
module.exports = myFunction          // ❌
```

### TypeScript Best Practices

1. **Explicit Type Imports**:
```typescript
import type { User } from './types.ts'
import { type Config, loadConfig } from './config.ts'
```

2. **Strict Null Checks**:
```typescript
// Array access returns T | undefined due to noUncheckedIndexedAccess
const item = array[0]
if (item) {
  // item is defined here
}
```

3. **Override Keyword**:
```typescript
class Child extends Parent {
  override method() {  // Required with noImplicitOverride
    super.method()
  }
}
```

### Error Handling

```typescript
// Use native Error classes
throw new Error('Description')

// Bun provides better stack traces
console.error(error.stack)

// Async error handling
try {
  await bunOperation()
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

## Integration Patterns

### File Operations

```typescript
// Bun provides optimized file APIs
import { file, write } from "bun"

// Read file
const content = await file("./data.json").text()
const json = await file("./data.json").json()

// Write file
await write("./output.txt", "content")
await write("./data.json", JSON.stringify(data))

// Stream processing
const stream = file("./large.csv").stream()
```

### HTTP Server (if needed)

```typescript
// Bun's native HTTP server
Bun.serve({
  port: 3000,
  fetch(request) {
    return new Response("Hello from Bun!")
  }
})
```

### Database Connections

```typescript
// Bun has built-in SQLite
import { Database } from "bun:sqlite"

const db = new Database("mydb.sqlite")
const query = db.query("SELECT * FROM users WHERE id = ?")
const user = query.get(userId)
```

## Configuration Reference

### package.json Structure

```json
{
  "name": "omnera-v2",
  "version": "0.0.1",
  "module": "src/index.ts",  // Entry point for Bun (moved to src/)
  "type": "module",          // ES modules only
  "license": "BSL-1.1",      // Business Source License 1.1
  "scripts": {
    // Development scripts
    "dev": "bun run --watch src/index.ts",

    // Testing scripts
    "test:all": "bun test && bun test:e2e",    // Run both unit and E2E tests sequentially
    "test:e2e": "playwright test",             // E2E tests only (Playwright)
    // Note: Unit tests use native `bun test` command directly (no script needed)

    // Type checking (validation, not compilation)
    "typecheck": "tsc --noEmit",

    // Code linting (static analysis)
    "lint": "eslint .",

    // Code formatting
    "format": "prettier --write .",
    "format:check": "prettier --check .",

    // Dead code cleanup
    "clean": "knip --fix"
  },
  "devDependencies": {
    "@eslint/js": "^9.37.0",        // ESLint JavaScript rules (flat config)
    "@playwright/test": "^1.56.0",  // Playwright E2E testing framework
    "@types/bun": "latest",         // Bun type definitions
    "@types/node": "^24.7.2",       // Node.js type definitions (for compatibility)
    "eslint": "^9.37.0",            // ESLint static code analysis tool
    "globals": "^16.4.0",           // Global variables definitions for ESLint
    "knip": "^5.65.0",              // Dead code detection tool
    "prettier": "3.6.2",            // Code formatter
    "typescript": "^5.9.3",         // TypeScript compiler
    "typescript-eslint": "^8.46.1"  // TypeScript ESLint rules and parser
  },
  "peerDependencies": {
    "typescript": "^5.9.3"     // TypeScript compiler (actual compiler)
  }
}
```

**Script Explanations**:

- **`test:all`**: Runs all tests (unit + E2E) sequentially
  - Command: `bun test && bun test:e2e`
  - Purpose: Complete test suite validation before commits or releases
  - Execution: Unit tests run first (fail-fast), then E2E tests
  - When to use: Before commits, in CI/CD, before releases
  - Exit code: 0 if all tests pass, non-zero if any test fails
  - Strategy: Fail-fast (stops at first failure for quick feedback)

- **`bun test` (NOT a script)**: Native Bun command for unit tests
  - This is a **built-in Bun command**, not a package.json script
  - Purpose: Fast testing of isolated functions, classes, utilities
  - Scope: Tests `*.test.ts` and `*.spec.ts` files (excludes `tests/` directory)
  - When to use: During development, continuously with `--watch`
  - Speed: Very fast (milliseconds)
  - Use with `--watch` for continuous testing: `bun test --watch`

- **`test:e2e`**: Runs E2E tests only (Playwright)
  - Command: `playwright test`
  - Purpose: Test complete user workflows, UI, full application behavior
  - Scope: Tests `tests/**/*.spec.ts` files only
  - When to use: Before commits, in CI/CD, after feature development
  - Speed: Slower (seconds to minutes, requires browser startup)
  - Browsers: Runs on Chromium, Firefox, and WebKit

- **`typecheck`**: Runs TypeScript type checking without emitting files
  - Command: `tsc --noEmit`
  - Purpose: Validate all TypeScript types across the project
  - When to use: Before commits, in CI/CD, during development
  - Exit code: 0 if no errors, non-zero if type errors found
  - Does NOT generate any files (only validates types)

- **`lint`**: Runs ESLint static code analysis
  - Command: `eslint .`
  - Purpose: Detect code quality issues, logic errors, and anti-patterns
  - When to use: Before commits, in CI/CD, during development
  - Exit code: 0 if no errors, non-zero if linting errors found
  - Complements TypeScript by catching issues types alone cannot detect
  - Use with `--fix` flag to auto-fix many issues: `bunx eslint . --fix`

- **`format`**: Formats all files using Prettier
  - Command: `prettier --write .`
  - Purpose: Auto-format code to match style guidelines
  - When to use: Before commits, after code changes

- **`format:check`**: Checks formatting without modifying files
  - Command: `prettier --check .`
  - Purpose: Verify code is properly formatted
  - When to use: In CI/CD to enforce formatting

- **`clean`**: Detects and removes unused code with Knip
  - Command: `knip --fix`
  - Purpose: Clean up unused exports, find dead code and dependencies
  - When to use: Weekly maintenance, before releases, after refactoring
  - Auto-fixes: Removes unused exports automatically
  - Manual fixes: Reports unused files/dependencies for manual removal

**Dependency Structure**:

- **devDependencies**: Tools used during development only
  - `@playwright/test`: Modern E2E testing framework for browser automation and user workflow testing
  - `eslint`: Static code analysis tool (linter for code quality)
  - `@eslint/js`: ESLint's recommended JavaScript rules (flat config system)
  - `typescript-eslint`: TypeScript-specific ESLint rules and parser
  - `globals`: Global variable definitions for different environments (browser, Node.js, Bun)
  - `typescript`: TypeScript compiler (provides type checking)
  - `knip`: Dead code detection and cleanup tool
  - `prettier`: Code formatter (enforces style consistency)
  - `@types/bun`: Type definitions for Bun runtime APIs
  - `@types/node`: Type definitions for Node.js built-in APIs (needed for compatibility)

- **peerDependencies**: Required by dev tools but not directly used
  - `typescript`: The actual TypeScript compiler (shared dependency)
  - Allows project to control TypeScript version independently

**Why @types/node in a Bun Project**:

Even though this project uses Bun (not Node.js) as the runtime, `@types/node` is needed for:
- **Package Compatibility**: Many npm packages reference Node.js types in their definitions
- **Built-in APIs**: Bun implements Node.js APIs (fs, path, process, etc.) with the same interfaces
- **Type Accuracy**: Provides correct types for `process.env`, `Buffer`, and other Node.js globals
- **Third-party Dependencies**: Libraries may use Node.js types even when running on Bun
- **Tooling Support**: Development tools expect Node.js types to be available

**Example of @types/node Usage**:
```typescript
// These APIs work in Bun but need Node.js types
import { readFileSync } from 'fs'  // Needs @types/node
import { join } from 'path'         // Needs @types/node

// Access Node.js-compatible APIs
console.log(process.env.HOME)      // Needs @types/node for process types
const buffer = Buffer.from('data') // Needs @types/node for Buffer types
```

**Bun Runtime vs Node.js Types**:
- **Runtime**: Bun v1.3.0 (executes code, implements Node.js APIs)
- **Types**: @types/node v24.7.2 (provides TypeScript definitions)
- **Compatibility**: Bun is 99% Node.js API compatible, so Node types work correctly
- **Best of Both**: Fast Bun runtime + Accurate Node.js type definitions

### ESLint Configuration (eslint.config.ts)

**Location**: `/Users/thomasjeanneau/Codes/omnera-v2/eslint.config.ts`

**Complete Configuration**:
```typescript
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
])
```

**Configuration Breakdown**:

1. **File Patterns**: `['**/*.{js,mjs,cjs,ts,mts,cts}']`
   - Matches all JavaScript and TypeScript files
   - Includes module variants (ESM: `.mjs`, `.mts`; CommonJS: `.cjs`, `.cts`)
   - Ensures consistent linting across entire codebase

2. **Plugins**: `{ js }`
   - Registers `@eslint/js` plugin for JavaScript rule definitions
   - Provides core ESLint rules for JavaScript files
   - Foundation for additional TypeScript-specific rules

3. **Extends**: `['js/recommended']`
   - Applies ESLint's recommended JavaScript rules
   - Curated set of essential code quality rules
   - Catches common JavaScript pitfalls and anti-patterns

4. **Language Options**: `{ globals: globals.browser }`
   - Defines browser global variables (window, document, navigator, etc.)
   - Prevents "undefined variable" warnings for known browser APIs
   - Use `globals.node` or `globals.bun` if targeting different environments

5. **TypeScript Config**: `tseslint.configs.recommended`
   - Applies typescript-eslint's recommended rules
   - Provides TypeScript-specific linting (e.g., `@typescript-eslint/no-unused-vars`)
   - Parses TypeScript syntax correctly (interfaces, types, decorators, etc.)
   - Replaces need for separate parser and plugin configuration

**Flat Config System (ESLint v9)**:
- New configuration format introduced in ESLint v9
- Uses TypeScript/JavaScript files instead of `.eslintrc.json`
- More intuitive and flexible than legacy eslintrc format
- Better type safety when using TypeScript config files
- Simpler plugin/extends/rules composition

**Why Flat Config**:
- **Type-Safe**: eslint.config.ts provides TypeScript IntelliSense
- **Simpler**: Less configuration boilerplate than legacy format
- **Composable**: Easy to extend and override configurations
- **Future-Proof**: ESLint's recommended approach going forward
- **Better Errors**: Clearer error messages for configuration issues

**Ignored Files** (optional): Create `.eslintignore`:
```
# Dependencies
node_modules/

# Build output
dist/
build/
out/

# Lock files
bun.lock

# Configuration files (if desired)
*.config.js
*.config.ts

# Test coverage
coverage/

# Generated files
*.min.js
*.bundle.js
```

**Note**: Many files are ignored by default (node_modules, .git, etc.)

### Playwright Configuration (playwright.config.ts)

**Location**: `/Users/thomasjeanneau/Codes/omnera-v2/playwright.config.ts`

**Complete Configuration**:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
    // baseURL: 'http://localhost:3000', // Uncomment when server added
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // webServer: { // Uncomment to auto-start dev server
  //   command: 'bun run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
```

**Configuration Breakdown**:

1. **testDir**: `'./tests'`
   - E2E tests must be in the `tests/` directory
   - Separates E2E tests from unit tests (which live alongside source code)

2. **fullyParallel**: `true`
   - Runs tests in parallel across multiple workers for speed
   - Reduces total test execution time significantly
   - Each test file runs independently

3. **forbidOnly**: `!!process.env.CI`
   - Prevents committing `test.only()` to CI/CD
   - Ensures all tests run in CI, not just focused tests
   - Only enforced in CI environment

4. **retries**: `process.env.CI ? 2 : 0`
   - Auto-retry failed tests 2 times in CI (handles flaky tests)
   - No retries locally (fail fast for quick feedback)
   - Helps with network-dependent or timing-sensitive tests

5. **workers**: `process.env.CI ? 1 : undefined`
   - CI: 1 worker (serial execution for reliability)
   - Local: Multiple workers (parallel for speed)
   - Reduces CI resource usage and ensures consistent results

6. **reporter**: `'html'`
   - Generates interactive HTML report at `playwright-report/`
   - View with: `playwright show-report`
   - Other options: `'list'`, `'json'`, `'junit'`, `'dot'`

7. **use.trace**: `'on-first-retry'`
   - Captures execution trace only when test is retried
   - Includes screenshots, network activity, console logs
   - View with: `playwright show-trace trace.zip`
   - Other options: `'on'`, `'off'`, `'retain-on-failure'`

8. **use.baseURL**: (commented out)
   - Base URL for `page.goto('/')` style navigation
   - Uncomment and set when application has a dev server
   - Example: `'http://localhost:3000'`

9. **projects**: Browser configurations
   - **chromium**: Chrome, Edge, Opera, Brave (Blink engine)
   - **firefox**: Mozilla Firefox (Gecko engine)
   - **webkit**: Safari, iOS Safari (WebKit engine)
   - Each project runs tests in a different browser

10. **webServer**: (commented out)
    - Auto-start development server before tests
    - Waits for server to be ready before running tests
    - Reuses existing server locally, starts fresh in CI
    - Uncomment when application has a server

**Optional Configuration Enhancements**:

**Global Timeout**:
```typescript
timeout: 60000, // 60 seconds per test (default: 30000)
```

**Video Recording**:
```typescript
use: {
  video: 'on-first-retry', // or 'on', 'off', 'retain-on-failure'
}
```

**Screenshot on Failure**:
```typescript
use: {
  screenshot: 'only-on-failure', // or 'on', 'off'
}
```

**Mobile Device Testing**:
```typescript
projects: [
  // ... existing browsers
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] },
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 12'] },
  },
]
```

**Authentication Setup** (for faster tests):
```typescript
use: {
  storageState: 'playwright/.auth/user.json', // Reuse login state
}
```

### Prettier Configuration (.prettierrc.json)

**Location**: `/Users/thomasjeanneau/Codes/omnera-v2/.prettierrc.json`

**Complete Configuration**:
```json
{
  "semi": false,                      // Omit semicolons
  "trailingComma": "es5",            // Trailing commas where valid in ES5 (objects, arrays, params)
  "singleQuote": true,               // Use single quotes instead of double quotes
  "tabWidth": 2,                     // 2 spaces per indentation level
  "useTabs": false,                  // Use spaces for indentation, not tabs
  "printWidth": 100,                 // Wrap lines longer than 100 characters
  "singleAttributePerLine": true     // Force one JSX/HTML attribute per line
}
```

**Configuration Rationale**:
- **semi: false** - Cleaner code appearance, common in modern TypeScript/JavaScript
- **singleQuote: true** - Consistency with most TypeScript projects, fewer escape sequences
- **printWidth: 100** - Balance between readability and fitting code on screen
- **trailingComma: "es5"** - Cleaner git diffs, prevents missing comma errors
- **singleAttributePerLine: true** - Improved readability for React/JSX components
- **tabWidth: 2** - Standard for TypeScript projects, matches common conventions

**Ignored Files**: Create `.prettierignore` to exclude files from formatting:
```
# Dependencies
node_modules/

# Build output
dist/
build/
out/

# Lock files
bun.lock
package-lock.json
yarn.lock

# Generated files
*.min.js
*.bundle.js

# Logs
*.log
```

### Build & Bundle (when needed)

```typescript
// bun.build.ts
await Bun.build({
  entrypoints: ["./index.ts"],
  outdir: "./dist",
  target: "bun",  // or "browser", "node"
  minify: true,
  splitting: true
})
```

## Important Constraints

### ⚠️ CRITICAL: DO NOT USE

**Never use these commands or tools**:
- ❌ `node` - Bun replaces Node.js entirely
- ❌ `npm` - Use `bun` for package management
- ❌ `npx` - Use `bunx` instead
- ❌ `yarn` - Use `bun` for package management
- ❌ `pnpm` - Use `bun` for package management
- ❌ `vite` - Bun has built-in bundler
- ❌ `webpack` - Bun has built-in bundler
- ❌ `tsc` for compilation/building - **ONLY use tsc for type checking with --noEmit flag**
- ❌ `ts-node` - Bun executes TypeScript natively
- ❌ `nodemon` - Use `bun --watch` instead

**TypeScript Compiler (tsc) Clarification**:
- ✅ **CORRECT**: `tsc --noEmit` (type checking only)
- ✅ **CORRECT**: `bun run typecheck` (runs tsc --noEmit)
- ❌ **WRONG**: `tsc` (would attempt to compile/emit files)
- ❌ **WRONG**: `tsc src/file.ts` (would attempt to compile specific files)
- ❌ **WRONG**: Using tsc to build/compile JavaScript output
- **Why**: Bun executes TypeScript directly; tsc is ONLY for static type validation

### Command Replacements

| Instead of | Use |
|------------|-----|
| `node script.js` | `bun script.js` |
| `npm install` | `bun install` |
| `npm run dev` | `bun run dev` |
| `npx create-react-app` | `bunx create-react-app` |
| `npm test` | `bun test` |
| `nodemon index.js` | `bun --watch index.js` |
| `ts-node script.ts` | `bun script.ts` |

### Compatibility Notes

**Bun v1.3.0 Compatibility**:
- Full Node.js API compatibility (99%)
- npm package compatibility (99.9%)
- Native modules via N-API
- Built-in Node.js polyfills
- Web API support (fetch, WebSocket, etc.)

**Known Limitations**:
- Some Node.js C++ addons may not work
- Cluster module not fully implemented
- Some edge cases in streams API

## Performance Considerations

### Optimization Tips

1. **Use Bun's Native APIs**: Prefer `Bun.file()` over `fs.readFile()`
2. **Leverage Built-in Features**: Use Bun's SQLite instead of external DB drivers when possible
3. **Avoid Transpilation**: TypeScript runs directly, no build step needed
4. **Use Binary Lockfile**: Don't convert `bun.lock` to text format
5. **Global Cache**: Bun shares packages across projects automatically

### Benchmarking

```bash
# Simple benchmark
bun run --bun index.ts  # Force Bun runtime
time bun run index.ts    # Measure execution time

# Memory usage
bun run --smol index.ts  # Reduced memory mode
```

## Security Best Practices

1. **Lock File**: Always commit `bun.lock` to version control
2. **Audit**: Use `bunx npm audit` for security checks
3. **Permissions**: Bun respects file system permissions
4. **Environment Variables**: Never commit `.env.local`

## Development Workflow

### Daily Commands

```bash
# Start development
bun run dev              # If script exists
bun run src/index.ts     # Direct execution (entry point in src/)

# Run tests
bun test                 # Run unit tests (native Bun command - fast)
bun test:all             # Run all tests (unit + E2E)
bun test:e2e             # Run E2E tests only (slow)
bun test --watch         # Watch mode for unit tests (continuous testing)

# Playwright-specific commands
playwright test          # Run all E2E tests
playwright test --headed # Run E2E tests with visible browser
playwright test --debug  # Debug E2E tests step-by-step
playwright test --ui     # Run E2E tests in interactive UI mode
playwright show-report   # View HTML test report
playwright codegen       # Record browser interactions to generate test code

# Type checking
bun run typecheck    # Validate all types (recommended)
bun tsc --noEmit     # Alternative: direct tsc command
bunx tsc --noEmit --watch  # Watch mode (continuous type checking)

# Code linting
bun run lint         # Run ESLint static analysis (recommended)
bunx eslint .        # Alternative: direct eslint command
bunx eslint . --fix  # Auto-fix issues where possible

# Format code
bun run format       # Format all files (recommended)
prettier --write .   # Alternative: direct prettier command
prettier --check .   # Check formatting without modifying

# Add dependencies
bun add package-name         # Add runtime dependency
bun add -d package-name      # Add dev dependency

# Update dependencies
bun update package-name      # Update specific package
bun update                   # Update all packages

# Dead code cleanup
bun run clean                # Auto-fix unused exports
bunx knip                    # Detection only (no modifications)

# Complete quality check (before committing)
bun run lint && bun run format && bun run typecheck && bun test
```

**Command Frequency Recommendations**:

| Command | When to Run | Frequency |
|---------|-------------|-----------|
| `bun run src/index.ts` | Execute code | Every time you want to run the app |
| `bun test` | Verify unit tests | After changes, frequently during dev |
| `bun test:e2e` | Verify E2E tests | Before commits, less frequently |
| `bun test:all` | Run all tests | Before commits, in CI/CD |
| `bun run lint` | Check code quality | Before commits, during development |
| `bun run typecheck` | Validate types | Before commits, after dependency changes |
| `bun run format` | Fix formatting | Before commits, after code changes |
| `bun run clean` | Clean unused code | Weekly, before releases, after refactoring |
| `bun test --watch` | Continuous unit testing | During active development (recommended) |
| `playwright test --ui` | Interactive E2E testing | When debugging E2E tests |
| `playwright test --debug` | Debug E2E tests | When E2E tests fail |
| `playwright show-report` | View E2E test results | After E2E test failures |
| `bunx eslint . --fix` | Auto-fix lint issues | During active development (optional) |
| `bunx tsc --noEmit --watch` | Continuous type checking | During active development (optional) |
| `bunx knip` | Detect unused code | Weekly, before major releases |
| `bun update` | Update dependencies | Weekly or monthly |

### Pre-Commit Checklist

Before committing code, ensure all checks pass in this order:

1. **Code Linting**: Run `bun run lint` or `bunx eslint . --fix`
   - Detects code quality issues and logic errors
   - Auto-fixes many issues with `--fix` flag
   - Catches unused variables, anti-patterns, best practice violations
   - Must have zero linting errors

2. **Code Formatting**: Run `bun run format` or `prettier --write .`
   - Ensures consistent code style
   - Auto-fixes formatting issues
   - Must pass before proceeding to next steps

3. **Type Checking**: Run `bun run typecheck` or `tsc --noEmit`
   - Validates all TypeScript types
   - Catches type errors before runtime
   - Must have zero type errors
   - **CRITICAL**: Never commit code with type errors

4. **Unit Tests**: Run `bun test` (native command)
   - Executes all unit test suites
   - Fast feedback on code correctness
   - Must have all tests passing
   - Run with `--watch` during development for continuous feedback

5. **E2E Tests**: Run `bun test:e2e` or `bun test:all`
   - Executes all end-to-end tests across browsers
   - Validates complete user workflows and UI
   - Slower than unit tests (requires browser startup)
   - Must have all tests passing
   - **IMPORTANT**: Run less frequently than unit tests due to speed

6. **Review Changes**: Run `git diff` and `git status`
   - Verify only intended files are staged
   - Check for accidental debug code or console logs
   - Ensure no sensitive data (API keys, secrets)

**Quick Pre-Commit Command**:
```bash
# Run all checks in sequence (recommended order)
bun run lint && bun run format && bun run typecheck && bun test:all && git status

# With ESLint auto-fix
bunx eslint . --fix && bun run format && bun run typecheck && bun test:all && git status

# Alternative: Check-only mode (no modifications)
bunx eslint . && prettier --check . && bun run typecheck && bun test:all

# Unit tests only (faster, for quick iterations)
bun run lint && bun run format && bun run typecheck && bun test

# E2E tests only (when unit tests already passed)
bun test:e2e
```

**Recommended Check Order** (and why):
1. **ESLint first** - Fixes logic issues (unused vars, anti-patterns)
2. **Prettier second** - Formats code appearance (quotes, semicolons)
3. **TypeScript third** - Validates types after code is cleaned
4. **Unit tests fourth** - Fast verification of code correctness (fail-fast)
5. **E2E tests last** - Comprehensive validation of user workflows (slowest)

**If Any Check Fails**:
- **Linting failure**: Run `bunx eslint . --fix` to auto-fix, then manually fix remaining issues
- **Formatting failure**: Run `bun run format` to auto-fix
- **Type checking failure**: Fix reported type errors, then re-run `bun run typecheck`
- **Unit test failure**: Fix failing tests, then re-run `bun test`
- **E2E test failure**:
  - Debug with `playwright test --debug` or `playwright test --ui`
  - View trace with `playwright show-trace` for failed test artifacts
  - Check test screenshots and videos in `test-results/`
  - Fix test or application code, then re-run `bun test:e2e`
- **Never force commit** with failing checks (don't use `--no-verify`)

**CI/CD Integration**:

These same checks should run in your CI/CD pipeline:
```yaml
# Example GitHub Actions workflow
steps:
  - name: Install dependencies
    run: bun install

  - name: Install Playwright browsers
    run: bunx playwright install --with-deps

  - name: Lint code
    run: bun run lint

  - name: Check formatting
    run: prettier --check .

  - name: Type check
    run: bun run typecheck

  - name: Run unit tests
    run: bun test

  - name: Run E2E tests
    run: bun test:e2e

  - name: Upload Playwright report
    if: failure()
    uses: actions/upload-artifact@v3
    with:
      name: playwright-report
      path: playwright-report/

  - name: Upload test results
    if: failure()
    uses: actions/upload-artifact@v3
    with:
      name: test-results
      path: test-results/
```

**Why This Order in CI/CD**:
1. **Install dependencies** - Install all npm packages (including Playwright)
2. **Install Playwright browsers** - Download Chromium, Firefox, WebKit binaries
3. **Linting first** - Catches code quality issues early (faster than type checking)
4. **Formatting second** - Verifies code style consistency
5. **Type checking third** - Comprehensive type validation (slower)
6. **Unit tests fourth** - Fast verification (fail-fast if logic is broken)
7. **E2E tests last** - Comprehensive user workflow validation (slowest)
8. **Upload artifacts** - Save test reports and traces for debugging failures

**Playwright Browser Installation in CI**:
- `bunx playwright install --with-deps` installs browser binaries and system dependencies
- Required in CI environments (browsers not pre-installed)
- Should run after `bun install` but before E2E tests
- Use `--with-deps` to install OS-level dependencies (fonts, libraries)

### Pre-Release Checklist

Before major releases, perform comprehensive quality checks including dead code cleanup:

1. **Clean Unused Code**: Run `bunx knip` to detect all unused code
   - Review unused files and consider deleting them
   - Remove unused dependencies: `bun remove <package>`
   - Run `bun run clean` to auto-fix unused exports
   - Verify cleanup: `bunx knip` should report minimal issues

2. **Code Linting**: Run `bun run lint` or `bunx eslint . --fix`
   - Detects and fixes code quality issues
   - Auto-fix with `--fix` flag, then manually address remaining issues
   - Must have zero linting errors before release

3. **Code Formatting**: Run `bun run format` or `prettier --write .`
   - Ensures consistent code style across entire codebase
   - Auto-fixes all formatting issues

4. **Type Checking**: Run `bun run typecheck` or `tsc --noEmit`
   - Validates all TypeScript types
   - Must have zero type errors before release
   - Fix all reported type issues

5. **Unit Tests**: Run `bun test` (native command)
   - All tests must pass
   - Consider adding coverage checks: `bun test --coverage`
   - Ensure critical paths are tested

6. **Dependency Audit**: Review and update dependencies
   - Check for security vulnerabilities: `bunx npm audit`
   - Update outdated dependencies: `bun update`
   - Verify all dependencies are necessary (Knip should help)

7. **Review Changes**: Final verification
   - Review git diff for unintended changes
   - Check for debug code, console logs, or TODOs
   - Ensure no sensitive data or credentials
   - Verify version number is updated in `package.json`

**Quick Pre-Release Command**:
```bash
# Comprehensive release preparation (in recommended order)
bunx knip && bun run lint && bun run format && bun run typecheck && bun test:all

# With auto-fix flags
bunx knip && bunx eslint . --fix && bun run format && bun run typecheck && bun test:all

# If Knip reports issues, address them and rerun:
bun remove <unused-package> && bun run clean && bunx knip
```

**Release Workflow**:
```bash
# 1. Clean unused code
bunx knip --reporter markdown > knip-report.md
# Review report and address findings

# 2. Remove unused dependencies
bun remove <package1> <package2>

# 3. Auto-fix unused exports
bun run clean

# 4. Verify cleanup
bunx knip  # Should be clean or minimal issues

# 5. Run quality checks (in order)
bun run lint && bun run format && bun run typecheck && bun test:all

# With auto-fix
bunx eslint . --fix && bun run format && bun run typecheck && bun test:all

# 6. Update version and commit
# 7. Create git tag and release
```

**Why Knip Before Releases**:
- **Smaller Bundle Size**: Removing unused code reduces production bundle size
- **Faster Builds**: Fewer files to process during compilation/bundling
- **Cleaner Codebase**: Professional releases shouldn't ship dead code
- **Security**: Unused dependencies can have vulnerabilities
- **Maintainability**: Clean code is easier to maintain post-release

### IDE Integration (ESLint + Prettier)

**VS Code**:
1. Install extensions:
   - "ESLint" by Microsoft
   - "Prettier - Code formatter" by Prettier
2. Add to `.vscode/settings.json`:
```json
{
  // ESLint configuration
  "eslint.enable": true,
  "eslint.format.enable": false,  // Prettier handles formatting
  "eslint.lintTask.enable": true,

  // Prettier configuration
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,

  // Code actions on save (run ESLint fixes, then Prettier)
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // Language-specific settings
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**WebStorm/IntelliJ IDEA**:
1. **ESLint Setup**:
   - Go to Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
   - Enable "Automatic ESLint configuration"
   - Check "Run eslint --fix on save"

2. **Prettier Setup**:
   - Go to Settings > Languages & Frameworks > JavaScript > Prettier
   - Set Prettier package: `node_modules/prettier`
   - Enable "Run on save for files" pattern: `{**/*,*}.{ts,tsx,js,jsx,json,md}`
   - Enable "On 'Reformat Code' action"

3. **Order of Operations**:
   - ESLint runs first (fixes logic issues)
   - Prettier runs second (fixes formatting)

**Vim/Neovim** (using ALE):
```vim
" ESLint + Prettier integration with ALE
let g:ale_linters = {
\   'typescript': ['eslint'],
\   'javascript': ['eslint']
\}

let g:ale_fixers = {
\   'typescript': ['eslint', 'prettier'],
\   'javascript': ['eslint', 'prettier']
\}

" Fix on save
let g:ale_fix_on_save = 1

" ESLint first, then Prettier
let g:ale_fix_order = ['eslint', 'prettier']
```

**Vim/Neovim** (using coc.nvim):
```vim
" Install extensions
:CocInstall coc-eslint coc-prettier

" Auto-fix on save (add to init.vim or .vimrc)
autocmd BufWritePre *.ts,*.tsx,*.js,*.jsx :CocCommand eslint.executeAutofix
autocmd BufWritePre *.ts,*.tsx,*.js,*.jsx :CocCommand prettier.formatFile
```

**Emacs**:
```elisp
;; Using flycheck (for ESLint) and prettier-js
(require 'flycheck)
(add-hook 'typescript-mode-hook 'flycheck-mode)

;; Prettier integration
(require 'prettier-js)
(add-hook 'typescript-mode-hook 'prettier-js-mode)
(add-hook 'json-mode-hook 'prettier-js-mode)

;; Auto-fix ESLint issues on save
(add-hook 'typescript-mode-hook
          (lambda ()
            (add-hook 'before-save-hook 'eslint-fix-file nil t)))
```

**IDE Integration Best Practices**:
1. **Auto-fix on save** - Configure both ESLint and Prettier to run on save
2. **Correct order** - ESLint should run before Prettier (logic before formatting)
3. **Visual feedback** - Enable inline error/warning displays for real-time feedback
4. **Performance** - Consider disabling auto-fix for very large files if slow
5. **Consistency** - Share `.vscode/settings.json` with team for consistent setup

### Debugging

```bash
# Debug mode
bun --inspect index.ts
bun --inspect-brk index.ts  # Break on first line

# Print diagnostics
bun --print config
bun --version
```

## Migration Notes

### From Node.js/npm Project

1. Install Bun: `curl -fsSL https://bun.com/install | bash`
2. Remove `node_modules` and lock files
3. Run `bun install` to generate `bun.lock`
4. Replace `node` with `bun` in scripts
5. Update CI/CD to use Bun

### From Deno

- Bun is more npm-compatible than Deno
- No permission flags needed
- Standard `package.json` workflow

## Version History

- **Project Created**: Bun v1.3.0 (current)
- **TypeScript**: ^5.9.3 (both dev and peer dependency)
- **@types/bun**: latest
- **@types/node**: ^24.7.2 (added October 2024)
- **ESLint**: ^9.37.0 (added October 2024)
- **@eslint/js**: ^9.37.0 (added October 2024)
- **typescript-eslint**: ^8.46.1 (added October 2024)
- **globals**: ^16.4.0 (added October 2024)
- **Prettier**: 3.6.2 (added October 2024)
- **Knip**: ^5.65.0 (added October 2024)
- **Playwright**: ^1.56.0 (added October 2024)

**Timeline**:
- **Initial Setup**: Bun v1.3.0 with TypeScript ^5.9.3 and basic configuration
- **Formatting Added**: Prettier 3.6.2 for consistent code style enforcement
- **Type Checking Enhanced**: TypeScript moved to devDependencies for type validation
- **Node.js Types Added**: @types/node v24.7.2 for Node.js API compatibility
- **Linting Added**: ESLint v9.37.0 with typescript-eslint v8.46.1 for code quality and static analysis
- **Dead Code Detection Added**: Knip v5.65.0 for unused code cleanup
- **E2E Testing Added**: Playwright v1.56.0 for end-to-end browser testing and user workflow validation
- **Entry Point Moved**: Entry point moved from `index.ts` to `src/index.ts` for better project structure
- **Test Scripts Simplified**: Removed wrapper scripts for unit tests - use native `bun test` directly. Added `test:all` script for comprehensive testing
- **Current State**: Complete development toolchain (execution, linting, validation, formatting, unit testing, E2E testing, cleanup)

## Technology Summary

**Runtime & Execution**:
- **Bun v1.3.0**: Primary runtime (executes TypeScript directly without type checking)
- **Role**: Fast execution, package management, unit testing, bundling

**Type System & Validation**:
- **TypeScript ^5.9.3**: Type system and static analysis (dev + peer dependency)
- **Role**: Static type validation with `--noEmit` flag, no compilation/building

**Testing Frameworks**:
- **Bun Test (built-in)**: Fast unit testing for isolated functions and logic
- **Playwright ^1.56.0**: End-to-end testing framework for user workflows and browser automation
- **Role**: Unit tests verify code correctness, E2E tests validate complete user experiences

**Code Quality Tools**:
- **ESLint 9.37.0**: Static code analysis (linter for logic errors and code quality)
- **Prettier 3.6.2**: Code formatter (enforces consistent style)
- **Knip 5.65.0**: Dead code detector (finds unused code and dependencies)
- **Role**: Catch logic errors, auto-format code, clean unused code, maintain codebase hygiene

**ESLint Supporting Packages**:
- **@eslint/js v9.37.0**: ESLint's recommended JavaScript rules (flat config)
- **typescript-eslint v8.46.1**: TypeScript-specific ESLint rules and parser
- **globals v16.4.0**: Global variable definitions for different environments

**Type Definitions**:
- **@types/bun**: Type definitions for Bun runtime APIs
- **@types/node v24.7.2**: Type definitions for Node.js APIs (compatibility layer)

**Project Metadata**:
- Version: 0.0.1
- License: BSL-1.1 (Business Source License 1.1)
- Module System: ES Modules
- Entry Point: src/index.ts (moved from root)
- Type Checking: Strict mode enabled

**Development Dependencies** (`devDependencies`):
- `@playwright/test`: ^1.56.0 - E2E testing framework (browser automation)
- `@eslint/js`: ^9.37.0 - ESLint JavaScript rules (flat config)
- `@types/bun`: latest - Bun API type definitions
- `@types/node`: ^24.7.2 - Node.js API type definitions (for compatibility)
- `eslint`: ^9.37.0 - Static code analysis tool (linter)
- `globals`: ^16.4.0 - Global variables definitions for ESLint
- `knip`: ^5.65.0 - Dead code detection and cleanup tool
- `prettier`: 3.6.2 - Code formatter
- `typescript`: ^5.9.3 - TypeScript compiler
- `typescript-eslint`: ^8.46.1 - TypeScript ESLint rules and parser

**Peer Dependencies** (`peerDependencies`):
- `typescript`: ^5 - TypeScript compiler (actual type checker)

**Development Workflow**:
1. **Execution**: Bun runs TypeScript directly (fast, no type checking)
2. **Linting**: ESLint checks code quality and logic errors
3. **Validation**: TypeScript checks types separately (slow, comprehensive)
4. **Formatting**: Prettier enforces consistent style automatically
5. **Unit Testing**: Bun Test validates isolated code units (fast feedback)
6. **E2E Testing**: Playwright validates complete user workflows (comprehensive validation)
7. **Cleanup**: Knip detects and removes unused code periodically

**Key Principle**: Separation of concerns
- Bun = Runtime execution + Unit testing (performance priority)
- Playwright = E2E testing (user experience validation)
- ESLint = Code quality & logic (best practices priority)
- TypeScript = Type validation (correctness priority)
- Prettier = Code formatting (consistency priority)
- Knip = Dead code detection (maintainability priority)

---

*Last Updated: October 2024*
*This documentation is the source of truth for the Omnera V2 project infrastructure.*
