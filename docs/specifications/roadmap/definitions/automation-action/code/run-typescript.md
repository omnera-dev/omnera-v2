# Automation_action.code.run-typescript

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 68 points

Execute TypeScript code

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.code.run-typescript Schema

**Location**: `src/domain/models/app/automation_action.code.run-typescript.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Run TypeScript
 *
 * Execute TypeScript code
 */
export const Automation_action.code.run-typescriptSchema = Schema.Struct({
    name: Schema.String,
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      inputData: Schema.optional(Schema.Struct({
      })),
      code: Schema.String,
    }),
  }).pipe(Schema.annotations({
    title: "Run TypeScript",
    description: "Execute TypeScript code"
  }))

export type Automation_action.code.run-typescript = Schema.Schema.Type<typeof Automation_action.code.run-typescriptSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.code.run-typescript.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run a TypeScript code
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: I am working with input data
- **WHEN**: I run a TypeScript code
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: the code throw an error
- **WHEN**: I return an error
- **THEN**: it should succeed
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: I am working with externals
- **WHEN**: I run a TypeScript code
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: I am working with globals variables
- **WHEN**: I run a TypeScript code
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: I am working with tables
- **WHEN**: I run a TypeScript code
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: I am working with buckets
- **WHEN**: I run a TypeScript code
- **THEN**: it should complete successfully
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I run a TypeScript code that return an array
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I filter a TypeScript code that return an empty array
- **THEN**: it should work correctly
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: I am working with actions
- **WHEN**: I run a TypeScript code
- **THEN**: it should complete successfully
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-code-run-typescript-input"]`
- `[data-testid="automation_action-code-run-typescript-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 10 @spec E2E tests passing
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
