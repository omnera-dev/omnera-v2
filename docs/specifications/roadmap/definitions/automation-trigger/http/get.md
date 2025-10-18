# Automation_trigger.http.get

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 55 points

Triggered by a GET request

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

### Automation_trigger.http.get Schema

**Location**: `src/domain/models/app/automation_trigger.http.get.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * GET Request
 *
 * Triggered by a GET request
 */
export const AutomationTriggerHttpGetSchema = Schema.Struct({
  service: Schema.String,
  event: Schema.String,
  params: Schema.Struct({
    path: Schema.String,
    respondImmediately: Schema.optional(Schema.Boolean),
  }),
}).pipe(
  Schema.annotations({
    title: 'GET Request',
    description: 'Triggered by a GET request',
  })
)

export type AutomationTriggerHttpGet = Schema.Schema.Type<typeof AutomationTriggerHttpGetSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_trigger.http.get.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: Facebook sends GET validation request
- **WHEN**: I respond with hub.challenge
- **THEN**: it should succeed
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: hub.mode is not subscribe
- **WHEN**: I not respond with challenge
- **THEN**: it should succeed
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: I am working with a get request
- **WHEN**: I not found the automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: I am working with a wrong path
- **WHEN**: I not found the automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: LinkedIn sends GET validation request
- **WHEN**: I respond with correctly computed challengeResponse
- **THEN**: it should succeed
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: I am working with correct HMAC computation
- **WHEN**: I handle GET validation for HTTP trigger path
- **THEN**: it should complete successfully
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_trigger-http-get-input"]`
- `[data-testid="automation_trigger-http-get-error"]`

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

- None (ready to start)

---

## Related Documentation

- **Vision Schema**: [`docs/specifications/specs.schema.json`](../specs.schema.json)
- **Current Schema**: [`schemas/0.0.1/app.schema.json`](../../schemas/0.0.1/app.schema.json)
- **Testing Strategy**: [`docs/architecture/testing-strategy.md`](../../architecture/testing-strategy.md)
- **Main Roadmap**: [`ROADMAP.md`](../../../ROADMAP.md)
