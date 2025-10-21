# OAuth Client ID - Business Rules

## Overview

Public identifier for the OAuth 2.0 application registered with Notion. This ID is used to initiate OAuth authorization flows and identify your application to the Notion OAuth service.

## Validation Rules

- **Type**: String
- **Length**: Minimum 1 character (no maximum enforced)
- **Required**: Yes
- **Format**: Provider-specific (typically alphanumeric with underscores/hyphens)

### Examples

```json
{
  "clientId": "notion_client_xyz789"
}
```

```json
{
  "clientId": "app.omnera.notion.1234567890"
}
```

## How to Obtain

### Notion OAuth Setup

1. Navigate to [Notion Developer Hub](https://notion.com/developers)
2. Create new OAuth integration
3. Configure redirect URIs: `https://yourdomain.com/oauth/notion/callback`
4. Copy the generated **Client ID** from integration settings
5. Store in connection configuration

### Example OAuth Integration Config

```
Integration Name: Omnera Notion Integration
Client ID: notion_client_abc123xyz
Redirect URI: https://app.omnera.io/oauth/notion/callback
Scopes: data.records:read data.records:write
```

## Runtime Behavior

### OAuth Flow Usage

Client ID is included in authorization URL:

```
GET https://notion.com/oauth2/v1/authorize?
  client_id=notion_client_xyz789
  &redirect_uri=https://app.omnera.io/oauth/callback
  &response_type=code
  &scope=data.records:read
```

### Security Properties

- **Public**: Safe to expose in client-side code (JavaScript, mobile apps)
- **Not Secret**: Does not provide authentication on its own
- **Static**: Remains constant unless OAuth app is recreated

### Storage

- **Location**: Stored in database `connections` table
- **Encryption**: No encryption required (public identifier)
- **API Response**: Included in GET /connections responses

## Error Scenarios

### Invalid Client ID

**Scenario**: OAuth provider rejects client ID during authorization

```
GET /oauth/authorize?client_id=invalid_id
```

**Result**: OAuth error - `invalid_client` with redirect to error page

### Empty Client ID

**Scenario**: User creates connection without client ID

```json
{
  "clientId": "" // ❌ Invalid
}
```

**Result**: Validation error - "Client ID must be at least 1 character"

### Mismatched Client ID

**Scenario**: Client ID doesn't match OAuth app configuration

```
Authorization Header: Basic notion_client_abc:secret_xyz
Server expects: notion_client_123
```

**Result**: OAuth error - `unauthorized_client`

### Revoked OAuth App

**Scenario**: Notion OAuth app is deleted or disabled

```
User initiates OAuth flow with valid client ID
```

**Result**: OAuth provider returns `invalid_client` error

## Best Practices

### Environment Management

Use different OAuth apps per environment:

```json
{
  "development": {
    "clientId": "notion_dev_123",
    "redirectUri": "http://localhost:3000/oauth/callback"
  },
  "production": {
    "clientId": "notion_prod_789",
    "redirectUri": "https://app.omnera.io/oauth/callback"
  }
}
```

### Rotation Strategy

- Client IDs are typically long-lived (years)
- Rotation required only if OAuth app is compromised
- Update all connections after rotation
- Coordinate with client secret rotation

## Security Considerations

- **Exposure**: Safe to expose in public code, logs, and error messages
- **PKCE**: For mobile/SPA apps, use PKCE (Proof Key for Code Exchange) even though client ID is public
- **Validation**: Always validate OAuth callback state parameter to prevent CSRF
- **Rate Limiting**: Monitor OAuth attempts per client ID to detect abuse
