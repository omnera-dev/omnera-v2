# Tables.fields.number-field.precision

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 10 points

Number of decimal places (for decimal type)

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Tables.fields.number-field.precision Schema

**Location**: `src/domain/models/app/tables.fields.number-field.precision.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 *
 * Number of decimal places (for decimal type)
 */
export const Tables.fields.number-field.precisionSchema = Schema.Int.pipe(
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(10),
    Schema.annotations({
    description: "Number of decimal places (for decimal type)"
  })
  )

export type Tables.fields.number-field.precision = Schema.Schema.Type<typeof Tables.fields.number-field.precisionSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.fields.number-field.precision.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user enters Tables.fields.number-field.precision
- **WHEN**: value is less than 0
- **THEN**: display error "Minimum value is 0"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user enters Tables.fields.number-field.precision
- **WHEN**: value exceeds 10
- **THEN**: display error "Maximum value is 10"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user enters Tables.fields.number-field.precision
- **WHEN**: value is a decimal number
- **THEN**: display error "Value must be an integer"
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.fields.number-field.precision in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.fields.number-field.precision-input"]`
- `[data-testid="tables.fields.number-field.precision-error"]`

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
