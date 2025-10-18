# Automation_trigger.facebook-ads.new-lead

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 90 points

Triggered when a new Facebook Lead Ad response is created

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

### Automation_trigger.facebook-ads.new-lead Schema

**Location**: `src/domain/models/app/automation_trigger.facebook-ads.new-lead.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * New Lead
 * 
 * Triggered when a new Facebook Lead Ad response is created
 */
export const AutomationTriggerFacebookAdsNewLeadSchema = Schema.Struct({
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    event: Schema.String,
    params: Schema.Struct({
      pageId: Schema.String.pipe(
        Schema.annotations({
        title: "Facebook Page ID",
        description: "The ID of the Facebook page with lead forms"
      })
      ),
      appId: Schema.String.pipe(
        Schema.annotations({
        title: "Facebook App ID",
        description: "Your Facebook App ID from the developer console"
      })
      ),
      appSecret: Schema.String.pipe(
        Schema.annotations({
        title: "Facebook App Secret",
        description: "Your Facebook App Secret from the developer console"
      })
      ),
      verifyToken: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        title: "Webhook Verify Token",
        description: "Security token for webhook verification (auto-generated if not provided)"
      })
      )),
    }),
  }).pipe(Schema.annotations({
    title: "New Lead",
    description: "Triggered when a new Facebook Lead Ad response is created"
  }))

export type AutomationTriggerFacebookAdsNewLead = Schema.Schema.Type<typeof AutomationTriggerFacebookAdsNewLeadSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_trigger.facebook-ads.new-lead.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: I am working with a cron time
- **WHEN**: I trigger the automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_trigger-facebook-ads-new-lead-input"]`
- `[data-testid="automation_trigger-facebook-ads-new-lead-error"]`

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
