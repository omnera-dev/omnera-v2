# Json_schema.items

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 41 points

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

### Json_schema.items Schema

**Location**: `src/domain/models/app/json_schema.items.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
export const JsonSchemaItemsSchema = Schema.Union(
    Schema.Union(
    Schema.Unknown,
    Schema.Boolean
  ),
    Schema.Array(Schema.Union(
    Schema.Unknown,
    Schema.Boolean
  ))
  )

export type JsonSchemaItems = Schema.Schema.Type<typeof JsonSchemaItemsSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/json_schema.items.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user creates Json schema.items
- **WHEN**: selecting type
- **THEN**: display 2 type options
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user selects Type 1 type
- **WHEN**: filling out the form
- **THEN**: display fields specific to Type 1
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user selects Type 2 type
- **WHEN**: filling out the form
- **THEN**: display fields specific to Type 2
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Json schema.items in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="json_schema.items-type-select"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 3 @spec E2E tests passing
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
