# Automation_action.qonto.create-invoice

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 117 points

Creates a new invoice in Qonto

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.qonto.create-invoice Schema

**Location**: `src/domain/models/app/automation_action.qonto.create-invoice.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Create Invoice
 *
 * Creates a new invoice in Qonto
 */
export const Automation_action.qonto.create-invoiceSchema = Schema.Struct({
    name: Schema.String,
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      client_id: Schema.String.pipe(
        Schema.annotations({
        description: "ID of the client for this invoice"
      })
      ),
      amount: Schema.Number.pipe(
        Schema.greaterThan(0),
        Schema.annotations({
        description: "Invoice total amount"
      })
      ),
      currency: Schema.String.pipe(
        Schema.annotations({
        description: "Invoice currency"
      })
      ),
      due_date: Schema.String.pipe(
        Schema.annotations({
        description: "Invoice due date (ISO 8601 format)"
      })
      ),
      items: Schema.Array(Schema.Struct({
        description: Schema.String.pipe(
          Schema.annotations({
          description: "Item description"
        })
        ),
        quantity: Schema.Number.pipe(
          Schema.greaterThan(0),
          Schema.annotations({
          description: "Quantity"
        })
        ),
        unit_price: Schema.Number.pipe(
          Schema.greaterThan(0),
          Schema.annotations({
          description: "Unit price"
        })
        ),
      })),
      reference: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Invoice reference number"
      })
      )),
      notes: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Additional notes"
      })
      )),
    }),
  }).pipe(Schema.annotations({
    title: "Create Invoice",
    description: "Creates a new invoice in Qonto"
  }))

export type Automation_action.qonto.create-invoice = Schema.Schema.Type<typeof Automation_action.qonto.create-invoiceSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.qonto.create-invoice.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-invoice
- **WHEN**: name field is empty
- **THEN**: display error "Name is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-invoice
- **WHEN**: account field is empty
- **THEN**: display error "Account is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-invoice
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-invoice
- **WHEN**: action field is empty
- **THEN**: display error "Action is required"
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user is configuring Automation action.qonto.create-invoice
- **WHEN**: params field is empty
- **THEN**: display error "Params is required"
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-invoice
- **WHEN**: entering Name
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-invoice
- **WHEN**: entering Account
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-invoice
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-invoice
- **WHEN**: entering Action
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: user configures Automation action.qonto.create-invoice
- **WHEN**: entering Params
- **THEN**: field is required
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation action.qonto.create-invoice in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action.qonto.create-invoice-name-input"]`
- `[data-testid="automation_action.qonto.create-invoice-name-error"]`
- `[data-testid="automation_action.qonto.create-invoice-account-input"]`
- `[data-testid="automation_action.qonto.create-invoice-account-error"]`
- `[data-testid="automation_action.qonto.create-invoice-service-input"]`
- `[data-testid="automation_action.qonto.create-invoice-service-error"]`
- `[data-testid="automation_action.qonto.create-invoice-action-input"]`
- `[data-testid="automation_action.qonto.create-invoice-action-error"]`
- `[data-testid="automation_action.qonto.create-invoice-params-input"]`
- `[data-testid="automation_action.qonto.create-invoice-params-error"]`

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
