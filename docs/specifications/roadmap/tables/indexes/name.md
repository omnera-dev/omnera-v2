# Tables.indexes.name

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 10 points

Name of the index. Use descriptive names like 'idx_tablename_fieldname'

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

### Tables.indexes.name Schema

**Location**: `src/domain/models/app/tables.indexes.name.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * 
 * Name of the index. Use descriptive names like 'idx_tablename_fieldname'
 * 
 * @example
 * ```typescript
 * "idx_users_email"
 * ```
 */
export const TablesIndexesNameSchema = Schema.String.pipe(
    Schema.minLength(1, { message: () => 'This field is required' }),
    Schema.pattern(/^[a-z][a-z0-9_]*$/, {
    message: () => 'Name of the index. Use descriptive names like 'idx_tablename_fieldname''
  }),
    Schema.annotations({
    description: "Name of the index. Use descriptive names like 'idx_tablename_fieldname'",
    examples: ["idx_users_email","idx_products_sku","idx_orders_status"]
  })
  )

export type TablesIndexesName = Schema.Schema.Type<typeof TablesIndexesNameSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.indexes.name.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user enters Tables.indexes.name
- **WHEN**: input length is less than 1 characters
- **THEN**: display error "Minimum length is 1 characters"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user enters Tables.indexes.name
- **WHEN**: input does not match required pattern
- **THEN**: display error "Name of the index. Use descriptive names like 'idx_tablename_fieldname'"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user enters valid Tables.indexes.name
- **WHEN**: input matches required pattern
- **THEN**: accept input without error
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.indexes.name in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.indexes.name-input"]`
- `[data-testid="tables.indexes.name-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 3 @spec E2E tests passing
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
