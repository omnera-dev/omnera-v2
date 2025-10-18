# Name

> **Status**: ✅ DONE
> **Completion**: 100%
> **Complexity**: 15 points

The name of the application (follows npm package naming conventions)

## Implementation Status

**Schema**: ✅ Implemented (`src/domain/models/app/name.ts`)

**Tests**: ✅ All tests GREEN (21 passing)

✅ **Fully Implemented**

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Name Schema

**Location**: `src/domain/models/app/name.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Application Name
 * 
 * The name of the application (follows npm package naming conventions)
 * 
 * @example
 * ```typescript
 * "my-app"
 * ```
 */
export const NameSchema = Schema.String.pipe(
    Schema.minLength(1, { message: () => 'This field is required' }),
    Schema.maxLength(214, { message: () => 'Maximum length is 214 characters' }),
    Schema.pattern(/^(?:@[a-z0-9-~][a-z0-9-._~]*\\/)?[a-z0-9-~][a-z0-9-._~]*$/, {
    message: () => 'The name of the application (follows npm package naming conventions)'
  }),
    Schema.annotations({
    title: "Application Name",
    description: "The name of the application (follows npm package naming conventions)",
    examples: ["my-app","todo-app","@myorg/my-app","blog-system","dashboard-admin"]
  })
  )

export type Name = Schema.Schema.Type<typeof NameSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/name.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user enters Name
- **WHEN**: input length is less than 1 characters
- **THEN**: display error "Minimum length is 1 characters"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user enters Name
- **WHEN**: input length exceeds 214 characters
- **THEN**: display error "Maximum length is 214 characters"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user enters Name
- **WHEN**: input does not match required pattern
- **THEN**: display error "The name of the application (follows npm package naming conventions)"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user enters valid Name
- **WHEN**: input matches required pattern
- **THEN**: accept input without error
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Name in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="name-input"]`
- `[data-testid="name-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 4 @spec E2E tests passing
- [ ] All 1 @regression E2E tests passing
- [ ] Unit test coverage >80%
- [ ] All TypeScript strict mode checks passing
- [ ] All ESLint checks passing
- [ ] All Prettier formatting checks passing
- [ ] JSON schema export updated via `bun run export:schema`


---

## Related Documentation

- **Vision Schema**: [`docs/specifications/specs.schema.json`](../specs.schema.json)
- **Current Schema**: [`schemas/0.0.1/app.schema.json`](../../schemas/0.0.1/app.schema.json)
- **Testing Strategy**: [`docs/architecture/testing-strategy.md`](../../architecture/testing-strategy.md)
- **Main Roadmap**: [`ROADMAP.md`](../../../ROADMAP.md)
