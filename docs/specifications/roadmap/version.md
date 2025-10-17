# Version

> **Status**: ✅ DONE
> **Completion**: 67%
> **Complexity**: 10 points

Semantic version number following SemVer 2.0.0 specification (MAJOR.MINOR.PATCH). Increment MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes. Optional pre-release identifiers (e.g., -alpha, -beta.1) are supported. This version is used for change tracking, rollback capabilities, and API compatibility.

## Implementation Status

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

````typescript
/**
 * Version
 *
 * Semantic version number following SemVer 2.0.0 specification (MAJOR.MINOR.PATCH). Increment MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes. Optional pre-release identifiers (e.g., -alpha, -beta.1) are supported. This version is used for change tracking, rollback capabilities, and API compatibility.
 *
 * @example
 * ```typescript
 * "1.0.0"
 * ```
 */
export const VersionSchema = Schema.String.pipe(
  Schema.minLength(5, { message: () => 'Minimum length is 5 characters' }),
  Schema.pattern(/^\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9]+)?$/, {
    message: () =>
      'Semantic version number following SemVer 2.0.0 specification (MAJOR.MINOR.PATCH). Increment MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes. Optional pre-release identifiers (e.g., -alpha, -beta.1) are supported. This version is used for change tracking, rollback capabilities, and API compatibility.',
  }),
  Schema.annotations({
    title: 'Version',
    description:
      'Semantic version number following SemVer 2.0.0 specification (MAJOR.MINOR.PATCH). Increment MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes. Optional pre-release identifiers (e.g., -alpha, -beta.1) are supported. This version is used for change tracking, rollback capabilities, and API compatibility.',
    examples: ['1.0.0', '2.1.3', '0.5.0-beta', '1.0.0-alpha.1', '3.2.1'],
  })
)

export type Version = Schema.Schema.Type<typeof VersionSchema>
````

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
- **THEN**: display error "Semantic version number following SemVer 2.0.0 specification (MAJOR.MINOR.PATCH). Increment MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes. Optional pre-release identifiers (e.g., -alpha, -beta.1) are supported. This version is used for change tracking, rollback capabilities, and API compatibility."
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
