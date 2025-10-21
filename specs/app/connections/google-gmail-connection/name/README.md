# Connection Name - Business Rules

## Overview

Human-readable label for the connection instance, displayed throughout the UI to help users identify and distinguish between multiple connections of the same service type.

## Validation Rules

- **Type**: String
- **Length**: 1 to 100 characters
- **Required**: Yes
- **Format**: Any Unicode characters allowed (no pattern restrictions)

### Examples

```json
{
  "name": "My Google Gmail Workspace"
}
```

```json
{
  "name": "Production Database 🚀"
}
```

```json
{
  "name": "Marketing Team - Q1 2025"
}
```

## Runtime Behavior

- **Display**: Shown in connection selection dropdowns, automation configuration, and connection management UI
- **Mutability**: Can be updated at any time via PUT/PATCH requests
- **Uniqueness**: NOT enforced - users may create multiple connections with same name (differentiated by ID)
- **Default**: If not provided, could default to "{Service} Connection #{ID}" (application logic)

## Error Scenarios

### Empty Name

**Scenario**: User provides empty string or whitespace-only

```json
{
  "name": "" // ❌ Invalid
}
```

**Result**: Validation error - "Connection name must be at least 1 character"

### Name Too Long

**Scenario**: User provides name exceeding 100 characters

```json
{
  "name": "This is an extremely long connection name that exceeds the maximum allowed length and should be rejected..." // ❌ 101+ chars
}
```

**Result**: Validation error - "Connection name must not exceed 100 characters"

### Special Characters

**Scenario**: Name contains only emojis or special characters

```json
{
  "name": "🔥🚀💯" // ✅ Valid
}
```

**Result**: Accepted (no restrictions on character types)

## Best Practices

### Naming Conventions

- **Descriptive**: Include workspace, team, or environment context
  - Good: "Marketing Google Gmail - Production"
  - Bad: "Connection 1"

- **Searchable**: Use keywords that help filter/search
  - Good: "Sales CRM - Google Sheets"
  - Bad: "GS"

- **Consistent**: Establish organizational pattern
  - Pattern: "{Team} {Service} - {Environment}"
  - Example: "Engineering Notion - Staging"

### Multi-Environment Strategy

For teams managing multiple environments:

```json
[
  { "name": "Google Gmail - Development" },
  { "name": "Google Gmail - Staging" },
  { "name": "Google Gmail - Production" }
]
```

## Security Considerations

- **Exposure**: Connection names are visible to all users with workspace access
- **PII Warning**: Avoid including sensitive information (API keys, passwords, personal data)
- **Injection**: UI should escape HTML/JavaScript when rendering names to prevent XSS
