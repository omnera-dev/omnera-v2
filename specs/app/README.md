# specs/app/ - Application Specification Schemas

> **Purpose**: This directory contains JSON Schema specifications for the Omnera™ application domain model. These schemas define the structure, validation rules, and behavioral specifications for all application entities.

## Overview

The `specs/app/` directory follows a **co-located pattern** where each property or entity type has its own directory containing:

- JSON Schema validation rules (`.schema.json`)
- Executable test specifications (`.spec.ts`)
- Related documentation

This structure mirrors the **Effect.ts Layer pattern** philosophy: small, focused, composable units that build complex systems through composition rather than monolithic files.

## Directory Structure

```
specs/app/
├── app.schema.json              # Root application schema
├── name/                        # Application name property
│   ├── name.schema.json         # Schema definition
│   └── name.spec.ts             # Executable tests
├── description/                 # Application description property
│   ├── description.schema.json
│   └── description.spec.ts
├── version/                     # Application version property
│   ├── version.schema.json
│   └── version.spec.ts
├── tables/                      # Tables entity (complex nested)
│   ├── tables.schema.json       # Main tables schema
│   ├── id/                      # Table ID property
│   ├── name/                    # Table name property
│   ├── fields/                  # Table fields property
│   ├── field-types/             # Field type variants
│   │   ├── single-line-text/    # Text field type
│   │   ├── email/               # Email field type
│   │   ├── currency/            # Currency field type
│   │   └── [29 more types]
│   ├── indexes/
│   ├── primary-key/
│   └── unique-constraints/
├── automations/                 # Automations entity (complex nested)
│   ├── automations.schema.json  # Main automations schema
│   ├── id/, name/, description/
│   ├── trigger/                 # Trigger property
│   ├── actions/                 # Actions array property
│   ├── common/                  # Shared definitions
│   │   ├── filter-condition.schema.json
│   │   └── json-schema.schema.json
│   ├── action-types/            # Action type variants
│   │   ├── http-post/
│   │   │   ├── http-post-action.schema.json
│   │   │   └── params/          # Nested properties
│   │   │       ├── url/, headers/, body/
│   │   ├── database-create-record/
│   │   └── [24 more types]
│   └── trigger-types/           # Trigger type variants
│       ├── http-post/
│       ├── database-record-created/
│       └── [7 more types]
├── connections/                 # Connections entity
├── pages/                       # Pages entity
└── common/                      # Shared common definitions
    └── definitions.schema.json  # Common type definitions (id, etc.)
```

## File Structure Patterns

### 1. Simple Property Schema

**Pattern**: Single property with basic validation

**Location**: `{property-name}/{property-name}.schema.json`

**Example**: `specs/app/name/name.schema.json`

```json
{
  "$id": "name.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Application Name",
  "description": "The unique identifier name for the application...",
  "type": "string",
  "minLength": 1,
  "maxLength": 214,
  "pattern": "^(?:@[a-z0-9-~][a-z0-9-._~]*\\/)?[a-z0-9-~][a-z0-9-._~]*$",
  "examples": ["my-app", "@org/my-app"],
  "specs": [
    {
      "id": "APP-NAME-001",
      "given": "server with app name 'test-app'",
      "when": "user navigates to homepage",
      "then": "app name displays in h1 heading"
    }
  ]
}
```

**Key Elements**:

- `$id`: Relative identifier (just filename)
- `$schema`: JSON Schema Draft-07
- `title`: Human-readable name
- `description`: Business context and purpose
- Validation rules: `type`, `minLength`, `pattern`, etc.
- `examples`: Valid example values
- `specs`: Executable specifications (Given-When-Then format)

### 2. Complex Nested Schema

**Pattern**: Entity with multiple properties, each in its own directory

**Location**: `{entity-name}/{entity-name}.schema.json` + property subdirectories

**Example**: `specs/app/tables/tables.schema.json`

```json
{
  "$id": "tables.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Tables",
  "description": "Database tables collection...",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "$ref": "./id/id.schema.json"
      },
      "name": {
        "$ref": "./name/name.schema.json"
      },
      "fields": {
        "type": "array",
        "items": {
          "$ref": "./fields/fields.schema.json"
        }
      },
      "indexes": {
        "$ref": "./indexes/indexes.schema.json"
      },
      "primaryKey": {
        "$ref": "./primary-key/primary-key.schema.json"
      },
      "uniqueConstraints": {
        "$ref": "./unique-constraints/unique-constraints.schema.json"
      }
    },
    "required": ["id", "name", "fields"]
  },
  "specs": []
}
```

**Directory Structure**:

```
tables/
├── tables.schema.json           # Main schema with $refs
├── id/id.schema.json            # Table ID property
├── name/name.schema.json        # Table name property
├── fields/fields.schema.json    # Fields array property
├── indexes/indexes.schema.json
├── primary-key/primary-key.schema.json
└── unique-constraints/unique-constraints.schema.json
```

### 3. Type Discriminated Union Schema

**Pattern**: Multiple type variants with discriminator field

**Location**: `{property-name}/{property-name}.schema.json` + `{type-name}/{type-name}.schema.json`

**Example**: `specs/app/tables/fields/fields.schema.json`

```json
{
  "$id": "fields.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Field",
  "description": "A field in a table (discriminated union by 'type' property)",
  "anyOf": [
    {
      "$ref": "../field-types/single-line-text/single-line-text-field.schema.json"
    },
    {
      "$ref": "../field-types/email/email-field.schema.json"
    },
    {
      "$ref": "../field-types/currency/currency-field.schema.json"
    }
    // ... 29 more field types
  ],
  "specs": []
}
```

**Type Variant Example**: `specs/app/tables/field-types/email/email-field.schema.json`

```json
{
  "$id": "email-field.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Email Field",
  "description": "Email address field with automatic validation...",
  "type": "object",
  "properties": {
    "type": {
      "const": "email",
      "description": "Discriminator for email field type"
    },
    "id": {
      "$ref": "../../common/definitions.schema.json#/definitions/id"
    },
    "name": {
      "type": "string",
      "minLength": 1
    },
    "required": {
      "type": "boolean",
      "default": false
    },
    "unique": {
      "type": "boolean",
      "default": false
    }
  },
  "required": ["type", "id", "name"],
  "specs": [
    {
      "id": "EMAIL-FIELD-001",
      "given": "table with email field",
      "when": "user enters valid email",
      "then": "value should be stored in lowercase"
    }
  ]
}
```

**Key Features**:

- **Discriminator**: `type` property with `const` value (e.g., `"const": "email"`)
- **Type narrowing**: Enables TypeScript type discrimination
- **Co-location**: Each variant in its own directory
- **Composition**: Main schema uses `anyOf` to combine all variants

### 4. Nested Property Directories

**Pattern**: Complex types with nested properties get their own subdirectories

**Location**: `{type-name}/params/{param-name}/{param-name}.schema.json`

**Example**: `specs/app/automations/action-types/http-post/`

```
http-post/
├── http-post-action.schema.json  # Main action schema
└── params/                       # Nested parameters
    ├── url/
    │   └── url.schema.json
    ├── headers/
    │   └── headers.schema.json
    ├── body/
    │   └── body.schema.json
    └── params.schema.json        # Combines all params
```

**Main Schema**: `http-post-action.schema.json`

```json
{
  "$id": "http-post-action.schema.json",
  "type": "object",
  "properties": {
    "type": {
      "const": "http-post"
    },
    "params": {
      "$ref": "./params/params.schema.json"
    }
  }
}
```

**Params Schema**: `params/params.schema.json`

```json
{
  "$id": "params.schema.json",
  "type": "object",
  "properties": {
    "url": {
      "$ref": "./url/url.schema.json"
    },
    "headers": {
      "$ref": "./headers/headers.schema.json"
    },
    "body": {
      "$ref": "./body/body.schema.json"
    }
  }
}
```

### 5. Common Shared Definitions

**Pattern**: Shared type definitions referenced across multiple schemas

**Location**: `common/definitions.schema.json` or `{entity}/common/{definition}.schema.json`

**Example**: `specs/app/common/definitions.schema.json`

```json
{
  "$id": "definitions.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "id": {
      "type": "integer",
      "minimum": 1,
      "description": "Unique identifier (auto-incrementing integer)"
    }
  }
}
```

**Usage in other schemas**:

```json
{
  "properties": {
    "id": {
      "$ref": "../common/definitions.schema.json#/definitions/id"
    }
  }
}
```

**Entity-specific common definitions**: `specs/app/automations/common/filter-condition.schema.json`

Used only within automations schemas.

## Specs Array Format

Every schema file includes a `specs` array containing executable specifications in **Given-When-Then** format.

### Spec Object Structure

```typescript
interface Spec {
  id: string // Unique identifier (e.g., "APP-NAME-001")
  given: string // Precondition/context
  when: string // Action/event
  then: string // Expected outcome
}
```

### Examples

**Simple validation spec**:

```json
{
  "id": "APP-NAME-001",
  "given": "server with app name 'test-app'",
  "when": "user navigates to homepage",
  "then": "app name displays in h1 heading"
}
```

**Error handling spec**:

```json
{
  "id": "EMAIL-FIELD-002",
  "given": "table with email field",
  "when": "user enters invalid email format",
  "then": "validation error should be shown"
}
```

**Business logic spec**:

```json
{
  "id": "CURRENCY-FIELD-003",
  "given": "currency field with USD configured",
  "when": "user enters value '1234.567'",
  "then": "value should be rounded to 2 decimals: 1234.57"
}
```

### Spec ID Conventions

- **Format**: `{ENTITY}-{PROPERTY}-{NUMBER}` (e.g., `EMAIL-FIELD-001`)
- **Entity**: Uppercase entity/type name
- **Property**: Uppercase property name (if applicable)
- **Number**: Zero-padded 3-digit sequence (001, 002, 003...)

### Relationship to .spec.ts Files

Each `{property}.schema.json` file should have a corresponding `{property}.spec.ts` file that:

1. Imports the JSON schema
2. Implements Playwright E2E tests for each spec
3. Uses the spec ID as test identifier

**Example**: `specs/app/name/name.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import nameSchema from './name.schema.json'

// Iterate over specs from schema
for (const spec of nameSchema.specs) {
  test(`[${spec.id}] ${spec.given} → ${spec.when} → ${spec.then}`, async ({ page }) => {
    // Test implementation
  })
}
```

## Adding New Schemas

### 1. Simple Property

```bash
# Create directory
mkdir specs/app/{property-name}

# Create schema file
touch specs/app/{property-name}/{property-name}.schema.json

# Create spec file
touch specs/app/{property-name}/{property-name}.spec.ts
```

**Template**:

```json
{
  "$id": "{property-name}.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Property Title",
  "description": "Business context...",
  "type": "string",
  "examples": ["example1", "example2"],
  "specs": [
    {
      "id": "PROP-001",
      "given": "context",
      "when": "action",
      "then": "outcome"
    }
  ]
}
```

### 2. Complex Entity

```bash
# Create entity directory
mkdir specs/app/{entity-name}

# Create main schema
touch specs/app/{entity-name}/{entity-name}.schema.json

# Create property directories
mkdir specs/app/{entity-name}/{property1}
mkdir specs/app/{entity-name}/{property2}

# Create property schemas
touch specs/app/{entity-name}/{property1}/{property1}.schema.json
touch specs/app/{entity-name}/{property2}/{property2}.schema.json
```

**Main schema template**:

```json
{
  "$id": "{entity-name}.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Entity Name",
  "type": "object",
  "properties": {
    "property1": {
      "$ref": "./property1/property1.schema.json"
    },
    "property2": {
      "$ref": "./property2/property2.schema.json"
    }
  },
  "required": ["property1"],
  "specs": []
}
```

### 3. Type Variant

```bash
# Create variant directory under existing {entity-name}-types/
mkdir specs/app/{entity-name}/{entity-name}-types/{variant-name}

# Create variant schema
touch specs/app/{entity-name}/{entity-name}-types/{variant-name}/{variant-name}.schema.json

# Update parent discriminated union schema
# Add $ref to new variant in anyOf array
```

**Variant template**:

```json
{
  "$id": "{variant-name}.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Variant Title",
  "type": "object",
  "properties": {
    "type": {
      "const": "{variant-name}",
      "description": "Discriminator"
    },
    "id": {
      "$ref": "../../common/definitions.schema.json#/definitions/id"
    }
  },
  "required": ["type", "id"],
  "specs": []
}
```

## Best Practices

### 1. Co-location Principle

- **One concept = One directory**: Each property/type/entity gets its own directory
- **Self-contained**: All related files (schema, specs, docs) live together
- **Composability**: Build complex schemas by referencing simpler ones

### 2. Schema Design

- **Use $ref extensively**: Avoid duplication, reference shared definitions
- **Relative paths**: Use `./` or `../` for $ref paths (relative to current file)
- **const for discriminators**: Use `"const": "value"` instead of `"enum": ["value"]`
- **Explicit required**: Always specify `required` array for object schemas

### 3. Documentation

- **title**: Clear, concise name
- **description**: Business context, purpose, usage guidelines
- **examples**: Real-world example values
- **specs**: Executable behaviors in Given-When-Then format

### 4. Validation Rules

- **Be explicit**: Don't rely on defaults, specify all constraints
- **Use appropriate types**: `string`, `integer`, `number`, `boolean`, `object`, `array`
- **Pattern validation**: Use `pattern` for format validation (regex)
- **Range constraints**: Use `minimum`, `maximum`, `minLength`, `maxLength`

### 5. Specs Array

- **Complete coverage**: Every business rule should have a spec
- **Unique IDs**: Use entity-property-number format
- **Clear scenarios**: Given-When-Then should be unambiguous
- **Testable**: Each spec must be implementable as E2E test

## Schema Validation Tools

### Validate all schemas

```bash
# Using AJV (recommended)
bun run validate:schemas

# Manual validation with node:fs
bun run scripts/validate-schemas.ts
```

### Export schemas to TypeScript types

```bash
# Generate Effect Schema types from JSON schemas
bun run export:schema
```

### Update OpenAPI from schemas

```bash
# Sync JSON schemas → OpenAPI spec
bun run export:openapi
```

## Migration History

This schema structure evolved through several refactoring phases:

1. **Phase 1** (Initial): Monolithic schemas with inline definitions
2. **Phase 2** (x-user-stories → specs): Migrated custom `x-user-stories` to standard `specs` array
3. **Phase 3** (x-business-rules removal): Removed redundant `x-business-rules` custom extension
4. **Phase 4** (Co-location): Split monolithic schemas into co-located property directories
5. **Current**: Fully co-located pattern matching Effect.ts Layer philosophy

## Architecture Alignment

This schema structure aligns with Omnera™'s core architectural principles:

- **Layer-based architecture**: Schemas define domain models consumed by all layers
- **Functional programming**: Schemas are immutable, composable, pure data structures
- **DRY (Don't Repeat Yourself)**: Single source of truth via `$ref` composition
- **Specification-driven development**: `specs` array encodes testable business rules
- **Effect.ts Layer pattern**: Small, focused schemas compose into complex systems

## Related Documentation

- **Domain Models**: `src/domain/models/` (TypeScript Effect Schemas generated from these JSON schemas)
- **API Schemas**: `specs/api/` (OpenAPI specifications derived from these schemas)
- **E2E Tests**: `specs/**/*.spec.ts` (Playwright tests implementing `specs` array)
- **Architecture**: `docs/architecture/layer-based-architecture.md`

---

**Last Updated**: 2025-01-21
**Maintainer**: ESSENTIAL SERVICES
**License**: Business Source License 1.1
