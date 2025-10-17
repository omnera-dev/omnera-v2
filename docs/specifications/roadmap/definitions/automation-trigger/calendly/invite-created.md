# Automation_trigger.calendly.invite-created

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 82 points

Triggered when a Calendly invite is created

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_trigger.calendly.invite-created Schema

**Location**: `src/domain/models/app/automation_trigger.calendly.invite-created.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Invite Created
 *
 * Triggered when a Calendly invite is created
 */
export const Automation_trigger.calendly.invite-createdSchema = Schema.Struct({
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    event: Schema.String,
    params: Schema.optional(Schema.Struct({
      organization: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "The organization of the trigger"
      })
      )),
      scope: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "The scope of the trigger"
      })
      )),
    })),
  }).pipe(Schema.annotations({
    title: "Invite Created",
    description: "Triggered when a Calendly invite is created"
  }))

export type Automation_trigger.calendly.invite-created = Schema.Schema.Type<typeof Automation_trigger.calendly.invite-createdSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_trigger.calendly.invite-created.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation trigger.calendly.invite-created
- **WHEN**: account field is empty
- **THEN**: display error "Account is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation trigger.calendly.invite-created
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation trigger.calendly.invite-created
- **WHEN**: event field is empty
- **THEN**: display error "Event is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user configures Automation trigger.calendly.invite-created
- **WHEN**: entering Account
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user configures Automation trigger.calendly.invite-created
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation trigger.calendly.invite-created
- **WHEN**: entering Event
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation trigger.calendly.invite-created
- **WHEN**: entering Params
- **THEN**: field is optional
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation trigger.calendly.invite-created in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_trigger.calendly.invite-created-account-input"]`
- `[data-testid="automation_trigger.calendly.invite-created-account-error"]`
- `[data-testid="automation_trigger.calendly.invite-created-service-input"]`
- `[data-testid="automation_trigger.calendly.invite-created-service-error"]`
- `[data-testid="automation_trigger.calendly.invite-created-event-input"]`
- `[data-testid="automation_trigger.calendly.invite-created-event-error"]`
- `[data-testid="automation_trigger.calendly.invite-created-params-input"]`

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
