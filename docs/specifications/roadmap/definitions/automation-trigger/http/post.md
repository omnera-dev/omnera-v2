# Automation_trigger.http.post

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 63 points

Triggered by a POST request

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

### Automation_trigger.http.post Schema

**Location**: `src/domain/models/app/automation_trigger.http.post.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * POST Request
 * 
 * Triggered by a POST request
 */
export const AutomationTriggerHttpPostSchema = Schema.Struct({
    service: Schema.String,
    event: Schema.String,
    params: Schema.Struct({
      path: Schema.String,
      respondImmediately: Schema.optional(Schema.Boolean),
      requestBody: Schema.optional(Schema.Unknown),
    }),
  }).pipe(Schema.annotations({
    title: "POST Request",
    description: "Triggered by a POST request"
  }))

export type AutomationTriggerHttpPost = Schema.Schema.Type<typeof AutomationTriggerHttpPostSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_trigger.http.post.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: a airtable record is created
- **WHEN**: I trigger an automation
- **THEN**: it should succeed
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: POST request sent
- **WHEN**: I process actual lead data
- **THEN**: it should succeed
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I handle validation for HTTP trigger path as well
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I trigger an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: I am working with immediate response
- **WHEN**: I trigger an automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: I am working with a invalid body
- **WHEN**: I not trigger an automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: I am working with a valid object body
- **WHEN**: I trigger an automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: I am working with a valid array body
- **WHEN**: I trigger an automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: I am working with a valid array body and respond immediately
- **WHEN**: I trigger an automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: I am working with form data
- **WHEN**: I trigger an automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 11**: Validation Test

- **GIVEN**: I am working with a post request
- **WHEN**: I not found the automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 12**: Validation Test

- **GIVEN**: a calendly invite is created
- **WHEN**: I trigger an automation
- **THEN**: it should succeed
- **Tag**: `@spec`

**Scenario 13**: Validation Test

- **GIVEN**: POST request sent
- **WHEN**: I process actual lead form data
- **THEN**: it should succeed
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_trigger-http-post-input"]`
- `[data-testid="automation_trigger-http-post-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 13 @spec E2E tests passing
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
