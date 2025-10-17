# Pages

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 10 points

Pages and forms in the application

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

## Dependencies

This property depends on:

- **tables**

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Pages Schema

**Location**: `src/domain/models/app/pages.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Pages
 *
 * Pages and forms in the application
 */
export const PagesSchema = Schema.Array(
  Schema.Union(
    Schema.Struct({
      type: Schema.String,
      name: Schema.Unknown,
      path: Schema.Unknown,
      head: Schema.Array(
        Schema.Union(
          Schema.Struct({
            tag: Schema.String,
            name: Schema.String.pipe(
              Schema.minLength(1, { message: () => 'This field is required' })
            ),
            content: Schema.String.pipe(
              Schema.minLength(1, { message: () => 'This field is required' })
            ),
          }),
          Schema.Struct({
            tag: Schema.String,
            content: Schema.String.pipe(
              Schema.minLength(1, { message: () => 'This field is required' })
            ),
          }),
          Schema.Struct({
            tag: Schema.String,
            src: Schema.optional(Schema.String),
            content: Schema.optional(Schema.String),
            type: Schema.optional(Schema.String),
            async: Schema.optional(Schema.Boolean),
            defer: Schema.optional(Schema.Boolean),
          }),
          Schema.Struct({
            tag: Schema.String,
            content: Schema.String.pipe(
              Schema.minLength(1, { message: () => 'This field is required' })
            ),
            type: Schema.optional(Schema.String),
            media: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            tag: Schema.String,
            href: Schema.String.pipe(
              Schema.minLength(1, { message: () => 'This field is required' })
            ),
            rel: Schema.String.pipe(
              Schema.minLength(1, { message: () => 'This field is required' })
            ),
            type: Schema.optional(Schema.String),
            media: Schema.optional(Schema.String),
            sizes: Schema.optional(Schema.String),
            crossorigin: Schema.optional(Schema.String),
          })
        )
      ),
      body: Schema.Array(
        Schema.Union(
          Schema.Struct({
            type: Schema.String,
            content: Schema.String.pipe(
              Schema.minLength(1, { message: () => 'This field is required' })
            ),
          })
        )
      ),
    }),
    Schema.Struct({
      type: Schema.String,
      id: Schema.Unknown,
      name: Schema.Unknown,
      path: Schema.Unknown,
      title: Schema.optional(
        Schema.String.pipe(
          Schema.annotations({
            title: 'Display Title',
            description: 'Display title shown to users',
            examples: ['Contact Us', 'Create Your Account', 'We Value Your Feedback'],
          })
        )
      ),
      description: Schema.optional(
        Schema.String.pipe(
          Schema.annotations({
            title: 'Form Description',
            description: 'Help text or instructions for the form',
            examples: [
              'Fill out this form to get in touch with our team',
              'Please provide your details to create an account',
            ],
          })
        )
      ),
      inputs: Schema.Array(
        Schema.Union(
          Schema.Struct({
            name: Schema.String,
            label: Schema.optional(Schema.String),
            description: Schema.optional(Schema.String),
            required: Schema.optional(Schema.Boolean),
            defaultValue: Schema.optional(Schema.String),
            placeholder: Schema.optional(Schema.String),
            type: Schema.String,
          }),
          Schema.Struct({
            name: Schema.String,
            label: Schema.optional(Schema.String),
            description: Schema.optional(Schema.String),
            required: Schema.optional(Schema.Boolean),
            defaultValue: Schema.optional(Schema.Boolean),
            type: Schema.String,
          }),
          Schema.Struct({
            name: Schema.String,
            label: Schema.optional(Schema.String),
            description: Schema.optional(Schema.String),
            required: Schema.optional(Schema.Boolean),
            defaultValue: Schema.optional(Schema.String),
            placeholder: Schema.optional(Schema.String),
            options: Schema.Array(
              Schema.Struct({
                label: Schema.String,
                value: Schema.String,
              })
            ),
            type: Schema.String,
          }),
          Schema.Struct({
            name: Schema.String,
            label: Schema.optional(Schema.String),
            description: Schema.optional(Schema.String),
            required: Schema.optional(Schema.Boolean),
            accept: Schema.optional(Schema.String),
            type: Schema.String,
          })
        )
      ),
      action: Schema.String.pipe(
        Schema.annotations({
          description: 'What to do with form submission',
        })
      ),
      table: Schema.optional(
        Schema.String.pipe(
          Schema.minLength(1, { message: () => 'This field is required' }),
          Schema.annotations({
            description: 'Table to save form data (required for create-record action)',
          })
        )
      ),
      successMessage: Schema.optional(
        Schema.String.pipe(
          Schema.annotations({
            title: 'Success Message',
            description: 'Message displayed after successful form submission',
            examples: [
              'Thank you! We will get back to you soon.',
              'Your account has been created successfully!',
              'Form submitted successfully.',
            ],
          })
        )
      ),
      redirectUrl: Schema.optional(Schema.Unknown),
    }),
    Schema.Struct({
      type: Schema.String,
      name: Schema.Unknown,
      path: Schema.Unknown,
      table: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
          description: 'Name of the table to display',
        })
      ),
      title: Schema.optional(
        Schema.String.pipe(
          Schema.minLength(1, { message: () => 'This field is required' }),
          Schema.annotations({
            description: 'Display title for the page',
          })
        )
      ),
      columns: Schema.Array(Schema.String),
      searchable: Schema.optional(Schema.Boolean),
      sortable: Schema.optional(Schema.Boolean),
      filterable: Schema.optional(Schema.Boolean),
      actions: Schema.optional(
        Schema.Struct({
          create: Schema.optional(Schema.Boolean),
          edit: Schema.optional(Schema.Boolean),
          delete: Schema.optional(Schema.Boolean),
          export: Schema.optional(Schema.Boolean),
        })
      ),
    }),
    Schema.Struct({
      type: Schema.String,
      name: Schema.Unknown,
      path: Schema.Unknown,
      table: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
          description: 'Name of the table to display',
        })
      ),
      title: Schema.optional(
        Schema.String.pipe(
          Schema.minLength(1, { message: () => 'This field is required' }),
          Schema.annotations({
            description: 'Display title for the page',
          })
        )
      ),
      layout: Schema.optional(
        Schema.String.pipe(
          Schema.annotations({
            description: 'Layout style for the detail view',
          })
        )
      ),
      sections: Schema.Array(
        Schema.Struct({
          title: Schema.String.pipe(
            Schema.minLength(1, { message: () => 'This field is required' }),
            Schema.annotations({
              description: 'Section title',
            })
          ),
          fields: Schema.Array(Schema.String),
        })
      ),
    })
  )
).pipe(
  Schema.minItems(1),
  Schema.annotations({
    title: 'Pages',
    description: 'Pages and forms in the application',
  })
)

export type Pages = Schema.Schema.Type<typeof PagesSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/pages.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user configures Pages
- **WHEN**: array has fewer than 1 items
- **THEN**: display error "Minimum 1 items required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user manages Pages
- **WHEN**: adding a new item
- **THEN**: display empty item form
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user manages Pages
- **WHEN**: removing an item
- **THEN**: item is removed from the list
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Pages in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### @critical User Story (Essential Path)

This test validates the MINIMAL essential path for this feature.

**Essential Feature Validation**:

- **GIVEN**: user needs to use Pages feature
- **WHEN**: performing essential configuration
- **THEN**: minimal viable configuration succeeds
- **Tag**: `@critical`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="pages-list"]`
- `[data-testid="pages-add-button"]`
- `[data-testid="pages-remove-button"]`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 3 @spec E2E tests passing
- [ ] All 1 @regression E2E tests passing
- [ ] All 1 @critical E2E tests passing
- [ ] Unit test coverage >80%
- [ ] All TypeScript strict mode checks passing
- [ ] All ESLint checks passing
- [ ] All Prettier formatting checks passing
- [ ] JSON schema export updated via `bun run export:schema`

**Current Blockers**:

- Requires: tables

---

## Related Documentation

- **Vision Schema**: [`docs/specifications/specs.schema.json`](../specs.schema.json)
- **Current Schema**: [`schemas/0.0.1/app.schema.json`](../../schemas/0.0.1/app.schema.json)
- **Testing Strategy**: [`docs/architecture/testing-strategy.md`](../../architecture/testing-strategy.md)
- **Main Roadmap**: [`ROADMAP.md`](../../../ROADMAP.md)
