# Automation_action.notion.create-page

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 150 points

Creates a new page in Notion

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.notion.create-page Schema

**Location**: `src/domain/models/app/automation_action.notion.create-page.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Create Page
 *
 * Creates a new page in Notion
 */
export const Automation_action.notion.create-pageSchema = Schema.Struct({
    name: Schema.String,
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      parent: Schema.Union(
        Schema.Struct({
          type: Schema.String,
          database_id: Schema.String,
        }),
        Schema.Struct({
          type: Schema.String,
          page_id: Schema.String,
        }),
        Schema.Struct({
          type: Schema.String,
          workspace: Schema.Boolean,
        })
      ),
      properties: Schema.Struct({
      }),
      children: Schema.optional(Schema.Array(Schema.Unknown)),
      icon: Schema.optional(Schema.Union(
        Schema.Struct({
          type: Schema.String,
          emoji: Schema.String,
        }),
        Schema.Struct({
          type: Schema.String,
          external: Schema.Struct({
            url: Schema.String,
          }),
        })
      )),
      cover: Schema.optional(Schema.Struct({
        type: Schema.String,
        external: Schema.Struct({
          url: Schema.String,
        }),
      })),
    }),
  }).pipe(Schema.annotations({
    title: "Create Page",
    description: "Creates a new page in Notion"
  }))

export type Automation_action.notion.create-page = Schema.Schema.Type<typeof Automation_action.notion.create-pageSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.notion.create-page.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user is configuring Automation action.notion.create-page
- **WHEN**: name field is empty
- **THEN**: display error "Name is required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user is configuring Automation action.notion.create-page
- **WHEN**: account field is empty
- **THEN**: display error "Account is required"
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user is configuring Automation action.notion.create-page
- **WHEN**: service field is empty
- **THEN**: display error "Service is required"
- **Tag**: `@spec`

**Scenario 4**: Validation Test

- **GIVEN**: user is configuring Automation action.notion.create-page
- **WHEN**: action field is empty
- **THEN**: display error "Action is required"
- **Tag**: `@spec`

**Scenario 5**: Validation Test

- **GIVEN**: user is configuring Automation action.notion.create-page
- **WHEN**: params field is empty
- **THEN**: display error "Params is required"
- **Tag**: `@spec`

**Scenario 6**: Validation Test

- **GIVEN**: user configures Automation action.notion.create-page
- **WHEN**: entering Name
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 7**: Validation Test

- **GIVEN**: user configures Automation action.notion.create-page
- **WHEN**: entering Account
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 8**: Validation Test

- **GIVEN**: user configures Automation action.notion.create-page
- **WHEN**: entering Service
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 9**: Validation Test

- **GIVEN**: user configures Automation action.notion.create-page
- **WHEN**: entering Action
- **THEN**: field is optional
- **Tag**: `@spec`

**Scenario 10**: Validation Test

- **GIVEN**: user configures Automation action.notion.create-page
- **WHEN**: entering Params
- **THEN**: field is required
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Automation action.notion.create-page in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action.notion.create-page-name-input"]`
- `[data-testid="automation_action.notion.create-page-name-error"]`
- `[data-testid="automation_action.notion.create-page-account-input"]`
- `[data-testid="automation_action.notion.create-page-account-error"]`
- `[data-testid="automation_action.notion.create-page-service-input"]`
- `[data-testid="automation_action.notion.create-page-service-error"]`
- `[data-testid="automation_action.notion.create-page-action-input"]`
- `[data-testid="automation_action.notion.create-page-action-error"]`
- `[data-testid="automation_action.notion.create-page-params-input"]`
- `[data-testid="automation_action.notion.create-page-params-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 10 @spec E2E tests passing
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
