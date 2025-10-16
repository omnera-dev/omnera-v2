# Security Best Practices

## Overview

This guide provides security best practices for the Omnera stack, covering Better Auth authentication, input validation with Effect Schema, CSRF/XSS protection, and secure coding patterns. Security should be built into the application from the start, not added as an afterthought.

## Core Security Principles

1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Grant minimum necessary permissions
3. **Fail Securely**: Default to denying access, not granting it
4. **Don't Trust User Input**: Validate and sanitize all inputs
5. **Keep Dependencies Updated**: Regularly update packages for security patches

---

## Authentication Security (Better Auth)

### Session Management

Better Auth handles session security by default, but follow these practices:

```typescript
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),

  // ✅ CORRECT: Secure session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (reasonable duration)
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  // ✅ CORRECT: Secure cookie settings
  advanced: {
    cookieOptions: {
      httpOnly: true, // Prevent JavaScript access to cookies
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      path: '/', // Cookie available across entire site
    },
  },
})
```

**Security Benefits**:

- `httpOnly`: Protects against XSS attacks stealing session tokens
- `secure`: Ensures cookies only sent over HTTPS in production
- `sameSite: 'lax'`: Mitigates CSRF attacks
- Regular session updates: Reduces window for session hijacking

### Password Security

Better Auth handles password hashing automatically using bcrypt:

```typescript
// ✅ CORRECT: Better Auth hashes passwords automatically
await auth.api.signUpEmail({
  body: {
    email: 'user@example.com',
    password: 'securePassword123!', // Hashed automatically
    name: 'User',
  },
})

// ❌ INCORRECT: Never store passwords in plain text
const user = {
  email: 'user@example.com',
  password: 'securePassword123!', // Don't store unhashed passwords
}
await db.insert(users).values(user)
```

**Password Requirements** (enforce in validation):

- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, special characters
- Not common passwords (use password strength library if needed)

### Email Verification

Enable email verification to prevent fake accounts:

```typescript
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // ✅ Require verification
    sendResetPassword: async (user, resetPasswordUrl) => {
      // Send password reset email
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        body: `Click here to reset: ${resetPasswordUrl}`,
      })
    },
  },
})
```

### Multi-Factor Authentication (MFA)

Enable MFA for enhanced security:

```typescript
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  plugins: [
    twoFactorAuth(), // Enable 2FA plugin
  ],
})

// Usage in application
const { data } = await auth.api.enableTwoFactor({
  body: {
    password: userPassword, // Verify user identity
  },
})

// Show QR code to user for scanning with authenticator app
console.log(data.qrCode)
```

---

## Input Validation with Effect Schema

### Validate All User Inputs

Never trust user input. Always validate with Effect Schema:

```typescript
import { Schema } from 'effect'

// ✅ CORRECT: Define strict schemas for all inputs
const CreateUserSchema = Schema.Struct({
  email: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Email is required' }),
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: () => 'Invalid email format',
    })
  ),
  name: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Name is required' }),
    Schema.maxLength(100, { message: () => 'Name too long' }),
    Schema.pattern(/^[a-zA-Z\s]+$/, {
      message: () => 'Name contains invalid characters',
    })
  ),
  age: Schema.Number.pipe(
    Schema.int({ message: () => 'Age must be an integer' }),
    Schema.greaterThanOrEqualTo(0, { message: () => 'Age must be positive' }),
    Schema.lessThanOrEqualTo(150, { message: () => 'Age too large' })
  ),
})

// Validate in Hono route
app.post('/users', async (c) => {
  const body = await c.req.json()

  // Validate and decode
  const result = await Effect.runPromise(
    Schema.decodeUnknown(CreateUserSchema)(body).pipe(Effect.either)
  )

  if (result._tag === 'Left') {
    return c.json({ error: 'Validation failed', details: result.left }, 400)
  }

  const validatedData = result.right
  // Use validated data safely
  const user = await createUser(validatedData)
  return c.json(user)
})
```

### SQL Injection Prevention

Use parameterized queries with Drizzle ORM:

```typescript
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

// ✅ CORRECT: Parameterized query (safe)
const email = userInput.email
const user = await db.select().from(users).where(eq(users.email, email))

// ❌ INCORRECT: String concatenation (SQL injection risk)
const query = `SELECT * FROM users WHERE email = '${userInput.email}'`
const user = await db.execute(query) // Vulnerable to SQL injection!
```

**Why Parameterized Queries are Safe**:

- User input treated as data, not SQL code
- Drizzle automatically escapes special characters
- No way to inject malicious SQL

**ESLint Enforcement**: Omnera's ESLint configuration automatically enforces WHERE clauses on DELETE and UPDATE operations via eslint-plugin-drizzle, preventing accidental mass operations that could compromise data integrity or expose security vulnerabilities.

**See**: `@docs/infrastructure/quality/eslint.md#database-safety-rules` for complete enforcement details.

### XSS Prevention (Cross-Site Scripting)

React escapes strings by default, but be careful with `dangerouslySetInnerHTML`:

```tsx
// ✅ CORRECT: React escapes automatically
function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1> {/* Automatically escaped */}
      <p>{user.bio}</p> {/* Automatically escaped */}
    </div>
  )
}

// ❌ INCORRECT: Bypass escaping (XSS risk)
function UserProfile({ user }: { user: User }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: user.bio }} />
    // If user.bio contains: <script>alert('XSS')</script>
    // Script will execute! (XSS attack)
  )
}

// ✅ CORRECT: Sanitize HTML before rendering
import DOMPurify from 'isomorphic-dompurify'

function UserProfile({ user }: { user: User }) {
  const sanitizedBio = DOMPurify.sanitize(user.bio)

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedBio }} />
    // Scripts removed, safe to render
  )
}
```

**When to Sanitize**:

- Rich text content (WYSIWYG editors)
- User-generated HTML
- Content from external sources

---

## CSRF Protection (Cross-Site Request Forgery)

### Better Auth CSRF Protection

Better Auth includes CSRF protection via `sameSite` cookie attribute:

```typescript
// ✅ Already configured in Better Auth setup
advanced: {
  cookieOptions: {
    sameSite: 'lax', // Prevents CSRF attacks
  },
}
```

**How `sameSite: 'lax'` Works**:

- Cookies not sent with cross-site POST requests
- Prevents malicious sites from making authenticated requests
- Still allows top-level navigation (clicking links)

### Additional CSRF Token (Optional)

For extra protection, implement CSRF tokens:

```typescript
import { Hono } from 'hono'
import { csrf } from 'hono/csrf'

const app = new Hono()

// ✅ Add CSRF middleware
app.use('*', csrf())

// CSRF token automatically validated for POST/PUT/DELETE requests
app.post('/users', async (c) => {
  // Request rejected if CSRF token invalid
  const user = await createUser(userData)
  return c.json(user)
})
```

---

## Authorization and Access Control

### Role-Based Access Control (RBAC)

Implement role checks in routes:

```typescript
import { Hono } from 'hono'
import { auth } from '@/auth'

const app = new Hono()

// ✅ CORRECT: Check user roles before allowing access
app.delete('/users/:id', async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Check if user has admin role
  if (session.user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403)
  }

  // Proceed with deletion
  const userId = c.req.param('id')
  await deleteUser(Number(userId))
  return c.json({ success: true })
})
```

### Resource Ownership Check

Ensure users can only access their own resources:

```typescript
app.put('/posts/:id', async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const postId = Number(c.req.param('id'))
  const post = await db.select().from(posts).where(eq(posts.id, postId))

  if (!post[0]) {
    return c.json({ error: 'Post not found' }, 404)
  }

  // ✅ CORRECT: Verify ownership
  if (post[0].authorId !== session.user.id) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  // User owns the post, allow update
  const updatedPost = await updatePost(postId, updateData)
  return c.json(updatedPost)
})
```

### Effect-Based Authorization

Use Effect for type-safe authorization:

```typescript
import { Effect, Context } from 'effect'

class AuthorizationError {
  readonly _tag = 'AuthorizationError'
  constructor(readonly message: string) {}
}

class CurrentUser extends Context.Tag('CurrentUser')<CurrentUser, { id: number; role: string }>() {}

const requireAdmin = Effect.gen(function* () {
  const user = yield* CurrentUser

  if (user.role !== 'admin') {
    return yield* Effect.fail(new AuthorizationError('Admin access required'))
  }

  return user
})

// Use in business logic
const deleteUserProgram = (userId: number) =>
  Effect.gen(function* () {
    yield* requireAdmin // Fails if not admin

    // Proceed with deletion
    yield* UserService.delete(userId)
  })
```

---

## Secure Data Handling

### Encrypt Sensitive Data

Encrypt sensitive data at rest:

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY! // 32 bytes
const IV_LENGTH = 16

// ✅ CORRECT: Encrypt sensitive data before storing
function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}`
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv)

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

// Usage
const user = {
  email: 'user@example.com',
  ssn: encrypt('123-45-6789'), // Encrypt sensitive data
}
await db.insert(users).values(user)
```

### Never Log Sensitive Data

```typescript
// ❌ INCORRECT: Logging passwords
console.log('User logged in:', { email: user.email, password: user.password })

// ✅ CORRECT: Omit sensitive data from logs
console.log('User logged in:', { email: user.email })

// ✅ CORRECT: Redact sensitive fields
const logUser = (user: User) => {
  const { password, ssn, ...safeData } = user
  console.log('User data:', safeData)
}
```

### Use Environment Variables for Secrets

```typescript
// ❌ INCORRECT: Hardcoded secrets
const API_KEY = 'sk_live_abc123' // Never commit secrets!

// ✅ CORRECT: Load from environment variables
const API_KEY = process.env.API_KEY

if (!API_KEY) {
  throw new Error('API_KEY environment variable not set')
}
```

**Store secrets in**:

- `.env` file (local development, add to `.gitignore`)
- Environment variables (production deployment)
- Secret management service (AWS Secrets Manager, etc.)

---

## Rate Limiting

Prevent abuse with rate limiting:

```typescript
import { Hono } from 'hono'
import { rateLimiter } from 'hono-rate-limiter'

const app = new Hono()

// ✅ Apply rate limiting to sensitive endpoints
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  standardHeaders: 'draft-7',
  keyGenerator: (c) => c.req.header('x-forwarded-for') ?? 'anonymous',
})

app.use('/api/*', limiter)

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  keyGenerator: (c) => c.req.header('x-forwarded-for') ?? 'anonymous',
})

app.use('/auth/*', authLimiter)
```

---

## HTTPS and Transport Security

### Enforce HTTPS in Production

```typescript
import { Hono } from 'hono'

const app = new Hono()

// ✅ Redirect HTTP to HTTPS in production
app.use('*', async (c, next) => {
  if (process.env.NODE_ENV === 'production') {
    const proto = c.req.header('x-forwarded-proto')
    if (proto !== 'https') {
      const httpsUrl = `https://${c.req.header('host')}${c.req.url}`
      return c.redirect(httpsUrl, 301)
    }
  }
  await next()
})
```

### Security Headers

Add security headers to responses:

```typescript
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'

const app = new Hono()

// ✅ Add security headers middleware
app.use('*', secureHeaders())

// Default headers added:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
// - Strict-Transport-Security: max-age=31536000
```

**Custom security headers**:

```typescript
app.use('*', async (c, next) => {
  await next()

  // Content Security Policy (prevent XSS)
  c.res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  )

  // Referrer Policy
  c.res.headers.set('Referrer-Policy', 'no-referrer')

  // Permissions Policy
  c.res.headers.set('Permissions-Policy', 'geolocation=(), microphone=()')
})
```

---

## Dependency Security

### Regular Updates

Keep dependencies updated for security patches:

```bash
# Check for outdated packages
bun outdated

# Update all dependencies
bun update

# Update specific package
bun update <package-name>
```

### Audit Dependencies

```bash
# Audit npm packages for vulnerabilities
npm audit

# Fix vulnerabilities automatically (if available)
npm audit fix
```

### Use Lock Files

Always commit `bun.lock` to ensure consistent dependency versions:

```bash
# Install with frozen lockfile (CI/CD)
bun install --frozen-lockfile
```

---

## Error Handling Security

### Don't Expose Stack Traces in Production

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.onError((err, c) => {
  console.error('Server error:', err)

  // ❌ INCORRECT: Expose detailed error in production
  if (process.env.NODE_ENV === 'production') {
    return c.json({ error: err.message, stack: err.stack }, 500)
  }

  // ✅ CORRECT: Generic error message in production
  if (process.env.NODE_ENV === 'production') {
    return c.json({ error: 'Internal server error' }, 500)
  }

  // Development: Show detailed error
  return c.json({ error: err.message, stack: err.stack }, 500)
})
```

### Handle Effect Errors Securely

```typescript
const userProgram = Effect.gen(function* () {
  const user = yield* UserService.findById(userId)
  return user
}).pipe(
  Effect.catchTag(
    'UserNotFoundError',
    () => Effect.succeed({ error: 'User not found' }) // Generic message
  ),
  Effect.catchAll((error) => {
    // Log detailed error (server-side only)
    console.error('Unexpected error:', error)

    // Return generic message (client-side)
    return Effect.succeed({ error: 'An error occurred' })
  })
)
```

---

## Security Checklist

Before deploying to production, verify:

- [ ] **Authentication**: Better Auth configured with secure sessions
- [ ] **Password Security**: Passwords hashed (automatic with Better Auth)
- [ ] **Email Verification**: Enabled for user registration
- [ ] **Input Validation**: All user inputs validated with Effect Schema
- [ ] **SQL Injection**: Using parameterized queries (Drizzle ORM)
- [ ] **XSS Prevention**: React auto-escaping, HTML sanitized if needed
- [ ] **CSRF Protection**: `sameSite: 'lax'` cookies configured
- [ ] **Authorization**: Role checks and ownership verification
- [ ] **Sensitive Data**: Encrypted at rest, never logged
- [ ] **Environment Variables**: Secrets in `.env`, not hardcoded
- [ ] **Rate Limiting**: Applied to sensitive endpoints
- [ ] **HTTPS**: Enforced in production
- [ ] **Security Headers**: Added via middleware
- [ ] **Dependencies**: Up to date, audited for vulnerabilities
- [ ] **Error Handling**: Stack traces hidden in production

---

## Common Security Anti-Patterns

### ❌ Anti-Pattern 1: Trusting Client-Side Validation

```typescript
// ❌ Client-side validation alone is insufficient
function SignupForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    if (!email.includes('@')) {
      alert('Invalid email') // Client can bypass this
      return
    }

    // Send to server without server-side validation
    fetch('/api/signup', { method: 'POST', body: JSON.stringify({ email }) })
  }
}

// ✅ Always validate on server
app.post('/api/signup', async (c) => {
  const body = await c.req.json()

  // Server-side validation (required)
  const result = Schema.decodeUnknown(SignupSchema)(body)
  // ...
})
```

### ❌ Anti-Pattern 2: Using Weak Session IDs

```typescript
// ❌ Predictable session ID
const sessionId = `${userId}-${Date.now()}` // Can be guessed!

// ✅ Better Auth generates cryptographically secure session IDs
// No manual session ID generation needed
```

### ❌ Anti-Pattern 3: Storing Passwords in Plain Text

```typescript
// ❌ Never store unhashed passwords
await db.insert(users).values({
  email: 'user@example.com',
  password: 'password123', // Plain text!
})

// ✅ Use Better Auth (automatic password hashing)
await auth.api.signUpEmail({
  body: { email: 'user@example.com', password: 'password123' },
})
```

---

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Better Auth Security](https://better-auth.com/docs/concepts/security)
- [Effect Schema Validation](https://effect.website/docs/schema/introduction)
- [Hono Security Middleware](https://hono.dev/middleware/builtin/secure-headers)
- [Web Security Fundamentals](https://web.dev/secure/)

---

**Remember**: Security is not a feature to add later - it must be built into the application from the start. Always validate inputs, use secure defaults, and keep dependencies updated.
