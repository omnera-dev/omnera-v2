# Automation_action.google-gmail.send-email

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 144 points

Sends an email

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.google-gmail.send-email Schema

**Location**: `src/domain/models/app/automation_action.google-gmail.send-email.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Send Email
 *
 * Sends an email
 */
export const Automation_action.google-gmail.send-emailSchema = Schema.Struct({
    name: Schema.String,
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      from: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
      to: Schema.Union(
        Schema.String,
        Schema.Array(Schema.String)
      ),
      cc: Schema.optional(Schema.Union(
        Schema.String,
        Schema.Array(Schema.String)
      )),
      bcc: Schema.optional(Schema.Union(
        Schema.String,
        Schema.Array(Schema.String)
      )),
      subject: Schema.String,
      html: Schema.String,
      text: Schema.optional(Schema.String),
    }),
  }).pipe(Schema.annotations({
    title: "Send Email",
    description: "Sends an email"
  }))

export type Automation_action.google-gmail.send-email = Schema.Schema.Type<typeof Automation_action.google-gmail.send-emailSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.google-gmail.send-email.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation action.google-gmail.send-email
- **WHEN**: name field is empty
- **THEN**: display error "Name is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation action.google-gmail.send-email
- **WHEN**: account field is empty
- **THEN**: display error "Account is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation action.google-gmail.send-email
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user is configuring Automation action.google-gmail.send-email
- **WHEN**: action field is empty
- **THEN**: display error "Action is required"
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user is configuring Automation action.google-gmail.send-email
- **WHEN**: params field is empty
- **THEN**: display error "Params is required"
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation action.google-gmail.send-email
- **WHEN**: entering Name
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation action.google-gmail.send-email
- **WHEN**: entering Account
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: user configures Automation action.google-gmail.send-email
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: user configures Automation action.google-gmail.send-email
- **WHEN**: entering Action
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: user configures Automation action.google-gmail.send-email
- **WHEN**: entering Params
- **THEN**: field is required
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation action.google-gmail.send-email in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action.google-gmail.send-email-name-input"]`
- `[data-testid="automation_action.google-gmail.send-email-name-error"]`
- `[data-testid="automation_action.google-gmail.send-email-account-input"]`
- `[data-testid="automation_action.google-gmail.send-email-account-error"]`
- `[data-testid="automation_action.google-gmail.send-email-service-input"]`
- `[data-testid="automation_action.google-gmail.send-email-service-error"]`
- `[data-testid="automation_action.google-gmail.send-email-action-input"]`
- `[data-testid="automation_action.google-gmail.send-email-action-error"]`
- `[data-testid="automation_action.google-gmail.send-email-params-input"]`
- `[data-testid="automation_action.google-gmail.send-email-params-error"]`

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
