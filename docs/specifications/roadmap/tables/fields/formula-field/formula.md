# Tables.fields.formula-field.formula

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

Formula expression to compute the value. Supports field references, operators, and functions.

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

### Tables.fields.formula-field.formula Schema

**Location**: `src/domain/models/app/tables.fields.formula-field.formula.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

````typescript
/**
 *
 * Formula expression to compute the value. Supports field references, operators, and functions.
 *
 * @example
 * ```typescript
 * "price * quantity"
 * ```
 */
export const TablesFieldsFormulaFieldFormulaSchema = Schema.String.pipe(
  Schema.minLength(1, { message: () => 'This field is required' }),
  Schema.annotations({
    description:
      'Formula expression to compute the value. Supports field references, operators, and functions.',
    examples: [
      'price * quantity',
      "CONCAT(first_name, ' ', last_name)",
      "IF(status = 'active', 'Yes', 'No')",
      'ROUND(total * 0.15, 2)',
    ],
  })
)

export type TablesFieldsFormulaFieldFormula = Schema.Schema.Type<
  typeof TablesFieldsFormulaFieldFormulaSchema
>
````

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.fields.formula-field.formula.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user enters Tables.fields.formula-field.formula
- **WHEN**: input length is less than 1 characters
- **THEN**: display error "Minimum length is 1 characters"
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.fields.formula-field.formula in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.fields.formula-field.formula-input"]`
- `[data-testid="tables.fields.formula-field.formula-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 1 @spec E2E tests passing
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
