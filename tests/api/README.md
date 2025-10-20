# API E2E Tests

This directory contains End-to-End tests for the Omnera REST API, automatically generated from the OpenAPI specification.

## Source of Truth

**API Specification**: `docs/specifications/app/api.openapi.json`

All API tests in this directory are generated from the OpenAPI schema, which serves as the single source of truth for:

- API endpoints and operations
- Request/response schemas
- Validation rules
- Error handling
- User stories (x-user-stories in OpenAPI spec)

## Test Organization

Tests mirror the OpenAPI specification structure:

```
tests/api/
├── infrastructure.spec.ts  # Infrastructure endpoints (health, metrics)
├── tables.spec.ts          # Table configuration endpoints (GET /api/tables, etc.)
├── records.spec.ts         # Record CRUD operations (GET/POST/PATCH/DELETE /api/tables/{id}/records)
└── README.md               # This file
```

## Test Categories

Each test file follows the same three-category structure as other E2E tests:

### @spec Tests (Multiple)

- Granular tests for each API operation
- One test per x-user-story in OpenAPI spec
- Validates request/response schema compliance
- Tests error cases and validation

### @regression Test (ONE per file)

- Consolidates all @spec tests into complete API workflow
- Tests multiple operations in sequence
- Validates state persistence across requests

### @spec Test (Zero or One)

- Essential API operations that must always work
- Only for critical paths (authentication, data persistence)

## Writing API Tests

API tests are **automatically generated** by the `e2e-test-translator` agent from OpenAPI x-user-stories:

```bash
# Agent translates OpenAPI → API tests
e2e-test-translator reads: docs/specifications/app/api.openapi.json
e2e-test-translator writes: tests/api/*.spec.ts
```

### Manual Test Writing (Not Recommended)

If you need to write API tests manually:

1. **First, update the OpenAPI spec** with x-user-stories
2. Let `e2e-test-translator` generate the tests
3. Only write manual tests for scenarios not covered by OpenAPI

### Test Structure Example

```typescript
import { test, expect } from '../fixtures'

test.describe('API - Tables', () => {
  // @spec tests (one per OpenAPI operation)
  test.fixme('GET /api/tables should return array of tables',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with tables configured
      await startServerWithSchema({
        name: 'test-app',
        tables: [{ id: 1, name: 'users', fields: [...] }]
      })

      // WHEN: GET /api/tables
      const response = await page.request.get('/api/tables')

      // THEN: Should return 200 with array
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(Array.isArray(body)).toBe(true)
    }
  )

  // @regression test (ONE per file)
  test.fixme('user can complete full tables API workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // Complete workflow: List → Get → Create record → Update → Delete
    }
  )
})
```

## OpenAPI Validation

Tests validate that actual API responses match OpenAPI schema definitions:

- **Request validation**: Request body matches schema
- **Response validation**: Response body matches schema
- **Status codes**: HTTP status codes match specification
- **Headers**: Content-Type and other headers match
- **Error responses**: Error format matches schema

## Integration with Other Tests

API tests complement other test types:

| Test Type                | Location                | Purpose                        |
| ------------------------ | ----------------------- | ------------------------------ |
| **API Tests**            | `tests/api/`            | Validate REST API contracts    |
| **App Tests**            | `tests/app/`            | Validate domain model behavior |
| **Admin Tests**          | `tests/admin/`          | Validate admin UI workflows    |
| **Infrastructure Tests** | `tests/infrastructure/` | Validate server/auth/database  |

## Running Tests

```bash
# All API tests
bun test tests/api/

# Specific test file
bun test tests/api/tables.spec.ts

# By tag
bun test:e2e:spec      # @spec tests only
bun test:e2e:regression # @regression tests only
bun test:e2e:critical   # @spec tests only
```

## Test Development Workflow

1. **Design API** in `docs/specifications/app/api.openapi.json`
   - Add operations with x-user-stories
   - Define request/response schemas
   - Include examples

2. **Generate Tests** with `e2e-test-translator` agent
   - Reads OpenAPI x-user-stories
   - Generates tests/api/\*.spec.ts
   - All tests start as RED (test.fixme)

3. **Implement API** with `e2e-test-fixer` agent
   - Implements Hono routes
   - Makes tests GREEN one by one
   - Validates against OpenAPI schema

4. **Refactor** with `codebase-refactor-auditor` agent
   - Optimizes implementation
   - Maintains test coverage

## Best Practices

1. **Always update OpenAPI first** - Never write tests before updating the spec
2. **Use x-user-stories** - Let the agent generate tests from stories
3. **Test both success and error cases** - Include validation error scenarios
4. **Validate response schemas** - Ensure responses match OpenAPI definitions
5. **Keep tests independent** - Each test should work in isolation
6. **Use fixtures** - Always use `startServerWithSchema` for setup

## References

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [Agent Workflows](../../docs/development/agent-workflows.md)
- [Testing Strategy](../../docs/architecture/testing-strategy.md)
