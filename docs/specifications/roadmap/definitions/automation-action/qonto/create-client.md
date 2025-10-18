# Automation_action.qonto.create-client

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 119 points

Creates a new client in Qonto

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
export const AutomationActionQontoCreateClientSchema = Schema.Struct({
  name: Schema.String,
  account: Schema.Union(Schema.Number, Schema.String),
  service: Schema.String,
  action: Schema.String,
  params: Schema.Struct({
    name: Schema.String.pipe(
      Schema.annotations({
        description: 'Client name',
      })
    ),
    email: Schema.optional(
      Schema.String.pipe(
        Schema.pattern(
          /^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/,
          {
            message: () => 'Client email',
          }
        ),
        Schema.annotations({
          description: 'Client email',
        })
      )
    ),
    phone: Schema.optional(
      Schema.String.pipe(
        Schema.annotations({
          description: 'Client phone number',
        })
      )
    ),
    address: Schema.optional(
      Schema.Struct({
        street: Schema.String.pipe(
          Schema.annotations({
            description: 'Street address',
          })
        ),
        city: Schema.String.pipe(
          Schema.annotations({
            description: 'City',
          })
        ),
        postal_code: Schema.String.pipe(
          Schema.annotations({
            description: 'Postal code',
          })
        ),
        country: Schema.String.pipe(
          Schema.annotations({
            description: 'Country',
          })
        ),
      })
    ),
    vat_number: Schema.optional(
      Schema.String.pipe(
        Schema.annotations({
          description: 'VAT number',
        })
      )
    ),
  }),
}).pipe(
  Schema.annotations({
    title: 'Create Client',
    description: 'Creates a new client in Qonto',
  })
)

export type AutomationActionQontoCreateClient = Schema.Schema.Type<
  typeof AutomationActionQontoCreateClientSchema
>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.qonto.create-client.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I create a record from an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-qonto-create-client-input"]`
- `[data-testid="automation_action-qonto-create-client-error"]`

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
