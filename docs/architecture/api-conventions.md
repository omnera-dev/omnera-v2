# API Conventions

> **Convention over Configuration**: Sovrium automatically generates RESTful API routes based on your application configuration. No need to define endpoints manually.

## Overview

Sovrium follows a convention-based approach to API generation. When you define tables, pages, and automations in your `app.schema.json`, corresponding API routes are automatically created and exposed.

## Tables API

All tables automatically get full CRUD (Create, Read, Update, Delete) REST endpoints.

### Base Pattern

```
/api/tables/{tableName}/records
```

### Endpoints

#### List All Records

```http
GET /api/tables/{tableName}/records
```

**Query Parameters:**

- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Records per page (default: 50, max: 1000)
- `sort` (string): Field to sort by (prefix with `-` for descending)
- `filter[fieldName]` (string): Filter by field value

**Example:**

```http
GET /api/tables/users/records?page=1&limit=20&sort=-createdAt&filter[role]=admin
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### Get Single Record

```http
GET /api/tables/{tableName}/records/{id}
```

**Example:**

```http
GET /api/tables/users/records/123
```

**Response:**

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-16T14:20:00Z"
}
```

#### Create Record

```http
POST /api/tables/{tableName}/records
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "user"
}
```

**Response:**

```json
{
  "id": 124,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "user",
  "createdAt": "2025-01-17T09:15:00Z",
  "updatedAt": "2025-01-17T09:15:00Z"
}
```

#### Update Record

```http
PATCH /api/tables/{tableName}/records/{id}
Content-Type: application/json
```

**Request Body:**

```json
{
  "role": "admin"
}
```

**Response:**

```json
{
  "id": 124,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin",
  "createdAt": "2025-01-17T09:15:00Z",
  "updatedAt": "2025-01-17T11:45:00Z"
}
```

#### Delete Record

```http
DELETE /api/tables/{tableName}/records/{id}
```

**Response:**

```json
{
  "success": true,
  "id": 124
}
```

## File Upload API

Tables with attachment fields (`single-attachment` or `multiple-attachments`) automatically get file upload endpoints.

### Upload File

```http
POST /api/tables/{tableName}/records/{id}/fields/{fieldName}/upload
Content-Type: multipart/form-data
```

**Form Data:**

- `file` (File): The file to upload

**Example:**

```bash
curl -X POST \
  -F "file=@avatar.jpg" \
  http://localhost:3000/api/tables/users/records/123/fields/avatar/upload
```

**Response:**

```json
{
  "fileId": "abc123def456",
  "fileName": "avatar.jpg",
  "fileSize": 245678,
  "mimeType": "image/jpeg",
  "url": "/api/tables/users/records/123/fields/avatar/download/abc123def456"
}
```

### Download File

```http
GET /api/tables/{tableName}/records/{id}/fields/{fieldName}/download/{fileId}
```

**Example:**

```http
GET /api/tables/users/records/123/fields/avatar/download/abc123def456
```

**Response:** Binary file data with appropriate `Content-Type` header

### Delete File

```http
DELETE /api/tables/{tableName}/records/{id}/fields/{fieldName}/files/{fileId}
```

**Response:**

```json
{
  "success": true,
  "fileId": "abc123def456"
}
```

## Pages API

### Form Submissions

Pages with `type: "form"` automatically get submission endpoints.

```http
POST /api/pages/{pageName}/submit
Content-Type: application/json
```

**Request Body:** Matches the form's input fields

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I need help with..."
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Thank you! We will get back to you soon.",
  "recordId": 45
}
```

**Response (Validation Error):**

```json
{
  "success": false,
  "errors": {
    "email": "Invalid email format",
    "message": "Message is required"
  }
}
```

## Automations API

### Manual Trigger

```http
POST /api/automations/{automationName}/trigger
Content-Type: application/json
```

**Request Body:** Data to pass to the automation

```json
{
  "userId": 123,
  "event": "custom-event"
}
```

**Response:**

```json
{
  "success": true,
  "executionId": "exec_789xyz",
  "status": "running"
}
```

### Check Status

```http
GET /api/automations/{automationName}/status
```

**Query Parameters:**

- `executionId` (string): Execution ID from trigger response

**Example:**

```http
GET /api/automations/send-welcome-email/status?executionId=exec_789xyz
```

**Response:**

```json
{
  "executionId": "exec_789xyz",
  "status": "completed",
  "startedAt": "2025-01-17T10:00:00Z",
  "completedAt": "2025-01-17T10:00:03Z",
  "result": {
    "emailSent": true,
    "recipientEmail": "john@example.com"
  }
}
```

## Error Responses

All API endpoints follow a consistent error response format:

### Validation Error (400)

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": {
    "email": "Invalid email format",
    "age": "Must be a number"
  }
}
```

### Not Found (404)

```json
{
  "error": "Not Found",
  "message": "Record with id 999 not found in table 'users'"
}
```

### Unauthorized (401)

```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### Forbidden (403)

```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### Internal Server Error (500)

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "requestId": "req_abc123"
}
```

## Authentication

All API routes (except public forms) require authentication by default.

### Bearer Token

```http
Authorization: Bearer {token}
```

### API Key

```http
X-API-Key: {apiKey}
```

## Rate Limiting

All API endpoints are rate-limited per IP address:

- **Anonymous requests**: 60 requests per minute
- **Authenticated requests**: 300 requests per minute

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 287
X-RateLimit-Reset: 1642434000
```

## Pagination

List endpoints support cursor-based pagination:

### Query Parameters

- `page` (number): Page number (1-indexed)
- `limit` (number): Items per page (default: 50, max: 1000)

### Response Format

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 500,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering

List endpoints support filtering via query parameters:

```http
GET /api/tables/users/records?filter[role]=admin&filter[status]=active
```

### Operators

- `eq` (default): Equals
- `ne`: Not equals
- `gt`: Greater than
- `gte`: Greater than or equal
- `lt`: Less than
- `lte`: Less than or equal
- `in`: In array
- `contains`: String contains

**Example with operators:**

```http
GET /api/tables/products/records?filter[price][gte]=100&filter[price][lte]=500
```

## Sorting

List endpoints support sorting:

```http
GET /api/tables/users/records?sort=name
```

**Descending order:**

```http
GET /api/tables/users/records?sort=-createdAt
```

**Multiple fields:**

```http
GET /api/tables/users/records?sort=role,-createdAt
```

## CORS

CORS is enabled by default for all origins in development. In production, configure allowed origins via environment variables:

```bash
ALLOWED_ORIGINS=https://example.com,https://app.example.com
```

## Webhooks

Automations with HTTP triggers expose webhook endpoints:

```http
POST /webhooks/{automationName}
Content-Type: application/json
```

Webhook URLs include a security token:

```http
POST /webhooks/{automationName}?token={securityToken}
```

## Best Practices

### 1. Use Pagination

Always paginate large result sets to avoid performance issues:

```http
GET /api/tables/users/records?limit=100
```

### 2. Select Specific Fields

Reduce payload size by selecting only needed fields (future feature):

```http
GET /api/tables/users/records?fields=id,name,email
```

### 3. Use Batch Operations

For multiple updates, use batch endpoints (future feature):

```http
POST /api/tables/users/records/batch
```

### 4. Handle Rate Limits

Implement exponential backoff when rate limited:

```javascript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After')
  await sleep(retryAfter * 1000)
  // Retry request
}
```

### 5. Validate Input

Always validate input on the client before sending to avoid unnecessary errors:

```javascript
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

if (!validateEmail(formData.email)) {
  // Show error to user
  return
}

await fetch('/api/pages/contact/submit', {
  method: 'POST',
  body: JSON.stringify(formData),
})
```

## Examples

### Create User with Avatar

```javascript
// 1. Create user record
const userResponse = await fetch('/api/tables/users/records', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token123',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
  }),
})
const user = await userResponse.json()

// 2. Upload avatar
const formData = new FormData()
formData.append('file', avatarFile)

const uploadResponse = await fetch(`/api/tables/users/records/${user.id}/fields/avatar/upload`, {
  method: 'POST',
  headers: {
    Authorization: 'Bearer token123',
  },
  body: formData,
})
const avatar = await uploadResponse.json()

console.log('User created with avatar:', avatar.url)
```

### Submit Form

```javascript
const response = await fetch('/api/pages/contact/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Jane Smith',
    email: 'jane@example.com',
    message: 'I have a question about your product...',
  }),
})

const result = await response.json()

if (result.success) {
  console.log(result.message) // "Thank you! We will get back to you soon."
} else {
  console.error('Validation errors:', result.errors)
}
```

### List and Filter Products

```javascript
const response = await fetch(
  '/api/tables/products/records?' +
    'filter[category]=electronics&' +
    'filter[price][gte]=100&' +
    'filter[price][lte]=500&' +
    'sort=-popularity&' +
    'page=1&' +
    'limit=20',
  {
    headers: {
      Authorization: 'Bearer token123',
    },
  }
)

const { data, pagination } = await response.json()

console.log(`Found ${pagination.total} products`)
data.forEach((product) => {
  console.log(`${product.name}: $${product.price}`)
})
```

## Future Enhancements

The following features are planned for future releases:

- [ ] GraphQL API alongside REST
- [ ] WebSocket subscriptions for real-time updates
- [ ] Batch operations for bulk create/update/delete
- [ ] Field selection (`?fields=id,name,email`)
- [ ] Aggregation queries (`?aggregate=count,sum,avg`)
- [ ] Full-text search
- [ ] Geospatial queries
- [ ] API versioning (`/api/v2/...`)
- [ ] OpenAPI/Swagger documentation generation
- [ ] API client SDKs (TypeScript, Python, Go)

---

**Related Documentation:**

- [Schema Architecture](./layer-based-architecture.md)
- [Testing Strategy](./testing-strategy.md)
- [Security Best Practices](./security-best-practices.md)
