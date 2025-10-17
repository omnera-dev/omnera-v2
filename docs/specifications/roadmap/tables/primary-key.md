# Tables.primaryKey

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 50 points

Primary key configuration for the table. The primary key uniquely identifies each row and is automatically indexed.

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Tables.primaryKey Schema

**Location**: `src/domain/models/app/tables.primaryKey.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

````typescript
/**
 * Primary Key
 *
 * Primary key configuration for the table. The primary key uniquely identifies each row and is automatically indexed.
 *
 * @example
 * ```typescript
 * {
 *   "type": "auto-increment",
 *   "field": "id"
 * }
 * ```
 */
export const Tables.primaryKeySchema = Schema.Struct({
    type: Schema.String.pipe(
      Schema.annotations({
      description: "Primary key generation strategy. 'auto-increment' uses sequential integers (1, 2, 3...), 'uuid' generates random unique identifiers, 'composite' uses multiple fields together."
    })
    ),
    field: Schema.optional(Schema.String.pipe(
      Schema.pattern(/^[a-z][a-z0-9_]*$/, {
      message: () => 'Field name for single-column primary key. Only used with 'auto-increment' or 'uuid' type.'
    }),
      Schema.annotations({
      description: "Field name for single-column primary key. Only used with 'auto-increment' or 'uuid' type.",
      examples: ["id","user_id","product_id"]
    })
    )),
    fields: Schema.optional(Schema.Array(Schema.String.pipe(
      Schema.minLength(1, { message: () => 'This field is required' })
    ))),
  }).pipe(Schema.annotations({
    title: "Primary Key",
    description: "Primary key configuration for the table. The primary key uniquely identifies each row and is automatically indexed.",
    examples: [{"type":"auto-increment","field":"id"},{"type":"uuid","field":"id"},{"type":"composite","fields":["tenant_id","user_id"]}]
  }))

export type Tables.primaryKey = Schema.Schema.Type<typeof Tables.primaryKeySchema>
````

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.primary-key.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Tables.primary key
- **WHEN**: type field is empty
- **THEN**: display error "Type is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user configures Tables.primary key
- **WHEN**: entering Type
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user configures Tables.primary key
- **WHEN**: entering Field
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user configures Tables.primary key
- **WHEN**: entering Fields
- **THEN**: field is optional
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.primary key in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.primaryKey-type-input"]`
- `[data-testid="tables.primaryKey-type-error"]`
- `[data-testid="tables.primaryKey-field-input"]`
- `[data-testid="tables.primaryKey-fields-input"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 4 @spec E2E tests passing
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
