# Automation_trigger.linkedin-ads.new-lead-gen-form-response

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 87 points

Triggered when a new LinkedIn Lead Gen Form response is created

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
export const AutomationTriggerLinkedinAdsNewLeadGenFormResponseSchema = Schema.Struct({
  account: Schema.Union(Schema.Number, Schema.String),
  service: Schema.String,
  event: Schema.String,
  params: Schema.Struct({
    organizationId: Schema.optional(
      Schema.String.pipe(
        Schema.annotations({
          title: 'LinkedIn Organization ID',
          description: 'Required for non-sponsored lead forms',
        })
      )
    ),
    sponsoredAccountId: Schema.optional(
      Schema.String.pipe(
        Schema.annotations({
          title: 'LinkedIn Sponsored Account ID',
          description: 'Required for sponsored lead forms (leadType: SPONSORED)',
        })
      )
    ),
    leadType: Schema.optional(
      Schema.String.pipe(
        Schema.annotations({
          description: 'Type of lead form. SPONSORED requires sponsoredAccountId',
        })
      )
    ),
  }),
}).pipe(
  Schema.annotations({
    title: 'New Lead Gen Form Response',
    description: 'Triggered when a new LinkedIn Lead Gen Form response is created',
  })
)

export type AutomationTriggerLinkedinAdsNewLeadGenFormResponse = Schema.Schema.Type<
  typeof AutomationTriggerLinkedinAdsNewLeadGenFormResponseSchema
>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_trigger.linkedin-ads.new-lead-gen-form-response.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: I am working with a cron time
- **WHEN**: I trigger the automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_trigger-linkedin-ads-new-lead-gen-form-response-input"]`
- `[data-testid="automation_trigger-linkedin-ads-new-lead-gen-form-response-error"]`

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
