# Version

> **Status**: ✅ DONE
> **Completion**: 100%
> **Complexity**: 10 points

The version of the application following Semantic Versioning (SemVer) 2.0.0 specification

## Implementation Status

**Schema**: ✅ Implemented (`src/domain/models/app/version.ts`)

**Tests**: ✅ All tests GREEN (8 passing)

✅ **Fully Implemented**

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Version Schema

**Location**: `src/domain/models/app/version.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Application Version
 * 
 * The version of the application following Semantic Versioning (SemVer) 2.0.0 specification
 * 
 * @example
 * ```typescript
 * "1.0.0"
 * ```
 */
export const VersionSchema = Schema.String.pipe(
    Schema.minLength(5, { message: () => 'Minimum length is 5 characters' }),
    Schema.pattern(/^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$/, {
    message: () => 'The version of the application following Semantic Versioning (SemVer) 2.0.0 specification'
  }),
    Schema.annotations({
    title: "Application Version",
    description: "The version of the application following Semantic Versioning (SemVer) 2.0.0 specification",
    examples: ["1.0.0","0.0.1","1.2.3","1.0.0-alpha","1.0.0-beta.1","2.0.0-rc.1","1.0.0+build.123","1.0.0-alpha+001"]
  })
  )

export type Version = Schema.Schema.Type<typeof VersionSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/version.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user enters Version
- **WHEN**: input length is less than 5 characters
- **THEN**: display error "Minimum length is 5 characters"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user enters Version
- **WHEN**: input does not match required pattern
- **THEN**: display error "The version of the application following Semantic Versioning (SemVer) 2.0.0 specification"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user enters valid Version
- **WHEN**: input matches required pattern
- **THEN**: accept input without error
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Version in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="version-input"]`
- `[data-testid="version-error"]`

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


---

## Related Documentation

- **Vision Schema**: [`docs/specifications/specs.schema.json`](../specs.schema.json)
- **Current Schema**: [`schemas/0.0.1/app.schema.json`](../../schemas/0.0.1/app.schema.json)
- **Testing Strategy**: [`docs/architecture/testing-strategy.md`](../../architecture/testing-strategy.md)
- **Main Roadmap**: [`ROADMAP.md`](../../../ROADMAP.md)
