# Automation_action.qonto.create-invoice

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 117 points

Creates a new invoice in Qonto

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
export const AutomationActionQontoCreateInvoiceSchema = Schema.Struct({
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

export type AutomationActionQontoCreateInvoice = Schema.Schema.Type<typeof AutomationActionQontoCreateInvoiceSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.qonto.create-invoice.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I create a record from an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-qonto-create-invoice-input"]`
- `[data-testid="automation_action-qonto-create-invoice-error"]`

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
