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
**Configuration**: Optimized for Bun's bundler mode

**Key tsconfig.json Settings**:
```json
{
  "compilerOptions": {
    "lib": ["ESNext"],           // Latest JavaScript features
    "target": "ESNext",          // No downleveling needed
    "module": "Preserve",        // Preserves original module syntax
    "moduleResolution": "bundler", // Bun's resolution algorithm
    "allowImportingTsExtensions": true, // Can import .ts files directly
    "verbatimModuleSyntax": true, // Explicit import/export syntax
    "noEmit": true,              // Bun handles execution, not tsc
    "jsx": "react-jsx",          // JSX support (if React is added)
    "strict": true,              // Full type safety
    "noUncheckedIndexedAccess": true, // Array/object access safety
    "noImplicitOverride": true   // Explicit override keyword required
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
    "dev": "bun run --watch index.ts",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "typecheck": "tsc --noEmit",
    "format": "bunx prettier --write .",
    "format:check": "bunx prettier --check ."
  },
  "devDependencies": {
    "@types/bun": "latest",  // Bun type definitions
    "prettier": "3.6.2"      // Code formatter
  },
  "peerDependencies": {
    "typescript": "^5"       // TypeScript compiler (for types only)
  }
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
- ❌ `tsc` for compilation - Only for type checking
- ❌ `ts-node` - Bun executes TypeScript natively
- ❌ `nodemon` - Use `bun --watch` instead

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
bun test
bun test --watch

# Format code
bunx prettier --write .          # Format all files
bunx prettier --check .          # Check formatting

# Add new dependency
bun add package-name

# Type checking (IDE usually handles this)
bunx tsc --noEmit

# Update dependencies
bun update
```

### Pre-Commit Checklist

Before committing code, ensure:
1. **Formatting**: Run `bunx prettier --write .` to format all files
2. **Type checking**: Run `bunx tsc --noEmit` to verify types
3. **Tests**: Run `bun test` to ensure all tests pass
4. **Review changes**: Check `git diff` to verify only intended changes

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

## Technology Summary

**Runtime & Build Tools**:
- Bun v1.3.0 (runtime, package manager, test runner, bundler)
- TypeScript ^5 (type checking only, no compilation)
- Prettier 3.6.2 (code formatting)

**Project Metadata**:
- Version: 0.0.1
- License: BSL-1.1 (Business Source License 1.1)
- Module System: ES Modules

**Development Dependencies**:
- @types/bun: latest
- prettier: 3.6.2

---

*Last Updated: October 2024*
*This documentation is the source of truth for the Omnera V2 project infrastructure.*
