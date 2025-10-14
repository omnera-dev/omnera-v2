# Omnera V2

A modern TypeScript project built with Bun - the all-in-one JavaScript runtime.

## Prerequisites

- [Bun](https://bun.com) v1.3.0 or higher

### Installing Bun

```bash
# macOS, Linux, WSL
curl -fsSL https://bun.com/install | bash

# Windows (PowerShell)
powershell -c "irm bun.com/install.ps1 | iex"
```

## Getting Started

### Install Dependencies

```bash
bun install
```

### Run the Application

```bash
bun run src/index.ts
```

### Run Tests

```bash
# Run all tests
bun test

# Watch mode for development
bun test --watch

# With coverage
bun test --coverage
```

## Development

### Adding Dependencies

```bash
# Add runtime dependency
bun add package-name

# Add dev dependency
bun add -d package-name
```

### Running in Watch Mode

```bash
bun --watch src/index.ts
```

### Type Checking

```bash
bunx tsc --noEmit
```

## Project Structure

```
omnera-v2/
├── src/
│   └── index.ts           # Application entry point
├── tests/                 # E2E tests (Playwright)
├── scripts/               # Build and release scripts
├── .github/workflows/     # CI/CD workflows
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration (Bun-optimized)
├── playwright.config.ts   # Playwright E2E test configuration
├── eslint.config.ts       # ESLint configuration
├── .releaserc.json        # Semantic-release configuration
├── CHANGELOG.md          # Auto-generated changelog
├── LICENSE.md            # BSL 1.1 license
├── README.md            # This file
└── CLAUDE.md            # Detailed technical documentation
```

## Why Bun?

This project uses Bun instead of Node.js for:

- **Native TypeScript** - Direct execution without compilation
- **Speed** - 4x faster cold starts than Node.js
- **Unified Tooling** - Runtime, package manager, and test runner in one
- **Modern JavaScript** - Latest features by default
- **Developer Experience** - Faster installs, built-in watch mode

## Important Notes

⚠️ **This is a Bun project** - Do not use:

- `node`, `npm`, `yarn`, or `pnpm` commands
- `npx` (use `bunx` instead)
- `ts-node` or `nodemon` (Bun handles these natively)

## Documentation

For detailed technical documentation, infrastructure details, and coding standards, see [CLAUDE.md](/Users/thomasjeanneau/Codes/omnera-v2/CLAUDE.md).

## Contributing

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

Format: `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature (triggers minor version bump)
- `fix`: Bug fix (triggers patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `ci`: CI configuration changes

**Examples:**
```bash
feat(api): add user authentication endpoint
fix(database): resolve connection timeout issue
docs(readme): update installation instructions
```

**Breaking Changes:**
Add `BREAKING CHANGE:` in the commit body or add `!` after type to trigger major version bump:
```bash
feat!: redesign API structure

BREAKING CHANGE: endpoints now use /v2/ prefix
```

### Release Process

Releases are automated via GitHub Actions:
1. Push commits to `main` branch using conventional commit format
2. CI runs tests and quality checks
3. semantic-release analyzes commits and determines version bump
4. Updates CHANGELOG.md, package.json, and LICENSE.md
5. Publishes to npm registry
6. Creates GitHub release with release notes

## License

Omnera is licensed under the Business Source License 1.1.

- **Non-production use**: Free for development, testing, and personal projects
- **Production use**: Allowed for internal business use
- **Not allowed**: Offering Omnera as a managed service or SaaS to third parties

See [LICENSE.md](LICENSE) for full details.

---

_This project was created using `bun init` in Bun v1.3.0_
