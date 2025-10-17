# Automation_trigger.linkedin-ads.new-lead-gen-form-response

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 87 points

Triggered when a new LinkedIn Lead Gen Form response is created

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_trigger.linkedin-ads.new-lead-gen-form-response Schema

**Location**: `src/domain/models/app/automation_trigger.linkedin-ads.new-lead-gen-form-response.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * New Lead Gen Form Response
 *
 * Triggered when a new LinkedIn Lead Gen Form response is created
 */
export const Automation_trigger.linkedin-ads.new-lead-gen-form-responseSchema = Schema.Struct({
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    event: Schema.String,
    params: Schema.Struct({
      organizationId: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        title: "LinkedIn Organization ID",
        description: "Required for non-sponsored lead forms"
      })
      )),
      sponsoredAccountId: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        title: "LinkedIn Sponsored Account ID",
        description: "Required for sponsored lead forms (leadType: SPONSORED)"
      })
      )),
      leadType: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Type of lead form. SPONSORED requires sponsoredAccountId"
      })
      )),
    }),
  }).pipe(Schema.annotations({
    title: "New Lead Gen Form Response",
    description: "Triggered when a new LinkedIn Lead Gen Form response is created"
  }))

export type Automation_trigger.linkedin-ads.new-lead-gen-form-response = Schema.Schema.Type<typeof Automation_trigger.linkedin-ads.new-lead-gen-form-responseSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_trigger.linkedin-ads.new-lead-gen-form-response.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation trigger.linkedin-ads.new-lead-gen-form-response
- **WHEN**: account field is empty
- **THEN**: display error "Account is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation trigger.linkedin-ads.new-lead-gen-form-response
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation trigger.linkedin-ads.new-lead-gen-form-response
- **WHEN**: event field is empty
- **THEN**: display error "Event is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user is configuring Automation trigger.linkedin-ads.new-lead-gen-form-response
- **WHEN**: params field is empty
- **THEN**: display error "Params is required"
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user configures Automation trigger.linkedin-ads.new-lead-gen-form-response
- **WHEN**: entering Account
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation trigger.linkedin-ads.new-lead-gen-form-response
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation trigger.linkedin-ads.new-lead-gen-form-response
- **WHEN**: entering Event
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: user configures Automation trigger.linkedin-ads.new-lead-gen-form-response
- **WHEN**: entering Params
- **THEN**: field is optional
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation trigger.linkedin-ads.new-lead-gen-form-response in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_trigger.linkedin-ads.new-lead-gen-form-response-account-input"]`
- `[data-testid="automation_trigger.linkedin-ads.new-lead-gen-form-response-account-error"]`
- `[data-testid="automation_trigger.linkedin-ads.new-lead-gen-form-response-service-input"]`
- `[data-testid="automation_trigger.linkedin-ads.new-lead-gen-form-response-service-error"]`
- `[data-testid="automation_trigger.linkedin-ads.new-lead-gen-form-response-event-input"]`
- `[data-testid="automation_trigger.linkedin-ads.new-lead-gen-form-response-event-error"]`
- `[data-testid="automation_trigger.linkedin-ads.new-lead-gen-form-response-params-input"]`
- `[data-testid="automation_trigger.linkedin-ads.new-lead-gen-form-response-params-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 8 @spec E2E tests passing
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
