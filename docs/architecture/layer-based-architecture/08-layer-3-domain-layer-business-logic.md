# Layer-Based Architecture in Sovrium

> **Note**: This is part 8 of the split documentation. See navigation links below.

## Layer 3: Domain Layer (Business Logic)

### Responsibility

Contain pure business logic, domain models, validation rules, and core algorithms. This is the heart of the application.

### Technologies

- **TypeScript** - Pure functions, interfaces, type definitions
- **Functional Programming** - Immutability, pure functions, composition

### What Belongs Here

- Domain models (entities, value objects)
- Business rules (validation, calculations)
- Pure functions (deterministic, no side effects)
- Domain services (pure business logic)
- Factories (object creation logic)
- Type definitions and interfaces
- Domain errors (business rule violations)

### What Does NOT Belong Here

- ❌ UI components or rendering
- ❌ HTTP routes or API endpoints
- ❌ Database queries or I/O operations
- ❌ External API calls
- ❌ Effect programs (those belong in Application Layer)
- ❌ Infrastructure concerns

### Communication Pattern

- **Inbound**: Calls from Application Layer
- **Outbound**: NONE (pure, self-contained)
- **Dependencies**: ZERO external dependencies

### Code Examples

#### Domain Model

```typescript
// src/domain/models/User.ts
// ✅ CORRECT: Immutable domain model
export interface User {
  readonly id: number
  readonly name: string
  readonly email: string
  readonly passwordHash: string
  readonly joinedAt: Date
  readonly isActive: boolean
}
```

#### Domain Validator (Pure Function)

```typescript
// src/domain/validators/emailValidator.ts
// ✅ CORRECT: Pure validation function
export interface EmailValidationResult {
  readonly isValid: boolean
  readonly error?: string
}
export function validateEmail(email: string): EmailValidationResult {
  // Basic presence check
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' }
  }
  // Length check
  if (email.length > 255) {
    return { isValid: false, error: 'Email is too long' }
  }
  // Format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email format is invalid' }
  }
  return { isValid: true }
}
```

#### Domain Service (Pure Functions)

```typescript
// src/domain/services/passwordService.ts
import { createHash } from 'crypto'
// ✅ CORRECT: Pure domain service (deterministic for same input)
export function hashPassword(password: string): string {
  // In production, use bcrypt or similar with proper salting
  // This is simplified for demonstration
  return createHash('sha256').update(password).digest('hex')
}
export function verifyPassword(password: string, hash: string): boolean {
  const computedHash = hashPassword(password)
  return computedHash === hash
}
// ✅ CORRECT: Password strength validation (pure function)
export interface PasswordStrengthResult {
  readonly isValid: boolean
  readonly strength: 'weak' | 'medium' | 'strong'
  readonly errors: readonly string[]
}
export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const errors: string[] = []
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  const isValid = errors.length === 0
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (isValid) {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    strength = password.length >= 12 && hasSpecialChar ? 'strong' : 'medium'
  }
  return { isValid, strength, errors }
}
```

#### Domain Factory

```typescript
// src/domain/factories/userFactory.ts
import type { User } from '@/domain/models/User'
// ✅ CORRECT: Factory creates domain objects (pure function)
export interface CreateUserInput {
  readonly name: string
  readonly email: string
  readonly passwordHash: string
}
export function createUser(input: CreateUserInput): User {
  return {
    id: 0, // Will be assigned by database
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    passwordHash: input.passwordHash,
    joinedAt: new Date(),
    isActive: true,
  }
}
```

#### Domain Calculations (Pure Functions)

```typescript
// src/domain/services/orderCalculator.ts
// ✅ CORRECT: Pure business calculations
export interface OrderItem {
  readonly price: number
  readonly quantity: number
}
export function calculateSubtotal(items: readonly OrderItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}
export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return subtotal * (discountPercent / 100)
}
export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100)
}
export interface OrderTotal {
  readonly subtotal: number
  readonly discount: number
  readonly tax: number
  readonly total: number
}
export function calculateOrderTotal(
  items: readonly OrderItem[],
  discountPercent: number,
  taxRate: number
): OrderTotal {
  const subtotal = calculateSubtotal(items)
  const discount = calculateDiscount(subtotal, discountPercent)
  const taxableAmount = subtotal - discount
  const tax = calculateTax(taxableAmount, taxRate)
  const total = taxableAmount + tax
  return { subtotal, discount, tax, total }
}
```

#### Domain Errors

```typescript
// src/domain/errors/InvalidEmailError.ts
import { Data } from 'effect'
// ✅ CORRECT: Domain error for business rule violation
export class InvalidEmailError extends Data.TaggedError('InvalidEmailError')<{
  readonly message: string
}> {}
```

### Do's and Don'ts

#### ✅ DO

1. **Write pure functions** (deterministic, no side effects)
2. **Use immutable data structures** (readonly, const)
3. **Validate business rules** (email format, password strength)
4. **Perform calculations** (order totals, discounts)
5. **Define domain models** (entities, value objects)
6. **Create factories** for object construction
7. **Keep dependencies to ZERO** (no external dependencies)

#### ❌ DON'T

1. **Perform I/O operations** (database, file system, network)
2. **Use Effect programs** (Effect belongs in Application Layer)
3. **Access external services** (repositories, APIs)
4. **Mix presentation concerns** (UI, HTTP)
5. **Use non-deterministic functions** (Date.now(), Math.random())
6. **Depend on other layers** (self-contained)

---

## Navigation

[← Part 7](./07-layer-2-application-layer-use-casesorchestration.md) | [Part 9 →](./09-layer-4-infrastructure-layer-external-services.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-what-is-layer-based-architecture.md) | [Part 4](./04-why-layer-based-architecture-for-sovrium.md) | [Part 5](./05-sovriums-four-layers.md) | [Part 6](./06-layer-1-presentation-layer-uiapi.md) | [Part 7](./07-layer-2-application-layer-use-casesorchestration.md) | **Part 8** | [Part 9](./09-layer-4-infrastructure-layer-external-services.md) | [Part 10](./10-layer-communication-patterns.md) | [Part 11](./11-integration-with-functional-programming.md) | [Part 12](./12-testing-layer-based-architecture.md) | [Part 13](./13-file-structure.md) | [Part 14](./14-best-practices.md) | [Part 15](./15-common-pitfalls.md) | [Part 16](./16-resources-and-references.md) | [Part 17](./17-summary.md)
