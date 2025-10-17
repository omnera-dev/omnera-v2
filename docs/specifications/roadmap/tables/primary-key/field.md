# Tables.primaryKey.field

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

Field name for single-column primary key. Only used with 'auto-increment' or 'uuid' type.

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Tables.primaryKey.field Schema

**Location**: `src/domain/models/app/tables.primaryKey.field.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

````typescript
/**
 *
 * Field name for single-column primary key. Only used with 'auto-increment' or 'uuid' type.
 *
 * @example
 * ```typescript
 * "id"
 * ```
 */
export const Tables.primaryKey.fieldSchema = Schema.String.pipe(
    Schema.pattern(/^[a-z][a-z0-9_]*$/, {
    message: () => 'Field name for single-column primary key. Only used with 'auto-increment' or 'uuid' type.'
  }),
    Schema.annotations({
    description: "Field name for single-column primary key. Only used with 'auto-increment' or 'uuid' type.",
    examples: ["id","user_id","product_id"]
  })
  )

export type Tables.primaryKey.field = Schema.Schema.Type<typeof Tables.primaryKey.fieldSchema>
````

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.primary-key.field.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user enters Tables.primary key.field
- **WHEN**: input does not match required pattern
- **THEN**: display error "Field name for single-column primary key. Only used with 'auto-increment' or 'uuid' type."
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user enters valid Tables.primary key.field
- **WHEN**: input matches required pattern
- **THEN**: accept input without error
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.primary key.field in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.primaryKey.field-input"]`
- `[data-testid="tables.primaryKey.field-error"]`

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
