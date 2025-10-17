# Automation_action.http.post

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 75 points

Make a POST HTTP request

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.http.post Schema

**Location**: `src/domain/models/app/automation_action.http.post.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * POST Request
 *
 * Make a POST HTTP request
 */
export const Automation_action.http.postSchema = Schema.Struct({
    name: Schema.String,
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      url: Schema.String,
      headers: Schema.optional(Schema.Struct({
      })),
      body: Schema.optional(Schema.Struct({
      })),
    }),
  }).pipe(Schema.annotations({
    title: "POST Request",
    description: "Make a POST HTTP request"
  }))

export type Automation_action.http.post = Schema.Schema.Type<typeof Automation_action.http.postSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.http.post.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run a post http action
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: I am working with headers
- **WHEN**: I run a post http action
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: I am working with env headers
- **WHEN**: I run a post http action
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: I am working with default env headers
- **WHEN**: I run a post http action
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: I am working with body
- **WHEN**: I run a post http action
- **THEN**: it should complete successfully
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-http-post-input"]`
- `[data-testid="automation_action-http-post-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 5 @spec E2E tests passing
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
