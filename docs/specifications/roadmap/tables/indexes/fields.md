# Tables.indexes.fields

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 10 points

Field names to include in the index. Order matters for multi-column indexes.

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

### Tables.indexes.fields Schema

**Location**: `src/domain/models/app/tables.indexes.fields.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

````typescript
/**
 *
 * Field names to include in the index. Order matters for multi-column indexes.
 *
 * @example
 * ```typescript
 * [
 *   "email"
 * ]
 * ```
 */
export const TablesIndexesFieldsSchema = Schema.Array(
  Schema.String.pipe(Schema.minLength(1, { message: () => 'This field is required' }))
).pipe(
  Schema.minItems(1),
  Schema.annotations({
    description: 'Field names to include in the index. Order matters for multi-column indexes.',
    examples: [['email'], ['first_name', 'last_name'], ['status', 'created_at']],
  })
)

export type TablesIndexesFields = Schema.Schema.Type<typeof TablesIndexesFieldsSchema>
````

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.indexes.fields.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user configures Tables.indexes.fields
- **WHEN**: array has fewer than 1 items
- **THEN**: display error "Minimum 1 items required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user manages Tables.indexes.fields
- **WHEN**: adding a new item
- **THEN**: display empty item form
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user manages Tables.indexes.fields
- **WHEN**: removing an item
- **THEN**: item is removed from the list
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.indexes.fields in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.indexes.fields-list"]`
- `[data-testid="tables.indexes.fields-add-button"]`
- `[data-testid="tables.indexes.fields-remove-button"]`

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
