# Tables.indexes

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

Custom database indexes for query optimization. Indexes improve query performance by creating efficient lookup structures for specified fields.

## Implementation Status

**Schema**: 🔴 Not implemented

**Tests**: 🔴 No tests found

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Tables.indexes Schema

**Location**: `src/domain/models/app/tables.indexes.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

````typescript
/**
 * Database Indexes
 *
 * Custom database indexes for query optimization. Indexes improve query performance by creating efficient lookup structures for specified fields.
 *
 * @example
 * ```typescript
 * [
 *   {
 *     "name": "idx_user_email",
 *     "fields": [
 *       "email"
 *     ]
 *   },
 *   {
 *     "name": "idx_user_created",
 *     "fields": [
 *       "created_at"
 *     ],
 *     "unique": false
 *   }
 * ]
 * ```
 */
export const TablesIndexesSchema = Schema.Array(Schema.Struct({
    name: Schema.String.pipe(
      Schema.minLength(1, { message: () => 'This field is required' }),
      Schema.pattern(/^[a-z][a-z0-9_]*$/, {
      message: () => 'Name of the index. Use descriptive names like 'idx_tablename_fieldname''
    }),
      Schema.annotations({
      description: "Name of the index. Use descriptive names like 'idx_tablename_fieldname'",
      examples: ["idx_users_email","idx_products_sku","idx_orders_status"]
    })
    ),
    fields: Schema.Array(Schema.String.pipe(
      Schema.minLength(1, { message: () => 'This field is required' })
    )),
    unique: Schema.optional(Schema.Boolean),
  })).pipe(
    Schema.annotations({
    title: "Database Indexes",
    description: "Custom database indexes for query optimization. Indexes improve query performance by creating efficient lookup structures for specified fields.",
    examples: [[{"name":"idx_user_email","fields":["email"]},{"name":"idx_user_created","fields":["created_at"],"unique":false}]]
  })
  )

export type TablesIndexes = Schema.Schema.Type<typeof TablesIndexesSchema>
````

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.indexes.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user manages Tables.indexes
- **WHEN**: adding a new item
- **THEN**: display empty item form
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user manages Tables.indexes
- **WHEN**: removing an item
- **THEN**: item is removed from the list
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.indexes in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.indexes-list"]`
- `[data-testid="tables.indexes-add-button"]`
- `[data-testid="tables.indexes-remove-button"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 2 @spec E2E tests passing
- [ ] All 1 @regression E2E tests passing
- [ ] Unit test coverage >80%
- [ ] All TypeScript strict mode checks passing
- [ ] All ESLint checks passing
- [ ] All Prettier formatting checks passing
- [ ] JSON schema export updated via `bun run export:schema`

**Current Blockers**:

- None (ready to start)

---

## Related Documentation

- **Vision Schema**: [`docs/specifications/specs.schema.json`](../specs.schema.json)
- **Current Schema**: [`schemas/0.0.1/app.schema.json`](../../schemas/0.0.1/app.schema.json)
- **Testing Strategy**: [`docs/architecture/testing-strategy.md`](../../architecture/testing-strategy.md)
- **Main Roadmap**: [`ROADMAP.md`](../../../ROADMAP.md)
