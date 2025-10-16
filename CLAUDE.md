# CLAUDE.md - Omnera Project Documentation

> **Note**: This is a streamlined version. Detailed documentation is available in `docs/` directory and imported on-demand when needed.

## Quick Reference

**Project**: Omnera (npm package: "omnera")
**Version**: 0.0.1 (managed by semantic-release)
**License**: BSL-1.1
**Runtime**: Bun 1.3.0 (NOT Node.js)
**Entry Point**: src/index.ts

## Core Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Bun** | 1.3.0 | Runtime & package manager |
| **TypeScript** | ^5 | Type-safe language |
| **Effect** | 3.18.4 | Functional programming, DI, error handling |
| **Hono** | 4.9.12 | Web framework (API routes) |
| **Better Auth** | 1.3.27 | Authentication |
| **Drizzle ORM** | ^0.44.6 | Database (PostgreSQL via bun:sql) |
| **React** | 19.2.0 | UI library |
| **Tailwind CSS** | 4.1.14 | Styling |
| **shadcn/ui** | N/A | Component collection (copy-paste, not npm) |
| **TanStack Query** | 5.90.3 | Server state management |
| **TanStack Table** | ^8.21.3 | Data tables |

## Essential Commands

```bash
# Development
bun install                 # Install dependencies
bun run src/index.ts        # Run application

# Code Quality (pre-commit)
bun run lint                # ESLint
bun run format              # Prettier
bun run typecheck           # TypeScript
bun test                    # Unit tests (Bun Test)
bun test:e2e                # E2E tests (Playwright)
bun test:all                # All tests

# Release (automated via GitHub Actions)
git commit -m "feat: add feature"  # Conventional commit
git push origin main               # Triggers release if feat/fix
```

## Coding Standards (Critical Rules)

### Code Formatting (Prettier - `.prettierrc.json`)
- **No semicolons** (`semi: false`)
- **Single quotes** (`singleQuote: true`)
- **100 char line width** (`printWidth: 100`)
- **2-space indent** (`tabWidth: 2`)
- **Trailing commas** (`trailingComma: "es5"`)
- **One attribute per line** (`singleAttributePerLine: true`)

### Module System
- **Always ES Modules** (NOT CommonJS)
- **Include .ts extensions** in imports
- **Use path aliases** for components (`@/components/ui/button`)

### UI Components (shadcn/ui Pattern)
- **Location**: `src/components/ui/{component-name}.tsx`
- **Props**: Extend native HTML element props
- **className merging**: Always use `cn()` from `@/lib/utils`
- **Exports**: Export both component and props interface

### Commit Messages (Conventional Commits - REQUIRED)
- `feat:` → Minor version bump (0.X.0)
- `fix:` → Patch version bump (0.0.X)
- `feat!:` or `BREAKING CHANGE:` → Major version bump (X.0.0)
- `docs:`, `style:`, `refactor:`, `test:`, `chore:` → No version bump

## Architecture Principles

### Layer-Based Architecture (4 Layers)
1. **Presentation** (UI/API) - React components, Hono routes
2. **Application** (Use Cases) - Effect programs, workflow orchestration
3. **Domain** (Business Logic) - Pure functions, validation, models
4. **Infrastructure** (External) - Database, APIs, file system

**Dependency Direction**: Outer → Inner (Presentation → Application → Domain ← Infrastructure)

### Functional Programming (Core Principles)
1. **Pure Functions** - No side effects in Domain layer
2. **Immutability** - Use `readonly`, never mutate
3. **Explicit Effects** - Use Effect.ts for side effects
4. **Composition** - Build complex from simple functions
5. **Type Safety** - Strict TypeScript, Effect error types

**Enforcement**: FP patterns automatically enforced via ESLint (`eslint-plugin-functional`). See `@docs/infrastructure/quality/eslint.md#functional-programming-enforcement`

**Note**: Layer-based architecture (domain/, application/, infrastructure/, presentation/) is aspirational - current codebase uses flat structure. See `@docs/architecture/layer-based-architecture.md#enforcement` for details.

## File Structure

```
omnera-v2/
├── docs/                        # Detailed documentation (import on-demand)
│   ├── infrastructure/          # Tech stack docs
│   └── architecture/            # Architecture patterns
├── src/
│   ├── components/ui/           # shadcn/ui components
│   ├── lib/utils.ts             # Utilities (cn helper)
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

**When you need specific details, import the relevant documentation file:**

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
- `@docs/architecture/testing-strategy.md` - F.I.R.S.T principles
- `@docs/architecture/performance-optimization.md` - Performance patterns
- `@docs/architecture/security-best-practices.md` - Security guidelines

**Example**: When working with authentication, import:
```
@docs/infrastructure/framework/better-auth.md
```

## Development Workflow

1. **Write code** following standards above
2. **Test locally**: `bun run lint && bun run format && bun run typecheck && bun test`
3. **Commit**: Use conventional commits (`feat:`, `fix:`, etc.)
4. **Push**: GitHub Actions runs tests and creates release if needed

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

**License**: Business Source License 1.1 (BSL-1.1)
- Free for development, testing, personal projects
- Production use allowed for internal business use
- NOT allowed: Offering Omnera as managed service/SaaS to third parties
