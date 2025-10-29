# Testing Strategy - E2E-First TDD with Test-After Unit Tests

> **Note**: This is part 6 of the split documentation. See navigation links below.

## Test File Naming Convention

**CRITICAL: Pattern-based separation enforced via Bun test runner and ESLint**

| Test Type      | Extension  | Location               | Example                  |
| -------------- | ---------- | ---------------------- | ------------------------ |
| **Unit Tests** | `.test.ts` | Co-located with source | `src/calculator.test.ts` |
| **E2E Tests**  | `.spec.ts` | `specs/` directory     | `specs/login.spec.ts`    |

**Why this convention**:

- **Clear Separation**: `.test.ts` = unit, `.spec.ts` = E2E (visual distinction)
- **Pattern-Based Filtering**: Bun test runner uses filename patterns to select test files
- **Tool Compatibility**: Bun recognizes both, Playwright defaults to `.spec.ts`
- **Industry Standard**: Matches patterns used by Jest, Vitest, Playwright
- **Searchability**: Easy to find all unit tests (`**/*.test.ts`) or E2E tests (`specs/**/*.spec.ts`)

## Architectural Rationale

**Architecture Decision**: Test file naming is a **cross-cutting architectural pattern** that enables separation of concerns via filename extensions, not directory structure.

**Why This Matters Architecturally**:

1. **Separation by Test Type (Not Directory)**: Different test runners (Bun Test vs Playwright) operate on different file types, preventing conflicts and enabling co-location
2. **Simple Pattern-Based Filtering**: `bun test .test.ts .test.tsx` filters by extension, making test execution robust and predictable
3. **Tool Isolation**: Each test type has its own runner, preventing accidental cross-contamination (ESLint enforces this)
4. **Co-Location Strategy**: Unit tests live next to source code (`.test.ts`), E2E tests live with schemas (`.spec.ts` in `specs/`)
5. **Cross-Layer Convention**: This pattern applies consistently across all layers (Domain, Application, Infrastructure, Presentation)

**Enforcement Strategy**:

- **Runtime**: Bun test runner filters by filename pattern (`.test.ts`, `.test.tsx`)
- **Static Analysis**: ESLint prevents wrong test runner imports (Playwright in unit tests, Bun Test in E2E tests)
- **Build System**: `package.json` excludes all test files from published package
- **Manual Review**: Filename convention compliance checked during code review (not automatable via ESLint)

**Design Trade-Offs**:

- ✅ **Advantage**: Works regardless of directory structure (robust)
- ✅ **Advantage**: Clear intent via file extension (explicit)
- ✅ **Advantage**: Simple filtering command (no complex globs)
- ❌ **Limitation**: Filename convention not enforceable via ESLint (requires manual review)
- ❌ **Limitation**: Developers must remember which extension to use (mitigated by ESLint import restrictions)

## Enforcement Mechanisms

### 1. Bun Test Runner (Pattern-Based Filtering)

**Unit Test Command**:

```bash
bun test --concurrent .test.ts .test.tsx
```

**How it works**:

- Bun test runner accepts filename pattern arguments
- Only runs tests matching `.test.ts` or `.test.tsx` extensions
- Co-located test files in `src/` and `scripts/` are automatically discovered
- `.spec.ts` files are ignored by unit test command

**Why pattern-based over directory-based**:

- More robust: works regardless of directory structure
- Clearer intent: extension explicitly signals test type
- Simpler configuration: no complex directory exclusions needed

### 2. ESLint Enforcement

**Rule 1: E2E tests must use Playwright**

```typescript
// eslint.config.ts lines 1309-1325
{
  files: ['specs/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'bun:test',
            message: 'E2E tests (in specs/ directory) must use Playwright, not Bun Test.'
          }
        ]
      }
    ]
  }
}
```

**Rule 2: Unit tests must use Bun Test**

```typescript
// eslint.config.ts lines 1327-1345
{
  files: ['src/**/*.test.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@playwright/test',
            message: 'Unit tests (*.test.ts) must use Bun Test, not Playwright.'
          }
        ]
      }
    ]
  }
}
```

**Rule 3: Test files excluded from layer boundaries**

```typescript
// eslint.config.ts line 528
'boundaries/ignore': ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx']
```

### 3. TypeScript Configuration

Test files are included in compilation but excluded from published package:

```json
// package.json lines 42-45
"files": [
  "!src/**/*.test.ts",
  "!src/**/*.test.tsx",
  "!src/**/*.spec.ts",
  "!src/**/*.spec.tsx"
]
```

## Common Pitfalls

❌ **Wrong: Using `.spec.ts` in src/ directory**

```typescript
// src/calculator.spec.ts - WRONG!
import { test, expect } from '@playwright/test'
```

**Problem**: ESLint will prevent `@playwright/test` import in `src/**/*.test.{ts,tsx}` files

✅ **Correct: Using `.test.ts` in src/ directory**

```typescript
// src/calculator.test.ts - CORRECT
import { test, expect } from 'bun:test'
```

❌ **Wrong: Using `.test.ts` in specs/ directory**

```typescript
// specs/login.test.ts - WRONG!
import { test, expect } from 'bun:test'
```

**Problem**: E2E tests won't be co-located with schema files, and ESLint will prevent `bun:test` import in `specs/` directory

✅ **Correct: Using `.spec.ts` in specs/ directory**

```typescript
// specs/login.spec.ts - CORRECT
import { test, expect } from '@playwright/test'
```

## Validation Checklist

Before committing new test files:

- [ ] Unit tests use `.test.ts` extension
- [ ] Unit tests are co-located with source files in `src/` or `scripts/`
- [ ] Unit tests import from `bun:test`
- [ ] E2E tests use `.spec.ts` extension
- [ ] E2E tests are in `specs/` directory
- [ ] E2E tests import from `@playwright/test`
- [ ] ESLint passes (`bun run lint`)
- [ ] Tests run correctly (`bun test:unit` or `bun test:e2e`)

  **See also**: [Bun Test Documentation](../infrastructure/testing/bun-test.md#test-file-naming-convention) for tool-specific details.

---

## Navigation

[← Part 5](./05-quick-reference-when-to-write-tests.md) | [Part 7 →](./07-testing-principles.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-testing-approach.md) | [Part 4](./04-managing-red-tests-with-fixme.md) | [Part 5](./05-quick-reference-when-to-write-tests.md) | **Part 6** | [Part 7](./07-testing-principles.md) | [Part 8](./08-playwright-best-practices.md) | [Part 9](./09-test-execution-strategies.md) | [Part 10](./10-best-practices-summary.md) | [Part 11](./11-anti-patterns-to-avoid.md) | [Part 12](./12-enforcement-and-code-review.md) | [Part 13](./13-references.md)
