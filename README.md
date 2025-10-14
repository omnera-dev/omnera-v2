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
bun run index.ts
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
bun --watch index.ts
```

### Type Checking

```bash
bunx tsc --noEmit
```

## Project Structure

```
omnera-v2/
├── index.ts           # Application entry point
├── package.json       # Project configuration
├── tsconfig.json      # TypeScript configuration (Bun-optimized)
├── bun.lock          # Lock file (binary format)
├── README.md         # This file
└── CLAUDE.md         # Detailed technical documentation
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

## License

Omnera is licensed under the Business Source License 1.1.

- **Non-production use**: Free for development, testing, and personal projects
- **Production use**: Allowed for internal business use
- **Not allowed**: Offering Omnera as a managed service or SaaS to third parties
- **Converts to**: Apache License 2.0 on October 14, 2029

See [LICENSE.md](LICENSE) for full details.

---

*This project was created using `bun init` in Bun v1.3.0*
