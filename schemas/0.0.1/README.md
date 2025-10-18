# Application Configuration v0.0.1

This directory contains the exported Application Configuration for Omnera version 0.0.1.

Complete application configuration including name, version, and description. This is the root schema for Omnera applications.

## Files

- `app.schema.json` - JSON Schema for validation and documentation
- `types.d.ts` - TypeScript type definitions

## Usage

### JSON Schema Validation

You can use the JSON Schema file to validate configurations in any language that supports JSON Schema.

```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "description": "A simple todo list application"
}
```

### TypeScript

```typescript
import type { ApplicationConfiguration } from './types'

const config: ApplicationConfiguration = {
  "name": "todo-app",
  "version": "1.0.0",
  "description": "A simple todo list application"
}
```

## Schema Properties

### Application Name

**Property**: `name` (required)

The name of the application (follows npm package naming conventions)

**Constraints:**
- Type: `string`
- Minimum length: 1
- Maximum length: 214
- Pattern: `^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$`

**Examples:**
- `"my-app"`
- `"todo-app"`
- `"@myorg/my-app"`
- `"blog-system"`
- `"dashboard-admin"`

### Application Version

**Property**: `version` (optional)

The version of the application following Semantic Versioning (SemVer) 2.0.0 specification

**Constraints:**
- Type: `string`
- Minimum length: 5
- Pattern: `^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$`

**Examples:**
- `"1.0.0"`
- `"0.0.1"`
- `"1.2.3"`
- `"1.0.0-alpha"`
- `"1.0.0-beta.1"`
- `"2.0.0-rc.1"`
- `"1.0.0+build.123"`
- `"1.0.0-alpha+001"`

### Application Description

**Property**: `description` (optional)

A single-line description of the application (line breaks not allowed)

**Constraints:**
- Type: `string`
- Pattern: `^[^\r\n]*$`

**Examples:**
- `"A simple application"`
- `"My app - with special characters!@#$%"`
- `"Très bien! 你好 🎉"`
- `"Full-featured e-commerce platform with cart, checkout & payment processing"`

## Generated

This schema was generated automatically on 2025-10-18 from the source schemas in `src/domain/models/app/`.

For the latest schema definitions, please refer to the source code or generate a new export.
