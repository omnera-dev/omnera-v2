# CLAUDE.md - Omnera Project Documentation

This document provides comprehensive technical documentation for the Omnera project, designed to give Claude Code and other AI assistants complete context for accurate code generation.

## Documentation Imports

The following detailed documentation files are imported for Claude Code's memory:

@docs/infrastructure/runtime/bun.md
@docs/infrastructure/language/typescript.md
@docs/infrastructure/framework/effect.md
@docs/infrastructure/framework/hono.md
@docs/infrastructure/framework/better-auth.md
@docs/infrastructure/database/drizzle.md
@docs/infrastructure/ui/react.md
@docs/infrastructure/ui/tanstack-query.md
@docs/infrastructure/ui/tanstack-table.md
@docs/infrastructure/ui/tailwind.md
@docs/infrastructure/ui/shadcn.md
@docs/infrastructure/quality/eslint.md
@docs/infrastructure/quality/prettier.md
@docs/infrastructure/quality/knip.md
@docs/infrastructure/testing/bun-test.md
@docs/infrastructure/testing/playwright.md
@docs/infrastructure/cicd/workflows.md
@docs/infrastructure/release/semantic-release.md
@docs/architecture/functional-programming.md
@docs/architecture/layer-based-architecture.md
@docs/architecture/testing-strategy.md
@docs/architecture/performance-optimization.md
@docs/architecture/security-best-practices.md

## Project Overview

**Project Name**: Omnera
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

**Detailed Documentation**: [`docs/infrastructure/runtime/bun.md`](docs/infrastructure/runtime/bun.md)

### TypeScript (^5)

Strict type-safe TypeScript with Bun-optimized configuration.

- **Purpose**: Type checking (tsc) + Execution (Bun)
- **Critical**: `noEmit: true` - Bun executes, tsc validates types
- **Two-Phase Workflow**: Fast execution (Bun) + Type checking (tsc)

**Detailed Documentation**: [`docs/infrastructure/language/typescript.md`](docs/infrastructure/language/typescript.md)

### Effect (3.18.4)

Typed functional programming library for building robust applications.

- **Purpose**: Type-safe error handling, dependency injection, structured concurrency
- **Key Feature**: Explicit error types tracked at compile time
- **Why Effect**: Composability, testability, reliability, excellent TypeScript integration

**Detailed Documentation**: [`docs/infrastructure/framework/effect.md`](docs/infrastructure/framework/effect.md)

### Hono (4.9.12)

Ultra-lightweight web framework for building APIs and web applications.

- **Purpose**: Fast, type-safe HTTP routing and middleware
- **Key Feature**: Built on Web Standard APIs, works on Bun, Cloudflare, Deno, AWS, Node.js
- **Why Hono**: Under 14kB, blazing fast routing, excellent TypeScript support, Effect-ready

**Detailed Documentation**: [`docs/infrastructure/framework/hono.md`](docs/infrastructure/framework/hono.md)

### Better Auth (1.3.27)

Framework-agnostic authentication and authorization library for TypeScript.

- **Purpose**: Type-safe authentication with email/password, OAuth, 2FA, passkeys, and session management
- **Key Feature**: Extensible plugin system, full control over user data, zero vendor lock-in
- **Why Better Auth**: Works seamlessly with Hono and Effect, Bun-native, rich plugin ecosystem, no per-user costs

**Detailed Documentation**: [`docs/infrastructure/framework/better-auth.md`](docs/infrastructure/framework/better-auth.md)

### Drizzle ORM

TypeScript-first ORM for SQL databases providing type-safe queries with zero-cost type safety.

- **Purpose**: Type-safe database operations, schema management, migrations, and relational queries
- **Key Feature**: SQL-like syntax with full TypeScript inference, native Bun SQL integration (bun:sqlite)
- **Why Drizzle**: Zero runtime overhead, perfect Effect integration, Better Auth compatible via drizzleAdapter, SQL-familiar API

**Detailed Documentation**: [`docs/infrastructure/database/drizzle.md`](docs/infrastructure/database/drizzle.md)

### React (19.2.0)

Component-based UI library for building interactive user interfaces.

- **Purpose**: Declarative, composable UI components with server-side rendering support
- **Key Feature**: React 19 Compiler for automatic optimization, Actions for form handling, use() hook
- **Why React**: Rich ecosystem, excellent TypeScript support, perfect SSR with Hono, seamless Tailwind integration

**Detailed Documentation**: [`docs/infrastructure/ui/react.md`](docs/infrastructure/ui/react.md)

### Tailwind CSS (4.1.14)

Utility-first CSS framework for rapid UI development.

- **Purpose**: Fast UI development with utility classes, responsive design, dark mode support
- **Key Feature**: CSS-first configuration with @theme directive, 10x faster v4 engine
- **Why Tailwind**: No context switching, optimized bundle size, perfect for React components

**Detailed Documentation**: [`docs/infrastructure/ui/tailwind.md`](docs/infrastructure/ui/tailwind.md)

### shadcn/ui (Component Collection)

Copy-paste component collection built with Tailwind CSS and React.

- **Purpose**: Production-ready, accessible UI components you own and control
- **Key Feature**: Components copied into your project (NOT an npm package)
- **Why shadcn/ui**: Full customization freedom, no vendor lock-in, zero bundle bloat, perfect Tailwind integration

**Key Dependencies**: class-variance-authority (0.7.1), clsx (2.1.1), tailwind-merge (3.3.1), lucide-react (0.545.0)

**Detailed Documentation**: [`docs/infrastructure/ui/shadcn.md`](docs/infrastructure/ui/shadcn.md)

## Development Tools

### Code Quality Tools

| Tool | Version | Purpose | Command | Documentation |
|------|---------|---------|---------|--------------|
| **ESLint** | 9.37.0 | Code quality & logic errors | `bun run lint` | [`docs/infrastructure/quality/eslint.md`](docs/infrastructure/quality/eslint.md) |
| **Prettier** | 3.6.2 | Code formatting | `bun run format` | [`docs/infrastructure/quality/prettier.md`](docs/infrastructure/quality/prettier.md) |
| **TypeScript (tsc)** | ^5 | Type checking | `bun run typecheck` | [`docs/infrastructure/language/typescript.md`](docs/infrastructure/language/typescript.md) |
| **Knip** | 5.65.0 | Dead code detection | `bun run clean` | [`docs/infrastructure/quality/knip.md`](docs/infrastructure/quality/knip.md) |

### UI Development Tools

| Tool | Version | Purpose | Command | Documentation |
|------|---------|---------|---------|--------------|
| **React** | 19.2.0 | Component-based UI library | - | [`docs/infrastructure/ui/react.md`](docs/infrastructure/ui/react.md) |
| **React DOM** | 19.2.0 | React rendering for web (SSR & client) | - | [`docs/infrastructure/ui/react.md`](docs/infrastructure/ui/react.md) |
| **TanStack Query** | 5.90.3 | Server-state management and data fetching | - | [`docs/infrastructure/ui/tanstack-query.md`](docs/infrastructure/ui/tanstack-query.md) |
| **TanStack Table** | ^8.20.5 | Headless table library for data tables and data grids | - | [`docs/infrastructure/ui/tanstack-table.md`](docs/infrastructure/ui/tanstack-table.md) |
| **Tailwind CSS** | 4.1.14 | Utility-first CSS framework | `bunx tailwindcss` | [`docs/infrastructure/ui/tailwind.md`](docs/infrastructure/ui/tailwind.md) |
| **shadcn/ui** | N/A | Copy-paste component collection (not npm package) | - | [`docs/infrastructure/ui/shadcn.md`](docs/infrastructure/ui/shadcn.md) |
| **class-variance-authority** | 0.7.1 | Type-safe component variants | - | [`docs/infrastructure/ui/shadcn.md`](docs/infrastructure/ui/shadcn.md) |
| **clsx** | 2.1.1 | Conditional className construction | - | [`docs/infrastructure/ui/shadcn.md`](docs/infrastructure/ui/shadcn.md) |
| **tailwind-merge** | 3.3.1 | Merge Tailwind classes without conflicts | - | [`docs/infrastructure/ui/shadcn.md`](docs/infrastructure/ui/shadcn.md) |
| **lucide-react** | 0.545.0 | Icon library (1000+ icons) | - | [`docs/infrastructure/ui/shadcn.md`](docs/infrastructure/ui/shadcn.md) |
| **PostCSS** | 8.5.6 | CSS processing (Tailwind integration) | `bunx postcss` | - |
| **prettier-plugin-tailwindcss** | 0.7.0 | Auto-sort Tailwind classes | `bun run format` | [`docs/infrastructure/ui/tailwind.md`](docs/infrastructure/ui/tailwind.md) |

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
│   ├── architecture/           # Architecture documentation (FP principles, patterns)
│   └── infrastructure/          # Technical infrastructure documentation
│       ├── runtime/            # Runtime environment (Bun)
│       ├── language/           # Programming language (TypeScript)
│       ├── framework/          # Core frameworks (Effect, Hono, Better Auth)
│       ├── database/           # Database technologies (Drizzle ORM)
│       ├── ui/                 # UI libraries (React, Tailwind CSS, shadcn/ui)
│       ├── quality/            # Code quality tools (ESLint, Prettier, Knip)
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
│   ├── components/
│   │   └── ui/                 # shadcn/ui components (Typography, etc.)
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn, etc.)
│   ├── index.ts                # Entry point
│   └── **/*.test.ts            # Unit tests (co-located with source)
├── tests/
│   └── **/*.spec.ts            # E2E tests (Playwright only)
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config (Bun-optimized, path aliases)
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

// CORRECT - Use path aliases for components
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// INCORRECT - Don't omit extensions
import { something } from './module'  // ❌

// INCORRECT - Don't use relative paths for components
import { Button } from '../../../components/ui/button'  // ❌
```

### UI Component Conventions (shadcn/ui)

**All UI components MUST follow shadcn/ui patterns**:

1. **Component Location**: `src/components/ui/{component-name}.tsx`
2. **Utility Functions**: `src/lib/utils.ts` (for `cn` helper)
3. **Props Interface**: Extend native HTML element props
4. **className Merging**: Always use `cn()` utility from `@/lib/utils`
5. **TypeScript Exports**: Export both component and props interface

**Example Component Structure**:

```typescript
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Props interface extends native HTML props
export interface ComponentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'outline'
}

// Component implementation
export function Component({
  children,
  variant = 'default',
  className,
  ...props
}: ComponentProps) {
  return (
    <div
      className={cn(
        'base-styles', // Base Tailwind classes
        variant === 'outline' && 'outline-styles', // Variant styles
        className // User overrides (must come last)
      )}
      {...props} // Spread remaining HTML attributes
    >
      {children}
    </div>
  )
}
```

**The `cn` Utility Function**:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage: Merges classes and resolves Tailwind conflicts
cn('px-4 py-2', className) // User className overrides base styles
cn('px-4', 'px-8') // Result: 'px-8' (later value wins)
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
- **docs/architecture/**: Architecture decisions and patterns
  - **functional-programming.md**: FP principles, patterns, and best practices
  - **layer-based-architecture.md**: Layered architecture pattern, layer separation, and communication
- **docs/infrastructure/**: Detailed technical documentation organized by category
  - **runtime/**: Runtime environment (Bun)
  - **language/**: Programming language (TypeScript)
  - **framework/**: Core frameworks (Effect, Hono, Better Auth)
  - **database/**: Database technologies (Drizzle ORM)
  - **ui/**: UI libraries and styling (React, Tailwind CSS, shadcn/ui)
  - **quality/**: Code quality tools (ESLint, Prettier, Knip)
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

## Project Architecture

### Functional Programming Principles

Omnera follows Functional Programming (FP) principles throughout the codebase. FP provides the foundation for writing predictable, testable, and maintainable code.

**Core Principles**:
- **Pure Functions** - Deterministic functions without side effects
- **Immutability** - Data structures that cannot be mutated
- **Function Composition** - Building complex operations from simple functions
- **Explicit Effects** - Side effects handled explicitly via Effect.ts
- **Type Safety** - Leveraging TypeScript's strict type system

**Why FP for Omnera**:
- Perfect alignment with Effect.ts architecture
- Improved testability and predictability
- Better concurrent programming safety
- Enhanced code maintainability and readability

**Detailed Documentation**: [`docs/architecture/functional-programming.md`](docs/architecture/functional-programming.md)

### Layer-Based Architecture

Omnera follows a **Layer-Based Architecture** (also known as **Layered Architecture**) that organizes code into four distinct horizontal layers with well-defined responsibilities and clear boundaries.

**Four Layers**:
1. **Presentation Layer (UI/API)** - React components, Hono routes, user interactions
2. **Application Layer (Use Cases)** - Workflow orchestration, Effect programs, business workflows
3. **Domain Layer (Business Logic)** - Pure business rules, domain models, validation (FP principles)
4. **Infrastructure Layer (External)** - Database access, APIs, file system, external services

**Key Principles**:
- **Dependency Direction**: Outer layers depend on inner layers (never reverse)
- **Pure Domain**: Domain Layer contains only pure functions (no side effects)
- **Effect Orchestration**: Application Layer coordinates workflows with Effect.ts
- **Interface Segregation**: Infrastructure implements interfaces defined in Application Layer
- **Type-Safe Boundaries**: TypeScript enforces layer contracts

**Why Layered Architecture**:
- Clear separation of concerns and responsibilities
- Independent development and testing of each layer
- Business logic isolated from UI and infrastructure
- Easy to swap infrastructure implementations
- Perfect alignment with Effect.ts dependency injection

**Detailed Documentation**: [`docs/architecture/layer-based-architecture.md`](docs/architecture/layer-based-architecture.md)

---

_This project was created using `bun init` in Bun v1.3.0_
