# Tables.fields.formula-field.resultType

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

Expected data type of the formula result

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Tables.fields.formula-field.resultType Schema

**Location**: `src/domain/models/app/tables.fields.formula-field.resultType.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 *
 * Expected data type of the formula result
 */
export const Tables.fields.formula-field.resultTypeSchema = Schema.Literal("text", "number", "boolean", "date").pipe(Schema.annotations({
    description: "Expected data type of the formula result"
  }))

export type Tables.fields.formula-field.resultType = Schema.Schema.Type<typeof Tables.fields.formula-field.resultTypeSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.fields.formula-field.result-type.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user selects Tables.fields.formula-field.result type
- **WHEN**: one of the valid options is selected
- **THEN**: accept the selection without error
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is presented with Tables.fields.formula-field.result type options
- **WHEN**: viewing the dropdown
- **THEN**: display options: "text", "number", "boolean", "date"
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.fields.formula-field.result type in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.fields.formula-field.resultType-input"]`
- `[data-testid="tables.fields.formula-field.resultType-error"]`
- `[data-testid="tables.fields.formula-field.resultType-select"]`
- `[data-testid="tables.fields.formula-field.resultType-option"]`

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
