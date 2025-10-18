# Tables.uniqueConstraints

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

Composite unique constraints ensure that combinations of multiple field values are unique across all rows. Use this when you need uniqueness across multiple fields (e.g., email + tenant_id must be unique together).

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

### Tables.uniqueConstraints Schema

**Location**: `src/domain/models/app/tables.uniqueConstraints.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Unique Constraints
 * 
 * Composite unique constraints ensure that combinations of multiple field values are unique across all rows. Use this when you need uniqueness across multiple fields (e.g., email + tenant_id must be unique together).
 * 
 * @example
 * ```typescript
 * [
 *   {
 *     "name": "uq_user_email_tenant",
 *     "fields": [
 *       "email",
 *       "tenant_id"
 *     ]
 *   },
 *   {
 *     "name": "uq_product_sku_variant",
 *     "fields": [
 *       "sku",
 *       "variant_id"
 *     ]
 *   }
 * ]
 * ```
 */
export const TablesUniqueConstraintsSchema = Schema.Array(Schema.Struct({
    name: Schema.String.pipe(
      Schema.minLength(1, { message: () => 'This field is required' }),
      Schema.pattern(/^[a-z][a-z0-9_]*$/, {
      message: () => 'Name of the unique constraint. Use descriptive names like 'uq_tablename_field1_field2''
    }),
      Schema.annotations({
      description: "Name of the unique constraint. Use descriptive names like 'uq_tablename_field1_field2'",
      examples: ["uq_users_email_tenant","uq_products_sku_variant","uq_orders_number_year"]
    })
    ),
    fields: Schema.Array(Schema.String.pipe(
      Schema.minLength(1, { message: () => 'This field is required' })
    )),
  })).pipe(
    Schema.annotations({
    title: "Unique Constraints",
    description: "Composite unique constraints ensure that combinations of multiple field values are unique across all rows. Use this when you need uniqueness across multiple fields (e.g., email + tenant_id must be unique together).",
    examples: [[{"name":"uq_user_email_tenant","fields":["email","tenant_id"]},{"name":"uq_product_sku_variant","fields":["sku","variant_id"]}]]
  })
  )

export type TablesUniqueConstraints = Schema.Schema.Type<typeof TablesUniqueConstraintsSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.unique-constraints.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user manages Tables.unique constraints
- **WHEN**: adding a new item
- **THEN**: display empty item form
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user manages Tables.unique constraints
- **WHEN**: removing an item
- **THEN**: item is removed from the list
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.unique constraints in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.uniqueConstraints-list"]`
- `[data-testid="tables.uniqueConstraints-add-button"]`
- `[data-testid="tables.uniqueConstraints-remove-button"]`

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
