# Tables.fields.relationship-field.relationType

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

Type of relationship

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Tables.fields.relationship-field.relationType Schema

**Location**: `src/domain/models/app/tables.fields.relationship-field.relationType.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 *
 * Type of relationship
 */
export const Tables.fields.relationship-field.relationTypeSchema = Schema.Literal("one-to-one", "one-to-many", "many-to-many").pipe(Schema.annotations({
    description: "Type of relationship"
  }))

export type Tables.fields.relationship-field.relationType = Schema.Schema.Type<typeof Tables.fields.relationship-field.relationTypeSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.fields.relationship-field.relation-type.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user selects Tables.fields.relationship-field.relation type
- **WHEN**: one of the valid options is selected
- **THEN**: accept the selection without error
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is presented with Tables.fields.relationship-field.relation type options
- **WHEN**: viewing the dropdown
- **THEN**: display options: "one-to-one", "one-to-many", "many-to-many"
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.fields.relationship-field.relation type in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.fields.relationship-field.relationType-input"]`
- `[data-testid="tables.fields.relationship-field.relationType-error"]`
- `[data-testid="tables.fields.relationship-field.relationType-select"]`
- `[data-testid="tables.fields.relationship-field.relationType-option"]`

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
