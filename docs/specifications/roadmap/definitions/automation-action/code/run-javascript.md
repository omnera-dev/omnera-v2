# Automation_action.code.run-javascript

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 68 points

Execute JavaScript code

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.code.run-javascript Schema

**Location**: `src/domain/models/app/automation_action.code.run-javascript.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Run JavaScript
 *
 * Execute JavaScript code
 */
export const Automation_action.code.run-javascriptSchema = Schema.Struct({
    name: Schema.String,
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      inputData: Schema.optional(Schema.Struct({
      })),
      code: Schema.String,
    }),
  }).pipe(Schema.annotations({
    title: "Run JavaScript",
    description: "Execute JavaScript code"
  }))

export type Automation_action.code.run-javascript = Schema.Schema.Type<typeof Automation_action.code.run-javascriptSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.code.run-javascript.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation action.code.run-javascript
- **WHEN**: name field is empty
- **THEN**: display error "Name is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation action.code.run-javascript
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation action.code.run-javascript
- **WHEN**: action field is empty
- **THEN**: display error "Action is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user is configuring Automation action.code.run-javascript
- **WHEN**: params field is empty
- **THEN**: display error "Params is required"
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user configures Automation action.code.run-javascript
- **WHEN**: entering Name
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation action.code.run-javascript
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation action.code.run-javascript
- **WHEN**: entering Action
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: user configures Automation action.code.run-javascript
- **WHEN**: entering Params
- **THEN**: field is required
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation action.code.run-javascript in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action.code.run-javascript-name-input"]`
- `[data-testid="automation_action.code.run-javascript-name-error"]`
- `[data-testid="automation_action.code.run-javascript-service-input"]`
- `[data-testid="automation_action.code.run-javascript-service-error"]`
- `[data-testid="automation_action.code.run-javascript-action-input"]`
- `[data-testid="automation_action.code.run-javascript-action-error"]`
- `[data-testid="automation_action.code.run-javascript-params-input"]`
- `[data-testid="automation_action.code.run-javascript-params-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 8 @spec E2E tests passing
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
