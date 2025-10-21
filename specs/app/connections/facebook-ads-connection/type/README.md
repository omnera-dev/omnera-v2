# Connection Type - Business Rules

## Overview

Type discriminator that identifies which service integration this connection represents. This field enables polymorphic handling of different connection types in a type-safe manner.

## Validation Rules

- **Type**: String constant
- **Value**: Must be exactly `"facebook-ads"` (case-sensitive)
- **Required**: Yes
- **Immutability**: Cannot be changed after creation

### Example

```json
{
  "type": "facebook-ads"
}
```

## Runtime Behavior

### Handler Selection

The type field determines which OAuth provider and API client to use:

```typescript
switch (connection.type) {
  case 'facebook-ads':
    return new Facebook AdsOAuthHandler(connection)
  case 'notion':
    return new NotionOAuthHandler(connection)
  // ... other handlers
}
```

### Type Safety (TypeScript)

Enables discriminated unions for compile-time type checking:

```typescript
type Connection =
  | { type: 'facebook-ads'; clientId: string; clientSecret: string }
  | { type: 'notion'; clientId: string; clientSecret: string }
  | { type: 'qonto'; clientId: string; clientSecret: string; apiKey: string }

function connect(conn: Connection) {
  if (conn.type === 'facebook-ads') {
    // TypeScript knows conn has facebook-ads-specific properties
  }
}
```

### Schema Validation

Used in JSON Schema `oneOf` to validate against correct connection schema:

```json
{
  "oneOf": [
    { "$ref": "./facebook-ads-connection.schema.json" },
    { "$ref": "./notion-connection.schema.json" }
  ]
}
```

## Error Scenarios

### Invalid Type Value

**Scenario**: Client provides incorrect type

```json
{
  "type": "Facebook Ads" // ❌ Case mismatch
}
```

**Result**: Validation error - "Type must be exactly 'facebook-ads'"

```json
{
  "type": "facebook-ads-connection" // ❌ Wrong format
}
```

**Result**: Validation error - "Type must be exactly 'facebook-ads'"

### Type Modification

**Scenario**: Attempting to change connection type

```json
PATCH /connections/1
{
  "type": "notion"  // ❌ Cannot change type
}
```

**Result**: Business logic error - "Connection type cannot be changed. Create a new connection instead."

### Missing Type

**Scenario**: Creating connection without type field

```json
{
  "name": "My Connection",
  "clientId": "abc123"
  // Missing "type"
}
```

**Result**: Validation error - "Type is required"

## Design Rationale

### Why Const Instead of Enum?

- **Schema-specific**: Each connection schema has its own type value
- **Type safety**: Prevents accidental type mismatches at validation layer
- **Polymorphism**: Enables runtime handler selection via discriminated union

### Why Required and Immutable?

- **Referential integrity**: Changing type would invalidate OAuth tokens and configuration
- **Data consistency**: Connection type determines schema structure; changes would cause data corruption
- **User experience**: Changing service types is a separate "migrate connection" workflow

## Security Considerations

- **No security implications**: Type is not sensitive data
- **Exposure**: Safe to include in API responses and client-side code
- **Validation**: Always validate type matches expected handler before processing OAuth callbacks
