# Automation_trigger.http.get

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 55 points

Triggered by a GET request

## Implementation Status

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
export const Automation_trigger.http.getSchema = Schema.Struct({
    service: Schema.String,
    event: Schema.String,
    params: Schema.Struct({
      path: Schema.String,
      respondImmediately: Schema.optional(Schema.Boolean),
    }),
  }).pipe(Schema.annotations({
    title: "GET Request",
    description: "Triggered by a GET request"
  }))

export type Automation_trigger.http.get = Schema.Schema.Type<typeof Automation_trigger.http.getSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_trigger.http.get.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation trigger.http.get
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation trigger.http.get
- **WHEN**: event field is empty
- **THEN**: display error "Event is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation trigger.http.get
- **WHEN**: params field is empty
- **THEN**: display error "Params is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user configures Automation trigger.http.get
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user configures Automation trigger.http.get
- **WHEN**: entering Event
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation trigger.http.get
- **WHEN**: entering Params
- **THEN**: field is required
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation trigger.http.get in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_trigger.http.get-service-input"]`
- `[data-testid="automation_trigger.http.get-service-error"]`
- `[data-testid="automation_trigger.http.get-event-input"]`
- `[data-testid="automation_trigger.http.get-event-error"]`
- `[data-testid="automation_trigger.http.get-params-input"]`
- `[data-testid="automation_trigger.http.get-params-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 6 @spec E2E tests passing
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
