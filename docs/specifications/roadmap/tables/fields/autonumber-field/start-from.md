# Tables.fields.autonumber-field.startFrom

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

Starting number

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Tables.fields.autonumber-field.startFrom Schema

**Location**: `src/domain/models/app/tables.fields.autonumber-field.startFrom.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 *
 * Starting number
 */
export const Tables.fields.autonumber-field.startFromSchema = Schema.Int.pipe(
    Schema.greaterThanOrEqualTo(1),
    Schema.annotations({
    description: "Starting number"
  })
  )

export type Tables.fields.autonumber-field.startFrom = Schema.Schema.Type<typeof Tables.fields.autonumber-field.startFromSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.fields.autonumber-field.start-from.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user enters Tables.fields.autonumber-field.start from
- **WHEN**: value is less than 1
- **THEN**: display error "Minimum value is 1"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user enters Tables.fields.autonumber-field.start from
- **WHEN**: value is a decimal number
- **THEN**: display error "Value must be an integer"
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.fields.autonumber-field.start from in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.fields.autonumber-field.startFrom-input"]`
- `[data-testid="tables.fields.autonumber-field.startFrom-error"]`

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
