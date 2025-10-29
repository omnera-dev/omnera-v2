# Bun Test Runner (Unit Tests)

## Overview

**Purpose**: Built-in fast test runner for unit testing isolated functions, classes, and utilities. Bun Test runs unit tests, while Playwright handles end-to-end (E2E) tests.

## Test File Patterns (Unit Tests)

- `*.test.ts`, `*.test.tsx`
- `*.spec.ts`, `*.spec.tsx` (outside `tests/` directory)
- `*_test.ts`, `*_test.tsx`
- Files in `__tests__` directories

## IMPORTANT: Test File Location

- **Unit Tests (Bun)**: Place `*.test.ts` or `*.spec.ts` files alongside source code (e.g., `src/utils.test.ts`)
- **E2E Tests (Playwright)**: Place `*.spec.ts` files in `tests/` directory (e.g., `tests/login.spec.ts`)
- **Script Tests (Bun)**: Place `*.test.ts` files alongside scripts (e.g., `scripts/export-schema.test.ts`)

## Test File Naming Convention

**Recommended convention for clarity and consistency**:

| Test Type        | Extension  | Location               | Example                         |
| ---------------- | ---------- | ---------------------- | ------------------------------- |
| **Unit Tests**   | `.test.ts` | Co-located with source | `src/calculator.test.ts`        |
| **Script Tests** | `.test.ts` | Co-located with script | `scripts/export-schema.test.ts` |
| **E2E Tests**    | `.spec.ts` | `tests/` directory     | `tests/login.spec.ts`           |

**Why this convention**:

- **Clear Separation**: `.test.ts` = unit, `.spec.ts` = E2E (visual distinction)
- **Tool Compatibility**: Bun recognizes both, Playwright defaults to `.spec.ts`
- **Industry Standard**: Matches patterns used by Jest, Vitest, Playwright
- **Searchability**: Easy to find all unit tests (`**/*.test.ts`) or E2E tests (`tests/**/*.spec.ts`)

**Alternative (also valid)**:
You can use `.spec.ts` for both unit and E2E tests, relying on location for distinction:

- Unit: `src/calculator.spec.ts` (co-located)
- E2E: `tests/login.spec.ts` (in tests/ directory)

## Test Commands

### ⚠️ CRITICAL: Unit Test Command Requirements

**DO NOT use `bun test` without directory filters** - It will incorrectly discover Playwright E2E spec files (`.spec.ts` in `specs/` directory) which causes errors because Bun's test runner is incompatible with Playwright's API.

**✅ CORRECT - Use npm script with directory filters:**
```bash
bun test:unit                        # Runs unit tests in src/ and scripts/ only
bun test:unit:watch                  # Watch mode for unit tests
CLAUDECODE=1 bun test:unit           # AI-optimized output (failures only)
```

**❌ WRONG - Raw `bun test` discovers ALL test files:**
```bash
bun test                             # ❌ Discovers specs/**/*.spec.ts (Playwright files)
                                     # ❌ Causes: "test.describe is not a function"
```

**Why this happens**: Bun's test runner auto-discovers ALL `.test.ts` AND `.spec.ts` files in the project, regardless of `bunfig.toml` exclude patterns (known limitation in Bun 1.3.0). Playwright E2E tests use `.spec.ts` extension and Playwright's test API, which is incompatible with Bun's test runner.

**When raw `bun test` IS safe** (specific file/directory):
```bash
bun test src/calculator.test.ts      # ✅ Specific file
bun test src/                        # ✅ Specific directory
bun test scripts/                    # ✅ Specific directory
bun test --concurrent src/ scripts/  # ✅ Multiple directories (same as test:unit)
```

### Native Command vs Script Wrapper

`bun test` is a **native Bun command** that directly invokes Bun's built-in test runner. However, **always use the `bun test:unit` script wrapper** to ensure correct directory filtering.

**Additional commands:**
```bash
# Coverage
bun test:unit:coverage               # Generate coverage report

# Filtering by test name
bun test --grep "pattern" src/       # Must specify directory when filtering

# Bail on first failure (built into test:unit via check-quality.ts)
bun test --bail src/ scripts/

# Timeout
bun test --timeout 5000 src/         # 5 seconds (must specify directory)
```

## AI-Assisted Development Optimization

### Recommended Command for AI Workflows

**For Claude Code (AI-assisted development)**:

```bash
CLAUDECODE=1 bun test:unit
```

**For humans (manual testing)**:

```bash
bun test:unit
```

These commands use a package.json script that automatically runs tests in both `src/` and `scripts/` directories with optimized flags (`--concurrent` for parallel execution).

**Why use a script instead of raw `bun test`?**

1. **Prevents Playwright conflicts** - Raw `bun test` discovers `.spec.ts` files in `specs/` directory, causing errors
2. **Directory filtering required** - Must explicitly specify `src/` and `scripts/` directories
3. **Consistent behavior** - Same command works everywhere (development, CI/CD)
4. **Future-proof** - Easy to update flags globally without changing every command
5. **Known Bun limitation** - `bunfig.toml` exclude patterns don't work in Bun 1.3.0

### `--concurrent` Flag

**Purpose**: Run all tests concurrently within their respective files for maximum speed.

**Behavior**:

- Tests within each file execute in parallel
- Dramatically reduces total test execution time
- Safe for independent unit tests (no shared state)
- Maintains test isolation within files

**Example**:

```bash
# Sequential (default) - manual command
bun test src/ scripts/              # ~5 seconds for 50 tests

# Concurrent - manual command
bun test --concurrent src/ scripts/ # ~1.5 seconds for 50 tests

# With script (handles directories automatically)
bun test:unit                       # ~1.5 seconds for 50 tests
```

**When to Use**:

- ✅ Unit tests with no shared state
- ✅ Pure function tests
- ✅ Script tests in `scripts/` directory
- ❌ Tests that share mutable global state
- ❌ Tests that modify the same files/database

### `CLAUDECODE=1` Environment Variable

**Purpose**: Reduce test output verbosity for AI context efficiency while maintaining visibility into failures.

**Behavior**:

- ✅ **Test failures are displayed in detail** (full error messages, stack traces, diffs)
- ✅ **Summary statistics remain intact** (total tests, passed, failed, duration)
- ❌ **Passing test indicators are hidden** (no green checkmarks for each passing test)
- ❌ **Skipped test indicators are hidden** (no yellow indicators for skipped tests)
- ❌ **Todo test indicators are hidden** (no cyan indicators for todo tests)

**Why This Matters for AI Development**:

1. **Context Efficiency**: AI assistants have limited context windows. Hiding passing test noise preserves context for actual failures.
2. **Signal-to-Noise Ratio**: Only failures matter during development. Passing tests provide no actionable information.
3. **Faster Analysis**: Claude Code can immediately focus on failures without parsing hundreds of passing test lines.
4. **Token Conservation**: Reduced output means more tokens available for code analysis and fixes.

**Output Comparison**:

```bash
# WITHOUT CLAUDECODE=1 (verbose)
✓ calculator.add should add two numbers
✓ calculator.add should handle negative numbers
✓ calculator.add should handle zero
✓ calculator.subtract should subtract numbers
✗ calculator.divide should throw on division by zero
  Expected error to be thrown

  at divide (calculator.ts:15:10)
  at Object.<anonymous> (calculator.test.ts:28:12)

✓ calculator.divide should divide numbers
✓ calculator.multiply should multiply numbers
~ calculator.power is not implemented yet (skipped)
⏭ calculator.sqrt (todo)

Tests: 6 passed, 1 failed, 1 skipped, 1 todo, 9 total
Time: 145ms
```

```bash
# WITH CLAUDECODE=1 (focused)
✗ calculator.divide should throw on division by zero
  Expected error to be thrown

  at divide (calculator.ts:15:10)
  at Object.<anonymous> (calculator.test.ts:28:12)

Tests: 6 passed, 1 failed, 1 skipped, 1 todo, 9 total
Time: 145ms
```

**Notice**: Only the failure is shown, but the summary still reports all test counts. This gives Claude Code exactly what it needs: the failure to fix and confirmation that other tests passed.

### Combined Usage

**For Claude Code (AI-assisted development)**:

```bash
# Run all unit tests with AI optimization
CLAUDECODE=1 bun test:unit

# Run specific file with optimization
CLAUDECODE=1 bun test --concurrent ./src/calculator.test.ts

# Watch mode with optimization (continuous TDD)
CLAUDECODE=1 bun test:unit:watch
```

**For humans (manual testing)**:

```bash
# Run all unit tests
bun test:unit

# Run specific file
bun test --concurrent ./src/calculator.test.ts

# Watch mode
bun test:unit:watch
```

### Required package.json Scripts

The project uses explicit glob patterns to ensure ONLY unit test files are discovered:

```json
{
  "scripts": {
    "test:unit": "bun test --concurrent src/**/*.test.ts src/**/*.test.tsx scripts/**/*.test.ts scripts/**/*.test.tsx",
    "test:unit:watch": "bun test --concurrent --watch src/**/*.test.ts src/**/*.test.tsx scripts/**/*.test.ts scripts/**/*.test.tsx",
    "test:unit:coverage": "bun test --concurrent --coverage src/**/*.test.ts src/**/*.test.tsx scripts/**/*.test.ts scripts/**/*.test.tsx"
  }
}
```

**Why explicit glob patterns instead of directories?**

- **Maximum specificity** - Only matches `.test.ts` and `.test.tsx` extensions
- **Prevents Playwright conflicts** - Excludes `.spec.ts` files (Playwright E2E tests)
- **Clear separation** - Unit tests (`.test.ts`) vs E2E tests (`.spec.ts`)
- **Bun limitation workaround** - `bunfig.toml` exclude patterns don't work in Bun 1.3.0
- **Future-proof** - Works even if `.spec.ts` files are added to `src/` or `scripts/` directories

**For AI-assisted development**, Claude Code will use:

```bash
CLAUDECODE=1 bun test:unit  # Optimized output for AI context efficiency
```

**For human development**, you'll use:

```bash
bun test:unit  # Full verbose output for human review
```

### When NOT to Use CLAUDECODE=1

Avoid `CLAUDECODE=1` when:

- **Debugging passing tests**: You need to see all test output to verify test behavior
- **CI/CD pipelines**: Full output provides better visibility in logs (though it's still safe to use)
- **Test development**: Writing new tests and want to see all output
- **Human-only review**: Developers may prefer seeing all passing tests

For these scenarios, use standard commands:

```bash
# Standard output (all tests visible)
bun test:unit

# Specific directory without script
bun test --concurrent src/

# CI/CD (full verbosity)
bun test --concurrent --verbose src/ scripts/
```

## Test Structure

```typescript
import { test, expect, describe, beforeEach, afterEach } from 'bun:test'

describe('Feature', () => {
  beforeEach(() => {
    // Setup before each test
  })

  test('should do something', () => {
    expect(2 + 2).toBe(4)
    expect(value).toEqual(expectedObject)
    expect(fn).toThrow()
  })

  test.skip('skipped test', () => {})
  test.only('focused test', () => {})
  test.todo('future test')
})
```

## Assertions

Built-in Jest-compatible matchers:

```typescript
// Equality
expect(value).toBe(42)
expect(value).toEqual({ key: 'value' })
expect(value).not.toBe(null)

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Numbers
expect(value).toBeGreaterThan(10)
expect(value).toBeLessThan(100)
expect(value).toBeCloseTo(3.14, 2)

// Strings
expect(text).toMatch(/pattern/)
expect(text).toContain('substring')

// Arrays and iterables
expect(array).toContain(item)
expect(array).toHaveLength(5)

// Objects
expect(object).toHaveProperty('key')
expect(object).toMatchObject({ key: 'value' })

// Functions
expect(fn).toThrow()
expect(fn).toThrow(Error)
expect(fn).toThrow('error message')

// Snapshots
expect(value).toMatchSnapshot()
```

## Mocking

```typescript
import { mock, spyOn } from 'bun:test'

// Mock functions
const mockFn = mock((x: number) => x * 2)
mockFn(5)
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith(5)

// Spy on object methods
const spy = spyOn(object, 'method')
spy.mockReturnValue(42)
spy.mockResolvedValue('async value')
spy.mockRejectedValue(new Error('error'))
```

## Test Execution Approach

- **`bun test:unit`**: Script that runs unit tests in `src/` and `scripts/` (uses explicit glob patterns)
- **`bun test:e2e`**: Script that runs Playwright E2E tests in `specs/` directory
- **`bun test:all`**: Script that runs both unit and E2E tests sequentially

## Unit vs E2E Test Execution

```bash
# Unit tests only (fast, run frequently) - ALWAYS USE SCRIPT
bun test:unit                        # ✅ CORRECT (filters to src/ and scripts/)
bun test                             # ❌ WRONG (discovers Playwright .spec.ts files)

# E2E tests only (slow, run before commits)
bun test:e2e                         # Playwright tests in specs/
bun test:e2e:spec                    # Spec tests (@spec tag) - development
bun test:e2e:regression              # Regression tests (@regression tag) - CI/CD

# Both tests sequentially (recommended before commits)
bun test:all                         # Unit tests THEN E2E regression tests
```

### Why Unit Tests Use Script Instead of Raw Command

**The Problem**: `bun test` without directory filters discovers ALL test files including:
- ✅ `src/**/*.test.ts` (Bun unit tests)
- ✅ `scripts/**/*.test.ts` (Bun unit tests)
- ❌ `specs/**/*.spec.ts` (Playwright E2E tests - INCOMPATIBLE with Bun test runner)

**The Solution**: Always use `bun test:unit` which explicitly filters to unit test files only.

**Known Limitation**: `bunfig.toml` exclude patterns don't work in Bun 1.3.0, so directory/glob filtering is the only reliable way to avoid Playwright conflicts.

## When to Use Unit Tests (Bun Test)

- Testing individual functions, classes, utilities
- Validating business logic and algorithms
- Testing edge cases and error handling
- Verifying data transformations
- Testing pure functions (no side effects)
- Fast iteration during development
- TDD (Test-Driven Development) workflow

## Unit Tests vs E2E Tests

| Aspect              | Bun Test (Unit)                               | Playwright (E2E)                                      |
| ------------------- | --------------------------------------------- | ----------------------------------------------------- |
| **Purpose**         | Test isolated functions, classes, utilities   | Test complete user workflows, UI, full app behavior   |
| **Speed**           | Very fast (milliseconds)                      | Slower (seconds to minutes)                           |
| **Scope**           | Single units of code                          | Entire application stack                              |
| **Browser**         | No browser required                           | Real browsers (Chromium, Firefox, WebKit)             |
| **Dependencies**    | Tests pure logic, mocked dependencies         | Tests real integrations, actual dependencies          |
| **When to Run**     | Frequently (every change)                     | Less frequently (before commits, in CI/CD)            |
| **Test Files**      | `*.test.ts` (in src/ and scripts/)            | `*.spec.ts` (in specs/ directory)                     |
| **Command**         | `bun test:unit` (script with directory filter)| `playwright test` or `bun test:e2e`                   |
| **Feedback Loop**   | Immediate (watch mode)                        | Slower (full app startup)                             |
| **What It Catches** | Logic bugs, function correctness              | UI bugs, integration issues, user experience problems |

## Why Both Test Types Are Needed

- **Unit Tests (Bun)**: Fast feedback on code correctness, test edge cases, validate logic
- **E2E Tests (Playwright)**: Verify real user workflows, catch integration issues, ensure UI works
- **Complementary**: Unit tests catch most bugs quickly, E2E tests ensure everything works together
- **Cost-Effectiveness**: Fast unit tests run constantly, expensive E2E tests run selectively

## Example Unit Test

```typescript
// src/calculator.test.ts
import { test, expect, describe } from 'bun:test'
import { add, subtract, divide } from './calculator'

describe('Calculator', () => {
  describe('add', () => {
    test('should add two numbers', () => {
      expect(add(2, 3)).toBe(5)
      expect(add(-1, 1)).toBe(0)
      expect(add(0, 0)).toBe(0)
    })
  })

  describe('divide', () => {
    test('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5)
      expect(divide(9, 3)).toBe(3)
    })

    test('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero')
    })
  })
})
```

## Testing Scripts in `scripts/` Directory

The `scripts/` directory contains TypeScript utility scripts executed by Bun (e.g., build tools, code generators, data exporters). These scripts should have colocated unit tests to ensure reliability.

### Script Structure

```
scripts/
├── export-schema.ts       # Script implementation
├── export-schema.test.ts  # Unit tests for the script
└── split-docs.ts          # Another TypeScript script
```

### Script Testing Guidelines

1. **Colocate tests**: Place `*.test.ts` files alongside scripts (e.g., `scripts/my-script.test.ts`)
2. **Test pure functions**: Extract testable logic into pure functions
3. **Mock file system**: Use Bun's built-in mocking for `fs` operations
4. **Test edge cases**: Validate error handling, missing files, invalid inputs
5. **Executable scripts**: Scripts should have shebang `#!/usr/bin/env bun` and be executable

### Script Test Example

```typescript
// scripts/string-utils.ts
export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9-_]/gi, '-').toLowerCase()
}

export function getVersion(pkg: { version: string }): string {
  if (!pkg.version) {
    throw new Error('Package version is required')
  }
  return pkg.version
}
```

```typescript
// scripts/string-utils.test.ts
import { test, expect, describe } from 'bun:test'
import { sanitizeFilename, getVersion } from './string-utils.ts'

describe('string-utils', () => {
  describe('sanitizeFilename', () => {
    test('should sanitize filename with special characters', () => {
      expect(sanitizeFilename('My File!@#$%^&*().txt')).toBe('my-file--------.txt')
    })

    test('should preserve hyphens and underscores', () => {
      expect(sanitizeFilename('my-awesome_file.txt')).toBe('my-awesome_file.txt')
    })

    test('should handle empty strings', () => {
      expect(sanitizeFilename('')).toBe('')
    })
  })

  describe('getVersion', () => {
    test('should return version from package object', () => {
      expect(getVersion({ version: '1.0.0' })).toBe('1.0.0')
    })

    test('should throw error when version is missing', () => {
      expect(() => getVersion({ version: '' })).toThrow('Package version is required')
    })
  })
})
```

### Running Script Tests

```bash
# Run all unit tests (including scripts)
bun test:unit                        # ✅ CORRECT (uses script wrapper)

# Run only script tests
bun test scripts/                    # ✅ Safe (specific directory)

# Run specific script test
bun test scripts/export-schema.test.ts  # ✅ Safe (specific file)

# Watch mode for script development
bun test:unit:watch                  # ✅ CORRECT (watches src/ and scripts/)
bun test --watch scripts/            # ✅ Safe (specific directory)
```

**⚠️ WARNING**: Do NOT use `bun test` without directory filters - use `bun test:unit` instead to avoid discovering Playwright spec files.

### Mocking File System Operations

```typescript
import { test, expect, mock } from 'bun:test'
import { writeFile, mkdir } from 'fs/promises'

test('should create directory and write file', async () => {
  // Mock filesystem operations
  const mockMkdir = mock(mkdir)
  const mockWriteFile = mock(writeFile)

  mockMkdir.mockResolvedValue(undefined)
  mockWriteFile.mockResolvedValue(undefined)

  // Test your script logic
  await mockMkdir('/output')
  await mockWriteFile('/output/file.txt', 'content')

  expect(mockMkdir).toHaveBeenCalledWith('/output', { recursive: true })
  expect(mockWriteFile).toHaveBeenCalledWith('/output/file.txt', 'content')
})
```

### Best Practices for Script Testing

1. **Extract logic from main execution**: Separate testable functions from script entry point
2. **Test helpers separately**: Unit test utility functions independent of main script
3. **Mock external dependencies**: Use mocks for file system, network, external APIs
4. **Test error paths**: Verify error handling for missing files, invalid data, etc.
5. **Keep tests fast**: Scripts tests should run in milliseconds like other unit tests

### Example: Testing a Build Script

```typescript
// scripts/build-helpers.ts
export function calculateBuildHash(files: string[]): string {
  return files.sort().join('|')
}

export function validateBuildConfig(config: any): void {
  if (!config.outDir) {
    throw new Error('outDir is required in build config')
  }
}
```

```typescript
// scripts/build-helpers.test.ts
import { test, expect, describe } from 'bun:test'
import { calculateBuildHash, validateBuildConfig } from './build-helpers.ts'

describe('build-helpers', () => {
  test('calculateBuildHash should sort files and create hash', () => {
    expect(calculateBuildHash(['c.ts', 'a.ts', 'b.ts'])).toBe('a.ts|b.ts|c.ts')
  })

  test('validateBuildConfig should throw on missing outDir', () => {
    expect(() => validateBuildConfig({})).toThrow('outDir is required')
  })

  test('validateBuildConfig should pass with valid config', () => {
    expect(() => validateBuildConfig({ outDir: './dist' })).not.toThrow()
  })
})
```

## Watch Mode for Continuous Testing

```bash
# Watch mode (auto-runs tests on file changes)
bun test:unit:watch                  # ✅ CORRECT (filters to src/ and scripts/)
CLAUDECODE=1 bun test:unit:watch     # AI-optimized output (failures only)

# Raw watch command with directory filter
bun test --watch src/ scripts/       # ✅ Safe (specific directories)
```

**⚠️ NEVER use `bun test --watch` without directory filters** - Always use `bun test:unit:watch` to avoid Playwright conflicts.

Watch mode is perfect for TDD (Test-Driven Development):

1. Write a failing test
2. Save the file
3. Test automatically runs and fails
4. Write implementation
5. Save the file
6. Test automatically runs and passes

## Coverage Reports

```bash
# Generate coverage report
bun test:unit:coverage               # ✅ CORRECT (uses script wrapper)

# Raw coverage command (if needed)
bun test --coverage src/ scripts/    # ✅ Safe (specific directories)

# Coverage output shows:
# - % of statements covered
# - % of branches covered
# - % of functions covered
# - % of lines covered
```

**⚠️ WARNING**: Do NOT use `bun test --coverage` without directory filters.

## Performance Benefits

- **Native Execution**: Bun executes TypeScript tests directly (no compilation)
- **Fast Startup**: 4x faster than Node.js-based test runners
- **Parallel Execution**: Tests run in parallel by default
- **Efficient Mocking**: Built-in mocking without external libraries

## Integration with Bun

- **Native command**: `bun test` is built into Bun runtime
- **No additional setup**: Test runner included with Bun installation
- **TypeScript support**: Direct TypeScript execution without transpilation
- **Jest compatibility**: Familiar API for developers coming from Jest

## Best Practices

1. **Co-locate tests with source code** - Place `*.test.ts` next to implementation
2. **Test behavior, not implementation** - Focus on what code does, not how
3. **Use descriptive test names** - Clearly state what is being tested
4. **Keep tests focused** - One assertion per test when possible
5. **Use watch mode during development** - Get immediate feedback
6. **Mock external dependencies** - Unit tests should be isolated
7. **Test edge cases** - Zero, negative, null, undefined, empty arrays
8. **Run tests before committing** - Ensure all tests pass
9. **Use `describe` blocks** - Group related tests together
10. **Avoid test interdependence** - Each test should be independent

## Common Pitfalls

- ❌ Testing implementation details instead of behavior
- ❌ Not cleaning up after tests (side effects)
- ❌ Tests that depend on execution order
- ❌ Not testing edge cases and error conditions
- ❌ Overly complex test setup
- ❌ Testing third-party library code

## When to Run Unit Tests

1. **During Development** (continuous):

   ```bash
   bun test:unit:watch              # Auto-run on file changes
   CLAUDECODE=1 bun test:unit:watch # AI-optimized output
   ```

2. **Before Committing** (critical):

   ```bash
   bun test:unit                    # Ensure all tests pass
   ```

3. **In CI/CD Pipeline** (critical):

   ```bash
   bun test:unit                    # Fail builds if tests fail
   ```

4. **After Refactoring** (recommended):
   ```bash
   bun test:unit                    # Verify behavior unchanged
   ```

**⚠️ NEVER use raw `bun test` without directory filters** - Always use `bun test:unit` script to avoid Playwright conflicts.

## References

- Bun test documentation: https://bun.sh/docs/cli/test
- Jest matchers (compatible): https://jestjs.io/docs/expect
- Testing best practices: https://bun.sh/guides/test/lifecycle
