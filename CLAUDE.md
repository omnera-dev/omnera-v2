# CLAUDE.md - Omnera V2 Project Documentation

This document provides comprehensive technical documentation for the Omnera V2 project, designed to give Claude Code and other AI assistants complete context for accurate code generation.

## Documentation Imports

The following detailed documentation files are imported for Claude Code's memory:

@docs/infrastructure/tools/bun.md
@docs/infrastructure/tools/typescript.md
@docs/infrastructure/tools/effect.md
@docs/infrastructure/tools/eslint.md
@docs/infrastructure/tools/prettier.md
@docs/infrastructure/tools/knip.md
@docs/infrastructure/testing/bun-test.md
@docs/infrastructure/testing/playwright.md
@docs/infrastructure/cicd/workflows.md
@docs/infrastructure/release/semantic-release.md

## Project Overview

**Project Name**: Omnera V2
**NPM Package Name**: omnera
**Description**: Modern TypeScript framework built with Bun
**Version**: 0.0.1 (managed by semantic-release)
**License**: BSL-1.1 (Business Source License 1.1)
**Repository**: https://github.com/omnera-dev/omnera-v2
**Primary Runtime**: Bun (NOT Node.js)
**Package Manager**: Bun (NOT npm, yarn, or pnpm)
**Module System**: ES Modules (type: "module")
**Entry Point**: src/index.ts

## Core Technologies

### Bun Runtime (v1.3.0)

All-in-one JavaScript/TypeScript runtime replacing Node.js.

- **Purpose**: Native TypeScript execution, built-in test runner, fast package management
- **Key Feature**: Executes TypeScript directly without compilation
- **Why Bun**: 4x faster cold starts, unified toolchain, native TypeScript support

**Detailed Documentation**: [`docs/infrastructure/tools/bun.md`](docs/infrastructure/tools/bun.md)

### TypeScript (^5)

Strict type-safe TypeScript with Bun-optimized configuration.

- **Purpose**: Type checking (tsc) + Execution (Bun)
- **Critical**: `noEmit: true` - Bun executes, tsc validates types
- **Two-Phase Workflow**: Fast execution (Bun) + Type checking (tsc)

**Detailed Documentation**: [`docs/infrastructure/tools/typescript.md`](docs/infrastructure/tools/typescript.md)

### Effect (3.18.4)

Typed functional programming library for building robust applications.

- **Purpose**: Type-safe error handling, dependency injection, structured concurrency
- **Key Feature**: Explicit error types tracked at compile time
- **Why Effect**: Composability, testability, reliability, excellent TypeScript integration

**Detailed Documentation**: [`docs/infrastructure/tools/effect.md`](docs/infrastructure/tools/effect.md)

## Development Tools

### Code Quality Tools

| Tool | Version | Purpose | Command | Documentation |
|------|---------|---------|---------|--------------|
| **ESLint** | 9.37.0 | Code quality & logic errors | `bun run lint` | [`docs/infrastructure/tools/eslint.md`](docs/infrastructure/tools/eslint.md) |
| **Prettier** | 3.6.2 | Code formatting | `bun run format` | [`docs/infrastructure/tools/prettier.md`](docs/infrastructure/tools/prettier.md) |
| **TypeScript (tsc)** | ^5 | Type checking | `bun run typecheck` | [`docs/infrastructure/tools/typescript.md`](docs/infrastructure/tools/typescript.md) |
| **Knip** | 5.65.0 | Dead code detection | `bun run clean` | [`docs/infrastructure/tools/knip.md`](docs/infrastructure/tools/knip.md) |

### Testing Frameworks

| Tool | Version | Purpose | Command | Documentation |
|------|---------|---------|---------|--------------|
| **Bun Test** | Built-in | Unit tests (fast, isolated logic) | `bun test` | [`docs/infrastructure/testing/bun-test.md`](docs/infrastructure/testing/bun-test.md) |
| **Playwright** | 1.56.0 | E2E tests (full workflows) | `bun test:e2e` | [`docs/infrastructure/testing/playwright.md`](docs/infrastructure/testing/playwright.md) |

**Test Strategy**: Unit tests run first (fail-fast), then E2E tests. Combined: `bun test:all`

## Infrastructure

### CI/CD Pipelines

- **Test Workflow** (`.github/workflows/ci.yml`): Runs on push/PR to main
- **Release Workflow** (`.github/workflows/release.yml`): Automated releases after tests pass

**Detailed Documentation**: [`docs/infrastructure/cicd/workflows.md`](docs/infrastructure/cicd/workflows.md)

### Release Management

**semantic-release v24.2.0** - Fully automated version management and publishing

- **Trigger**: Push to main with `feat:` or `fix:` commits
- **Actions**: Version bump, changelog generation, npm publish, GitHub release
- **Commit Format**: Conventional Commits (REQUIRED)

**Detailed Documentation**: [`docs/infrastructure/release/semantic-release.md`](docs/infrastructure/release/semantic-release.md)

## File Structure

```
omnera-v2/
├── docs/
│   └── infrastructure/          # Technical infrastructure documentation
│       ├── tools/              # Development tools (Bun, TypeScript, Effect, ESLint, Prettier, Knip)
│       ├── testing/            # Testing frameworks (Bun Test, Playwright)
│       ├── cicd/               # CI/CD workflows (GitHub Actions)
│       └── release/            # Release management (semantic-release)
├── .github/
│   └── workflows/
│       ├── test.yml            # Test workflow
│       └── release.yml         # Release workflow
├── scripts/
│   └── update-license-date.js  # License date updater (BSL 1.1)
├── src/
│   ├── index.ts                # Entry point
│   └── **/*.test.ts            # Unit tests (co-located with source)
├── tests/
│   └── **/*.spec.ts            # E2E tests (Playwright only)
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config (Bun-optimized)
├── playwright.config.ts        # Playwright E2E testing configuration
├── eslint.config.ts            # ESLint linting configuration (flat config)
├── .prettierrc.json            # Prettier formatting configuration
├── .releaserc.json             # Semantic-release configuration
├── knip.json                   # Knip dead code detection configuration
├── bun.lock                    # Lock file (binary)
├── README.md                   # User documentation
├── CLAUDE.md                   # This file - Technical documentation
├── CHANGELOG.md                # Auto-generated changelog (semantic-release)
└── LICENSE.md                  # BSL 1.1 license (auto-updated by semantic-release)
```

### File Organization Principles

**Entry Point**:
- **Location**: `src/index.ts` (moved from root `index.ts`)
- **Reference**: `package.json` specifies `"module": "src/index.ts"`
- **Rationale**: Cleaner project root, separates source code from configuration

**Test File Locations**:
- **Unit Tests (Bun)**: Co-located with source code (e.g., `src/utils.test.ts` next to `src/utils.ts`)
- **E2E Tests (Playwright)**: Separate `tests/` directory (e.g., `tests/login.spec.ts`)
- **Rationale**: Unit tests stay close to code, E2E tests represent user workflows

## Environment Variables

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

**All code MUST follow Prettier formatting rules** defined in `.prettierrc.json`:

1. **Quotes**: Always use single quotes (`'`)
2. **Semicolons**: Never use semicolons
3. **Line Width**: Maximum 100 characters per line
4. **Trailing Commas**: Use trailing commas in multi-line structures (ES5 compatible)
5. **Indentation**: 2 spaces (no tabs)
6. **JSX/TSX Attributes**: One attribute per line

**Examples**:

```typescript
// CORRECT
const message = 'Hello world'
const value = 42
const array = ['item1', 'item2', 'item3']

// INCORRECT
const message = "Hello world"  // ❌ Double quotes
const value = 42;              // ❌ Semicolon
const array = ['item1', 'item2', 'item3']  // ❌ Missing trailing comma
```

**Automatic Formatting**: Run `bunx prettier --write .` before committing code

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

### Import Conventions

```typescript
// CORRECT - Bun allows .ts extensions
import { something } from './module.ts'

// CORRECT - Type-only imports must be explicit
import type { SomeType } from './types.ts'

// INCORRECT - Don't omit extensions
import { something } from './module'  // ❌
```

## Development Workflow

### Pre-Commit Checklist

Before committing code, run:

```bash
bun run lint           # ESLint code quality checks
bun run format         # Prettier formatting
bun run typecheck      # TypeScript type validation
bun test               # Unit tests
bun test:e2e           # E2E tests (optional locally, required in CI)
```

Or run all checks at once:

```bash
bun run lint && bun run format && bun run typecheck && bun test:all
```

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

**Format**: `<type>(<scope>): <subject>`

**Types**:
- `feat:` - New feature (triggers minor version bump)
- `fix:` - Bug fix (triggers patch version bump)
- `docs:` - Documentation changes (no version bump)
- `style:` - Code style changes (formatting, no logic change, no version bump)
- `refactor:` - Code refactoring (no new features or bug fixes, no version bump)
- `perf:` - Performance improvements (no version bump)
- `test:` - Adding or updating tests (no version bump)
- `chore:` - Maintenance tasks, dependencies (no version bump)
- `ci:` - CI/CD configuration changes (no version bump)

**Breaking Changes**: Add `!` after type or include `BREAKING CHANGE:` in commit body (triggers major version bump)

**Examples**:

```bash
feat(api): add user authentication endpoint
fix(database): resolve connection timeout issue
docs(readme): update installation instructions
feat!: redesign API structure
```

### Release Process

Releases are automated via GitHub Actions:

1. Push commits to `main` branch using conventional commit format
2. CI runs tests and quality checks
3. semantic-release analyzes commits and determines version bump
4. Updates CHANGELOG.md, package.json, and LICENSE.md
5. Publishes to npm registry
6. Creates GitHub release with release notes

**See**: [`docs/infrastructure/release/semantic-release.md`](docs/infrastructure/release/semantic-release.md)

## Quick Reference

### Essential Commands

```bash
# Development
bun install                 # Install dependencies
bun run src/index.ts        # Run application
bun --watch src/index.ts    # Run with watch mode

# Code Quality
bun run lint                # Lint code (ESLint)
bun run format              # Format code (Prettier)
bun run format:check        # Check formatting
bun run typecheck           # Type check (tsc)
bun run clean               # Find unused code (Knip)

# Testing
bun test                    # Run unit tests (Bun Test)
bun test --watch            # Unit tests in watch mode
bun test:e2e                # Run E2E tests (Playwright)
bun test:all                # Run all tests (unit + E2E)

# Release
git commit -m "feat: add feature"  # Conventional commit
git push origin main               # Triggers release if feat/fix
```

### Tool Comparison

| Concern | Tool | When to Run |
|---------|------|-------------|
| **Formatting** | Prettier | Before commits, on save |
| **Code Quality** | ESLint | Before commits, in CI/CD |
| **Type Safety** | TypeScript (tsc) | Before commits, in CI/CD |
| **Unit Testing** | Bun Test | Continuously during development |
| **E2E Testing** | Playwright | Before commits, in CI/CD |
| **Dead Code** | Knip | Weekly, before releases |
| **Version Management** | semantic-release | Automated on push to main |

## Documentation Structure

This project uses a modular documentation approach:

- **CLAUDE.md** (this file): High-level project overview and quick reference
- **docs/infrastructure/**: Detailed technical documentation
  - **tools/**: Development tools (Bun, TypeScript, Effect, ESLint, Prettier, Knip)
  - **testing/**: Testing frameworks (Bun Test, Playwright)
  - **cicd/**: CI/CD workflows (GitHub Actions)
  - **release/**: Release management (semantic-release)

## License

Omnera is licensed under the Business Source License 1.1.

- **Non-production use**: Free for development, testing, and personal projects
- **Production use**: Allowed for internal business use
- **Not allowed**: Offering Omnera as a managed service or SaaS to third parties

See [LICENSE.md](LICENSE.md) for full details.

---

## Product Specifications

_This section is reserved for product specifications and requirements._

TODO: Add product specifications here

---

## Project Architecture

_This section is reserved for project architecture documentation._

TODO: Add project architecture here

---

## Best Practices

_This section is reserved for project-specific best practices and patterns._

TODO: Add best practices here

---

_This project was created using `bun init` in Bun v1.3.0_
