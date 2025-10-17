# Automation_action.notion.update-page

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 131 points

Updates properties, icon, cover, or archived status of a Notion page

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Automation_action.notion.update-page Schema

**Location**: `src/domain/models/app/automation_action.notion.update-page.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Update Page
 *
 * Updates properties, icon, cover, or archived status of a Notion page
 */
export const Automation_action.notion.update-pageSchema = Schema.Struct({
    name: Schema.String,
    account: Schema.Union(
      Schema.Number,
      Schema.String
    ),
    service: Schema.String,
    action: Schema.String,
    params: Schema.Struct({
      pageId: Schema.String.pipe(
        Schema.annotations({
        description: "The ID of the page to update"
      })
      ),
      properties: Schema.optional(Schema.Struct({
      })),
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
      archived: Schema.optional(Schema.Boolean),
    }),
  }).pipe(Schema.annotations({
    title: "Update Page",
    description: "Updates properties, icon, cover, or archived status of a Notion page"
  }))

export type Automation_action.notion.update-page = Schema.Schema.Type<typeof Automation_action.notion.update-pageSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/automation_action.notion.update-page.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: the application is running
- **WHEN**: I create a record from an automation
- **THEN**: it should work correctly
- **Tag**: `@spec`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="automation_action-notion-update-page-input"]`
- `[data-testid="automation_action-notion-update-page-error"]`

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
