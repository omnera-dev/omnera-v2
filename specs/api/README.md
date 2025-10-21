# API Specifications - Modular OpenAPI Structure

This directory contains the **modular OpenAPI specifications** and **co-located E2E tests** for the Omnera API. The structure follows a **specification-driven development** pattern where OpenAPI specs and Playwright E2E tests live side-by-side.

## 📁 Directory Structure

```
specs/api/
├── README.md                           # This file
├── api.openapi.json                    # Main OpenAPI orchestrator
├── paths/                              # Endpoint definitions (co-located with tests)
│   ├── health/
│   │   ├── get.json                    # OpenAPI spec for GET /api/health
│   │   └── get.spec.ts                 # E2E tests for GET /api/health
│   ├── auth/                           # Authentication endpoints (/api/auth/*)
│   │   ├── sign-in/
│   │   │   ├── email/
│   │   │   │   ├── post.json           # OpenAPI spec
│   │   │   │   └── post.spec.ts        # E2E tests
│   │   │   └── social/
│   │   │       ├── post.json
│   │   │       └── post.spec.ts
│   │   ├── sign-up/
│   │   │   └── email/
│   │   │       ├── post.json
│   │   │       └── post.spec.ts
│   │   ├── sign-out/
│   │   │   ├── post.json
│   │   │   └── post.spec.ts
│   │   ├── get-session/
│   │   │   ├── get.json
│   │   │   └── get.spec.ts
│   │   ├── forget-password/
│   │   │   ├── post.json
│   │   │   └── post.spec.ts
│   │   ├── reset-password/
│   │   │   ├── post.json
│   │   │   └── post.spec.ts
│   │   ├── verify-email/
│   │   │   ├── get.json
│   │   │   └── get.spec.ts
│   │   ├── send-verification-email/
│   │   │   ├── post.json
│   │   │   └── post.spec.ts
│   │   ├── change-email/
│   │   │   ├── post.json
│   │   │   └── post.spec.ts
│   │   └── change-password/
│   │       ├── post.json
│   │       └── post.spec.ts
│   └── tables/                         # Table & record endpoints (/api/tables/*)
│       ├── get.json                    # GET /api/tables
│       ├── {tableId}/
│       │   ├── get.json                # GET /api/tables/{tableId}
│       │   └── records/
│       │       ├── get.json            # GET /api/tables/{tableId}/records
│       │       ├── post.json           # POST /api/tables/{tableId}/records
│       │       └── {recordId}/
│       │           ├── get.json        # GET /api/tables/{tableId}/records/{recordId}
│       │           ├── patch.json      # PATCH /api/tables/{tableId}/records/{recordId}
│       │           └── delete.json     # DELETE /api/tables/{tableId}/records/{recordId}
└── components/                         # Shared OpenAPI components
    ├── schemas/                        # Reusable data models
    │   ├── User.json
    │   ├── Session.json
    │   ├── Table.json
    │   ├── Field.json
    │   ├── PrimaryKey.json
    │   ├── UniqueConstraint.json
    │   ├── Index.json
    │   └── Error.json
    └── responses/                      # Reusable response definitions
        ├── TableNotFound.json
        ├── RecordNotFound.json
        ├── ValidationError.json
        └── ConflictError.json
```

## 🎯 Design Principles

### 1. **Co-location Pattern**

Each endpoint has both its OpenAPI specification (`.json`) and E2E tests (`.spec.ts`) in the same directory:

```
paths/health/
├── get.json       ← OpenAPI specification (contract)
└── get.spec.ts    ← E2E tests (validation)
```

**Benefits**:

- Easy to find tests for any endpoint
- Spec and tests evolve together
- Single directory per endpoint (atomic updates)

### 2. **URL-Based File Organization**

Directory structure mirrors URL structure:

| URL Path                  | File Location                        |
| ------------------------- | ------------------------------------ |
| `/api/health`             | `paths/health/get.json`              |
| `/api/auth/sign-in/email` | `paths/auth/sign-in/email/post.json` |
| `/api/tables/{tableId}`   | `paths/tables/{tableId}/get.json`    |

**Benefits**:

- Intuitive navigation
- File path = URL path
- Easy to locate endpoint files

### 3. **HTTP Method = File Name**

Each HTTP method is a separate file:

```
paths/tables/{tableId}/records/
├── get.json       ← GET endpoint
├── post.json      ← POST endpoint
└── {recordId}/
    ├── get.json   ← GET endpoint
    ├── patch.json ← PATCH endpoint
    └── delete.json ← DELETE endpoint
```

**Benefits**:

- One file per operation
- Clear separation of concerns
- Easy to update individual endpoints

### 4. **Shared Components via $ref**

Reusable schemas and responses are stored in `components/` and referenced via `$ref`:

```json
{
  "responses": {
    "200": {
      "content": {
        "application/json": {
          "schema": {
            "$ref": "../../components/schemas/User.json"
          }
        }
      }
    },
    "404": {
      "$ref": "../../components/responses/TableNotFound.json"
    }
  }
}
```

**Benefits**:

- DRY (Don't Repeat Yourself)
- Single source of truth for schemas
- Easier to maintain consistency

## 📝 File Formats

### OpenAPI Specification Files (`.json`)

**Location**: `paths/{endpoint}/{method}.json`

**Structure**:

```json
{
  "summary": "Brief endpoint description",
  "description": "Detailed description with usage notes",
  "operationId": "uniqueOperationId",
  "tags": ["category"],
  "parameters": [], // Query params, path params, headers
  "requestBody": {}, // POST/PUT/PATCH body
  "responses": {
    "200": {}, // Success response
    "400": {}, // Validation error
    "401": {}, // Unauthorized
    "404": {}, // Not found
    "409": {} // Conflict
  },
  "specs": [
    // Given-When-Then specifications (extracted from co-located .spec.ts)
    {
      "id": "ENDPOINT-001",
      "given": "Precondition",
      "when": "Action",
      "then": "Expected result"
    }
  ]
}
```

**Example**: `paths/health/get.json`

```json
{
  "summary": "Health check endpoint",
  "description": "Returns server health status.",
  "operationId": "healthCheck",
  "tags": ["infrastructure"],
  "responses": {
    "200": {
      "description": "Server is healthy",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "required": ["status", "timestamp", "app"],
            "properties": {
              "status": {
                "type": "string",
                "enum": ["ok"]
              },
              "timestamp": {
                "type": "string",
                "format": "date-time"
              },
              "app": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" }
                }
              }
            }
          }
        }
      }
    }
  },
  "specs": [
    {
      "id": "HEALTH-001",
      "given": "A running server",
      "when": "User requests health endpoint",
      "then": "Response should be 200 OK"
    },
    {
      "id": "HEALTH-002",
      "given": "A server with specific app name",
      "when": "User requests health endpoint",
      "then": "JSON should have status field"
    },
    {
      "id": "HEALTH-003",
      "given": "A running server",
      "when": "User requests health endpoint",
      "then": "Timestamp should be between request start and end"
    },
    {
      "id": "HEALTH-004",
      "given": "A server with scoped package name",
      "when": "User requests health endpoint",
      "then": "App name should preserve special characters"
    }
  ]
}
```

### The `specs` Key - Given-When-Then Specifications

**Purpose**: Each OpenAPI JSON file includes a `specs` array that contains executable specifications extracted from the co-located `.spec.ts` test file. This creates bidirectional traceability between API specification and test implementation.

**Format**:

```json
{
  "specs": [
    {
      "id": "UNIQUE-ID-001",
      "given": "Precondition describing the initial state",
      "when": "Action that triggers the behavior",
      "then": "Expected outcome or result"
    }
  ]
}
```

**ID Convention**:

- Pattern: `{ENDPOINT-PATH}-{NUMBER}`
- Examples:
  - `HEALTH-001`, `HEALTH-002`
  - `AUTH-SIGN-IN-EMAIL-001`, `AUTH-SIGN-IN-EMAIL-002`
  - `AUTH-SIGN-UP-EMAIL-001`, `AUTH-SIGN-UP-EMAIL-002`

**Extraction Process**:

1. The `scripts/add-specs-to-api-json.ts` script parses `.spec.ts` files
2. It extracts GIVEN/WHEN/THEN comments from each `@spec` test
3. It generates unique IDs based on endpoint path
4. It adds the `specs` array to the corresponding `.json` file

**Benefits**:

- **Documentation**: Human-readable BDD scenarios in the OpenAPI spec
- **Traceability**: Direct link between spec and executable tests
- **Single Source of Truth**: Specs array mirrors actual test implementation
- **Pattern Alignment**: Matches `specs/app/*.schema.json` structure

**Example** - Complete endpoint with specs:

```json
{
  "summary": "Sign in with email and password",
  "operationId": "signInEmail",
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "required": ["email", "password"],
          "properties": {
            "email": { "type": "string", "format": "email" },
            "password": { "type": "string", "format": "password" }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "Success - User authenticated"
    },
    "401": {
      "description": "Unauthorized - Invalid credentials"
    }
  },
  "specs": [
    {
      "id": "AUTH-SIGN-IN-EMAIL-001",
      "given": "A running server",
      "when": "User signs in with correct credentials",
      "then": "Response should be 200 OK"
    },
    {
      "id": "AUTH-SIGN-IN-EMAIL-002",
      "given": "A running server",
      "when": "User attempts sign-in with wrong password",
      "then": "Response should be authentication error (4xx)"
    },
    {
      "id": "AUTH-SIGN-IN-EMAIL-003",
      "given": "A running server",
      "when": "User attempts sign-in with non-existent email",
      "then": "Response should be authentication error (4xx)"
    }
  ]
}
```

**Maintenance**: Run `bun run scripts/add-specs-to-api-json.ts` after updating test files to regenerate specs arrays.

### E2E Test Files (`.spec.ts`)

**Location**: `paths/{endpoint}/{method}.spec.ts`

**Structure**:

```typescript
import { test, expect } from '../../../fixtures'

/**
 * E2E Tests for {METHOD} {URL}
 *
 * Specification:
 * - What the endpoint must do
 * - What it must validate
 * - What errors it must handle
 *
 * Reference Implementation:
 * - Source code location
 * - OpenAPI Spec: specs/api/paths/{endpoint}/{method}.json
 */

test.describe('{METHOD} {URL}', () => {
  /**
   * Test Case 1: Description
   *
   * GIVEN: Preconditions
   * WHEN: Action
   * THEN: Expected result
   */
  test('should do something', { tag: '@spec' }, async ({ page, startServerWithSchema }) => {
    // GIVEN: Setup
    await startServerWithSchema({ name: 'test-app' })

    // WHEN: Action
    const response = await page.request.get('/api/endpoint')

    // THEN: Assertion
    expect(response.status()).toBe(200)
  })
})
```

**Example**: `paths/health/get.spec.ts`

```typescript
import { test, expect } from '../../../fixtures'

test.describe('GET /api/health', () => {
  test('should return 200 OK status', { tag: '@spec' }, async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server
    await startServerWithSchema({ name: 'health-test-app' })

    // WHEN: User requests health endpoint
    const response = await page.goto('/api/health')

    // THEN: Response should be 200 OK
    expect(response?.status()).toBe(200)

    // AND: Content-Type should be application/json
    const contentType = response?.headers()['content-type']
    expect(contentType).toContain('application/json')
  })
})
```

### Shared Component Files

#### Schema Files (`components/schemas/{Schema}.json`)

**Purpose**: Define reusable data models

**Example**: `components/schemas/User.json`

```json
{
  "type": "object",
  "description": "User account information",
  "required": ["id", "email", "emailVerified", "createdAt", "updatedAt"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique user identifier",
      "example": "user_123abc"
    },
    "email": {
      "type": "string",
      "format": "email",
      "example": "user@example.com"
    },
    "emailVerified": {
      "type": "boolean",
      "default": false
    },
    "createdAt": {
      "type": "string",
      "format": "date-time"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

#### Response Files (`components/responses/{Response}.json`)

**Purpose**: Define reusable HTTP responses

**Example**: `components/responses/ValidationError.json`

```json
{
  "description": "Validation error",
  "content": {
    "application/json": {
      "schema": {
        "$ref": "../schemas/Error.json"
      },
      "examples": {
        "missingRequired": {
          "value": {
            "error": "Validation failed",
            "code": "VALIDATION_ERROR",
            "details": {
              "field": "email",
              "message": "Email is required"
            }
          }
        }
      }
    }
  }
}
```

## 🚀 Adding a New Endpoint

### Step 1: Create Directory Structure

```bash
mkdir -p specs/api/paths/{resource}/{method-or-id}
```

**Example**:

```bash
mkdir -p specs/api/paths/users/{userId}
```

### Step 2: Create OpenAPI Spec (`.json`)

Create `specs/api/paths/users/{userId}/get.json`:

```json
{
  "summary": "Get user by ID",
  "description": "Retrieves a single user by their unique identifier.",
  "operationId": "getUserById",
  "tags": ["users"],
  "parameters": [
    {
      "name": "userId",
      "in": "path",
      "required": true,
      "schema": {
        "type": "string"
      },
      "description": "Unique user identifier"
    }
  ],
  "responses": {
    "200": {
      "description": "User found",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "../../../components/schemas/User.json"
          }
        }
      }
    },
    "404": {
      "$ref": "../../../components/responses/UserNotFound.json"
    }
  }
}
```

### Step 3: Create E2E Tests (`.spec.ts`)

Create `specs/api/paths/users/{userId}/get.spec.ts`:

```typescript
import { test, expect } from '../../../../fixtures'

test.describe('GET /api/users/{userId}', () => {
  test('should return user by ID', { tag: '@spec' }, async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server with test user
    await startServerWithSchema({ name: 'get-user-test' })

    // WHEN: User requests specific user
    const response = await page.request.get('/api/users/user_123')

    // THEN: Response should be 200 OK
    expect(response.status()).toBe(200)

    const user = await response.json()
    expect(user).toHaveProperty('id', 'user_123')
  })

  test(
    'should return 404 for non-existent user',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema({ name: 'user-404-test' })

      // WHEN: User requests non-existent user
      const response = await page.request.get('/api/users/nonexistent')

      // THEN: Response should be 404
      expect(response.status()).toBe(404)
    }
  )
})
```

### Step 4: Update Main OpenAPI File

Add the endpoint to `specs/api/api.openapi.json`:

```json
{
  "paths": {
    "/api/users/{userId}": {
      "get": {
        "$ref": "./paths/users/{userId}/get.json"
      }
    }
  }
}
```

### Step 5: Run Tests

```bash
# Run endpoint-specific tests
bun test:e2e:spec specs/api/paths/users/{userId}/get.spec.ts

# Run all spec tests
bun test:e2e:spec
```

## 🔍 $ref Path Calculation

### Relative Path Rules

From endpoint spec to component:

```
Current file: paths/auth/sign-in/email/post.json
Target file:  components/schemas/User.json

Relative path: ../../../../components/schemas/User.json
```

**Formula**: Count directories from endpoint to `api/`, then navigate to component

**Examples**:

| From                                       | To                                          | $ref                                                 |
| ------------------------------------------ | ------------------------------------------- | ---------------------------------------------------- |
| `paths/health/get.json`                    | `components/schemas/User.json`              | `../../components/schemas/User.json`                 |
| `paths/auth/sign-in/email/post.json`       | `components/schemas/User.json`              | `../../../../components/schemas/User.json`           |
| `paths/tables/{tableId}/records/post.json` | `components/responses/ValidationError.json` | `../../../components/responses/ValidationError.json` |

## 🧪 Test Organization

### Endpoint-Specific Tests (Co-located)

**Location**: `specs/api/paths/{endpoint}/{method}.spec.ts`

**Purpose**: Validate individual endpoint contracts

**Tags**: `@spec` (runs on every commit)

**Example Tests**:

- HTTP status codes (200, 400, 404, etc.)
- Response schema validation
- Required field validation
- Error handling

### Integration Tests (Separate)

**Location**: `specs/infrastructure/{feature}/{feature}.spec.ts`

**Purpose**: Validate complete workflows across multiple endpoints

**Tags**: `@regression` (runs before merge/deploy)

**Example Tests**:

- Full authentication flow (sign-up → sign-in → sign-out)
- Complete CRUD workflow (create → read → update → delete)
- Cross-endpoint data consistency

## 📊 Current API Coverage

### Endpoints

| Category       | Endpoints | Status                                        |
| -------------- | --------- | --------------------------------------------- |
| Infrastructure | 1         | ✅ Health                                     |
| Authentication | 11        | ✅ Sign-in, Sign-up, Session, Password, Email |
| Tables         | 5         | ✅ CRUD operations                            |
| Records        | 3         | ✅ CRUD operations                            |
| **Total**      | **20**    | **All documented + tested**                   |

### Test Coverage

| File Type               | Count  | Lines     | Specs Count |
| ----------------------- | ------ | --------- | ----------- |
| OpenAPI specs (`.json`) | 47     | ~3000     | 33 specs    |
| E2E tests (`.spec.ts`)  | 12     | ~1500     | 33 tests    |
| Shared components       | 12     | ~800      | -           |
| **Total**               | **71** | **~5300** | **33**      |

**Specs Breakdown**:

- Health: 4 specs
- Authentication: 29 specs (across 11 endpoints)
- Tables/Records: 0 specs (TODO: add tests and extract specs)

## 🛠️ Maintenance Guidelines

### When to Update OpenAPI Specs

✅ **Update spec when**:

- Adding new endpoint
- Changing request/response structure
- Adding/removing required fields
- Changing validation rules
- Adding new error responses

❌ **Don't update spec for**:

- Internal implementation changes
- Performance optimizations
- Bug fixes that don't affect contract

### When to Update E2E Tests

✅ **Update tests when**:

- OpenAPI spec changes
- New validation requirements
- New error scenarios
- Edge cases discovered

❌ **Don't update tests for**:

- Internal refactoring
- Code style changes
- Non-functional changes

### Keeping Specs and Tests in Sync

**Rule**: Every OpenAPI spec property should be validated by at least one test

**Example**:

```json
// OpenAPI spec defines these fields:
{
  "properties": {
    "status": { "type": "string" }, // ← Must have test
    "timestamp": { "type": "string" }, // ← Must have test
    "app": { "type": "object" } // ← Must have test
  }
}
```

```typescript
// E2E test validates all fields:
test('should return complete response', async () => {
  const json = await response.json()

  expect(json).toHaveProperty('status') // ✅ Validates
  expect(json).toHaveProperty('timestamp') // ✅ Validates
  expect(json).toHaveProperty('app') // ✅ Validates
})
```

## 🔗 Related Documentation

- **OpenAPI 3.1.0 Spec**: https://spec.openapis.org/oas/v3.1.0
- **Playwright Testing**: `specs/fixtures.ts`
- **Better Auth Integration**: `specs/infrastructure/auth/`
- **Server Infrastructure**: `specs/infrastructure/server/`

## 💡 Best Practices

1. **One endpoint = Two files + specs array**: Always create both `.json` (spec) and `.spec.ts` (test), with specs array extracted from tests
2. **Use $ref for shared schemas**: Don't duplicate schemas across endpoints
3. **Include examples**: Every response should have at least one example
4. **Tag tests appropriately**: Use `@spec` for endpoint tests, `@regression` for integration
5. **Given-When-Then**: Structure test cases with clear preconditions, actions, and assertions
6. **Descriptive names**: Use clear, descriptive file and test names
7. **Document edge cases**: Include examples for special cases (scoped packages, null values, etc.)
8. **Regenerate specs**: Run `bun run scripts/add-specs-to-api-json.ts` after updating test GIVEN/WHEN/THEN comments

---

**Last Updated**: 2025-01-21
**Maintained By**: Development Team
**Questions?**: See `CLAUDE.md` or create an issue
