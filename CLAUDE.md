# CLAUDE.md - Omnera™ Project Documentation

> **Note**: This is a streamlined version. Detailed documentation is available in `docs/` directory and imported on-demand when needed.

## Project Context

**Vision**: Omnera™ aims to be a configuration-driven application platform (see `@docs/specifications/vision.md` for full vision)
**Current Status**: Phase 0 - Foundation (minimal schema with metadata only)
**Implementation Progress**: See `ROADMAP.md` for detailed feature tracking and development phases

> 💡 When writing code or tests, keep the target architecture in mind (vision.md) while working within current capabilities (ROADMAP.md)

## Quick Reference

**Project**: Omnera™ (npm package: "omnera")
**Legal Entity**: ESSENTIAL SERVICES (copyright holder & trademark owner)
**Version**: 0.0.1 (managed by semantic-release)
**License**: Sustainable Use License v1.0 (SUL-1.0)
**Runtime**: Bun 1.3.0 (NOT Node.js)
**Entry Points**:
- Library: `src/index.ts` (module import)
- CLI: `src/cli.ts` (binary executable via `bun run start` or `omnera` command)

## Core Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Bun** | 1.3.0 | Runtime & package manager |
| **TypeScript** | ^5 | Type-safe language |
| **Effect** | 3.18.4 | Functional programming, DI, error handling |
| **Hono** | 4.10.1 | Web framework (API routes) |
| **Zod** | 4.1.12 | Client-side validation (React Hook Form) |
| **Better Auth** | 1.3.27 | Authentication |
| **Drizzle ORM** | ^0.44.6 | Database (PostgreSQL via bun:sql) |
| **React** | 19.2.0 | UI library |
| **Tailwind CSS** | 4.1.14 | Styling |
| **shadcn/ui** | N/A | Component collection (copy-paste, not npm) |
| **TanStack Query** | 5.90.5 | Server state management |
| **TanStack Table** | ^8.21.3 | Data tables |

## Essential Commands

```bash
# Development
bun install                 # Install dependencies
bun run start               # Run application via CLI (src/cli.ts)
bun run src/index.ts        # Run application directly (alternative)

# Scripts (TypeScript utilities)
bun run scripts/export-schema.ts  # Run a specific script
bun run export:schema              # Export schema to JSON file
bun test:unit                      # Test all unit tests (src/ and scripts/)

# Database (Drizzle ORM)
bun run db:generate         # Generate migration from schema changes
bun run db:migrate          # Apply migrations to database
bun run db:push             # Push schema changes directly (dev only)
bun run db:studio           # Launch Drizzle Studio (database GUI)
bun run db:check            # Check migration status
bun run db:drop             # Drop migration

# Code Quality (pre-commit)
bun run license             # Add copyright headers to all source files
bun run lint                # ESLint (check)
bun run lint:fix            # ESLint (auto-fix)
bun run format              # Prettier (format all files)
bun run format:check        # Prettier (check formatting without modifying)
bun run typecheck           # TypeScript type checking
bun run clean               # Knip (detect unused code/dependencies)
bun run clean:fix           # Knip (auto-fix unused exports)
bun test:unit               # Unit tests (Bun Test - src/ and scripts/)
bun test:unit:watch         # Unit tests in watch mode
bun test:e2e                # E2E tests (Playwright - all)
bun test:e2e:spec           # E2E spec tests (@spec tag)
bun test:e2e:critical       # E2E critical tests (@critical tag)
bun test:e2e:regression     # E2E regression tests (@regression tag)
bun test:e2e:dev            # E2E dev subset (@spec + @critical)
bun test:e2e:ci             # E2E CI subset (@regression + @critical)
bun test:e2e:ui             # E2E tests with Playwright UI
bun test:all                # All tests (unit + E2E)

# Release (manual via GitHub Actions)
git commit -m "release: publish"   # Explicit release commit
git push origin main               # Triggers release ONLY with "release:" type

# Agent Workflows (TDD Pipeline)
# See: @docs/development/agent-workflows.md for complete agent collaboration guide
```

## Coding Standards (Critical Rules)

### Code Formatting (Prettier - `.prettierrc.json`)
- **No semicolons** (`semi: false`)
- **Single quotes** (`singleQuote: true`)
- **100 char line width** (`printWidth: 100`)
- **2-space indent** (`tabWidth: 2`)
- **Trailing commas** (`trailingComma: "es5"`)
- **One attribute per line** (`singleAttributePerLine: true`)

### Copyright Headers (REQUIRED for all .ts/.tsx files)
- **All source files** (src/, scripts/, tests/) MUST include copyright header
- **Header format**:
```typescript
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */
```
- **When creating new files**: Run `bun run license` after creating files to add headers
- **For agents**: ALWAYS run `bun run license` after creating new .ts/.tsx files

### Module System
- **Always ES Modules** (NOT CommonJS)
- **Omit file extensions** in imports (extensionless)
- **Use path aliases** for components (`@/components/ui/button`)

### UI Components (shadcn/ui Pattern)
- **Location**: `src/components/ui/{component-name}.tsx`
- **Props**: Extend native HTML element props
- **className merging**: Always use `cn()` from `@/lib/utils`
- **Exports**: Export both component and props interface

### Commit Messages (Conventional Commits - REQUIRED)
- `release:` → Publish new version (patch bump 0.0.X) - **ONLY this triggers releases**
- `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:` → No version bump

## Architecture Principles

### Layer-Based Architecture (4 Layers)
1. **Presentation** (UI/API) - React components, Hono routes
2. **Application** (Use Cases) - Effect programs, workflow orchestration
3. **Domain** (Business Logic) - Pure functions, validation, models
4. **Infrastructure** (External) - Database, APIs, file system

**Dependency Direction**: Outer → Inner (Presentation → Application → Domain ← Infrastructure)

### Functional Programming (Core Principles)
1. **DRY (Don't Repeat Yourself)** - Single source of truth for all logic
2. **Pure Functions** - No side effects in Domain layer
3. **Immutability** - Use `readonly`, never mutate
4. **Explicit Effects** - Use Effect.ts for side effects
5. **Composition** - Build complex from simple functions
6. **Type Safety** - Strict TypeScript, Effect error types

**Enforcement**: FP patterns automatically enforced via ESLint (`eslint-plugin-functional`). See `@docs/infrastructure/quality/eslint.md#functional-programming-enforcement`

**Layer Enforcement**: Layer-based architecture (domain/, application/, infrastructure/, presentation/) is actively enforced via `eslint-plugin-boundaries`. See `@docs/architecture/layer-based-architecture.md#enforcement` for details.

## File Structure

```
omnera-v2/
├── docs/                        # Detailed documentation (import on-demand)
│   ├── infrastructure/          # Tech stack docs
│   └── architecture/            # Architecture patterns
├── scripts/                     # Build & utility scripts (TypeScript, run by Bun)
│   ├── **/*.ts                  # TypeScript scripts (executable with Bun)
│   └── **/*.test.ts             # Script unit tests (co-located)
├── src/                         # Layer-based architecture (see @docs/architecture/layer-based-architecture.md)
│   ├── domain/                  # Domain Layer - Pure business logic
│   ├── application/             # Application Layer - Use cases, orchestration
│   ├── infrastructure/          # Infrastructure Layer - External services, I/O
│   ├── presentation/            # Presentation Layer - UI components, API routes
│   ├── index.ts                 # Entry point
│   └── **/*.test.ts             # Unit tests (co-located)
├── tests/**/*.spec.ts           # E2E tests (Playwright)
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── eslint.config.ts
└── CLAUDE.md                    # This file
```

## Detailed Documentation (On-Demand Import)

> **Note on Documentation Links**: This document uses `@docs/` syntax optimized for Claude Code AI consumption. This is **NOT a TypeScript path alias** (only `@/*` is configured in tsconfig.json). Human developers should interpret `@docs/` as the `docs/` directory in the project root. Example: `@docs/infrastructure/runtime/bun.md` → `docs/infrastructure/runtime/bun.md`

**When you need specific details, import the relevant documentation file:**

### Product Vision & Roadmap
- `@docs/specifications/vision.md` - Target state and product vision (future capabilities)
- `@ROADMAP.md` - Implementation roadmap with phases and current development status

### Schema Architecture
- `@docs/specifications/effect-schema-translatorure.md` - Multi-file JSON Schema structure with $ref, validation tools, and best practices
- `@docs/specifications/specs.schema.json` - Root schema (orchestrator with $ref to feature schemas)
- `@docs/specifications/triple-documentation-pattern.md` - Schema documentation pattern (What/Why/Who-When)

### Infrastructure
- `@docs/infrastructure/runtime/bun.md` - Bun runtime & package manager
- `@docs/infrastructure/language/typescript.md` - TypeScript configuration
- `@docs/infrastructure/framework/effect.md` - Effect.ts patterns
- `@docs/infrastructure/framework/hono.md` - Hono web framework
- `@docs/infrastructure/framework/better-auth.md` - Authentication
- `@docs/infrastructure/database/drizzle.md` - Drizzle ORM
- `@docs/infrastructure/ui/react.md` - React 19 patterns
- `@docs/infrastructure/ui/react-hook-form.md` - Form management (client-side, Zod validation)
- `@docs/infrastructure/ui/radix-ui.md` - Accessible UI primitives (shadcn/ui foundation)
- `@docs/infrastructure/ui/tailwind.md` - Tailwind CSS
- `@docs/infrastructure/ui/shadcn.md` - shadcn/ui components
- `@docs/infrastructure/ui/tanstack-query.md` - TanStack Query
- `@docs/infrastructure/ui/tanstack-table.md` - TanStack Table
- `@docs/infrastructure/utility/date-fns.md` - Date utilities (client-side, date-picker)
- `@docs/infrastructure/quality/eslint.md` - ESLint linting
- `@docs/infrastructure/quality/prettier.md` - Prettier formatting
- `@docs/infrastructure/quality/knip.md` - Dead code detection
- `@docs/infrastructure/testing/bun-test.md` - Unit testing
- `@docs/infrastructure/testing/playwright.md` - E2E testing
- `@docs/infrastructure/cicd/workflows.md` - GitHub Actions
- `@docs/infrastructure/release/semantic-release.md` - Automated releases

### Architecture
- `@docs/architecture/functional-programming.md` - FP principles
- `@docs/architecture/layer-based-architecture.md` - Layered architecture
- `@docs/architecture/naming-conventions.md` - Comprehensive naming conventions (files, variables, functions, classes, types)
- `@docs/architecture/file-naming-conventions.md` - Detailed file naming guide
- `@docs/architecture/api-conventions.md` - Convention-based API routing
- `@docs/architecture/testing-strategy.md` - F.I.R.S.T principles
- `@docs/architecture/performance-optimization.md` - Performance patterns
- `@docs/architecture/security-best-practices.md` - Security guidelines

### Development Workflows
- `@docs/development/agent-workflows.md` - Complete TDD pipeline and agent collaboration guide

**Example**: When working with authentication, import:
```
@docs/infrastructure/framework/better-auth.md
```

## Development Workflow

1. **Write code** following standards above
2. **Test locally**: `bun run lint && bun run format && bun run typecheck && bun test:unit`
3. **Commit**: Use conventional commits (`feat:`, `fix:`, etc.) for regular work
4. **Push**: GitHub Actions runs tests
5. **Release**: When ready to publish, use `git commit -m "release: publish"` and push

## Key Differences from Typical Stacks

- ❌ **NOT Node.js** - Use Bun exclusively
- ❌ **NOT npm/yarn/pnpm** - Use Bun package manager
- ❌ **NOT CommonJS** - ES Modules only
- ❌ **NOT manual memoization** - React 19 Compiler handles it
- ❌ **NOT npm package for shadcn/ui** - Copy components directly
- ✅ **DO use TypeScript directly** - Bun executes .ts files natively
- ✅ **DO use Effect.gen** - Application layer workflows
- ✅ **DO use path aliases** - `@/components/ui/button`
- ✅ **DO validate inputs** - Client: Zod (React Hook Form), Server: Effect Schema
- ✅ **DO use correct date library** - Client: date-fns (date-picker), Server: Effect.DateTime

---

**License & Trademarks**

**License**: Sustainable Use License v1.0 (Fair-Code)
- **Copyright**: ESSENTIAL SERVICES (legal entity, owns the code)
- **Trademark**: Omnera™ is a trademark of ESSENTIAL SERVICES (registered in France)
- **Free for**: Personal use, internal business purposes, non-commercial distribution
- **NOT allowed**: Commercial SaaS/managed services to third parties without license
- **Commercial licensing**: Contact license@omnera.dev for commercial use cases
- **Philosophy**: Fair-code (source-available, commercially restricted, community-friendly)
- See `LICENSE.md` for license terms and `TRADEMARK.md` for trademark usage guidelines
