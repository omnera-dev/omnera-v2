# specs/admin/ - Admin Interface Specifications

> **Purpose**: This directory contains E2E test specifications for the Omnera™ administrative interface (`/_admin/*` routes). These specs define user workflows and acceptance criteria for admin-level operations like managing tables, connections, automations, and pages.

## Overview

The `specs/admin/` directory focuses on **admin user interface behaviors** rather than domain models. Unlike `specs/app/` (which contains JSON Schema validation rules), this directory contains:

- **Behavioral specifications** in JSON format (`.json` files)
- **E2E test implementations** in TypeScript (`.spec.ts` files)
- **Admin route testing** for `/_admin/*` URL patterns

This structure supports **specification-driven E2E testing** where specs define acceptance criteria and Playwright tests verify the implementation.

## Directory Structure

```
specs/admin/
├── README.md                    # This file
├── tables/                      # Admin table management UI
│   ├── tables.json              # Behavioral specs (Given-When-Then)
│   └── tables.spec.ts           # Playwright E2E tests
└── connections/                 # Admin connection management UI
    ├── connections.json         # Behavioral specs (Given-When-Then)
    └── connections.spec.ts      # Playwright E2E tests
```

## File Structure Pattern

### Pattern: Admin Feature Module

Each admin feature (tables, connections, automations, pages) has its own directory with two files:

**Directory Structure**:

```
{feature-name}/
├── {feature-name}.json          # Behavioral specifications
└── {feature-name}.spec.ts       # E2E test implementations
```

### 1. Specification File (`.json`)

**Purpose**: Define behavioral acceptance criteria in Given-When-Then format

**Location**: `{feature-name}/{feature-name}.json`

**Example**: `specs/admin/tables/tables.json`

```json
{
  "title": "Admin Tables",
  "description": "Administrative interface for managing database tables, including CRUD operations on table records. Provides UI for viewing, creating, updating, and deleting records, as well as API endpoints for programmatic access.",
  "specs": [
    {
      "id": "ADMIN-TABLES-001",
      "given": "application is running",
      "when": "user navigates to admin tables page",
      "then": "page should load correctly"
    },
    {
      "id": "ADMIN-TABLES-002",
      "given": "application is running with configured tables",
      "when": "user lists tables",
      "then": "all tables should be displayed"
    }
  ]
}
```

**Key Elements**:

- `title`: Feature name (e.g., "Admin Tables")
- `description`: Purpose and scope of the admin feature
- `specs`: Array of behavioral specifications

**Spec Object Structure**:

```typescript
interface Spec {
  id: string // Unique identifier (e.g., "ADMIN-TABLES-001")
  given: string // Precondition/context
  when: string // User action/event
  then: string // Expected outcome
}
```

### 2. Test File (`.spec.ts`)

**Purpose**: Implement E2E tests using Playwright that verify the behavioral specifications

**Location**: `{feature-name}/{feature-name}.spec.ts`

**Example**: `specs/admin/tables/tables.spec.ts`

```typescript
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../fixtures'

/**
 * E2E Tests for Tables - Root Level CRUD Operations
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (18 tests from x-user-stories)
 * 2. @regression test - ONE consolidated workflow test
 *
 * Source: specs/admin/tables/tables.json
 */

test.describe('Tables - Root Level CRUD Operations', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - Root Level
  // Granular tests defining acceptance criteria during TDD development
  // Run during: Development, pre-commit (bun test:e2e:spec)
  // ============================================================================

  // ADMIN-TABLES-001: application is running → user navigates to admin tables page → page should load correctly
  test.fixme(
    'should return admin tables page correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [],
      })

      // WHEN: I navigate to the admin tables page
      await page.goto('/_admin/tables')

      // THEN: The page should load correctly
      await expect(page).toHaveURL(/\\/admin\\/tables/)
      await expect(page.locator('[data-testid="tables-page"]')).toBeVisible()
    }
  )

  // ... more @spec tests ...
})

// ============================================================================
// REGRESSION TEST (@regression)
// ONE consolidated test covering complete workflow
// Run during: CI/CD, pre-release (bun test:e2e:regression)
// ============================================================================

// ADMIN-TABLES-WORKFLOW: user is on the admin tables page → user performs complete workflow → all expected outcomes are verified
test.fixme(
  'user can complete full tables workflow',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // Full end-to-end workflow testing all specs together
  }
)
```

**Key Features**:

- **Copyright header**: REQUIRED for all `.ts` files (Business Source License 1.1)
- **Spec ID comments**: Each test is preceded by a comment with spec ID and Given→When→Then summary
- **Two test types**:
  - `@spec` tag: Granular tests for each specification (run during development)
  - `@regression` tag: Consolidated workflow test (run during CI/CD)
- **Fixtures**: Uses custom Playwright fixtures (`startServerWithSchema`, etc.)
- **test.fixme()**: Tests marked as "to be implemented" (changed to `test()` when implemented)

## Specification ID Conventions

### Format

```
{FEATURE}-{AREA}-{NUMBER}
```

**Examples**:

- `ADMIN-TABLES-001` - Admin Tables feature, spec #001
- `CONN-ADMIN-002` - Connection Admin feature, spec #002
- `ADMIN-TABLES-WORKFLOW` - Workflow/regression test (special suffix)

### Components

- **Feature**: Uppercase feature name (`ADMIN-TABLES`, `CONN-ADMIN`, `ADMIN-AUTOMATIONS`)
- **Area**: Optional sub-area for complex features (`API`, `UI`, `WORKFLOW`)
- **Number**: Zero-padded 3-digit sequence (001, 002, 003...)
- **Workflow**: Special suffix for regression tests covering complete workflows

## Test Organization

### @spec Tests (Granular)

**Purpose**: Test individual acceptance criteria during TDD development

**Characteristics**:

- One test per specification from `.json` file
- Focused on single user action and outcome
- Run frequently during development (`bun test:e2e:spec`)
- Can be marked as `test.fixme()` during red-green-refactor cycle

**Example**:

```typescript
// ADMIN-TABLES-001: application is running → user navigates to admin tables page → page should load correctly
test.fixme(
  'should return admin tables page correctly',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // Test implementation
  }
)
```

### @regression Tests (Consolidated)

**Purpose**: Verify complete user workflows end-to-end before release

**Characteristics**:

- ONE test per feature covering all specs in realistic sequence
- Tests full user journey from start to finish
- Run before merge/release (`bun test:e2e:regression`)
- Should always pass (not marked as `test.fixme()`)

**Example**:

```typescript
// ADMIN-TABLES-WORKFLOW: user is on admin tables page → user performs complete workflow → all outcomes verified
test.fixme(
  'user can complete full tables workflow',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // Step 1: Navigate to admin tables page
    // Step 2: View table list
    // Step 3: Create record
    // Step 4: Update record
    // Step 5: Delete record
    // ... (complete workflow covering all specs)
  }
)
```

## Relationship to specs/app/

| Aspect          | specs/app/                   | specs/admin/                |
| --------------- | ---------------------------- | --------------------------- |
| **Purpose**     | Domain model validation      | Admin UI behavior           |
| **File Type**   | JSON Schema (`.schema.json`) | Behavioral specs (`.json`)  |
| **Validation**  | Data structure & constraints | User workflows & acceptance |
| **Scope**       | Application configuration    | Admin interface operations  |
| **Tests**       | Domain/API validation        | E2E UI + API testing        |
| **URL Pattern** | `/api/*` endpoints           | `/_admin/*` routes          |

**Example Distinction**:

- `specs/app/tables/tables.schema.json`: Defines what a valid table configuration looks like (field types, constraints, validation rules)
- `specs/admin/tables/tables.json`: Defines how users interact with tables in the admin UI (create records, search, delete)

## Adding New Admin Features

### 1. Create Feature Directory

```bash
mkdir specs/admin/{feature-name}
```

### 2. Create Specification File

```bash
touch specs/admin/{feature-name}/{feature-name}.json
```

**Template**:

```json
{
  "title": "Feature Title",
  "description": "Description of what this admin feature enables users to do",
  "specs": [
    {
      "id": "ADMIN-FEATURE-001",
      "given": "precondition or context",
      "when": "user action",
      "then": "expected outcome"
    }
  ]
}
```

### 3. Create Test File

```bash
touch specs/admin/{feature-name}/{feature-name}.spec.ts
```

**Template**:

```typescript
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../fixtures'

test.describe('Feature Name - Description', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // ============================================================================

  // ADMIN-FEATURE-001: given → when → then
  test.fixme('should do something', { tag: '@spec' }, async ({ page, startServerWithSchema }) => {
    // GIVEN: precondition
    // WHEN: action
    // THEN: assertion
  })
})

// ============================================================================
// REGRESSION TEST (@regression)
// ============================================================================

// ADMIN-FEATURE-WORKFLOW: complete user journey
test.fixme(
  'user can complete full feature workflow',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // Complete workflow
  }
)
```

### 4. Add Copyright Headers

```bash
bun run license
```

### 5. Implement Tests (TDD Workflow)

1. **Red**: Write failing `test.fixme()` tests based on specs
2. **Green**: Implement minimal code to make tests pass
3. **Refactor**: Improve code quality while keeping tests green
4. **Convert**: Change `test.fixme()` to `test()` when implemented

## Running Tests

### Run @spec tests (development)

```bash
bun test:e2e:spec
```

Runs only granular specification tests during TDD development.

### Run @regression tests (CI/CD)

```bash
bun test:e2e:regression
```

Runs consolidated workflow tests before merge/release.

### Run all E2E tests

```bash
bun test:e2e
```

Runs both @spec and @regression tests.

### Run with UI

```bash
bun test:e2e:ui
```

Opens Playwright UI for debugging tests visually.

## Best Practices

### 1. Specification Writing

- **Be specific**: Clear, unambiguous Given-When-Then statements
- **User-focused**: Write from user perspective, not implementation details
- **Testable**: Each spec should be verifiable with automated test
- **Independent**: Specs should not depend on other specs' execution order

### 2. Test Implementation

- **One assertion per @spec test**: Focus on single outcome
- **Use data-testid**: Prefer `[data-testid="element"]` over text/class selectors
- **Real workflows in @regression**: Simulate actual user behavior
- **Clean state**: Each test should start with fresh application state

### 3. Test Organization

- **Comment every test**: Include spec ID and Given→When→Then summary
- **Group related tests**: Use `test.describe()` for logical grouping
- **Mark incomplete as fixme**: Use `test.fixme()` for unimplemented tests
- **One workflow test**: Each feature gets ONE @regression test

### 4. Maintenance

- **Update specs first**: When requirements change, update `.json` then tests
- **Keep IDs stable**: Never renumber spec IDs (add new numbers sequentially)
- **Document changes**: Update this README when adding new features
- **Run license script**: Always run `bun run license` after creating `.ts` files

## Common Patterns

### Pattern 1: CRUD Operations

Most admin features involve Create, Read, Update, Delete operations:

```json
{
  "specs": [
    {
      "id": "ADMIN-FEATURE-001",
      "given": "user is on feature page",
      "when": "user clicks create button",
      "then": "create form should be displayed"
    },
    {
      "id": "ADMIN-FEATURE-002",
      "given": "user fills form with valid data",
      "when": "user submits form",
      "then": "item should be created successfully"
    },
    {
      "id": "ADMIN-FEATURE-003",
      "given": "user selects an item",
      "when": "user clicks edit button",
      "then": "edit form should be displayed with current values"
    },
    {
      "id": "ADMIN-FEATURE-004",
      "given": "user modifies item data",
      "when": "user submits form",
      "then": "item should be updated successfully"
    },
    {
      "id": "ADMIN-FEATURE-005",
      "given": "user selects an item",
      "when": "user clicks delete button",
      "then": "confirmation dialog should be displayed"
    },
    {
      "id": "ADMIN-FEATURE-006",
      "given": "user confirms deletion",
      "when": "user clicks confirm",
      "then": "item should be deleted successfully"
    }
  ]
}
```

### Pattern 2: OAuth Connection Flow

For external service integrations:

```json
{
  "specs": [
    {
      "id": "CONN-ADMIN-001",
      "given": "user navigates to connections page",
      "when": "page loads",
      "then": "list of all connections should be displayed"
    },
    {
      "id": "CONN-ADMIN-002",
      "given": "connection exists but is not connected",
      "when": "user clicks 'Connect' button",
      "then": "OAuth flow should initiate"
    },
    {
      "id": "CONN-ADMIN-003",
      "given": "OAuth flow completes successfully",
      "when": "user is redirected back",
      "then": "connection status should be 'connected'"
    },
    {
      "id": "CONN-ADMIN-004",
      "given": "connection is active",
      "when": "user clicks 'Disconnect' button",
      "then": "connection should be disconnected and tokens revoked"
    }
  ]
}
```

### Pattern 3: List, Filter, Search

For data browsing features:

```json
{
  "specs": [
    {
      "id": "ADMIN-FEATURE-001",
      "given": "user navigates to feature page",
      "when": "page loads",
      "then": "list of items should be displayed"
    },
    {
      "id": "ADMIN-FEATURE-002",
      "given": "user types in search box",
      "when": "user enters search term",
      "then": "list should filter to show matching items only"
    },
    {
      "id": "ADMIN-FEATURE-003",
      "given": "user selects filter option",
      "when": "user applies filter",
      "then": "list should show only items matching filter criteria"
    }
  ]
}
```

## Test Fixtures

Admin tests use custom Playwright fixtures defined in `specs/fixtures.ts`:

### `startServerWithSchema(schema)`

Starts the application server with a specific configuration schema.

**Usage**:

```typescript
await startServerWithSchema({
  name: 'test-app',
  description: 'Test application',
  version: '1.0.0',
  tables: [
    {
      id: 1,
      name: 'users',
      fields: [{ id: 1, name: 'email', type: 'email' }],
    },
  ],
})
```

### `page`

Standard Playwright `Page` object with additional helpers.

### `request`

API request context for testing API endpoints directly.

## Architecture Alignment

This testing structure aligns with Omnera™'s core principles:

- **Specification-driven development**: Specs define behavior before implementation
- **TDD workflow**: Red-Green-Refactor cycle with `test.fixme()` → `test()`
- **Layer separation**: Admin UI tests are separate from domain model tests
- **DRY principle**: Specs in `.json` files are single source of truth
- **Functional programming**: Tests are pure, isolated, and composable

## Related Documentation

- **Domain Specifications**: `specs/app/README.md` (JSON Schema validation)
- **Test Fixtures**: `specs/fixtures.ts` (Playwright custom fixtures)
- **API Specifications**: `specs/api/` (OpenAPI route definitions)
- **Testing Guide**: `docs/development/testing.md` (Overall testing strategy)

---

**Last Updated**: 2025-01-21
**Maintainer**: ESSENTIAL SERVICES
**License**: Business Source License 1.1
