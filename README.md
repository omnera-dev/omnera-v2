# Omnera™

> **⚠️ Early Development**: Omnera is in Phase 0 (Foundation). See [ROADMAP.md](ROADMAP.md) for implementation progress and [docs/specifications/vision.md](docs/specifications/vision.md) for the full product vision.

A configuration-driven web application platform built with Bun, Effect, React, and Tailwind CSS.

**Note**: Omnera™ is a trademark of ESSENTIAL SERVICES. See [TRADEMARK.md](TRADEMARK.md) for trademark usage guidelines.

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

**Coming Soon** (see [ROADMAP.md](ROADMAP.md)):

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
| **Hono**         | 4.10.3  | Web framework                     |
| **React**        | 19.2.0  | UI library (SSR)                  |
| **Tailwind CSS** | 4.1.16  | Styling                           |

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
bun test:unit                    # Unit tests
bun test:e2e                     # E2E tests (Playwright)
bun test:unit:watch              # Unit tests in watch mode

# Watch Mode
bun --watch src/index.ts         # Auto-reload on changes
```

## Project Structure

```
omnera-v2/
├── docs/                           # Detailed documentation
│   ├── specifications/             # Product vision
│   ├── architecture/               # Architecture patterns
│   ├── development/                # Development workflows
│   └── infrastructure/             # Tech stack docs
├── src/                            # Layer-based architecture
│   ├── index.ts                    # Main entry point
│   ├── domain/                     # Domain Layer - Pure business logic
│   ├── application/                # Application Layer - Use cases
│   ├── infrastructure/             # Infrastructure Layer - External services
│   └── presentation/               # Presentation Layer - UI & API routes
├── scripts/                        # Build & utility scripts (TypeScript)
├── templates/                      # Example applications
│   └── landing-page.ts             # Minimal landing page template
├── specs/                          # E2E tests (Playwright)
├── ROADMAP.md                      # Implementation progress tracker
├── CLAUDE.md                       # Technical documentation (for AI/developers)
└── README.md                       # This file (for humans on GitHub)
```

## Documentation

> **Note**: This README uses standard markdown links for GitHub rendering. Developers working with Claude Code should reference [CLAUDE.md](CLAUDE.md), which uses `@docs/` syntax optimized for AI-assisted development.

### Quick Reference

| Document                                                           | Purpose                                    |
| ------------------------------------------------------------------ | ------------------------------------------ |
| **[README.md](README.md)**                                         | Quick start guide (you are here)           |
| **[ROADMAP.md](ROADMAP.md)**                                       | Current implementation status & roadmap    |
| **[CLAUDE.md](CLAUDE.md)**                                         | Technical documentation & coding standards |
| **[docs/specifications/vision.md](docs/specifications/vision.md)** | Product vision & future features           |

### Detailed Documentation

For comprehensive documentation on architecture, infrastructure, and development workflows, explore the `docs/` directory:

- **[docs/specifications/](docs/specifications/)** - Product vision and roadmap
- **[docs/architecture/](docs/architecture/)** - Architecture patterns and principles
- **[docs/infrastructure/](docs/infrastructure/)** - Technology stack documentation
- **[docs/development/](docs/development/)** - Development workflows and agent collaboration

All detailed documentation is imported on-demand when needed (see [CLAUDE.md](CLAUDE.md) for the complete reference).

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

[![License: BSL-1.1](https://img.shields.io/badge/License-BSL--1.1-blue.svg)](LICENSE.md)
[![Source Available](https://img.shields.io/badge/Source-Available-green.svg)](https://github.com/omnera-dev/omnera-v2)

**Business Source License 1.1 (BSL 1.1)**

Omnera is **source-available** under the Business Source License 1.1. The source code is public, and you are free to use, modify, and redistribute it with some restrictions.

✅ **Free for**:

- Personal projects and educational purposes
- Internal business operations and tools
- Non-competing client deployments
- Development, testing, and contributing

❌ **Commercial license required for**:

- Offering Omnera as a hosted/managed service to third parties
- Providing Omnera SaaS where it's the primary value
- Competitive use cases (contact us for licensing)

🕐 **Becomes Open Source**: On **January 1, 2029**, Omnera automatically converts to **Apache License 2.0** with no restrictions.

📧 **Commercial Licensing**: For competitive SaaS/hosting use cases, contact **license@omnera.dev**

See [LICENSE.md](LICENSE.md) for full BSL 1.1 terms and [TRADEMARK.md](TRADEMARK.md) for trademark usage.

**Copyright**: © 2025 ESSENTIAL SERVICES
**Trademark**: Omnera™ is a trademark of ESSENTIAL SERVICES

---

**Questions or feedback?** Open an issue on [GitHub](https://github.com/omnera-dev/omnera-v2) or check the [documentation](docs/specifications/vision.md).
