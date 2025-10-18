# Schema Architecture

This document explains the modular multi-file architecture of Omnera's JSON Schema specifications.

## Overview

The Omnera specification schema (`specs.schema.json`) has been split into multiple files using JSON Schema `$ref` for better organization, maintainability, and navigation.

## File Structure

```
docs/specifications/
├── specs.schema.json                    # Root schema (orchestrator)
├── specs.schema.json.backup             # Backup of monolithic schema
└── schemas/                              # Modular schema files
    ├── common/
    │   └── definitions.schema.json      # Shared type definitions (id, name, path)
    ├── tables/
    │   └── tables.schema.json           # Table configuration schema
    ├── automations/
    │   └── automations.schema.json      # Automation workflows schema
    ├── pages/
    │   └── pages.schema.json            # Page routing schema
    └── connections/
        └── connections.schema.json      # External integrations schema
```

## Schema Types

### Root Schema (specs.schema.json)

The root schema contains:

- **Top-level properties** with `$ref` pointing to feature schemas
- **Remaining definitions** that don't fit in common or feature schemas
- **Metadata** (title, version, $schema)

**Example**:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Application Configuration",
  "version": "0.81.0",
  "properties": {
    "name": {
      /* inline schema */
    },
    "version": {
      /* inline schema */
    },
    "description": {
      /* inline schema */
    },
    "tables": {
      "$ref": "./schemas/tables/tables.schema.json"
    },
    "pages": {
      "$ref": "./schemas/pages/pages.schema.json"
    },
    "automations": {
      "$ref": "./schemas/automations/automations.schema.json"
    },
    "connections": {
      "$ref": "./schemas/connections/connections.schema.json"
    }
  }
}
```

### Common Definitions (schemas/common/definitions.schema.json)

Contains shared type definitions used across multiple features:

- **id**: Unique positive integer identifier (auto-increment, immutable)
- **name**: Internal identifier (database naming conventions)
- **path**: URL routing path (starts with /)

**Usage**:

```json
{
  "properties": {
    "tableId": {
      "$ref": "../common/definitions.schema.json#/definitions/id"
    }
  }
}
```

### Feature Schemas (schemas/_/_)

Each feature schema contains:

- **Full property definition** with Triple-Documentation Pattern:
  - `description`: What the property does
  - `examples`: Valid configuration values
  - `x-business-rules`: WHY constraints exist (business rationale)
  - `x-user-stories`: GIVEN-WHEN-THEN scenarios for testing
- **Validation rules**: type, minLength, pattern, enum, etc.
- **Feature-specific definitions**: Complex types used only by this feature

**Example - tables.schema.json**:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Tables Schema",
  "description": "Database table definitions with fields, relationships, and CRUD operations",
  "type": "array",
  "x-business-rules": [
    "Tables must have unique names within the application",
    "Each table must have at least one field"
  ],
  "x-user-stories": [
    "GIVEN user creates table WHEN specifying name THEN name must be unique",
    "GIVEN table with fields WHEN validating THEN each field must have valid type"
  ],
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "$ref": "../common/definitions.schema.json#/definitions/id"
      },
      "name": {
        "$ref": "../common/definitions.schema.json#/definitions/name"
      }
      /* ... more fields */
    }
  }
}
```

## How $ref Resolution Works

### Relative Paths

All `$ref` paths are relative to the file containing the reference:

- **From root schema**: `./schemas/tables/tables.schema.json`
- **From feature schema**: `../common/definitions.schema.json#/definitions/id`

### JSON Pointer (Fragment)

The `#/definitions/id` part uses JSON Pointer syntax to navigate within a schema:

- `#/definitions/id` → schema.definitions.id
- `#/properties/tables` → schema.properties.tables

## Tools and Validation

### Validation Tools

1. **validate-schema.ts** - Validates schema structure and compiles with AJV

   ```bash
   bun run scripts/validate-schema.ts
   ```

   - Validates against JSON Schema Draft 7 metaschema
   - Supports external $ref resolution via `loadSchema` function
   - Tests schema compilation
   - Reports validation errors

2. **validate-schema-refs.ts** - Validates all $ref paths are correct

   ```bash
   bun run scripts/validate-schema-refs.ts docs/specifications/
   ```

   - Finds all $ref in all schema files
   - Validates file paths exist
   - Validates JSON pointers resolve correctly
   - Reports invalid references

3. **split-schema.ts** - Splits monolithic schema into modular files

   ```bash
   bun run scripts/split-schema.ts --help
   bun run scripts/split-schema.ts --prepare          # Create directories
   bun run scripts/split-schema.ts --extract-common   # Extract id, name, path
   bun run scripts/split-schema.ts --split tables     # Split specific feature
   bun run scripts/split-schema.ts --split-all        # Split all features
   ```

   - Extracts common definitions
   - Splits features into separate files
   - Adjusts $ref paths for nesting (./schemas/ → ../)
   - Preserves Triple-Documentation Pattern

### Agent Integration

AI agents consume the multi-file schema structure:

**effect-schema-translator**: Implements Effect Schemas from property definitions

- Reads specs.schema.json
- Follows $ref to feature schemas
- Extracts constraints + x-business-rules
- Implements src/domain/models/app/{property}.ts

**e2e-test-translator**: Creates RED Playwright tests from user stories

- Reads specs.schema.json
- Follows $ref to feature schemas
- Extracts x-user-stories array
- Creates tests/app/{property}.spec.ts with test.fixme()

**spec-editor**: Collaborative schema design guide

- Helps user validate specs.schema.json structure
- Ensures all $ref paths are valid
- Verifies Triple-Documentation Pattern completeness
- Helps user regenerate ROADMAP.md

See agent documentation in `.claude/agents/` for detailed navigation guides.

## Benefits of Modular Architecture

### 1. Better Organization

- Each feature has its own file
- Easier to find and navigate property definitions
- Clear separation of concerns

### 2. Easier Maintenance

- Changes to one feature don't affect others
- Smaller files are easier to review and edit
- Reduced merge conflicts

### 3. DRY (Don't Repeat Yourself)

- Common definitions in one place (id, name, path)
- Single source of truth for shared types
- No duplication across features

### 4. Version Control Friendly

- Git diffs show only changed features
- Smaller, focused commits
- Better collaboration

### 5. Performance

- Only load necessary schemas
- Faster validation with smaller files
- Better caching

## Migration from Monolithic Schema

The original monolithic schema (9,897 lines) was split using this process:

1. **Backup**: Created specs.schema.json.backup
2. **Extract Common**: Moved id, name, path to schemas/common/definitions.schema.json
3. **Split Features**: Extracted tables, automations, pages, connections to schemas/\*/
4. **Update $refs**: Adjusted relative paths for nested locations
5. **Move Definitions**: Moved feature-specific definitions (e.g., automation, automation_trigger) to feature schemas
6. **Validate**: Verified all 91 $refs resolve correctly

## Extending the Schema

### Adding a New Feature

1. Create feature schema file:

   ```bash
   mkdir -p docs/specifications/schemas/my-feature
   ```

2. Create `my-feature.schema.json` with Triple-Documentation Pattern:

   ```json
   {
     "$schema": "http://json-schema.org/draft-07/schema#",
     "title": "My Feature Schema",
     "description": "What this feature does",
     "type": "object",
     "x-business-rules": ["Why constraints exist"],
     "x-user-stories": ["GIVEN-WHEN-THEN scenarios"]
   }
   ```

3. Update root schema to reference it:

   ```json
   {
     "properties": {
       "myFeature": {
         "$ref": "./schemas/my-feature/my-feature.schema.json"
       }
     }
   }
   ```

4. Validate:
   ```bash
   bun run scripts/validate-schema.ts
   bun run scripts/validate-schema-refs.ts docs/specifications/
   ```

### Using Common Definitions

Reference shared types from feature schemas:

```json
{
  "properties": {
    "userId": {
      "$ref": "../common/definitions.schema.json#/definitions/id",
      "x-business-rules": ["User ID must reference existing user"]
    }
  }
}
```

## Best Practices

### 1. Keep Feature Schemas Focused

- One feature per file
- Related definitions in the same file
- Use common definitions for shared types

### 2. Preserve Triple-Documentation Pattern

Every property should have:

- ✅ `description` (what it does)
- ✅ `examples` (valid values)
- ✅ `x-business-rules` (why constraints exist)
- ✅ `x-user-stories` (GIVEN-WHEN-THEN scenarios)

### 3. Validate After Changes

Always run both validation scripts:

```bash
bun run scripts/validate-schema.ts
bun run scripts/validate-schema-refs.ts docs/specifications/
```

### 4. Use Relative Paths

- From root → features: `./schemas/feature/`
- From features → common: `../common/`
- From features → features: `../other-feature/`

### 5. Document Breaking Changes

If you change:

- $ref paths
- File structure
- Common definitions

Update this document and notify agent maintainers.

## Troubleshooting

### "$ref cannot be resolved"

Check:

1. File path is correct relative to referencing file
2. File exists at the path
3. JSON pointer (fragment) is correct

Run:

```bash
bun run scripts/validate-schema-refs.ts docs/specifications/
```

### "Schema compilation failed"

Check:

1. JSON syntax is valid
2. All $refs resolve correctly
3. Schema conforms to Draft 7

Run:

```bash
bun run scripts/validate-schema.ts
```

### "Circular reference detected"

AJV detects circular $refs. To fix:

1. Identify the circular dependency
2. Restructure schemas to break the cycle
3. Consider using `definitions` within the same file

## References

- [JSON Schema Draft 7 Specification](https://json-schema.org/draft-07/json-schema-core.html)
- [JSON Schema $ref Guide](https://json-schema.org/understanding-json-schema/structuring.html)
- [AJV Documentation](https://ajv.js.org/)
- [Triple-Documentation Pattern](./triple-documentation-pattern.md)
