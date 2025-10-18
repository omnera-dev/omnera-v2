# Automation_action.http.get

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 68 points

Make a GET HTTP request

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

### Automation_action.http.get Schema

**Location**: `src/domain/models/app/automation_action.http.get.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * GET Request
 *
 * Make a GET HTTP request
 */
export const AutomationActionHttpGetSchema = Schema.Struct({
  name: Schema.String,
  service: Schema.String,
  action: Schema.String,
  params: Schema.Struct({
    url: Schema.String,
    headers: Schema.optional(Schema.Struct({})),
  }),
}).pipe(
  Schema.annotations({
    title: 'GET Request',
    description: 'Make a GET HTTP request',
  })
)

export type AutomationActionHttpGet = Schema.Schema.Type<typeof AutomationActionHttpGetSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.http.get.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run a get http action
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: I am working with headers
- **WHEN**: I run a get http action
- **THEN**: it should complete successfully
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-http-get-input"]`
- `[data-testid="automation_action-http-get-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 2 @spec E2E tests passing
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
