# CLAUDE.md - Omnera V2 Project Documentation

This document provides comprehensive technical documentation for the Omnera V2 project, designed to give Claude Code and other AI assistants complete context for accurate code generation.

## Project Overview

**Project Name**: Omnera V2
**Version**: 0.0.1
**License**: BSL-1.1 (Business Source License 1.1)
**Created with**: Bun v1.3.0 (via `bun init`)
**Primary Runtime**: Bun (NOT Node.js)
**Package Manager**: Bun (NOT npm, yarn, or pnpm)
**Test Runner**: Bun Test (built-in)
**Code Formatter**: Prettier 3.6.2
**Module System**: ES Modules (type: "module")
**Entry Point**: index.ts

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

### Prettier Code Formatter (v3.6.2)

**Purpose**: Enforces consistent code formatting across the entire codebase automatically, eliminating style debates and ensuring uniform code appearance.

**Why Prettier**:
- Zero-config opinionated formatter (minimal configuration needed)
- Supports TypeScript, JavaScript, JSX, TSX, JSON, Markdown, and more
- Integrates seamlessly with Bun via `bunx`
- Prevents formatting inconsistencies in version control
- Saves time during code reviews by eliminating style discussions

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
1. **Pre-commit**: Consider running `bunx prettier --check .` before commits
2. **CI/CD**: Add formatting checks to continuous integration
3. **IDE/Editor**: Configure editor to format on save (see IDE Integration section)
4. **Manual Formatting**: Run `bunx prettier --write .` when needed

### Bun Test Runner

**Test File Patterns**:
- `*.test.ts`, `*.test.tsx`
- `*.spec.ts`, `*.spec.tsx`
- `*_test.ts`, `*_test.tsx`
- Files in `__tests__` directories

**Test Commands**:
```bash
# Run all tests
bun test

# Run specific file/pattern
bun test path/to/file.test.ts
bun test src/**/*.test.ts

# Watch mode
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
    // Setup
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

## Infrastructure

### File Structure

```
omnera-v2/
├── index.ts              # Entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript config (Bun-optimized)
├── .prettierrc.json      # Prettier formatting configuration
├── .prettierignore       # Files to exclude from Prettier (optional)
├── bun.lock             # Lock file (binary)
├── README.md            # User documentation
├── CLAUDE.md            # This file - Technical documentation
└── src/                 # Source code (when added)
    ├── components/      # UI components (if applicable)
    ├── lib/             # Utility functions
    └── types/           # TypeScript type definitions
```

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
  "module": "index.ts",      // Entry point for Bun
  "type": "module",          // ES modules only
  "license": "BSL-1.1",      // Business Source License 1.1
  "scripts": {
    // Development scripts
    "dev": "bun run --watch index.ts",

    // Testing scripts
    "test": "bun test",
    "test:watch": "bun test --watch",

    // Type checking (validation, not compilation)
    "typecheck": "tsc --noEmit",

    // Code formatting
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "@types/bun": "latest",  // Bun type definitions
    "prettier": "3.6.2",     // Code formatter
    "tsc": "^2.0.4"          // TypeScript compiler wrapper
  },
  "peerDependencies": {
    "typescript": "^5"       // TypeScript compiler (actual compiler)
  }
}
```

**Script Explanations**:

- **`typecheck`**: Runs TypeScript type checking without emitting files
  - Command: `tsc --noEmit`
  - Purpose: Validate all TypeScript types across the project
  - When to use: Before commits, in CI/CD, during development
  - Exit code: 0 if no errors, non-zero if type errors found
  - Does NOT generate any files (only validates types)

- **`format`**: Formats all files using Prettier
  - Command: `prettier --write .`
  - Purpose: Auto-format code to match style guidelines
  - When to use: Before commits, after code changes

- **`format:check`**: Checks formatting without modifying files
  - Command: `prettier --check .`
  - Purpose: Verify code is properly formatted
  - When to use: In CI/CD to enforce formatting

**Dependency Structure**:

- **devDependencies**: Tools used during development only
  - `tsc`: Wrapper for running TypeScript compiler
  - `prettier`: Code formatter
  - `@types/bun`: Type definitions for Bun APIs

- **peerDependencies**: Required by dev tools but not directly used
  - `typescript`: The actual TypeScript compiler used by tsc wrapper
  - Allows project to control TypeScript version independently

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
bun run dev          # If script exists
bun run index.ts     # Direct execution

# Run tests
bun test             # Run all tests
bun test --watch     # Watch mode (continuous testing)

# Type checking
bun run typecheck    # Validate all types (recommended)
bun tsc --noEmit     # Alternative: direct tsc command
bunx tsc --noEmit --watch  # Watch mode (continuous type checking)

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

# Complete quality check (before committing)
bun run format && bun run typecheck && bun test
```

**Command Frequency Recommendations**:

| Command | When to Run | Frequency |
|---------|-------------|-----------|
| `bun run index.ts` | Execute code | Every time you want to run the app |
| `bun test` | Verify functionality | After changes, before commits |
| `bun run typecheck` | Validate types | Before commits, after dependency changes |
| `bun run format` | Fix formatting | Before commits, after code changes |
| `bun test --watch` | Continuous testing | During active development (optional) |
| `bunx tsc --noEmit --watch` | Continuous type checking | During active development (optional) |
| `bun update` | Update dependencies | Weekly or monthly |

### Pre-Commit Checklist

Before committing code, ensure all checks pass in this order:

1. **Code Formatting**: Run `bun run format` or `prettier --write .`
   - Ensures consistent code style
   - Auto-fixes formatting issues
   - Must pass before proceeding to next steps

2. **Type Checking**: Run `bun run typecheck` or `tsc --noEmit`
   - Validates all TypeScript types
   - Catches type errors before runtime
   - Must have zero type errors
   - **CRITICAL**: Never commit code with type errors

3. **Unit Tests**: Run `bun test`
   - Executes all test suites
   - Ensures functionality works correctly
   - Must have all tests passing

4. **Review Changes**: Run `git diff` and `git status`
   - Verify only intended files are staged
   - Check for accidental debug code or console logs
   - Ensure no sensitive data (API keys, secrets)

**Quick Pre-Commit Command**:
```bash
# Run all checks in sequence
bun run format && bun run typecheck && bun test && git status

# Alternative: Run formatting check without modifying files
prettier --check . && bun run typecheck && bun test
```

**If Any Check Fails**:
- **Formatting failure**: Run `bun run format` to auto-fix
- **Type checking failure**: Fix reported type errors, then re-run `bun run typecheck`
- **Test failure**: Fix failing tests, then re-run `bun test`
- **Never force commit** with failing checks (don't use `--no-verify`)

**CI/CD Integration**:

These same checks should run in your CI/CD pipeline:
```yaml
# Example GitHub Actions workflow
steps:
  - name: Install dependencies
    run: bun install

  - name: Check formatting
    run: prettier --check .

  - name: Type check
    run: bun run typecheck

  - name: Run tests
    run: bun test
```

### IDE Integration (Prettier)

**VS Code**:
1. Install "Prettier - Code formatter" extension
2. Add to `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**WebStorm/IntelliJ IDEA**:
1. Go to Settings > Languages & Frameworks > JavaScript > Prettier
2. Set Prettier package: `node_modules/prettier`
3. Enable "Run on save for files" pattern: `{**/*,*}.{ts,tsx,js,jsx,json,md}`
4. Enable "On 'Reformat Code' action"

**Vim/Neovim**:
```vim
" Using vim-prettier plugin
let g:prettier#autoformat = 1
let g:prettier#autoformat_require_pragma = 0
```

**Emacs**:
```elisp
;; Using prettier-js package
(add-hook 'typescript-mode-hook 'prettier-js-mode)
(add-hook 'json-mode-hook 'prettier-js-mode)
```

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
- **TypeScript**: ^5 (peer dependency)
- **@types/bun**: latest
- **Prettier**: 3.6.2 (added October 2024)
- **tsc**: ^2.0.4 (added October 2024 - type checking tool)

**Timeline**:
- **Initial Setup**: Bun v1.3.0 with TypeScript ^5 and basic configuration
- **Formatting Added**: Prettier 3.6.2 for consistent code style
- **Type Checking Added**: tsc v2.0.4 for static type validation (separate from runtime)
- **Current State**: Complete development toolchain (execution, validation, formatting, testing)

## Technology Summary

**Runtime & Execution**:
- **Bun v1.3.0**: Primary runtime (executes TypeScript directly without type checking)
- **Role**: Fast execution, package management, testing, bundling

**Type System & Validation**:
- **TypeScript ^5**: Type system and static analysis (peer dependency)
- **tsc v2.0.4**: TypeScript compiler wrapper (for type checking only)
- **Role**: Static type validation with `--noEmit` flag, no compilation/building

**Code Quality Tools**:
- **Prettier 3.6.2**: Code formatter (enforces consistent style)
- **Role**: Auto-format code, enforce style guidelines

**Project Metadata**:
- Version: 0.0.1
- License: BSL-1.1 (Business Source License 1.1)
- Module System: ES Modules
- Type Checking: Strict mode enabled

**Development Dependencies** (`devDependencies`):
- `@types/bun`: latest - Bun API type definitions
- `prettier`: 3.6.2 - Code formatter
- `tsc`: ^2.0.4 - TypeScript compiler wrapper

**Peer Dependencies** (`peerDependencies`):
- `typescript`: ^5 - TypeScript compiler (actual type checker)

**Development Workflow**:
1. **Execution**: Bun runs TypeScript directly (fast, no type checking)
2. **Validation**: tsc checks types separately (slow, comprehensive)
3. **Formatting**: Prettier enforces consistent style
4. **Testing**: Bun test runner validates functionality

**Key Principle**: Separation of concerns
- Bun = Runtime execution (performance priority)
- tsc = Type validation (correctness priority)
- Prettier = Code formatting (consistency priority)

---

*Last Updated: October 2024*
*This documentation is the source of truth for the Omnera V2 project infrastructure.*
