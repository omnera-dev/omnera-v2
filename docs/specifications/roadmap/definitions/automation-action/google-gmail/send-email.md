# Automation_action.google-gmail.send-email

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 144 points

Sends an email

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
export const AutomationActionGoogleGmailSendEmailSchema = Schema.Struct({
  name: Schema.String,
  account: Schema.Union(Schema.Number, Schema.String),
  service: Schema.String,
  action: Schema.String,
  params: Schema.Struct({
    from: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    to: Schema.Union(Schema.String, Schema.Array(Schema.String)),
    cc: Schema.optional(Schema.Union(Schema.String, Schema.Array(Schema.String))),
    bcc: Schema.optional(Schema.Union(Schema.String, Schema.Array(Schema.String))),
    subject: Schema.String,
    html: Schema.String,
    text: Schema.optional(Schema.String),
  }),
}).pipe(
  Schema.annotations({
    title: 'Send Email',
    description: 'Sends an email',
  })
)

export type AutomationActionGoogleGmailSendEmail = Schema.Schema.Type<
  typeof AutomationActionGoogleGmailSendEmailSchema
>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.google-gmail.send-email.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I create a record from an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-google-gmail-send-email-input"]`
- `[data-testid="automation_action-google-gmail-send-email-error"]`

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
