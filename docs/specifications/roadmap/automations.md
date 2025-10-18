# Automations

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 5 points

Workflow automations that execute actions when triggered by specific events or conditions. Automations enable business logic such as sending emails when records are created, updating related data when values change, or integrating with external services via webhooks. Each automation consists of a trigger (when to run) and a sequence of actions (what to do).

## Implementation Status

**Schema**: 🔴 Not implemented

**Tests**: 🔴 No tests found

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
 * Workflow automations that execute actions when triggered by specific events or conditions. Automations enable business logic such as sending emails when records are created, updating related data when values change, or integrating with external services via webhooks. Each automation consists of a trigger (when to run) and a sequence of actions (what to do).
 */
export const AutomationsSchema = Schema.Array(Schema.Unknown).pipe(
  Schema.annotations({
    title: 'Automations',
    description:
      'Workflow automations that execute actions when triggered by specific events or conditions. Automations enable business logic such as sending emails when records are created, updating related data when values change, or integrating with external services via webhooks. Each automation consists of a trigger (when to run) and a sequence of actions (what to do).',
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

- **GIVEN**: the application is running
- **WHEN**: I list automations
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I disable an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I enable an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I open the edit url
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I return a list of automations
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: I am working with same integration actions in a queue
- **WHEN**: I run parallel automations
- **THEN**: it should complete successfully
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automations-input"]`
- `[data-testid="automations-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 6 @spec E2E tests passing
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
