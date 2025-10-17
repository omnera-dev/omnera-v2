# Tables.fields.autonumber-field.prefix

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 0 points

Optional prefix for the autonumber

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Tables.fields.autonumber-field.prefix Schema

**Location**: `src/domain/models/app/tables.fields.autonumber-field.prefix.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

````typescript
/**
 *
 * Optional prefix for the autonumber
 *
 * @example
 * ```typescript
 * "INV-"
 * ```
 */
export const Tables.fields.autonumber-field.prefixSchema = Schema.String.pipe(
    Schema.annotations({
    description: "Optional prefix for the autonumber",
    examples: ["INV-","ORD-",""]
  })
  )

export type Tables.fields.autonumber-field.prefix = Schema.Schema.Type<typeof Tables.fields.autonumber-field.prefixSchema>
````

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.fields.autonumber-field.prefix.spec.ts`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.fields.autonumber-field.prefix in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.fields.autonumber-field.prefix-input"]`
- `[data-testid="tables.fields.autonumber-field.prefix-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
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
