# Automation_action.http.response

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 76 points

Send an HTTP response

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.http.response Schema

**Location**: `src/domain/models/app/automation_action.http.response.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * HTTP Response
 *
 * Send an HTTP response
 */
export const Automation_action.http.responseSchema = Schema.Struct({
    name: Schema.String,
    service: Schema.String,
    action: Schema.String,
    params: Schema.optional(Schema.Struct({
      headers: Schema.optional(Schema.Struct({
      })),
      body: Schema.optional(Schema.Union(
        Schema.Struct({
        }),
        Schema.String
      )),
    })),
  }).pipe(Schema.annotations({
    title: "HTTP Response",
    description: "Send an HTTP response"
  }))

export type Automation_action.http.response = Schema.Schema.Type<typeof Automation_action.http.responseSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.http.response.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation action.http.response
- **WHEN**: name field is empty
- **THEN**: display error "Name is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation action.http.response
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation action.http.response
- **WHEN**: action field is empty
- **THEN**: display error "Action is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user configures Automation action.http.response
- **WHEN**: entering Name
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user configures Automation action.http.response
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation action.http.response
- **WHEN**: entering Action
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation action.http.response
- **WHEN**: entering Params
- **THEN**: field is optional
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation action.http.response in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action.http.response-name-input"]`
- `[data-testid="automation_action.http.response-name-error"]`
- `[data-testid="automation_action.http.response-service-input"]`
- `[data-testid="automation_action.http.response-service-error"]`
- `[data-testid="automation_action.http.response-action-input"]`
- `[data-testid="automation_action.http.response-action-error"]`
- `[data-testid="automation_action.http.response-params-input"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 7 @spec E2E tests passing
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
