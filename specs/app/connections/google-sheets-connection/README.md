# Google Sheets Connection - Business Rules

## Overview

OAuth 2.0 integration with Google Sheets, enabling access to Google Sheets bases, tables, records, and webhooks. Google Sheets is a cloud-based spreadsheet-database hybrid platform used for project management, CRM, and data organization.

## Use Cases

- **Data Sync**: Sync records between Sovrium tables and Google Sheets bases
- **Automation Triggers**: React to new/updated records in Google Sheets
- **Webhook Integration**: Subscribe to Google Sheets webhook events
- **API Actions**: Create, read, update, delete records via Google Sheets API

## Connection Schema

### Required Properties

| Property       | Type                  | Description                         |
| -------------- | --------------------- | ----------------------------------- |
| `type`         | const "google-sheets" | Service discriminator               |
| `id`           | integer               | Unique connection identifier        |
| `name`         | string (1-100 chars)  | Human-readable label                |
| `clientId`     | string                | OAuth 2.0 client identifier         |
| `clientSecret` | string                | OAuth 2.0 client secret (encrypted) |

### Example Configuration

```json
{
  "type": "google-sheets",
  "id": 1,
  "name": "Marketing Google Sheets Workspace",
  "clientId": "google-sheets_client_xyz789",
  "clientSecret": "secret_google-sheets_abc123"
}
```

## OAuth Setup Guide

### 1. Create OAuth Integration in Google Sheets

1. Navigate to [Google Sheets Developer Hub](https://google-sheets.com/developers)
2. Click "Create OAuth Integration"
3. Fill in integration details:
   - **Name**: Sovrium Integration
   - **Redirect URI**: `https://yourdomain.com/oauth/google-sheets/callback`
   - **Scopes**: Select required permissions (e.g., `data.records:read`, `data.records:write`)
4. Copy **Client ID** and **Client Secret**

### 2. Configure Connection in Sovrium

1. Go to Settings > Connections
2. Click "Add Connection" > "Google Sheets"
3. Paste Client ID and Client Secret
4. Set connection name (e.g., "Marketing Google Sheets")
5. Click "Save"

### 3. Connect via OAuth Flow

1. Click "Connect" button next to saved connection
2. Redirected to Google Sheets authorization page
3. Grant requested permissions
4. Redirected back to Sovrium
5. Connection status changes to "Connected"

## Runtime Behavior

### OAuth Flow Lifecycle

```mermaid
sequenceDiagram
    User->>Sovrium: Click "Connect"
    Sovrium->>Google Sheets: Redirect to /oauth/authorize
    Google Sheets->>User: Show authorization page
    User->>Google Sheets: Grant permissions
    Google Sheets->>Sovrium: Redirect with auth code
    Sovrium->>Google Sheets: Exchange code for tokens
    Google Sheets->>Sovrium: Return access + refresh tokens
    Sovrium->>Database: Store encrypted tokens
    Sovrium->>User: Show "Connected" status
```

### Token Management

- **Access Token**: Short-lived (1 hour), used for API requests
- **Refresh Token**: Long-lived (90 days), used to obtain new access tokens
- **Auto-Refresh**: System automatically refreshes expired access tokens
- **Encryption**: All tokens encrypted at rest using AES-256

### Connection States

| State          | Description                      | User Actions                   |
| -------------- | -------------------------------- | ------------------------------ |
| `configured`   | Credentials saved, not connected | Connect                        |
| `connected`    | OAuth completed, tokens valid    | Disconnect, Test               |
| `disconnected` | Manually disconnected            | Re-connect                     |
| `error`        | OAuth failed or tokens revoked   | Update credentials, Re-connect |

## API Capabilities

### Supported Operations

- **List Bases**: Retrieve all accessible Google Sheets bases
- **List Tables**: Get tables within a base
- **Query Records**: Filter, sort, paginate records
- **Create Record**: Insert new record with field values
- **Update Record**: Modify existing record fields
- **Delete Record**: Remove record from table
- **Webhooks**: Subscribe to record changes

### Example API Call (via Sovrium)

```typescript
// Automation action: Create Google Sheets record
{
  "action": "google-sheets.createRecord",
  "connection": 1,  // Connection ID
  "config": {
    "baseId": "appABC123",
    "tableId": "tblDEF456",
    "fields": {
      "Name": "John Doe",
      "Email": "john@example.com",
      "Status": "Active"
    }
  }
}
```

## Security Best Practices

### Credentials Storage

- Client Secret MUST be encrypted before database storage
- Never expose Client Secret in API responses (mask as `***`)
- Use separate OAuth apps for dev/staging/production environments

### Permission Scopes

Request only necessary scopes:

- **Read-only**: `data.records:read`, `schema.bases:read`
- **Write access**: Add `data.records:write`
- **Webhooks**: Add `webhook:manage`

### Token Security

- Store access/refresh tokens encrypted
- Rotate refresh tokens on security events
- Revoke tokens immediately on connection deletion
- Monitor for unusual API activity

## Error Scenarios

### OAuth Authorization Failed

**Cause**: User denied permissions or invalid client credentials
**Resolution**: Verify Client ID/Secret, retry connection flow

### Token Expired

**Cause**: Access token expired and refresh failed
**Resolution**: System auto-refreshes; if refresh fails, user must re-connect

### API Rate Limit

**Cause**: Exceeded Google Sheets API rate limits (5 requests/second)
**Resolution**: Implement exponential backoff, queue requests

### Webhook Payload Delivery Failed

**Cause**: Sovrium webhook endpoint unreachable
**Resolution**: Google Sheets retries up to 3 times; check endpoint availability

## Testing Specifications

See `specs` array in schema for E2E test scenarios covering:

- Connection creation with valid credentials
- Validation of invalid credentials
- Connection name updates

Run tests: `bun test:e2e --grep="CONN-GOOGLE_SHEETS"`

## Related Resources

- [Google Sheets OAuth Documentation](https://google-sheets.com/developers/web/api/oauth-reference)
- [Google Sheets API Reference](https://google-sheets.com/developers/web/api/introduction)
- [Sovrium Connection Management Guide](../../../admin/connections/README.md)
