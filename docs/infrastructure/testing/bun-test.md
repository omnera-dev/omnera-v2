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

## Test File Naming Convention

**Recommended convention for clarity and consistency**:

| Test Type | Extension | Location | Example |
|-----------|-----------|----------|---------|
| **Unit Tests** | `.test.ts` | Co-located with source | `src/calculator.test.ts` |
| **E2E Tests** | `.spec.ts` | `tests/` directory | `tests/login.spec.ts` |

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

**IMPORTANT**: `bun test` is a **native Bun command**, not a package.json script. It directly invokes Bun's built-in test runner without any script wrapper.

```bash
# Run all unit tests (native command - excludes tests/ directory)
bun test

# Run specific file/pattern
bun test path/to/file.test.ts
bun test src/**/*.test.ts

# Watch mode (continuous testing)
bun test --watch

# Coverage
bun test --coverage

# Filtering
bun test --only "test name pattern"
bun test --grep "pattern"

# Bail on first failure
bun test --bail

# Timeout
bun test --timeout 5000  # 5 seconds
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

- **`bun test`**: Native Bun command for unit tests (NOT a script - directly runs Bun's built-in test runner)
- **`bun test:all`**: Script that runs both unit and E2E tests sequentially (`bun test && bun test:e2e`)
- **`bun test:e2e`**: Script that runs Playwright E2E tests (`playwright test`)

## Unit vs E2E Test Execution

```bash
# Unit tests only (fast, run frequently) - NATIVE COMMAND
bun test

# E2E tests only (slow, run before commits) - SCRIPT
bun test:e2e

# Both tests sequentially (recommended before commits) - SCRIPT
bun test:all
```

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
| **Test Files**      | `*.test.ts`, `*.spec.ts` (outside tests/ dir) | `tests/**/*.spec.ts`                                  |
| **Command**         | `bun test` (native command)                   | `playwright test` or `bun test:e2e`                   |
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

## Watch Mode for Continuous Testing

```bash
# Watch mode (auto-runs tests on file changes)
bun test --watch
```

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
bun test --coverage

# Coverage output shows:
# - % of statements covered
# - % of branches covered
# - % of functions covered
# - % of lines covered
```

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
   bun test --watch  # Auto-run on file changes
   ```

2. **Before Committing** (critical):

   ```bash
   bun test  # Ensure all tests pass
   ```

3. **In CI/CD Pipeline** (critical):

   ```bash
   bun test  # Fail builds if tests fail
   ```

4. **After Refactoring** (recommended):
   ```bash
   bun test  # Verify behavior unchanged
   ```

## References

- Bun test documentation: https://bun.sh/docs/cli/test
- Jest matchers (compatible): https://jestjs.io/docs/expect
- Testing best practices: https://bun.sh/guides/test/lifecycle
