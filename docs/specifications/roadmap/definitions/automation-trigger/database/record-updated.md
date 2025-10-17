# Automation_trigger.database.record-updated

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 50 points

Triggered when a record is updated

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_trigger.database.record-updated Schema

**Location**: `src/domain/models/app/automation_trigger.database.record-updated.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Record Updated
 *
 * Triggered when a record is updated
 */
export const Automation_trigger.database.record-updatedSchema = Schema.Struct({
    service: Schema.String,
    event: Schema.String,
    params: Schema.Struct({
      table: Schema.String,
    }),
  }).pipe(Schema.annotations({
    title: "Record Updated",
    description: "Triggered when a record is updated"
  }))

export type Automation_trigger.database.record-updated = Schema.Schema.Type<typeof Automation_trigger.database.record-updatedSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_trigger.database.record-updated.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: a record is updated
- **WHEN**: I run an automation
- **THEN**: it should succeed
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_trigger-database-record-updated-input"]`
- `[data-testid="automation_trigger-database-record-updated-error"]`

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
