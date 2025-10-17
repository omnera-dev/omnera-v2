# Json_schema

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 331 points

Schema describing data structure

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Json_schema Schema

**Location**: `src/domain/models/app/json_schema.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * JSON Schema
 *
 * Schema describing data structure
 */
export const Json_schemaSchema = Schema.Struct({
  type: Schema.optional(Schema.Union(Schema.String, Schema.Array(Schema.String))),
  properties: Schema.optional(Schema.Struct({})),
  required: Schema.optional(Schema.Array(Schema.String)),
  items: Schema.optional(
    Schema.Union(
      Schema.Union(Schema.Unknown, Schema.Boolean),
      Schema.Array(Schema.Union(Schema.Unknown, Schema.Boolean))
    )
  ),
  additionalProperties: Schema.optional(
    Schema.Union(Schema.Union(Schema.Unknown, Schema.Boolean), Schema.Boolean)
  ),
  enum: Schema.optional(Schema.Array(Schema.Unknown)),
  const: Schema.optional(Schema.Unknown),
  title: Schema.optional(Schema.String),
  description: Schema.optional(Schema.String),
  default: Schema.optional(Schema.Unknown),
  minimum: Schema.optional(Schema.Number),
  maximum: Schema.optional(Schema.Number),
  multipleOf: Schema.optional(Schema.Number),
  minLength: Schema.optional(Schema.Number),
  maxLength: Schema.optional(Schema.Number),
  pattern: Schema.optional(Schema.String),
  minItems: Schema.optional(Schema.Number),
  maxItems: Schema.optional(Schema.Number),
  uniqueItems: Schema.optional(Schema.Boolean),
  allOf: Schema.optional(Schema.Array(Schema.Union(Schema.Unknown, Schema.Boolean))),
  anyOf: Schema.optional(Schema.Array(Schema.Union(Schema.Unknown, Schema.Boolean))),
  oneOf: Schema.optional(Schema.Array(Schema.Union(Schema.Unknown, Schema.Boolean))),
  not: Schema.optional(Schema.Union(Schema.Unknown, Schema.Boolean)),
}).pipe(
  Schema.annotations({
    title: 'JSON Schema',
    description: 'Schema describing data structure',
  })
)

export type Json_schema = Schema.Schema.Type<typeof Json_schemaSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/json_schema.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Type
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Properties
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Required
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Items
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Additional properties
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Enum
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Const
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Title
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Description
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Default
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 11**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Minimum
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 12**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Maximum
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 13**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Multiple of
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 14**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Min length
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 15**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Max length
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 16**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Pattern
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 17**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Min items
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 18**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Max items
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 19**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Unique items
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 20**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering All of
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 21**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Any of
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 22**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering One of
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 23**: Validation Test

- **GIVEN**: user configures Json schema
- **WHEN**: entering Not
- **THEN**: field is optional
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Json schema in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="json_schema-type-input"]`
- `[data-testid="json_schema-properties-input"]`
- `[data-testid="json_schema-required-input"]`
- `[data-testid="json_schema-items-input"]`
- `[data-testid="json_schema-additionalProperties-input"]`
- `[data-testid="json_schema-enum-input"]`
- `[data-testid="json_schema-const-input"]`
- `[data-testid="json_schema-title-input"]`
- `[data-testid="json_schema-description-input"]`
- `[data-testid="json_schema-default-input"]`
- `[data-testid="json_schema-minimum-input"]`
- `[data-testid="json_schema-maximum-input"]`
- `[data-testid="json_schema-multipleOf-input"]`
- `[data-testid="json_schema-minLength-input"]`
- `[data-testid="json_schema-maxLength-input"]`
- `[data-testid="json_schema-pattern-input"]`
- `[data-testid="json_schema-minItems-input"]`
- `[data-testid="json_schema-maxItems-input"]`
- `[data-testid="json_schema-uniqueItems-input"]`
- `[data-testid="json_schema-allOf-input"]`
- `[data-testid="json_schema-anyOf-input"]`
- `[data-testid="json_schema-oneOf-input"]`
- `[data-testid="json_schema-not-input"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 23 @spec E2E tests passing
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
