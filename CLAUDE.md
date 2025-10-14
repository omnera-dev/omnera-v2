# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Runtime & Package Manager

This project uses **Bun** exclusively as the runtime, package manager, and test runner.

- **Install dependencies**: `bun install`
- **Run the application**: `bun run index.ts`
- **Run tests**: `bun test` (runs all tests with Bun's built-in test runner)
- **Run specific test file**: `bun test path/to/file.test.ts`
- **Run tests in watch mode**: `bun test --watch`

**Important**: Do NOT use npm, yarn, pnpm, node, or vite commands. Always use `bun` for all package management, script execution, and testing tasks.

## TypeScript Configuration

The project uses strict TypeScript settings optimized for Bun:
- Module system: ES modules with `"module": "Preserve"` and `"moduleResolution": "bundler"`
- JSX: Configured for React with `"jsx": "react-jsx"`
- Strict mode enabled with additional safety flags like `noUncheckedIndexedAccess` and `noImplicitOverride`
- TypeScript import extensions are allowed (`allowImportingTsExtensions: true`)

## Project Structure

This is a minimal Bun + TypeScript project currently in early setup phase:
- Entry point: `index.ts`
- No defined folder structure yet for larger application code
- Project is configured for React JSX support in tsconfig.json
