# Name

> **Status**: ✅ DONE
> **Completion**: 50%
> **Complexity**: 5 points

The name of your application

## Implementation Status

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

````typescript
/**
 * Application Name
 *
 * The name of your application
 *
 * @example
 * ```typescript
 * "My E-commerce App"
 * ```
 */
export const NameSchema = Schema.String.pipe(
  Schema.minLength(3, { message: () => 'Minimum length is 3 characters' }),
  Schema.annotations({
    title: 'Application Name',
    description: 'The name of your application',
    examples: ['My E-commerce App', 'Customer Portal', 'Admin Dashboard'],
  })
)

export type Name = Schema.Schema.Type<typeof NameSchema>
````

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/name.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user enters Name
- **WHEN**: input length is less than 3 characters
- **THEN**: display error "Minimum length is 3 characters"
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
- [ ] All 1 @spec E2E tests passing
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
