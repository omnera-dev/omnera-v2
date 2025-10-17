# Automation_action.linkedin-ads.create-lead-notification-subscription

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 97 points

Creates a LinkedIn Lead Notification subscription at owner level

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.linkedin-ads.create-lead-notification-subscription Schema

**Location**: `src/domain/models/app/automation_action.linkedin-ads.create-lead-notification-subscription.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Create Lead Notification Subscription
 *
 * Creates a LinkedIn Lead Notification subscription at owner level
 */
export const Automation_action.linkedin-ads.create-lead-notification-subscriptionSchema = Schema.Struct({
    name: Schema.String,
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      webhook: Schema.String.pipe(
        Schema.annotations({
        title: "Webhook URL"
      })
      ),
      organizationId: Schema.String.pipe(
        Schema.annotations({
        title: "LinkedIn Organization ID"
      })
      ),
      leadType: Schema.optional(Schema.String),
    }),
  }).pipe(Schema.annotations({
    title: "Create Lead Notification Subscription",
    description: "Creates a LinkedIn Lead Notification subscription at owner level"
  }))

export type Automation_action.linkedin-ads.create-lead-notification-subscription = Schema.Schema.Type<typeof Automation_action.linkedin-ads.create-lead-notification-subscriptionSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.linkedin-ads.create-lead-notification-subscription.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: name field is empty
- **THEN**: display error "Name is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: account field is empty
- **THEN**: display error "Account is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user is configuring Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: action field is empty
- **THEN**: display error "Action is required"
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user is configuring Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: params field is empty
- **THEN**: display error "Params is required"
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: entering Name
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: entering Account
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: user configures Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: user configures Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: entering Action
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: user configures Automation action.linkedin-ads.create-lead-notification-subscription
- **WHEN**: entering Params
- **THEN**: field is required
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation action.linkedin-ads.create-lead-notification-subscription in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-name-input"]`
- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-name-error"]`
- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-account-input"]`
- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-account-error"]`
- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-service-input"]`
- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-service-error"]`
- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-action-input"]`
- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-action-error"]`
- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-params-input"]`
- `[data-testid="automation_action.linkedin-ads.create-lead-notification-subscription-params-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 10 @spec E2E tests passing
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
