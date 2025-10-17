# Automation_action.filter.only-continue-if

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 55 points

Continue only if condition is met

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.filter.only-continue-if Schema

**Location**: `src/domain/models/app/automation_action.filter.only-continue-if.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Only Continue If
 *
 * Continue only if condition is met
 */
export const Automation_action.filter.only-continue-ifSchema = Schema.Struct({
    name: Schema.String,
    service: Schema.String,
    action: Schema.String,
    params: Schema.Unknown,
  }).pipe(Schema.annotations({
    title: "Only Continue If",
    description: "Continue only if condition is met"
  }))

export type Automation_action.filter.only-continue-if = Schema.Schema.Type<typeof Automation_action.filter.only-continue-ifSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.filter.only-continue-if.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I not run an action if the filter returns false
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an and filter action that returns true
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an and filter action that returns false
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an or filter action that returns true
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an or filter action that returns false
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an action if the filter returns true
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an exists filter action that returns true
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an exists filter action that returns false
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an does-not-exist filter action that returns true
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an does-not-exist filter action that returns false
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 11**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an is-true filter action that returns true
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 12**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an is-true filter action that returns false
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 13**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an is-false filter action that returns true
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 14**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an is-false filter action that returns false
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 15**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an contains filter action that returns true
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 16**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an contains filter action that returns false
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 17**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an does-not-contain filter action that returns true
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 18**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run an does-not-contain filter action that returns false
- **THEN**: it should work correctly
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-filter-only-continue-if-input"]`
- `[data-testid="automation_action-filter-only-continue-if-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 18 @spec E2E tests passing
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
