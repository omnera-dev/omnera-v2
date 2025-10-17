# Automation_action.facebook-ads.get-leadgen

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 85 points

Retrieves lead generation data using the leadgen_id from webhook

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.facebook-ads.get-leadgen Schema

**Location**: `src/domain/models/app/automation_action.facebook-ads.get-leadgen.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Get LeadGen
 *
 * Retrieves lead generation data using the leadgen_id from webhook
 */
export const Automation_action.facebook-ads.get-leadgenSchema = Schema.Struct({
    name: Schema.String,
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      leadgenId: Schema.String.pipe(
        Schema.annotations({
        title: "Leadgen ID",
        description: "The leadgen_id from Facebook webhook data"
      })
      ),
    }),
  }).pipe(Schema.annotations({
    title: "Get LeadGen",
    description: "Retrieves lead generation data using the leadgen_id from webhook"
  }))

export type Automation_action.facebook-ads.get-leadgen = Schema.Schema.Type<typeof Automation_action.facebook-ads.get-leadgenSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.facebook-ads.get-leadgen.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation action.facebook-ads.get-leadgen
- **WHEN**: name field is empty
- **THEN**: display error "Name is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation action.facebook-ads.get-leadgen
- **WHEN**: account field is empty
- **THEN**: display error "Account is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation action.facebook-ads.get-leadgen
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user is configuring Automation action.facebook-ads.get-leadgen
- **WHEN**: action field is empty
- **THEN**: display error "Action is required"
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user is configuring Automation action.facebook-ads.get-leadgen
- **WHEN**: params field is empty
- **THEN**: display error "Params is required"
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation action.facebook-ads.get-leadgen
- **WHEN**: entering Name
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation action.facebook-ads.get-leadgen
- **WHEN**: entering Account
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: user configures Automation action.facebook-ads.get-leadgen
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: user configures Automation action.facebook-ads.get-leadgen
- **WHEN**: entering Action
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: user configures Automation action.facebook-ads.get-leadgen
- **WHEN**: entering Params
- **THEN**: field is required
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation action.facebook-ads.get-leadgen in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action.facebook-ads.get-leadgen-name-input"]`
- `[data-testid="automation_action.facebook-ads.get-leadgen-name-error"]`
- `[data-testid="automation_action.facebook-ads.get-leadgen-account-input"]`
- `[data-testid="automation_action.facebook-ads.get-leadgen-account-error"]`
- `[data-testid="automation_action.facebook-ads.get-leadgen-service-input"]`
- `[data-testid="automation_action.facebook-ads.get-leadgen-service-error"]`
- `[data-testid="automation_action.facebook-ads.get-leadgen-action-input"]`
- `[data-testid="automation_action.facebook-ads.get-leadgen-action-error"]`
- `[data-testid="automation_action.facebook-ads.get-leadgen-params-input"]`
- `[data-testid="automation_action.facebook-ads.get-leadgen-params-error"]`

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
