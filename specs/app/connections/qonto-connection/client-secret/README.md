# OAuth Client Secret - Business Rules

## Overview

Confidential credential used to authenticate the application during OAuth 2.0 token exchange with Qonto. This secret proves the application's identity and must be kept secure at all times.

## Validation Rules

- **Type**: String
- **Length**: Minimum 1 character (no maximum enforced at schema level)
- **Required**: Yes
- **Format**: Provider-specific (typically base64-encoded random string)

### Examples

```json
{
  "clientSecret": "secret_qonto_abc123xyz789"
}
```

```json
{
  "clientSecret": "sk_live_51Hxyz...ABCDEF"
}
```

## How to Obtain

### Qonto OAuth Setup

1. Navigate to [Qonto Developer Hub](https://qonto.com/developers)
2. Create new OAuth integration (same as Client ID setup)
3. Copy the generated **Client Secret** immediately (shown only once)
4. Store securely in password manager or secrets vault
5. Configure in Omnera connection settings

WARNING: Client secret is shown only once during creation. If lost, must regenerate new secret.

## Security Considerations

### Encryption at Rest

- **Storage**: MUST be encrypted before writing to database
- **Algorithm**: AES-256-GCM or equivalent
- **Key Management**: Use dedicated encryption key stored in secrets manager (AWS KMS, HashiCorp Vault, etc.)

```typescript
// Example encryption before storage
const encrypted = await encrypt(clientSecret, masterKey)
await db.connections.insert({
  clientId: 'abc123',
  clientSecret: encrypted, // Stored encrypted
})
```

### Exposure Protection

- **API Responses**: NEVER return in GET /connections responses
  - Option 1: Omit field entirely
  - Option 2: Mask as `"clientSecret": "***"`

- **Logs**: Redact from application logs and error messages
  - Bad: `Failed to authenticate with secret: sk_live_xyz`
  - Good: `Failed to authenticate with client secret [REDACTED]`

- **Error Messages**: Do not include in validation errors
  - Bad: `Invalid secret: sk_live_xyz does not match`
  - Good: `Invalid client secret format`

### Rotation Policy

- **Frequency**: Rotate every 90 days (recommended security policy)
- **Process**:
  1. Generate new secret in Qonto OAuth settings
  2. Update Omnera connection with new secret
  3. Test OAuth flow with new credentials
  4. Revoke old secret in Qonto
  5. Document rotation in audit log

### Access Control

- **Who can view**: Only workspace admins/owners
- **Who can update**: Only workspace admins/owners
- **Audit trail**: Log all read/write operations with user ID and timestamp

## Runtime Behavior

### OAuth Token Exchange

Client secret is used during authorization code exchange:

```http
POST https://qonto.com/oauth2/v1/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=AUTH_CODE_FROM_CALLBACK
&client_id=qonto_client_abc123
&client_secret=secret_qonto_xyz789
&redirect_uri=https://app.omnera.io/oauth/callback
```

### Decryption for Use

Decrypt only when needed for OAuth flow:

```typescript
async function exchangeOAuthCode(connection: Connection, code: string) {
  // Decrypt secret from database
  const clientSecret = await decrypt(connection.encryptedSecret, masterKey)

  // Use for token exchange
  const tokens = await oauthProvider.exchangeCode({
    clientId: connection.clientId,
    clientSecret, // Decrypted in memory only
    code,
  })

  // Never log or return secret
  return tokens
}
```

### Immutability

- Secret can be updated via PATCH /connections/:id
- Update requires re-verification via OAuth test flow
- Old secret immediately invalidated after successful update

## Error Scenarios

### Empty Client Secret

**Scenario**: User creates connection without secret

```json
{
  "clientSecret": "" // ❌ Invalid
}
```

**Result**: Validation error - "Client secret is required and cannot be empty"

### Invalid Secret Format

**Scenario**: User provides malformed secret

```json
{
  "clientSecret": "not-a-valid-secret-format"
}
```

**Result**: OAuth exchange fails with `invalid_client` error from provider

### Incorrect Secret

**Scenario**: Secret doesn't match client ID in OAuth provider

```http
POST /oauth/token
client_id=qonto_client_123
client_secret=wrong_secret
```

**Result**: OAuth provider returns `401 Unauthorized` with `invalid_client` error

### Expired/Revoked Secret

**Scenario**: OAuth app credentials were rotated but connection not updated

```
User initiates OAuth flow
Server attempts token exchange with old secret
```

**Result**: `invalid_client` error, prompt user to update connection credentials

### Encryption Key Loss

**Scenario**: Master encryption key is lost/rotated without re-encrypting secrets

```
Server attempts to decrypt client secret
Decryption fails due to key mismatch
```

**Result**: All connections unusable until secrets are re-entered and re-encrypted

## Best Practices

### Secret Management

```typescript
// ✅ GOOD: Encrypt before storage
const encrypted = await encrypt(secret, masterKey)
await db.insert({ clientSecret: encrypted })

// ❌ BAD: Store plaintext
await db.insert({ clientSecret: secret })

// ✅ GOOD: Decrypt only when needed
const secret = await decrypt(conn.clientSecret, masterKey)
await oauthExchange(secret)

// ❌ BAD: Decrypt and cache in memory
this.secrets[connId] = await decrypt(conn.clientSecret, masterKey)
```

### Environment Separation

Never reuse production secrets in development:

```json
{
  "development": {
    "clientId": "qonto_dev_123",
    "clientSecret": "secret_dev_abc"
  },
  "production": {
    "clientId": "qonto_prod_789",
    "clientSecret": "secret_prod_xyz"
  }
}
```

### Backup and Recovery

- Store encrypted backups of all connection secrets
- Document recovery procedure for lost master encryption key
- Test restoration process quarterly

## Compliance

### GDPR/Privacy

- Client secrets are NOT personal data (PII)
- No special deletion requirements beyond security best practices

### SOC 2 / ISO 27001

- Encryption at rest: Required
- Encryption in transit: Required (HTTPS only)
- Access logging: Required
- Rotation policy: Recommended (90 days)
- Backup encryption: Required

### PCI DSS (if applicable)

- Treat as sensitive authentication data (SAD)
- Never log, display, or transmit unencrypted
- Quarterly rotation recommended
