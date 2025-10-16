# Omnera

> **⚠️ Early Development**: Omnera is in Phase 1 (Foundation). See [STATUS.md](STATUS.md) for implementation progress and [docs/specifications.md](docs/specifications.md) for the full product vision.

A configuration-driven web application platform built with Bun, Effect, React, and Tailwind CSS.

**Current Version**: 0.0.1 - Minimal web server with React SSR and dynamic CSS compilation

## Prerequisites

- [Bun](https://bun.com) v1.3.0 or higher

### Installing Bun

```bash
# macOS, Linux, WSL
curl -fsSL https://bun.com/install | bash

# Windows (PowerShell)
powershell -c "irm bun.com/install.ps1 | iex"
```

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Run Your First Server

**Option A: Use the template**

```bash
bun run templates/landing-page.ts
```

**Option B: Create your own**

```typescript
// app.ts
import { start } from 'omnera'

const myApp = {
  name: 'My App',
  description: 'A simple Bun application',
}

start(myApp)
```

```bash
bun run app.ts
```

Visit **http://localhost:3000** to see your app running!

### 3. Customize Configuration

```typescript
import { start } from 'omnera'

start(myApp, {
  port: 8080, // Custom port (default: 3000)
  hostname: '0.0.0.0', // Custom hostname (default: localhost)
})
```

## What's Included

**Current Features (v0.0.1):**

- ✅ **Bun Runtime** - Fast TypeScript execution without compilation
- ✅ **Web Server** - Hono-based server with automatic lifecycle management
- ✅ **React SSR** - Server-side rendering with React 19
- ✅ **Tailwind CSS** - Auto-compilation with PostCSS (no build step)
- ✅ **Type Safety** - Effect Schema validation for configuration
- ✅ **Graceful Shutdown** - Automatic SIGINT/SIGTERM handling

**Coming Soon** (see [STATUS.md](STATUS.md)):

- 📋 Database integration (PostgreSQL + Drizzle ORM)
- 📋 Authentication (Better Auth)
- 📋 Dynamic routing
- 📋 CRUD operations
- 📋 Admin dashboards
- 📋 And much more...

## Core Stack

| Technology       | Version | Purpose                           |
| ---------------- | ------- | --------------------------------- |
| **Bun**          | 1.3.0   | Runtime & package manager         |
| **TypeScript**   | ^5      | Type-safe language                |
| **Effect**       | 3.18.4  | Functional programming (internal) |
| **Hono**         | 4.9.12  | Web framework                     |
| **React**        | 19.2.0  | UI library (SSR)                  |
| **Tailwind CSS** | 4.1.14  | Styling                           |

Full stack details in [CLAUDE.md](CLAUDE.md#core-stack)

## Development

### Common Commands

```bash
# Development
bun install                      # Install dependencies
bun run templates/landing-page.ts # Run example

# Code Quality
bun run lint                     # Run ESLint
bun run format                   # Run Prettier
bun run typecheck                # TypeScript check

# Testing
bun test                         # Unit tests
bun test:e2e                     # E2E tests (Playwright)
bun test --watch                 # Watch mode

# Watch Mode
bun --watch src/index.ts         # Auto-reload on changes
```

## Project Structure

```
omnera-v2/
├── docs/                           # Detailed documentation
│   ├── specifications.md           # Product vision & roadmap
│   ├── architecture/               # Architecture patterns
│   └── infrastructure/             # Tech stack docs
├── src/
│   ├── index.ts                    # Main entry point
│   ├── application/                # Use cases (Effect programs)
│   ├── domain/                     # Business logic (pure functions)
│   ├── infrastructure/             # External services
│   └── presentation/               # UI components & routes
├── templates/                      # Example applications
│   └── landing-page.ts             # Minimal landing page template
├── tests/                          # E2E tests (Playwright)
├── STATUS.md                       # Implementation progress tracker
├── CLAUDE.md                       # Technical documentation
└── README.md                       # This file
```

## Documentation

| Document                                             | Purpose                                    |
| ---------------------------------------------------- | ------------------------------------------ |
| **[README.md](README.md)**                           | Quick start guide (you are here)           |
| **[STATUS.md](STATUS.md)**                           | Current implementation status & roadmap    |
| **[CLAUDE.md](CLAUDE.md)**                           | Technical documentation & coding standards |
| **[docs/specifications.md](docs/specifications.md)** | Product vision & future features           |

## Why Bun?

Omnera uses **Bun** instead of Node.js:

- ⚡ **Native TypeScript** - Execute `.ts` files directly, no compilation needed
- 🚀 **4x Faster** - Cold starts and package installs
- 🛠️ **All-in-One** - Runtime, package manager, test runner, bundler
- 🎯 **Better DX** - Built-in watch mode, faster feedback loops

**Important**: This is a Bun-only project. Do not use `node`, `npm`, `yarn`, or `pnpm`.

## Contributing

### Commit Message Format

This project uses **[Conventional Commits](https://www.conventionalcommits.org/)** for automated versioning:

```bash
feat(tables): add CRUD operations       # Minor version bump (0.X.0)
fix(server): resolve port binding       # Patch version bump (0.0.X)
docs(readme): update installation       # No version bump
feat!: redesign configuration API       # Major version bump (X.0.0)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

See [CLAUDE.md](CLAUDE.md#commit-messages-conventional-commits---required) for full guidelines.

### Development Workflow

1. **Fork & Clone** - Create your feature branch
2. **Code** - Follow coding standards in [CLAUDE.md](CLAUDE.md)
3. **Test** - Run `bun run lint && bun run typecheck && bun test`
4. **Commit** - Use conventional commits
5. **Push** - Create a pull request

Releases are **fully automated** via GitHub Actions and semantic-release.

## License

**Business Source License 1.1 (BSL-1.1)**

✅ **Free for**:

- Development and testing
- Personal projects
- Internal business use

❌ **Not allowed**:

- Offering Omnera as a managed service/SaaS to third parties

See [LICENSE.md](LICENSE.md) for full details.

---

**Questions or feedback?** Open an issue on [GitHub](https://github.com/omnera/omnera) or check the [documentation](docs/specifications.md).
