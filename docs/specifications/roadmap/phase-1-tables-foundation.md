# Phase 1: Tables Foundation (v0.1.0)

> **For Implementation**: This document provides agent-optimized blueprints for schema-architect and e2e-red-test-writer agents.

**Status**: ⏳ **NOT STARTED**

**Target Date**: Q2 2025

**Estimated Duration**: 4-6 weeks

**Goal**: Implement core table functionality with basic field types and CRUD operations

---

## Features to Implement

### Schema Changes

- ⏳ Property: `tables` - Array of database table definitions
- ⏳ Type: `array` of objects
- ⏳ Validation: minItems(1), table name pattern, field validation
- ⏳ Optional/Required: optional

**Field Types** (Basic):

- Text fields: `single-line-text`, `long-text`, `phone-number`, `email`, `url`
- Number fields: `integer`, `decimal`, `currency`, `percentage`
- Date fields: `date`, `datetime`, `time`
- Boolean field: `checkbox`
- Selection field: `single-select`

### API Implementation

- ⏳ Convention-based routing: `/api/tables/{tableName}/records`
- ⏳ CRUD endpoints: GET (list), GET (single), POST, PATCH, DELETE
- ⏳ Query parameters: pagination (`page`, `limit`)
- ⏳ Sorting support (`sort` parameter)
- ⏳ Filtering support (`filter[field]` parameters)

### Infrastructure

- ⏳ Database schema generation (Drizzle ORM)
- ⏳ Effect Schema validation for table configuration
- ⏳ PostgreSQL table creation from JSON config
- ⏳ Auto-migration on schema changes
- ⏳ REST API route generation

---

## Effect Schema Blueprint

**File**: `src/domain/models/app/tables.ts`

```typescript
import { Schema } from 'effect'

/**
 * Field types for table columns
 */
const TextFieldSchema = Schema.Struct({
  id: Schema.Number.pipe(
    Schema.int(),
    Schema.positive(),
    Schema.annotations({
      title: 'Field ID',
      description: 'Unique identifier for the field',
    })
  ),
  name: Schema.String.pipe(
    Schema.pattern(/^[a-z][a-z0-9_]*$/, {
      message: () =>
        'Field name must start with lowercase letter and contain only lowercase letters, numbers, and underscores',
    }),
    Schema.annotations({
      title: 'Field Name',
      description: 'The name of the database field',
      examples: ['email', 'first_name', 'phone_number'],
    })
  ),
  type: Schema.Literal('single-line-text', 'long-text', 'phone-number', 'email', 'url').pipe(
    Schema.annotations({
      title: 'Text Field Type',
      description: 'Type of text field',
      examples: ['email', 'single-line-text'],
    })
  ),
  required: Schema.optional(Schema.Boolean).pipe(Schema.withDefault(() => false)),
  default: Schema.optional(Schema.String),
})

const NumberFieldSchema = Schema.Struct({
  id: Schema.Number.pipe(Schema.int(), Schema.positive()),
  name: Schema.String.pipe(
    Schema.pattern(/^[a-z][a-z0-9_]*$/, {
      message: () =>
        'Field name must start with lowercase letter and contain only lowercase letters, numbers, and underscores',
    })
  ),
  type: Schema.Literal('integer', 'decimal', 'currency', 'percentage'),
  required: Schema.optional(Schema.Boolean).pipe(Schema.withDefault(() => false)),
  min: Schema.optional(Schema.Number),
  max: Schema.optional(Schema.Number),
  precision: Schema.optional(
    Schema.Number.pipe(
      Schema.int(),
      Schema.between(0, 10),
      Schema.withDefault(() => 2)
    )
  ),
  currency: Schema.optional(Schema.String.pipe(Schema.withDefault(() => 'USD'))),
  default: Schema.optional(Schema.Number),
})

const DateFieldSchema = Schema.Struct({
  id: Schema.Number.pipe(Schema.int(), Schema.positive()),
  name: Schema.String.pipe(
    Schema.pattern(/^[a-z][a-z0-9_]*$/, {
      message: () =>
        'Field name must start with lowercase letter and contain only lowercase letters, numbers, and underscores',
    })
  ),
  type: Schema.Literal('date', 'datetime', 'time'),
  required: Schema.optional(Schema.Boolean).pipe(Schema.withDefault(() => false)),
  format: Schema.optional(Schema.String.pipe(Schema.withDefault(() => 'YYYY-MM-DD'))),
  includeTime: Schema.optional(Schema.Boolean.pipe(Schema.withDefault(() => false))),
  timezone: Schema.optional(Schema.String.pipe(Schema.withDefault(() => 'UTC'))),
  default: Schema.optional(Schema.String),
})

const CheckboxFieldSchema = Schema.Struct({
  id: Schema.Number.pipe(Schema.int(), Schema.positive()),
  name: Schema.String.pipe(
    Schema.pattern(/^[a-z][a-z0-9_]*$/, {
      message: () =>
        'Field name must start with lowercase letter and contain only lowercase letters, numbers, and underscores',
    })
  ),
  type: Schema.Literal('checkbox'),
  required: Schema.optional(Schema.Boolean).pipe(Schema.withDefault(() => false)),
  default: Schema.optional(Schema.Boolean),
})

const SingleSelectFieldSchema = Schema.Struct({
  id: Schema.Number.pipe(Schema.int(), Schema.positive()),
  name: Schema.String.pipe(
    Schema.pattern(/^[a-z][a-z0-9_]*$/, {
      message: () =>
        'Field name must start with lowercase letter and contain only lowercase letters, numbers, and underscores',
    })
  ),
  type: Schema.Literal('single-select'),
  required: Schema.optional(Schema.Boolean).pipe(Schema.withDefault(() => false)),
  options: Schema.Array(Schema.String).pipe(
    Schema.minItems(1, {
      message: () => 'At least one option is required for single-select field',
    }),
    Schema.annotations({
      title: 'Select Options',
      description: 'Available options for the select field',
      examples: [['admin', 'user', 'guest']],
    })
  ),
  default: Schema.optional(Schema.String),
})

/**
 * Field schema (union of all field types)
 */
const FieldSchema = Schema.Union(
  TextFieldSchema,
  NumberFieldSchema,
  DateFieldSchema,
  CheckboxFieldSchema,
  SingleSelectFieldSchema
).pipe(
  Schema.annotations({
    title: 'Table Field',
    description: 'A field definition in a table',
  })
)

/**
 * Table schema
 */
const TableSchema = Schema.Struct({
  id: Schema.Number.pipe(
    Schema.int(),
    Schema.positive(),
    Schema.annotations({
      title: 'Table ID',
      description: 'Unique identifier for the table',
    })
  ),
  name: Schema.String.pipe(
    Schema.pattern(/^[a-z][a-z0-9_]*$/, {
      message: () =>
        'Table name must start with lowercase letter and contain only lowercase letters, numbers, and underscores',
    }),
    Schema.annotations({
      title: 'Table Name',
      description: 'Name of the database table',
      examples: ['users', 'posts', 'products'],
    })
  ),
  fields: Schema.Array(FieldSchema).pipe(
    Schema.minItems(1, {
      message: () => 'At least one field is required',
    }),
    Schema.annotations({
      title: 'Table Fields',
      description: 'List of fields in the table',
    })
  ),
}).pipe(
  Schema.annotations({
    title: 'Table',
    description: 'A database table definition',
  })
)

/**
 * Tables schema (array of tables)
 */
export const TablesSchema = Schema.Array(TableSchema).pipe(
  Schema.annotations({
    title: 'Tables Configuration',
    description: 'Database table definitions for the application',
    examples: [
      [
        {
          id: 1,
          name: 'users',
          fields: [
            { id: 1, name: 'email', type: 'email', required: true },
            { id: 2, name: 'name', type: 'single-line-text', required: true },
            {
              id: 3,
              name: 'role',
              type: 'single-select',
              options: ['admin', 'user'],
              required: true,
            },
          ],
        },
      ],
    ],
  })
)

export type Tables = Schema.Schema.Type<typeof TablesSchema>
export type Table = Schema.Schema.Type<typeof TableSchema>
export type Field = Schema.Schema.Type<typeof FieldSchema>
```

**Validation Rules**:

1. **Table Name Pattern**: `^[a-z][a-z0-9_]*$`
   - Pattern/Constraint: Must start with lowercase letter
   - Error Message: "Table name must start with lowercase letter and contain only lowercase letters, numbers, and underscores"
   - Example Valid: `users`, `user_profiles`, `posts2024`
   - Example Invalid: `Users`, `user-profiles`, `1users`

2. **Field Name Pattern**: `^[a-z][a-z0-9_]*$`
   - Pattern/Constraint: Must start with lowercase letter
   - Error Message: "Field name must start with lowercase letter and contain only lowercase letters, numbers, and underscores"
   - Example Valid: `email`, `first_name`, `phone_number`
   - Example Invalid: `Email`, `first-name`, `1st_name`

3. **Minimum Fields**: At least 1 field required
   - Pattern/Constraint: `minItems(1)`
   - Error Message: "At least one field is required"
   - Example Valid: `[{ id: 1, name: 'email', type: 'email' }]`
   - Example Invalid: `[]`

4. **Select Options**: At least 1 option for single-select
   - Pattern/Constraint: `minItems(1)`
   - Error Message: "At least one option is required for single-select field"
   - Example Valid: `['admin', 'user']`
   - Example Invalid: `[]`

---

## E2E Test Blueprint

**File**: `tests/app/tables.spec.ts`

```typescript
import { test, expect } from '../fixtures'

/**
 * E2E Tests for App Tables
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (8-12 tests)
 * 2. @regression test - ONE consolidated workflow test
 * 3. @critical test - Essential table CRUD path
 */

test.describe('AppSchema - Tables', () => {
  // ==========================================================================
  // SPECIFICATION TESTS (@spec)
  // ==========================================================================

  test.fixme(
    'should accept valid tables configuration',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Valid tables configuration
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [
              { id: 1, name: 'email', type: 'email', required: true },
              { id: 2, name: 'name', type: 'single-line-text' },
            ],
          },
        ],
      })

      // WHEN: User views the application
      await page.goto('/')

      // THEN: Tables are accessible
      await expect(page.locator('[data-testid="tables-container"]')).toBeVisible()
    }
  )

  test.fixme(
    'should reject table with invalid name pattern',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Invalid table name (starts with uppercase)
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'Users', // Invalid: starts with uppercase
            fields: [{ id: 1, name: 'email', type: 'email' }],
          },
        ],
      })

      // WHEN: Server attempts to start
      await page.goto('/')

      // THEN: Should display validation error
      await expect(page.locator('[data-testid="tables-error"]')).toHaveText(
        'Table name must start with lowercase letter and contain only lowercase letters, numbers, and underscores'
      )
    }
  )

  test.fixme(
    'should reject table with no fields',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Table with empty fields array
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [], // Invalid: no fields
          },
        ],
      })

      // WHEN: Server attempts to start
      await page.goto('/')

      // THEN: Should display validation error
      await expect(page.locator('[data-testid="tables-error"]')).toHaveText(
        'At least one field is required'
      )
    }
  )

  test.fixme(
    'should reject field with invalid name pattern',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Field with invalid name (contains hyphen)
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'user-email', type: 'email' }], // Invalid: hyphen
          },
        ],
      })

      // WHEN: Server attempts to start
      await page.goto('/')

      // THEN: Should display validation error
      await expect(page.locator('[data-testid="tables-error"]')).toHaveText(
        'Field name must start with lowercase letter and contain only lowercase letters, numbers, and underscores'
      )
    }
  )

  test.fixme(
    'should accept all text field types',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Table with various text field types
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [
              { id: 1, name: 'bio', type: 'long-text' },
              { id: 2, name: 'phone', type: 'phone-number' },
              { id: 3, name: 'email', type: 'email' },
              { id: 4, name: 'website', type: 'url' },
            ],
          },
        ],
      })

      // WHEN: User views the application
      await page.goto('/')

      // THEN: All field types are recognized
      await expect(page.locator('[data-testid="field-bio"]')).toHaveAttribute('type', 'long-text')
      await expect(page.locator('[data-testid="field-phone"]')).toHaveAttribute(
        'type',
        'phone-number'
      )
    }
  )

  test.fixme(
    'should accept all number field types',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Table with various number field types
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'products',
            fields: [
              { id: 1, name: 'quantity', type: 'integer' },
              { id: 2, name: 'price', type: 'decimal', precision: 2 },
              { id: 3, name: 'cost', type: 'currency', currency: 'USD' },
              { id: 4, name: 'discount', type: 'percentage' },
            ],
          },
        ],
      })

      // WHEN: User views the application
      await page.goto('/')

      // THEN: All number field types are recognized
      await expect(page.locator('[data-testid="field-quantity"]')).toHaveAttribute(
        'type',
        'integer'
      )
      await expect(page.locator('[data-testid="field-price"]')).toHaveAttribute('type', 'decimal')
    }
  )

  test.fixme(
    'should accept single-select field with options',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Table with single-select field
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [
              {
                id: 1,
                name: 'role',
                type: 'single-select',
                options: ['admin', 'user', 'guest'],
                required: true,
              },
            ],
          },
        ],
      })

      // WHEN: User views the field
      await page.goto('/')

      // THEN: Options are available
      const select = page.locator('[data-testid="field-role-select"]')
      await expect(select).toBeVisible()
      await select.click()
      await expect(page.locator('text=admin')).toBeVisible()
      await expect(page.locator('text=user')).toBeVisible()
      await expect(page.locator('text=guest')).toBeVisible()
    }
  )

  test.fixme(
    'should reject single-select field with no options',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Single-select field with empty options array
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [
              {
                id: 1,
                name: 'role',
                type: 'single-select',
                options: [], // Invalid: no options
              },
            ],
          },
        ],
      })

      // WHEN: Server attempts to start
      await page.goto('/')

      // THEN: Should display validation error
      await expect(page.locator('[data-testid="tables-error"]')).toHaveText(
        'At least one option is required for single-select field'
      )
    }
  )

  // ==========================================================================
  // REGRESSION TEST (@regression) - EXACTLY ONE
  // ==========================================================================

  test.fixme(
    'user can complete full tables configuration workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Complete tables configuration with all field types
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [
              { id: 1, name: 'email', type: 'email', required: true },
              { id: 2, name: 'name', type: 'single-line-text', required: true },
              { id: 3, name: 'bio', type: 'long-text' },
              { id: 4, name: 'age', type: 'integer', min: 0, max: 150 },
              { id: 5, name: 'is_active', type: 'checkbox', default: true },
              { id: 6, name: 'role', type: 'single-select', options: ['admin', 'user'] },
            ],
          },
        ],
      })

      // WHEN: User interacts with complete workflow
      await page.goto('/')

      // THEN: All behaviors verified
      // 1. Tables configuration is valid
      await expect(page.locator('[data-testid="tables-container"]')).toBeVisible()

      // 2. All field types are recognized
      await expect(page.locator('[data-testid="field-email"]')).toHaveAttribute('type', 'email')
      await expect(page.locator('[data-testid="field-name"]')).toHaveAttribute(
        'type',
        'single-line-text'
      )
      await expect(page.locator('[data-testid="field-bio"]')).toHaveAttribute('type', 'long-text')
      await expect(page.locator('[data-testid="field-age"]')).toHaveAttribute('type', 'integer')
      await expect(page.locator('[data-testid="field-is_active"]')).toHaveAttribute(
        'type',
        'checkbox'
      )
      await expect(page.locator('[data-testid="field-role"]')).toHaveAttribute(
        'type',
        'single-select'
      )

      // 3. Required fields are marked
      await expect(page.locator('[data-testid="field-email-required"]')).toBeVisible()
      await expect(page.locator('[data-testid="field-name-required"]')).toBeVisible()

      // 4. Select options are available
      const roleSelect = page.locator('[data-testid="field-role-select"]')
      await roleSelect.click()
      await expect(page.locator('text=admin')).toBeVisible()
      await expect(page.locator('text=user')).toBeVisible()

      // 5. Validation errors shown for invalid data
      await page.locator('[data-testid="field-age-input"]').fill('200')
      await page.locator('[data-testid="submit-btn"]').click()
      await expect(page.locator('[data-testid="field-age-error"]')).toContainText('maximum')
    }
  )

  // ==========================================================================
  // CRITICAL PATH TEST (@critical)
  // ==========================================================================

  test.fixme(
    'critical: tables configuration validates and renders',
    { tag: '@critical' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Valid minimal tables configuration
      await startServerWithSchema({
        name: 'test-app',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email', required: true }],
          },
        ],
      })

      // WHEN: User loads the application
      await page.goto('/')

      // THEN: Tables are accessible
      await expect(page.locator('[data-testid="tables-container"]')).toBeVisible()
    }
  )
})
```

**Test Scenarios**:

1. **Valid Configuration** (@spec)
   - Setup: Valid tables with multiple field types
   - Action: Load application
   - Assertion: Tables render correctly
   - data-testid: `tables-container`

2. **Invalid Table Name** (@spec)
   - Setup: Table name starting with uppercase
   - Expected Error: "Table name must start with lowercase letter and contain only lowercase letters, numbers, and underscores"
   - data-testid: `tables-error`

3. **No Fields Validation** (@spec)
   - Setup: Table with empty fields array
   - Expected Error: "At least one field is required"
   - data-testid: `tables-error`

4. **Field Name Validation** (@spec)
   - Setup: Field name with hyphen
   - Expected Error: "Field name must start with lowercase letter and contain only lowercase letters, numbers, and underscores"
   - data-testid: `tables-error`

5. **Text Field Types** (@spec)
   - Setup: All text field types (long-text, phone-number, email, url)
   - Assertion: All types recognized
   - data-testid: `field-{fieldName}`

6. **Number Field Types** (@spec)
   - Setup: All number field types (integer, decimal, currency, percentage)
   - Assertion: All types recognized with correct attributes
   - data-testid: `field-{fieldName}`

7. **Single Select with Options** (@spec)
   - Setup: Single-select field with options array
   - Assertion: Options displayed in dropdown
   - data-testid: `field-{fieldName}-select`

8. **Single Select No Options** (@spec)
   - Setup: Single-select field with empty options
   - Expected Error: "At least one option is required for single-select field"
   - data-testid: `tables-error`

9. **Complete Workflow** (@regression)
   - Consolidates all scenarios into one comprehensive test
   - Tests all field types, validation, and interactions

10. **Critical Path** (@critical)
    - Minimal essential: Tables configuration validates and renders
    - Must be rock-solid

---

## Configuration Examples

**Valid Configuration**:

```json
{
  "name": "my-app",
  "tables": [
    {
      "id": 1,
      "name": "users",
      "fields": [
        { "id": 1, "name": "email", "type": "email", "required": true },
        { "id": 2, "name": "name", "type": "single-line-text", "required": true },
        {
          "id": 3,
          "name": "role",
          "type": "single-select",
          "options": ["admin", "user", "guest"],
          "required": true
        },
        { "id": 4, "name": "age", "type": "integer", "min": 0, "max": 150 },
        { "id": 5, "name": "is_active", "type": "checkbox", "default": true }
      ]
    }
  ]
}
```

**Invalid Configuration** (Invalid table name):

```json
{
  "name": "my-app",
  "tables": [
    {
      "id": 1,
      "name": "Users",
      "fields": [{ "id": 1, "name": "email", "type": "email" }]
    }
  ]
}
```

**Expected Error**: "Table name must start with lowercase letter and contain only lowercase letters, numbers, and underscores"

**Invalid Configuration** (No fields):

```json
{
  "name": "my-app",
  "tables": [
    {
      "id": 1,
      "name": "users",
      "fields": []
    }
  ]
}
```

**Expected Error**: "At least one field is required"

---

## UI Test Identifiers (data-testid)

| Element            | data-testid Pattern          | Purpose                          |
| ------------------ | ---------------------------- | -------------------------------- |
| Container          | `tables-container`           | Main wrapper for tables display  |
| Table Row          | `table-{tableName}`          | Individual table row             |
| Field Container    | `field-{fieldName}`          | Field display container          |
| Field Input        | `field-{fieldName}-input`    | Input element for field          |
| Field Select       | `field-{fieldName}-select`   | Select dropdown for options      |
| Required Indicator | `field-{fieldName}-required` | Shows field is required          |
| Field Error        | `field-{fieldName}-error`    | Displays field validation errors |
| Tables Error       | `tables-error`               | Displays table-level errors      |
| Submit Button      | `submit-btn`                 | Form submission button           |

---

## Definition of Done

**Schema Implementation** (schema-architect agent):

- [ ] Created `src/domain/models/app/tables.ts`
- [ ] Implemented TablesSchema with all field type unions
- [ ] Added annotations: title, description, examples for all schemas
- [ ] Exported types: `export type Tables`, `export type Table`, `export type Field`
- [ ] Created `src/domain/models/app/tables.test.ts`
- [ ] Tests cover: valid tables, invalid names, missing fields, all field types
- [ ] All tests pass: `bun test src/domain/models/app/tables.test.ts`

**E2E Tests** (e2e-red-test-writer agent):

- [ ] Created `tests/app/tables.spec.ts`
- [ ] Implemented 8+ @spec tests (all with test.fixme)
- [ ] Implemented 1 @regression test (with test.fixme)
- [ ] Implemented @critical test (with test.fixme)
- [ ] All data-testid patterns match UI identifier table
- [ ] All error messages match validation rules exactly
- [ ] Tests follow GIVEN-WHEN-THEN structure

**Integration**:

- [ ] Added `tables` to AppSchema in `src/domain/models/app/index.ts`
- [ ] Property is optional: `tables: Schema.optional(TablesSchema)`
- [ ] Updated integration tests in `src/domain/models/app/index.test.ts`
- [ ] Exported updated JSON Schema: `bun run scripts/export-schema.ts`
- [ ] Verified `schemas/0.0.1/app.schema.json` includes tables property

---

## Technical Approach

**Step 1**: Schema-Architect Agent

1. Read this roadmap phase file
2. Create `src/domain/models/app/tables.ts` using Effect Schema Blueprint above
3. Implement all field type schemas (Text, Number, Date, Checkbox, SingleSelect)
4. Implement validation rules with exact error messages
5. Add annotations (title, description, examples) to all schemas
6. Create `src/domain/models/app/tables.test.ts`
7. Verify all tests pass

**Step 2**: Integration

1. Import TablesSchema in `src/domain/models/app/index.ts`
2. Add to AppSchema: `tables: Schema.optional(TablesSchema)`
3. Update integration tests in `src/domain/models/app/index.test.ts`
4. Export JSON Schema: `bun run scripts/export-schema.ts`

**Step 3**: E2E-Red-Test-Writer Agent

1. Read this roadmap phase file
2. Create `tests/app/tables.spec.ts` using E2E Test Blueprint above
3. Implement all @spec tests (8+ tests, all with test.fixme)
4. Implement @regression test (with test.fixme)
5. Implement @critical test (with test.fixme)
6. Verify data-testid patterns match UI identifier table

**Step 4**: E2E-Test-Fixer Agent (Later - separate workflow)

1. Remove test.fixme() from first @spec test
2. Implement minimal UI code to make test pass
3. Repeat for remaining @spec tests one by one
4. Finally make @regression test pass
5. Make @critical test pass

---

## Dependencies

**Requires** (must be implemented first):

- Phase 0: Foundation (name, version, description) ✅ DONE

**Enables** (other features that depend on this):

- Phase 2: Advanced Fields (relationships, attachments)
- Phase 3: Pages (table-view, detail-view, forms that save to tables)
- Phase 4: Automations (database triggers on table events)

**Conflicts With**:

- None

---

## Migration Path

**From v0.0.1 to v0.1.0**:

- **Breaking Change**: None (tables property is optional)
- **Migration**: Existing apps continue to work without tables property

**To v0.2.0**:

- **Non-Breaking**: New field types added (multi-select, relationship, attachments)
- **Migration**: Automatic, no changes required

---

## API Reference

See [API Conventions](../../architecture/api-conventions.md#tables-api) for complete API documentation:

- `GET /api/tables/{tableName}/records` - List all records
- `GET /api/tables/{tableName}/records/{id}` - Get single record
- `POST /api/tables/{tableName}/records` - Create record
- `PATCH /api/tables/{tableName}/records/{id}` - Update record
- `DELETE /api/tables/{tableName}/records/{id}` - Delete record

---

**Phase Status**: ⏳ NOT STARTED
**Ready for Implementation**: ✅ YES (all prerequisites complete)
**Next Phase**: [Phase 2: Advanced Fields](./phase-2-advanced-fields.md)
