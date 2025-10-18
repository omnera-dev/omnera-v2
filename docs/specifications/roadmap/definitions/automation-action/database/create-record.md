# Automation_action.database.create-record

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 75 points

Create a record in a database table

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

### Automation_action.database.create-record Schema

**Location**: `src/domain/models/app/automation_action.database.create-record.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Create Record
 * 
 * Create a record in a database table
 */
export const AutomationActionDatabaseCreateRecordSchema = Schema.Struct({
    name: Schema.String,
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      table: Schema.Union(
        Schema.String,
        Schema.Number
      ),
      fields: Schema.Struct({
      }),
    }),
  }).pipe(Schema.annotations({
    title: "Create Record",
    description: "Create a record in a database table"
  }))

export type AutomationActionDatabaseCreateRecord = Schema.Schema.Type<typeof AutomationActionDatabaseCreateRecordSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.database.create-record.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I create a record from an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-database-create-record-input"]`
- `[data-testid="automation_action-database-create-record-error"]`

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
