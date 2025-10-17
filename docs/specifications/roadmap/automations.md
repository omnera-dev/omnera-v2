# Automations

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

List of automation workflows that define business logic and integrations

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

## Dependencies

This property depends on:

- **tables**

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automations Schema

**Location**: `src/domain/models/app/automations.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Automations
 *
 * List of automation workflows that define business logic and integrations
 */
export const AutomationsSchema = Schema.Array(Schema.Unknown).pipe(
  Schema.annotations({
    title: 'Automations',
    description: 'List of automation workflows that define business logic and integrations',
  })
)

export type Automations = Schema.Schema.Type<typeof AutomationsSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automations.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user manages Automations
- **WHEN**: adding a new item
- **THEN**: display empty item form
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user manages Automations
- **WHEN**: removing an item
- **THEN**: item is removed from the list
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automations in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automations-list"]`
- `[data-testid="automations-add-button"]`
- `[data-testid="automations-remove-button"]`

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

- Requires: tables

---

## Related Documentation

- **Vision Schema**: [`docs/specifications/specs.schema.json`](../specs.schema.json)
- **Current Schema**: [`schemas/0.0.1/app.schema.json`](../../schemas/0.0.1/app.schema.json)
- **Testing Strategy**: [`docs/architecture/testing-strategy.md`](../../architecture/testing-strategy.md)
- **Main Roadmap**: [`ROADMAP.md`](../../../ROADMAP.md)
