# Automation_action.qonto.create-client

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 119 points

Creates a new client in Qonto

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.qonto.create-client Schema

**Location**: `src/domain/models/app/automation_action.qonto.create-client.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Create Client
 *
 * Creates a new client in Qonto
 */
export const Automation_action.qonto.create-clientSchema = Schema.Struct({
    name: Schema.String,
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      name: Schema.String.pipe(
        Schema.annotations({
        description: "Client name"
      })
      ),
      email: Schema.optional(Schema.String.pipe(
        Schema.pattern(/^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/, {
        message: () => 'Client email'
      }),
        Schema.annotations({
        description: "Client email"
      })
      )),
      phone: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Client phone number"
      })
      )),
      address: Schema.optional(Schema.Struct({
        street: Schema.String.pipe(
          Schema.annotations({
          description: "Street address"
        })
        ),
        city: Schema.String.pipe(
          Schema.annotations({
          description: "City"
        })
        ),
        postal_code: Schema.String.pipe(
          Schema.annotations({
          description: "Postal code"
        })
        ),
        country: Schema.String.pipe(
          Schema.annotations({
          description: "Country"
        })
        ),
      })),
      vat_number: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "VAT number"
      })
      )),
    }),
  }).pipe(Schema.annotations({
    title: "Create Client",
    description: "Creates a new client in Qonto"
  }))

export type Automation_action.qonto.create-client = Schema.Schema.Type<typeof Automation_action.qonto.create-clientSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.qonto.create-client.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-client
- **WHEN**: name field is empty
- **THEN**: display error "Name is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-client
- **WHEN**: account field is empty
- **THEN**: display error "Account is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-client
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-client
- **WHEN**: action field is empty
- **THEN**: display error "Action is required"
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-client
- **WHEN**: params field is empty
- **THEN**: display error "Params is required"
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-client
- **WHEN**: entering Name
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-client
- **WHEN**: entering Account
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-client
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-client
- **WHEN**: entering Action
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-client
- **WHEN**: entering Params
- **THEN**: field is required
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation action.qonto.create-client in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action.qonto.create-client-name-input"]`
- `[data-testid="automation_action.qonto.create-client-name-error"]`
- `[data-testid="automation_action.qonto.create-client-account-input"]`
- `[data-testid="automation_action.qonto.create-client-account-error"]`
- `[data-testid="automation_action.qonto.create-client-service-input"]`
- `[data-testid="automation_action.qonto.create-client-service-error"]`
- `[data-testid="automation_action.qonto.create-client-action-input"]`
- `[data-testid="automation_action.qonto.create-client-action-error"]`
- `[data-testid="automation_action.qonto.create-client-params-input"]`
- `[data-testid="automation_action.qonto.create-client-params-error"]`

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
