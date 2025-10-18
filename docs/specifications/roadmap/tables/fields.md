# Tables.fields

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 10 points

List of fields/columns in this table

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

### Tables.fields Schema

**Location**: `src/domain/models/app/tables.fields.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 * Table Fields
 * 
 * List of fields/columns in this table
 */
export const TablesFieldsSchema = Schema.Array(Schema.Union(
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      unique: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      default: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      unique: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      min: Schema.optional(Schema.Number.pipe(
        Schema.annotations({
        description: "Minimum value"
      })
      )),
      max: Schema.optional(Schema.Number.pipe(
        Schema.annotations({
        description: "Maximum value"
      })
      )),
      precision: Schema.optional(Schema.Int.pipe(
        Schema.greaterThanOrEqualTo(0),
        Schema.lessThanOrEqualTo(10),
        Schema.annotations({
        description: "Number of decimal places (for decimal type)"
      })
      )),
      currency: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Currency code (for currency type)",
        examples: ["USD","EUR","GBP"]
      })
      )),
      default: Schema.optional(Schema.Number),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      unique: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      format: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Date format string",
        examples: ["YYYY-MM-DD","MM/DD/YYYY","DD-MM-YYYY"]
      })
      )),
      includeTime: Schema.optional(Schema.Boolean),
      timezone: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Timezone for datetime fields",
        examples: ["UTC","America/New_York","Europe/London"]
      })
      )),
      default: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      default: Schema.optional(Schema.Boolean),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      options: Schema.Array(Schema.String),
      default: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      options: Schema.Array(Schema.String),
      maxSelections: Schema.optional(Schema.Int.pipe(
        Schema.greaterThanOrEqualTo(1),
        Schema.annotations({
        description: "Maximum number of selections allowed"
      })
      )),
      default: Schema.optional(Schema.Array(Schema.String)),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      relatedTable: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
        description: "Name of the related table"
      })
      ),
      relationType: Schema.String.pipe(
        Schema.annotations({
        description: "Type of relationship"
      })
      ),
      displayField: Schema.optional(Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
        description: "Field from related table to display in UI"
      })
      )),
      onDelete: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Action to take when the related record is deleted"
      })
      )),
      onUpdate: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Action to take when the related record's key is updated"
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      storage: Schema.optional(Schema.Struct({
        provider: Schema.optional(Schema.String.pipe(
          Schema.annotations({
          description: "Storage provider"
        })
        )),
        bucket: Schema.optional(Schema.String.pipe(
          Schema.annotations({
          description: "S3 bucket name (required for s3 provider)"
        })
        )),
        maxSize: Schema.optional(Schema.Int.pipe(
          Schema.greaterThanOrEqualTo(1),
          Schema.annotations({
          description: "Maximum file size in bytes"
        })
        )),
        allowedTypes: Schema.optional(Schema.Array(Schema.String)),
      })),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      maxFiles: Schema.optional(Schema.Int.pipe(
        Schema.greaterThanOrEqualTo(1),
        Schema.annotations({
        description: "Maximum number of files allowed"
      })
      )),
      storage: Schema.optional(Schema.Struct({
        provider: Schema.optional(Schema.String.pipe(
          Schema.annotations({
          description: "Storage provider"
        })
        )),
        bucket: Schema.optional(Schema.String.pipe(
          Schema.annotations({
          description: "S3 bucket name (required for s3 provider)"
        })
        )),
        maxSize: Schema.optional(Schema.Int.pipe(
          Schema.greaterThanOrEqualTo(1),
          Schema.annotations({
          description: "Maximum file size in bytes per file"
        })
        )),
        allowedTypes: Schema.optional(Schema.Array(Schema.String)),
      })),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      type: Schema.String,
      formula: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
        description: "Formula expression to compute the value. Supports field references, operators, and functions.",
        examples: ["price * quantity","CONCAT(first_name, ' ', last_name)","IF(status = 'active', 'Yes', 'No')","ROUND(total * 0.15, 2)"]
      })
      ),
      resultType: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Expected data type of the formula result"
      })
      )),
      format: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Display format for the result (e.g., currency, percentage)",
        examples: ["currency","percentage","decimal","date"]
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      type: Schema.String,
      relationshipField: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
        description: "Name of the relationship field to aggregate from"
      })
      ),
      relatedField: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
        description: "Name of the field in the related table to aggregate"
      })
      ),
      aggregation: Schema.String.pipe(
        Schema.annotations({
        description: "Aggregation function to apply"
      })
      ),
      format: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Display format for the result",
        examples: ["currency","number","percentage"]
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      type: Schema.String,
      relationshipField: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
        description: "Name of the relationship field to lookup from"
      })
      ),
      relatedField: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
        description: "Name of the field in the related table to display"
      })
      ),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      allowMultiple: Schema.optional(Schema.Boolean),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      type: Schema.String,
      indexed: Schema.optional(Schema.Boolean),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      type: Schema.String,
      indexed: Schema.optional(Schema.Boolean),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      type: Schema.String,
      indexed: Schema.optional(Schema.Boolean),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      type: Schema.String,
      indexed: Schema.optional(Schema.Boolean),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      type: Schema.String,
      max: Schema.optional(Schema.Int.pipe(
        Schema.greaterThanOrEqualTo(1),
        Schema.lessThanOrEqualTo(10),
        Schema.annotations({
        description: "Maximum rating value"
      })
      )),
      style: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Visual style for the rating"
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      type: Schema.String,
      format: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Display format for the duration"
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      type: Schema.String,
      maxLength: Schema.optional(Schema.Int.pipe(
        Schema.greaterThanOrEqualTo(1),
        Schema.annotations({
        description: "Maximum length in characters"
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      indexed: Schema.optional(Schema.Boolean),
      type: Schema.String,
      options: Schema.Array(Schema.Struct({
        value: Schema.String.pipe(
          Schema.minLength(1, { message: () => 'This field is required' })
        ),
        color: Schema.optional(Schema.String.pipe(
          Schema.pattern(/^#[0-9a-fA-F]{6}$/, {
          message: () => 'Hex color code for the status'
        }),
          Schema.annotations({
          description: "Hex color code for the status"
        })
        )),
      })),
      default: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      type: Schema.String,
      label: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
        description: "Button text label"
      })
      ),
      action: Schema.String.pipe(
        Schema.annotations({
        description: "Type of action to trigger"
      })
      ),
      url: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "URL to open (when action is 'url')"
      })
      )),
      automation: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Automation name to trigger (when action is 'automation')"
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      type: Schema.String,
      prefix: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Optional prefix for the autonumber",
        examples: ["INV-","ORD-",""]
      })
      )),
      startFrom: Schema.optional(Schema.Int.pipe(
        Schema.greaterThanOrEqualTo(1),
        Schema.annotations({
        description: "Starting number"
      })
      )),
      digits: Schema.optional(Schema.Int.pipe(
        Schema.greaterThanOrEqualTo(1),
        Schema.lessThanOrEqualTo(10),
        Schema.annotations({
        description: "Number of digits with zero padding"
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      type: Schema.String,
      format: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Barcode format"
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      type: Schema.String,
      color: Schema.optional(Schema.String.pipe(
        Schema.pattern(/^#[0-9a-fA-F]{6}$/, {
        message: () => 'Color of the progress bar'
      }),
        Schema.annotations({
        description: "Color of the progress bar"
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      type: Schema.String,
      default: Schema.optional(Schema.String.pipe(
        Schema.pattern(/^#[0-9a-fA-F]{6}$/, {
        message: () => 'Invalid format'
      })
      )),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      type: Schema.String,
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      type: Schema.String,
      schema: Schema.optional(Schema.Struct({
      })),
    }),
    Schema.Struct({
      id: Schema.Unknown,
      name: Schema.Unknown,
      required: Schema.optional(Schema.Boolean),
      type: Schema.String,
      itemType: Schema.optional(Schema.String.pipe(
        Schema.annotations({
        description: "Type of items in the array"
      })
      )),
      maxItems: Schema.optional(Schema.Int.pipe(
        Schema.greaterThanOrEqualTo(1),
        Schema.annotations({
        description: "Maximum number of items allowed"
      })
      )),
    })
  )).pipe(
    Schema.minItems(1),
    Schema.annotations({
    title: "Table Fields",
    description: "List of fields/columns in this table"
  })
  )

export type TablesFields = Schema.Schema.Type<typeof TablesFieldsSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/tables.fields.spec.ts`

### @spec User Stories (Granular Behaviors)

These tests define specific acceptance criteria. Each test validates ONE behavior.

**Scenario 1**: Validation Test

- **GIVEN**: user configures Tables.fields
- **WHEN**: array has fewer than 1 items
- **THEN**: display error "Minimum 1 items required"
- **Tag**: `@spec`

**Scenario 2**: Validation Test

- **GIVEN**: user manages Tables.fields
- **WHEN**: adding a new item
- **THEN**: display empty item form
- **Tag**: `@spec`

**Scenario 3**: Validation Test

- **GIVEN**: user manages Tables.fields
- **WHEN**: removing an item
- **THEN**: item is removed from the list
- **Tag**: `@spec`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Tables.fields in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

### data-testid Patterns

Use these standardized test IDs for reliable selectors:

- `[data-testid="tables.fields-list"]`
- `[data-testid="tables.fields-add-button"]`
- `[data-testid="tables.fields-remove-button"]`

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

**Current Blockers**:

- None (ready to start)

---

## Related Documentation

- **Vision Schema**: [`docs/specifications/specs.schema.json`](../specs.schema.json)
- **Current Schema**: [`schemas/0.0.1/app.schema.json`](../../schemas/0.0.1/app.schema.json)
- **Testing Strategy**: [`docs/architecture/testing-strategy.md`](../../architecture/testing-strategy.md)
- **Main Roadmap**: [`ROADMAP.md`](../../../ROADMAP.md)
