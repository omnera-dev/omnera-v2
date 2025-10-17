# Automation_trigger.schedule.cron-time

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 55 points

Triggered by a cron expression

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_trigger.schedule.cron-time Schema

**Location**: `src/domain/models/app/automation_trigger.schedule.cron-time.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Cron Time
 *
 * Triggered by a cron expression
 */
export const Automation_trigger.schedule.cron-timeSchema = Schema.Struct({
    service: Schema.String,
    event: Schema.String,
    params: Schema.Struct({
      expression: Schema.String,
      timeZone: Schema.String,
    }),
  }).pipe(Schema.annotations({
    title: "Cron Time",
    description: "Triggered by a cron expression"
  }))

export type Automation_trigger.schedule.cron-time = Schema.Schema.Type<typeof Automation_trigger.schedule.cron-timeSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_trigger.schedule.cron-time.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: I am working with a cron time
- **WHEN**: I trigger the automation
- **THEN**: it should complete successfully
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_trigger-schedule-cron-time-input"]`
- `[data-testid="automation_trigger-schedule-cron-time-error"]`

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
