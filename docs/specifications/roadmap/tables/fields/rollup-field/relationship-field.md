# Tables.fields.rollup-field.relationshipField

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

Name of the relationship field to aggregate from

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Tables.fields.rollup-field.relationshipField Schema

**Location**: `src/domain/models/app/tables.fields.rollup-field.relationshipField.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 *
 * Name of the relationship field to aggregate from
 */
export const Tables.fields.rollup-field.relationshipFieldSchema = Schema.String.pipe(
    Schema.minLength(1, { message: () => 'This field is required' }),
    Schema.annotations({
    description: "Name of the relationship field to aggregate from"
  })
  )

export type Tables.fields.rollup-field.relationshipField = Schema.Schema.Type<typeof Tables.fields.rollup-field.relationshipFieldSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.fields.rollup-field.relationship-field.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user enters Tables.fields.rollup-field.relationship field
- **WHEN**: input length is less than 1 characters
- **THEN**: display error "Minimum length is 1 characters"
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.fields.rollup-field.relationship field in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.fields.rollup-field.relationshipField-input"]`
- `[data-testid="tables.fields.rollup-field.relationshipField-error"]`

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
