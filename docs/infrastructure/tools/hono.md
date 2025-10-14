# Hono - Lightweight Web Framework

## Overview

**Version**: 4.9.12
**Purpose**: Ultra-lightweight, fast web framework for building APIs and web applications built on Web Standard APIs

Hono is a modern web framework designed for the edge. It works seamlessly with Bun, Cloudflare Workers, Deno, AWS Lambda, and Node.js - allowing you to write once and deploy anywhere. With its focus on Web Standards, type safety, and performance, Hono is an ideal choice for building high-performance APIs in Omnera V2.

## Why Hono for Omnera V2

- **Ultra-lightweight**: Under 14kB (with hono/tiny preset) - minimal overhead
- **Blazing Fast**: Optimized routing with RegExpRouter for maximum performance
- **Web Standard APIs**: Built entirely on Web Standards (Request, Response, etc.)
- **Multi-Runtime**: Same code runs on Bun, Cloudflare Workers, Deno, AWS, Node.js
- **TypeScript First**: Excellent TypeScript support with type inference
- **Perfect Bun Integration**: Works natively with Bun's runtime
- **Batteries Included**: Built-in middleware and helpers out of the box
- **Effect-Ready**: Seamlessly integrates with Effect for functional error handling
- **Developer Experience**: Clean, intuitive API with minimal boilerplate

## Key Features

1. **Fast Routing**: RegExpRouter provides extremely fast route matching
2. **Type-Safe**: Full TypeScript support with proper type inference
3. **Middleware Ecosystem**: Rich collection of official and community middleware
4. **Web Standards**: Uses standard Request/Response objects
5. **Context API**: Powerful context object for handling requests
6. **Multiple Response Types**: JSON, text, HTML, streaming, SSE, and more
7. **Error Handling**: Built-in error handling with customization options
8. **Validation Ready**: Easy integration with validation libraries like Effect Schema

## Installation

Hono is already installed in Omnera V2:

```json
{
  "dependencies": {
    "hono": "^4.9.12"
  }
}
```

No additional installation needed.

## Basic Usage

### Creating a Hono App

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Simple route
app.get('/', (c) => c.text('Hello Hono!'))

// JSON response
app.get('/api/user', (c) => {
  return c.json({ name: 'Alice', age: 30 })
})

// Start server with Bun
export default app
```

### Running with Bun

```bash
# Create server file (e.g., src/server.ts)
bun run src/server.ts

# Or with watch mode
bun --watch src/server.ts
```

### Complete Server Example

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Root route
app.get('/', (c) => c.text('Welcome to Omnera API'))

// API routes
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

// Export for Bun
export default {
  port: 3000,
  fetch: app.fetch,
}
```

## Routing

### HTTP Methods

```typescript
import { Hono } from 'hono'

const app = new Hono()

// GET request
app.get('/users', (c) => c.json({ users: [] }))

// POST request
app.post('/users', async (c) => {
  const body = await c.req.json()
  return c.json({ created: true, data: body })
})

// PUT request
app.put('/users/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  return c.json({ updated: true, id, data: body })
})

// DELETE request
app.delete('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ deleted: true, id })
})

// PATCH request
app.patch('/users/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  return c.json({ patched: true, id, data: body })
})
```

### Route Parameters

```typescript
// Single parameter
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ userId: id })
})

// Multiple parameters
app.get('/posts/:postId/comments/:commentId', (c) => {
  const postId = c.req.param('postId')
  const commentId = c.req.param('commentId')
  return c.json({ postId, commentId })
})

// Optional parameters
app.get('/search/:query?', (c) => {
  const query = c.req.param('query') || 'default'
  return c.json({ query })
})

// Wildcard
app.get('/files/*', (c) => {
  const path = c.req.param('*')
  return c.json({ filePath: path })
})
```

### Query Parameters

```typescript
// Access query parameters
app.get('/search', (c) => {
  const query = c.req.query('q')
  const page = c.req.query('page') || '1'
  const limit = c.req.query('limit') || '10'

  return c.json({
    query,
    page: parseInt(page),
    limit: parseInt(limit),
  })
})

// Multiple values (e.g., ?tags=js&tags=ts)
app.get('/filter', (c) => {
  const tags = c.req.queries('tags') // Returns string[]
  return c.json({ tags })
})
```

### Route Grouping with Hono

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Create sub-app for API v1
const apiV1 = new Hono()
apiV1.get('/users', (c) => c.json({ version: 1, users: [] }))
apiV1.get('/posts', (c) => c.json({ version: 1, posts: [] }))

// Mount sub-app
app.route('/api/v1', apiV1)

// Create sub-app for API v2
const apiV2 = new Hono()
apiV2.get('/users', (c) => c.json({ version: 2, users: [] }))

app.route('/api/v2', apiV2)
```

## Middleware

### Built-in Middleware

Hono provides many built-in middleware:

```typescript
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

// Logger middleware - logs all requests
app.use('*', logger())

// CORS middleware
app.use(
  '*',
  cors({
    origin: 'http://localhost:3000',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)

// ETag for caching
app.use('*', etag())

// Pretty JSON formatting (development)
app.use('*', prettyJSON())

// Routes
app.get('/', (c) => c.json({ message: 'Hello' }))
```

### Custom Middleware

```typescript
import type { MiddlewareHandler } from 'hono'

// Simple middleware
const customLogger: MiddlewareHandler = async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
}

// Middleware with logic
const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('Authorization')

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Validate token (simplified)
  if (token !== 'Bearer valid-token') {
    return c.json({ error: 'Invalid token' }, 401)
  }

  // Attach user to context
  c.set('user', { id: '123', name: 'Alice' })

  await next()
}

// Apply middleware
app.use('*', customLogger)
app.use('/api/*', authMiddleware)

// Protected route
app.get('/api/profile', (c) => {
  const user = c.get('user')
  return c.json({ user })
})
```

### Middleware Composition

```typescript
// Apply multiple middleware to specific routes
app.use('/admin/*', authMiddleware, adminOnlyMiddleware)

// Conditional middleware
app.use('*', async (c, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Dev mode')
  }
  await next()
})
```

## Request Handling

### Accessing Request Data

```typescript
app.post('/api/data', async (c) => {
  // Request method
  const method = c.req.method // 'POST'

  // Request URL
  const url = c.req.url // Full URL
  const path = c.req.path // Path only

  // Headers
  const contentType = c.req.header('Content-Type')
  const allHeaders = c.req.header() // All headers

  // Query parameters
  const search = c.req.query('q')

  // Route parameters
  const id = c.req.param('id')

  // Request body (JSON)
  const jsonBody = await c.req.json()

  // Request body (text)
  const textBody = await c.req.text()

  // Request body (FormData)
  const formData = await c.req.formData()

  // Request body (ArrayBuffer)
  const arrayBuffer = await c.req.arrayBuffer()

  // Request body (Blob)
  const blob = await c.req.blob()

  return c.json({ method, path, contentType, jsonBody })
})
```

### Parsing Request Bodies

```typescript
// JSON body
app.post('/api/users', async (c) => {
  const body = await c.req.json<{ name: string; email: string }>()
  return c.json({ created: true, user: body })
})

// Form data
app.post('/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file')
  const name = formData.get('name')

  return c.json({ fileName: file, name })
})

// Text body
app.post('/webhook', async (c) => {
  const payload = await c.req.text()
  console.log('Webhook payload:', payload)
  return c.text('Received')
})
```

## Response Handling

### Response Types

```typescript
import { Hono } from 'hono'

const app = new Hono()

// JSON response
app.get('/json', (c) => {
  return c.json({ message: 'Hello', timestamp: Date.now() })
})

// JSON with status code
app.post('/users', (c) => {
  return c.json({ created: true }, 201)
})

// Text response
app.get('/text', (c) => {
  return c.text('Plain text response')
})

// HTML response
app.get('/html', (c) => {
  return c.html('<h1>Hello Hono</h1>')
})

// Redirect
app.get('/old-path', (c) => {
  return c.redirect('/new-path')
})

// Redirect with status code
app.get('/moved', (c) => {
  return c.redirect('/new-location', 301)
})

// No content
app.delete('/resource/:id', (c) => {
  return c.body(null, 204)
})

// Custom response
app.get('/custom', (c) => {
  return new Response('Custom response', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'X-Custom-Header': 'value',
    },
  })
})
```

### Status Codes

```typescript
// Success responses
app.get('/ok', (c) => c.json({ status: 'ok' }, 200))
app.post('/created', (c) => c.json({ id: 123 }, 201))
app.put('/accepted', (c) => c.json({ queued: true }, 202))
app.delete('/no-content', (c) => c.body(null, 204))

// Client error responses
app.get('/bad-request', (c) => c.json({ error: 'Invalid input' }, 400))
app.get('/unauthorized', (c) => c.json({ error: 'Not authenticated' }, 401))
app.get('/forbidden', (c) => c.json({ error: 'No permission' }, 403))
app.get('/not-found', (c) => c.json({ error: 'Resource not found' }, 404))

// Server error responses
app.get('/error', (c) => c.json({ error: 'Internal server error' }, 500))
app.get('/unavailable', (c) => c.json({ error: 'Service unavailable' }, 503))
```

### Setting Headers

```typescript
app.get('/headers', (c) => {
  // Set single header
  c.header('X-Custom-Header', 'value')

  // Set multiple headers
  c.header('X-Request-ID', '12345')
  c.header('X-Response-Time', '50ms')

  return c.json({ message: 'Check headers' })
})

// Content-Type is set automatically for c.json(), c.text(), etc.
```

## Integration with Effect

Hono integrates seamlessly with Effect for functional error handling and business logic.

### Basic Effect Integration

```typescript
import { Hono } from 'hono'
import { Effect } from 'effect'

const app = new Hono()

// Simple Effect program
const getUser = (id: string) =>
  Effect.succeed({
    id,
    name: 'Alice',
    email: 'alice@example.com',
  })

// Use Effect in route handler
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')

  const user = await Effect.runPromise(getUser(id))

  return c.json(user)
})
```

### Effect with Error Handling

```typescript
import { Effect, Data } from 'effect'

// Define error types
class UserNotFoundError extends Data.TaggedError('UserNotFoundError')<{
  userId: string
}> {}

class DatabaseError extends Data.TaggedError('DatabaseError')<{
  message: string
}> {}

// Effect program with errors
const fetchUser = (id: string) =>
  Effect.gen(function* () {
    // Simulate database lookup
    if (id === '404') {
      return yield* Effect.fail(new UserNotFoundError({ userId: id }))
    }

    if (id === 'error') {
      return yield* Effect.fail(new DatabaseError({ message: 'Connection failed' }))
    }

    return { id, name: 'Alice', email: 'alice@example.com' }
  })

// Route with Effect error handling
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')

  const result = await Effect.runPromise(
    fetchUser(id).pipe(
      Effect.catchTags({
        UserNotFoundError: (error) =>
          Effect.succeed({
            status: 404,
            body: { error: 'User not found', userId: error.userId },
          }),
        DatabaseError: (error) =>
          Effect.succeed({
            status: 500,
            body: { error: 'Database error', message: error.message },
          }),
      }),
      Effect.catchAll(() =>
        Effect.succeed({
          status: 500,
          body: { error: 'Unknown error' },
        })
      )
    )
  )

  // Handle success case
  if ('status' in result) {
    return c.json(result.body, result.status)
  }

  return c.json(result)
})
```

### Effect Services with Hono

```typescript
import { Effect, Context } from 'effect'

// Define service
class UserService extends Context.Tag('UserService')<
  UserService,
  {
    findById: (id: string) => Effect.Effect<User, UserNotFoundError>
    create: (data: CreateUserData) => Effect.Effect<User, DatabaseError>
  }
>() {}

// Implement service
const UserServiceLive = UserService.of({
  findById: (id) =>
    Effect.gen(function* () {
      // Database logic here
      if (id === '404') {
        return yield* Effect.fail(new UserNotFoundError({ userId: id }))
      }
      return { id, name: 'Alice', email: 'alice@example.com' }
    }),
  create: (data) =>
    Effect.gen(function* () {
      // Database logic here
      return { id: '123', ...data }
    }),
})

// Use in route
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')

  const program = Effect.gen(function* () {
    const userService = yield* UserService
    return yield* userService.findById(id)
  })

  const result = await Effect.runPromise(
    program.pipe(
      Effect.provide(UserServiceLive),
      Effect.catchAll((error) =>
        Effect.succeed({
          _tag: 'Error' as const,
          status: 404,
          message: 'User not found',
        })
      )
    )
  )

  if ('_tag' in result && result._tag === 'Error') {
    return c.json({ error: result.message }, result.status)
  }

  return c.json(result)
})
```

## Integration with Effect Schema

Effect Schema provides powerful validation for request data.

### Request Body Validation

```typescript
import { Schema } from 'effect'
import type { ParseError } from 'effect/ParseResult'

// Define schema
const CreateUserSchema = Schema.Struct({
  name: Schema.String.pipe(Schema.minLength(1)),
  email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  age: Schema.Number.pipe(Schema.int(), Schema.greaterThan(0), Schema.lessThan(150)),
})

type CreateUserData = Schema.Schema.Type<typeof CreateUserSchema>

// Route with validation
app.post('/users', async (c) => {
  const body = await c.req.json()

  const result = await Effect.runPromise(
    Schema.decodeUnknown(CreateUserSchema)(body).pipe(
      Effect.catchAll((error: ParseError) =>
        Effect.succeed({
          _tag: 'ValidationError' as const,
          message: 'Invalid request body',
          errors: error,
        })
      )
    )
  )

  if ('_tag' in result && result._tag === 'ValidationError') {
    return c.json({ error: result.message }, 400)
  }

  // result is now properly typed as CreateUserData
  return c.json({ created: true, user: result }, 201)
})
```

### Query Parameter Validation

```typescript
import { Schema } from 'effect'

// Schema for pagination
const PaginationSchema = Schema.Struct({
  page: Schema.NumberFromString.pipe(Schema.int(), Schema.greaterThan(0)),
  limit: Schema.NumberFromString.pipe(Schema.int(), Schema.greaterThan(0), Schema.lessThan(100)),
})

app.get('/users', async (c) => {
  const params = {
    page: c.req.query('page') || '1',
    limit: c.req.query('limit') || '10',
  }

  const result = await Effect.runPromise(
    Schema.decodeUnknown(PaginationSchema)(params).pipe(
      Effect.catchAll(() =>
        Effect.succeed({
          _tag: 'ValidationError' as const,
          message: 'Invalid pagination parameters',
        })
      )
    )
  )

  if ('_tag' in result && result._tag === 'ValidationError') {
    return c.json({ error: result.message }, 400)
  }

  // Fetch users with validated pagination
  return c.json({
    users: [],
    page: result.page,
    limit: result.limit,
  })
})
```

### Reusable Validation Middleware

```typescript
import type { MiddlewareHandler } from 'hono'

// Generic validation middleware
const validate = <A>(schema: Schema.Schema<A, unknown>): MiddlewareHandler => {
  return async (c, next) => {
    const body = await c.req.json()

    const result = await Effect.runPromise(
      Schema.decodeUnknown(schema)(body).pipe(
        Effect.catchAll(() =>
          Effect.succeed({
            _tag: 'ValidationError' as const,
            message: 'Validation failed',
          })
        )
      )
    )

    if ('_tag' in result && result._tag === 'ValidationError') {
      return c.json({ error: result.message }, 400)
    }

    // Store validated data in context
    c.set('validatedBody', result)

    await next()
  }
}

// Use validation middleware
app.post('/users', validate(CreateUserSchema), (c) => {
  const userData = c.get('validatedBody') as CreateUserData
  return c.json({ created: true, user: userData }, 201)
})
```

## Error Handling

### Built-in Error Handling

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Hono automatically handles errors
app.get('/error', (c) => {
  throw new Error('Something went wrong')
  // Returns 500 with error message
})

// Manual error response
app.get('/not-found', (c) => {
  return c.json({ error: 'Resource not found' }, 404)
})
```

### Custom Error Handler

```typescript
import { Hono } from 'hono'
import type { ErrorHandler } from 'hono'

const app = new Hono()

// Custom error handler
const errorHandler: ErrorHandler = (err, c) => {
  console.error(`Error: ${err.message}`)

  if (err instanceof SyntaxError) {
    return c.json({ error: 'Invalid JSON' }, 400)
  }

  return c.json({ error: 'Internal server error', message: err.message }, 500)
}

// Register error handler
app.onError(errorHandler)

// Routes
app.get('/error', (c) => {
  throw new Error('Test error')
})
```

### Error Handling with Effect

```typescript
import { Effect, Data } from 'effect'

class ValidationError extends Data.TaggedError('ValidationError')<{
  field: string
  message: string
}> {}

class NotFoundError extends Data.TaggedError('NotFoundError')<{
  resource: string
  id: string
}> {}

// Helper to convert Effect errors to HTTP responses
const handleEffectError = (error: unknown) => {
  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: { error: 'Validation error', field: error.field, message: error.message },
    }
  }

  if (error instanceof NotFoundError) {
    return {
      status: 404,
      body: { error: 'Not found', resource: error.resource, id: error.id },
    }
  }

  return {
    status: 500,
    body: { error: 'Internal server error' },
  }
}

// Use in routes
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')

  const program = Effect.gen(function* () {
    if (!id) {
      return yield* Effect.fail(new ValidationError({ field: 'id', message: 'ID is required' }))
    }

    if (id === '404') {
      return yield* Effect.fail(new NotFoundError({ resource: 'user', id }))
    }

    return { id, name: 'Alice' }
  })

  const result = await Effect.runPromise(
    program.pipe(Effect.catchAll((error) => Effect.succeed({ _tag: 'Error' as const, error })))
  )

  if ('_tag' in result && result._tag === 'Error') {
    const errorResponse = handleEffectError(result.error)
    return c.json(errorResponse.body, errorResponse.status)
  }

  return c.json(result)
})
```

## Testing with Bun Test

Hono applications are easy to test with Bun's built-in test runner.

### Basic Route Testing

```typescript
import { test, expect, describe } from 'bun:test'
import { Hono } from 'hono'

const app = new Hono()
app.get('/hello', (c) => c.text('Hello Hono!'))

describe('Hono App', () => {
  test('GET /hello returns greeting', async () => {
    const req = new Request('http://localhost/hello')
    const res = await app.fetch(req)

    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello Hono!')
  })
})
```

### Testing JSON Responses

```typescript
import { test, expect, describe } from 'bun:test'
import { Hono } from 'hono'

const app = new Hono()
app.get('/api/user', (c) => c.json({ name: 'Alice', age: 30 }))

describe('JSON API', () => {
  test('GET /api/user returns user data', async () => {
    const req = new Request('http://localhost/api/user')
    const res = await app.fetch(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('application/json')

    const data = await res.json()
    expect(data).toEqual({ name: 'Alice', age: 30 })
  })
})
```

### Testing POST Requests

```typescript
import { test, expect, describe } from 'bun:test'
import { Hono } from 'hono'

const app = new Hono()
app.post('/users', async (c) => {
  const body = await c.req.json()
  return c.json({ created: true, user: body }, 201)
})

describe('POST /users', () => {
  test('creates user successfully', async () => {
    const userData = { name: 'Bob', email: 'bob@example.com' }

    const req = new Request('http://localhost/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })

    const res = await app.fetch(req)

    expect(res.status).toBe(201)

    const data = await res.json()
    expect(data).toEqual({
      created: true,
      user: userData,
    })
  })
})
```

### Testing Error Handling

```typescript
import { test, expect, describe } from 'bun:test'
import { Hono } from 'hono'

const app = new Hono()
app.get('/error', (c) => {
  throw new Error('Test error')
})

describe('Error Handling', () => {
  test('handles errors correctly', async () => {
    const req = new Request('http://localhost/error')
    const res = await app.fetch(req)

    expect(res.status).toBe(500)
  })
})
```

### Testing with Effect Integration

```typescript
import { test, expect, describe } from 'bun:test'
import { Hono } from 'hono'
import { Effect, Data } from 'effect'

class UserNotFoundError extends Data.TaggedError('UserNotFoundError')<{
  userId: string
}> {}

const app = new Hono()

const getUser = (id: string) =>
  Effect.gen(function* () {
    if (id === '404') {
      return yield* Effect.fail(new UserNotFoundError({ userId: id }))
    }
    return { id, name: 'Alice' }
  })

app.get('/users/:id', async (c) => {
  const id = c.req.param('id')

  const result = await Effect.runPromise(
    getUser(id).pipe(
      Effect.catchAll(() => Effect.succeed({ _tag: 'Error' as const, message: 'User not found' }))
    )
  )

  if ('_tag' in result && result._tag === 'Error') {
    return c.json({ error: result.message }, 404)
  }

  return c.json(result)
})

describe('Effect Integration', () => {
  test('returns user when found', async () => {
    const req = new Request('http://localhost/users/123')
    const res = await app.fetch(req)

    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual({ id: '123', name: 'Alice' })
  })

  test('returns 404 when user not found', async () => {
    const req = new Request('http://localhost/users/404')
    const res = await app.fetch(req)

    expect(res.status).toBe(404)

    const data = await res.json()
    expect(data).toEqual({ error: 'User not found' })
  })
})
```

## Running Hono on Bun

### Development Server

```typescript
// src/server.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Omnera!'))

// Export for Bun
export default {
  port: 3000,
  fetch: app.fetch,
}
```

```bash
# Run development server
bun run src/server.ts

# Run with watch mode (auto-reload on changes)
bun --watch src/server.ts
```

### Production Server

```typescript
// src/server.ts
import { Hono } from 'hono'

const app = new Hono()

// Routes
app.get('/', (c) => c.json({ status: 'ok' }))

// Production configuration
const port = parseInt(process.env.PORT || '3000')

export default {
  port,
  fetch: app.fetch,
  // Enable Bun's built-in compression
  development: process.env.NODE_ENV !== 'production',
}

console.log(`Server running on http://localhost:${port}`)
```

```bash
# Run production server
NODE_ENV=production bun run src/server.ts
```

### Environment Variables

```typescript
// Access environment variables
app.get('/config', (c) => {
  return c.json({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    // Or use Bun.env
    apiKey: Bun.env.API_KEY,
  })
})
```

## Best Practices for Omnera V2

1. **Use TypeScript Types**: Leverage Hono's type inference for type-safe routing
2. **Validate with Effect Schema**: Always validate request data with Effect Schema
3. **Handle Errors with Effect**: Use Effect for business logic and error handling
4. **Middleware for Cross-Cutting Concerns**: Authentication, logging, CORS via middleware
5. **Group Related Routes**: Use sub-apps (`app.route()`) to organize routes
6. **Test with Bun Test**: Co-locate route tests with route definitions
7. **Keep Handlers Thin**: Move business logic to Effect services
8. **Use Context for Request-Scoped Data**: Store user, request ID, etc. in context
9. **Return Explicit Status Codes**: Always specify appropriate HTTP status codes
10. **Environment-Specific Configuration**: Use environment variables for config

## Common Patterns

### API Versioning

```typescript
import { Hono } from 'hono'

const app = new Hono()

// V1 API
const v1 = new Hono()
v1.get('/users', (c) => c.json({ version: 1, users: [] }))

// V2 API
const v2 = new Hono()
v2.get('/users', (c) => c.json({ version: 2, users: [] }))

app.route('/api/v1', v1)
app.route('/api/v2', v2)
```

### Authentication Pattern

```typescript
import type { MiddlewareHandler } from 'hono'
import { Effect, Data } from 'effect'

class UnauthorizedError extends Data.TaggedError('UnauthorizedError')<{
  reason: string
}> {}

// Auth middleware
const requireAuth: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Validate token with Effect
  const result = await Effect.runPromise(
    Effect.gen(function* () {
      // Token validation logic
      if (token !== 'valid-token') {
        return yield* Effect.fail(new UnauthorizedError({ reason: 'Invalid token' }))
      }

      return { id: '123', email: 'user@example.com' }
    }).pipe(
      Effect.catchAll(() => Effect.succeed({ _tag: 'Error' as const, message: 'Unauthorized' }))
    )
  )

  if ('_tag' in result && result._tag === 'Error') {
    return c.json({ error: result.message }, 401)
  }

  c.set('user', result)
  await next()
}

// Protected routes
app.get('/api/profile', requireAuth, (c) => {
  const user = c.get('user')
  return c.json({ user })
})
```

### CRUD Pattern with Effect

```typescript
import { Hono } from 'hono'
import { Effect, Data, Context } from 'effect'
import { Schema } from 'effect'

// Error types
class NotFoundError extends Data.TaggedError('NotFoundError')<{ id: string }> {}
class ValidationError extends Data.TaggedError('ValidationError')<{ message: string }> {}

// Schema
const UserSchema = Schema.Struct({
  name: Schema.String,
  email: Schema.String,
})

type User = Schema.Schema.Type<typeof UserSchema>

// Service
class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    findById: (id: string) => Effect.Effect<User, NotFoundError>
    create: (data: User) => Effect.Effect<User & { id: string }, ValidationError>
    update: (id: string, data: Partial<User>) => Effect.Effect<User, NotFoundError>
    delete: (id: string) => Effect.Effect<void, NotFoundError>
  }
>() {}

const app = new Hono()

// GET /users/:id
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')

  const program = Effect.gen(function* () {
    const repo = yield* UserRepository
    return yield* repo.findById(id)
  })

  const result = await Effect.runPromise(
    program.pipe(
      Effect.provide(UserRepositoryLive),
      Effect.catchAll(() =>
        Effect.succeed({ _tag: 'Error' as const, status: 404, message: 'User not found' })
      )
    )
  )

  if ('_tag' in result && result._tag === 'Error') {
    return c.json({ error: result.message }, result.status)
  }

  return c.json(result)
})

// POST /users
app.post('/users', async (c) => {
  const body = await c.req.json()

  const program = Effect.gen(function* () {
    const validated = yield* Schema.decodeUnknown(UserSchema)(body)
    const repo = yield* UserRepository
    return yield* repo.create(validated)
  })

  const result = await Effect.runPromise(
    program.pipe(
      Effect.provide(UserRepositoryLive),
      Effect.catchAll(() =>
        Effect.succeed({ _tag: 'Error' as const, status: 400, message: 'Invalid data' })
      )
    )
  )

  if ('_tag' in result && result._tag === 'Error') {
    return c.json({ error: result.message }, result.status)
  }

  return c.json(result, 201)
})
```

## Performance Considerations

- **Hono is extremely fast**: Optimized routing with minimal overhead
- **Use streaming for large responses**: Hono supports streaming responses
- **Leverage Bun's speed**: Bun + Hono = maximum performance
- **Minimize middleware**: Only use necessary middleware for best performance
- **Cache responses**: Use ETag middleware for caching

## Integration with Bun

- **Native TypeScript**: Hono TypeScript files run directly with Bun
- **Fast startup**: Bun's fast startup combined with Hono's lightweight design
- **Hot reload**: Use `bun --watch` for automatic reloading during development
- **Built-in fetch**: Bun's native fetch API works perfectly with Hono
- **Environment variables**: Access via `process.env` or `Bun.env`

## References

- Hono documentation: https://hono.dev/
- Hono API reference: https://hono.dev/docs/api/hono
- Hono middleware: https://hono.dev/docs/middleware/builtin/logger
- Bun HTTP server: https://bun.sh/docs/api/http
- Effect documentation: https://effect.website/
- Effect Schema: https://effect.website/docs/schema/introduction
