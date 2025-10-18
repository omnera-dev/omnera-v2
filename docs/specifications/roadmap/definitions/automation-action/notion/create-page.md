# Automation_action.notion.create-page

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 150 points

Creates a new page in Notion

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
export const AutomationActionNotionCreatePageSchema = Schema.Struct({
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

export type AutomationActionNotionCreatePage = Schema.Schema.Type<typeof AutomationActionNotionCreatePageSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.notion.create-page.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I create a record from an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-notion-create-page-input"]`
- `[data-testid="automation_action-notion-create-page-error"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 1 @spec E2E tests passing
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
