# Automation_action.linkedin-ads.get-lead-form-response

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 85 points

Retrieves a single LinkedIn Lead Form Response by its ID

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.linkedin-ads.get-lead-form-response Schema

**Location**: `src/domain/models/app/automation_action.linkedin-ads.get-lead-form-response.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Get Lead Form Response
 *
 * Retrieves a single LinkedIn Lead Form Response by its ID
 */
export const Automation_action.linkedin-ads.get-lead-form-responseSchema = Schema.Struct({
    name: Schema.String,
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      leadResponseId: Schema.String.pipe(
        Schema.annotations({
        title: "Lead Response ID",
        description: "The unique identifier for the lead form response"
      })
      ),
    }),
  }).pipe(Schema.annotations({
    title: "Get Lead Form Response",
    description: "Retrieves a single LinkedIn Lead Form Response by its ID"
  }))

export type Automation_action.linkedin-ads.get-lead-form-response = Schema.Schema.Type<typeof Automation_action.linkedin-ads.get-lead-form-responseSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.linkedin-ads.get-lead-form-response.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I create a record from an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-linkedin-ads-get-lead-form-response-input"]`
- `[data-testid="automation_action-linkedin-ads-get-lead-form-response-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 1 @spec E2E tests passing
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
