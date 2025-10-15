# Functional Programming in Omnera

## Overview

Omnera embraces Functional Programming (FP) as its core architectural philosophy. This document outlines the principles, patterns, and practices that guide how we write code in the Omnera project using TypeScript and Effect.ts.

## Why Functional Programming for Omnera?

### Benefits for Our Stack

1. **Type Safety with Effect.ts** - FP principles align perfectly with Effect's error handling and dependency injection
2. **Predictable Behavior** - Pure functions and immutability make code easier to reason about and test
3. **Composability** - Build complex functionality from simple, reusable building blocks
4. **Concurrent Safety** - Immutable data structures prevent race conditions in concurrent operations
5. **Maintainability** - Declarative code is easier to understand and modify over time
6. **Testability** - Pure functions are trivial to test without mocking or complex setup

### Integration with Existing Tools

| Tool | FP Support | How It Helps |
|------|------------|-------------|
| **Effect.ts** | Native | Effect is built on FP principles: immutability, pure functions, composability |
| **TypeScript** | Excellent | Strict types, readonly modifiers, functional utilities, const assertions |
| **Bun** | Compatible | Fast runtime for functional code patterns |
| **React 19** | Strong | Functional components, hooks, immutable state updates |

## Core Functional Programming Principles

### 1. Pure Functions

**Definition**: Functions that always return the same output for the same input and have no side effects.

#### Characteristics

- **Deterministic**: Same inputs → Same outputs (always)
- **No Side Effects**: Don't modify external state, don't perform I/O
- **Referentially Transparent**: Can be replaced with their return value

#### Examples

```typescript
// ✅ CORRECT: Pure function
function add(a: number, b: number): number {
  return a + b
}

// ✅ CORRECT: Pure function with objects
function calculateTotal(items: readonly { price: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

// ✅ CORRECT: Pure function with transformation
function formatUser(user: { name: string; email: string }): { displayName: string; contact: string } {
  return {
    displayName: user.name.toUpperCase(),
    contact: user.email.toLowerCase(),
  }
}

// ❌ INCORRECT: Impure - modifies external state
let counter = 0
function incrementCounter(): number {
  counter++ // Side effect: modifies external variable
  return counter
}

// ❌ INCORRECT: Impure - non-deterministic
function getCurrentTime(): number {
  return Date.now() // Different output each call
}

// ❌ INCORRECT: Impure - I/O side effect
function saveToDatabase(user: User): void {
  database.save(user) // Side effect: I/O operation
}
```

#### Effect.ts Pure Functions

Effect handles side effects explicitly, keeping core logic pure:

```typescript
import { Effect } from 'effect'

// ✅ CORRECT: Pure business logic, Effect handles side effects
function calculateDiscount(price: number, discountPercent: number): number {
  return price * (1 - discountPercent / 100)
}

// ✅ CORRECT: Pure Effect program (description of side effect, not execution)
function saveUser(user: User): Effect.Effect<void, DatabaseError, Database> {
  return Effect.gen(function* () {
    const db = yield* Database
    yield* db.save(user) // Side effect described, not executed
  })
}

// The Effect program is pure - it's just a description
// Side effects only happen when Effect.runPromise() is called
```

### 2. Immutability

**Definition**: Data structures cannot be modified after creation. Changes create new data structures.

#### Why Immutability Matters

- **Predictable State**: Data can't change unexpectedly
- **Concurrent Safety**: Safe to share data across threads/fibers
- **Time Travel Debugging**: Previous states remain accessible
- **Referential Transparency**: Values can be safely cached and reused

#### TypeScript Immutability Patterns

```typescript
// ✅ CORRECT: Use readonly for immutability
interface User {
  readonly id: number
  readonly name: string
  readonly email: string
}

// ✅ CORRECT: ReadonlyArray prevents mutations
function filterActiveUsers(users: readonly User[]): readonly User[] {
  return users.filter(user => user.status === 'active')
}

// ✅ CORRECT: Use const for immutable references
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const // const assertion makes it deeply readonly

// ✅ CORRECT: Create new objects instead of mutating
function updateUserEmail(user: User, newEmail: string): User {
  return { ...user, email: newEmail } // New object, original unchanged
}

// ✅ CORRECT: Immutable array operations
const numbers = [1, 2, 3, 4, 5] as const
const doubled = numbers.map(n => n * 2) // New array, original unchanged
const evens = numbers.filter(n => n % 2 === 0) // New array

// ❌ INCORRECT: Mutating object properties
function updateUser(user: User): void {
  user.email = 'new@example.com' // Mutation!
}

// ❌ INCORRECT: Mutating arrays
function addItem(items: number[], item: number): void {
  items.push(item) // Mutation!
}

// ❌ INCORRECT: Mutable reference
let counter = 0
function increment() {
  counter++ // Mutation!
}
```

#### Effect.ts with Immutability

```typescript
import { Effect, Ref } from 'effect'

// ✅ CORRECT: Effect.gen returns new values, never mutates
const program = Effect.gen(function* () {
  const user = { id: 1, name: 'Alice' }

  // Create updated user (new object)
  const updatedUser = { ...user, name: 'Alice Smith' }

  return updatedUser
})

// ✅ CORRECT: Use Ref for controlled mutable state
const counterProgram = Effect.gen(function* () {
  const counter = yield* Ref.make(0)

  // Update creates new state internally
  yield* Ref.update(counter, n => n + 1)

  const value = yield* Ref.get(counter)
  return value
})
```

### 3. First-Class Functions

**Definition**: Functions are treated as values - can be assigned to variables, passed as arguments, and returned from other functions.

#### Patterns

```typescript
// ✅ CORRECT: Function as variable
const add = (a: number, b: number): number => a + b

// ✅ CORRECT: Function as argument
function applyOperation(x: number, y: number, operation: (a: number, b: number) => number): number {
  return operation(x, y)
}

const result = applyOperation(5, 3, add) // 8

// ✅ CORRECT: Function returning function (currying)
function multiply(factor: number): (n: number) => number {
  return (n: number) => n * factor
}

const double = multiply(2)
const triple = multiply(3)

console.log(double(5)) // 10
console.log(triple(5)) // 15

// ✅ CORRECT: Array of functions
const validators: Array<(input: string) => boolean> = [
  input => input.length > 0,
  input => input.length < 100,
  input => /^[a-zA-Z0-9]+$/.test(input),
]

function validateInput(input: string): boolean {
  return validators.every(validator => validator(input))
}
```

#### Effect.ts First-Class Functions

```typescript
import { Effect } from 'effect'

// ✅ CORRECT: Effect programs as first-class values
const fetchUser = (id: number): Effect.Effect<User, UserNotFoundError> =>
  Effect.gen(function* () {
    // Fetch user logic
    return user
  })

const fetchPost = (id: number): Effect.Effect<Post, PostNotFoundError> =>
  Effect.gen(function* () {
    // Fetch post logic
    return post
  })

// ✅ CORRECT: Composing Effect programs
function fetchMultiple<A, E>(
  ids: readonly number[],
  fetcher: (id: number) => Effect.Effect<A, E>
): Effect.Effect<readonly A[], E> {
  return Effect.all(ids.map(fetcher))
}

// Usage
const userProgram = fetchMultiple([1, 2, 3], fetchUser)
const postProgram = fetchMultiple([10, 20], fetchPost)
```

### 4. Higher-Order Functions

**Definition**: Functions that take other functions as arguments or return functions as results.

#### Common Patterns

```typescript
// ✅ CORRECT: map - transforms each element
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map(n => n * 2) // [2, 4, 6, 8, 10]

// ✅ CORRECT: filter - selects elements matching predicate
const evens = numbers.filter(n => n % 2 === 0) // [2, 4]

// ✅ CORRECT: reduce - accumulates values
const sum = numbers.reduce((acc, n) => acc + n, 0) // 15

// ✅ CORRECT: Custom higher-order function
function withLogging<A, B>(fn: (a: A) => B): (a: A) => B {
  return (a: A) => {
    console.log(`Input: ${a}`)
    const result = fn(a)
    console.log(`Output: ${result}`)
    return result
  }
}

const addWithLogging = withLogging((n: number) => n + 10)
addWithLogging(5) // Logs: Input: 5, Output: 15

// ✅ CORRECT: Function composition
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a: A) => f(g(a))
}

const addOne = (n: number) => n + 1
const double = (n: number) => n * 2
const addOneThenDouble = compose(double, addOne)

console.log(addOneThenDouble(5)) // (5 + 1) * 2 = 12
```

#### Effect.ts Higher-Order Functions

```typescript
import { Effect } from 'effect'

// ✅ CORRECT: Effect.all - parallel execution
const users = Effect.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3),
])

// ✅ CORRECT: Effect.forEach - sequential or parallel iteration
const processUsers = Effect.forEach(
  [1, 2, 3],
  (id) => fetchUser(id),
  { concurrency: 5 } // Process 5 at a time
)

// ✅ CORRECT: Effect.retry - retry policy
const resilientFetch = fetchUser(1).pipe(
  Effect.retry({ times: 3, schedule: Schedule.exponential('100 millis') })
)

// ✅ CORRECT: Custom Effect combinator
function withTimeout<A, E, R>(
  effect: Effect.Effect<A, E, R>,
  duration: string
): Effect.Effect<A, E | TimeoutError, R> {
  return Effect.race(
    effect,
    Effect.fail(new TimeoutError()).pipe(Effect.delay(duration))
  )
}

const timedFetch = withTimeout(fetchUser(1), '5 seconds')
```

### 5. Function Composition

**Definition**: Building complex functions by combining simpler functions.

#### Composition Patterns

```typescript
// ✅ CORRECT: Pipe for left-to-right composition
function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C {
  return g(f(a))
}

const addOne = (n: number) => n + 1
const double = (n: number) => n * 2
const toString = (n: number) => String(n)

const result = pipe(5, addOne, double, toString) // "12"

// ✅ CORRECT: Compose for right-to-left composition
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a: A) => f(g(a))
}

const process = compose(toString, compose(double, addOne))
console.log(process(5)) // "12"

// ✅ CORRECT: Practical example - data transformation pipeline
interface User {
  id: number
  name: string
  email: string
}

interface UserDTO {
  userId: number
  displayName: string
  contact: string
}

const normalizeEmail = (user: User): User => ({
  ...user,
  email: user.email.toLowerCase(),
})

const capitalizeNam = (user: User): User => ({
  ...user,
  name: user.name.toUpperCase(),
})

const toDTO = (user: User): UserDTO => ({
  userId: user.id,
  displayName: user.name,
  contact: user.email,
})

// Compose transformation pipeline
function transformUser(user: User): UserDTO {
  return pipe(user, normalizeEmail, capitalizeName, toDTO)
}
```

#### Effect.ts Composition

```typescript
import { Effect } from 'effect'

// ✅ CORRECT: Effect.pipe for composing Effect operations
const program = Effect.succeed(5).pipe(
  Effect.map(n => n + 1),
  Effect.map(n => n * 2),
  Effect.map(n => String(n))
) // Effect<"12", never, never>

// ✅ CORRECT: Effect.gen for sequential composition
const userProgram = Effect.gen(function* () {
  const user = yield* fetchUser(1)
  const posts = yield* fetchUserPosts(user.id)
  const comments = yield* fetchPostComments(posts[0].id)

  return { user, posts, comments }
})

// ✅ CORRECT: Effect.flatMap for chaining dependent operations
const chainedProgram = fetchUser(1).pipe(
  Effect.flatMap(user => fetchUserPosts(user.id)),
  Effect.flatMap(posts => fetchPostComments(posts[0].id))
)

// ✅ CORRECT: Composable error handling
const resilientProgram = fetchUser(1).pipe(
  Effect.retry({ times: 3 }),
  Effect.timeout('5 seconds'),
  Effect.catchTag('UserNotFoundError', () => Effect.succeed(defaultUser)),
  Effect.catchTag('TimeoutError', () => Effect.succeed(cachedUser))
)
```

### 6. Declarative Code

**Definition**: Code that expresses WHAT to do, not HOW to do it. Focus on the desired outcome rather than implementation details.

#### Imperative vs Declarative

```typescript
// ❌ INCORRECT: Imperative (HOW) - step-by-step instructions
function sumEvenNumbersImperative(numbers: number[]): number {
  let sum = 0
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
      sum = sum + numbers[i]
    }
  }
  return sum
}

// ✅ CORRECT: Declarative (WHAT) - express the intent
function sumEvenNumbersDeclarative(numbers: readonly number[]): number {
  return numbers
    .filter(n => n % 2 === 0) // WHAT: Get even numbers
    .reduce((sum, n) => sum + n, 0) // WHAT: Sum them
}

// ❌ INCORRECT: Imperative string manipulation
function formatNamesImperative(names: string[]): string[] {
  const result: string[] = []
  for (let i = 0; i < names.length; i++) {
    const trimmed = names[i].trim()
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
    result.push(capitalized)
  }
  return result
}

// ✅ CORRECT: Declarative string manipulation
function formatNamesDeclarative(names: readonly string[]): readonly string[] {
  return names.map(name =>
    name
      .trim()
      .replace(/^./, char => char.toUpperCase())
  )
}
```

#### Effect.ts Declarative Programs

```typescript
import { Effect } from 'effect'

// ❌ INCORRECT: Imperative Effect usage
const imperativeProgram = Effect.gen(function* () {
  let user
  try {
    user = yield* fetchUser(1)
  } catch (error) {
    user = defaultUser
  }

  let posts
  try {
    posts = yield* fetchUserPosts(user.id)
  } catch (error) {
    posts = []
  }

  return { user, posts }
})

// ✅ CORRECT: Declarative Effect usage
const declarativeProgram = Effect.gen(function* () {
  const user = yield* fetchUser(1).pipe(
    Effect.catchAll(() => Effect.succeed(defaultUser))
  )

  const posts = yield* fetchUserPosts(user.id).pipe(
    Effect.catchAll(() => Effect.succeed([]))
  )

  return { user, posts }
})

// ✅ CORRECT: More declarative with Effect.all
const parallelProgram = Effect.all({
  user: fetchUser(1).pipe(Effect.orElse(() => Effect.succeed(defaultUser))),
  posts: fetchUserPosts(1).pipe(Effect.orElse(() => Effect.succeed([]))),
  stats: fetchStats().pipe(Effect.orElse(() => Effect.succeed(emptyStats))),
})
```

### 7. Recursion

**Definition**: Functions that call themselves to solve problems by breaking them into smaller sub-problems.

#### Recursion Patterns

```typescript
// ✅ CORRECT: Simple recursion - factorial
function factorial(n: number): number {
  if (n <= 1) return 1 // Base case
  return n * factorial(n - 1) // Recursive case
}

// ✅ CORRECT: Tail recursion (optimizable)
function factorialTail(n: number, accumulator: number = 1): number {
  if (n <= 1) return accumulator
  return factorialTail(n - 1, n * accumulator)
}

// ✅ CORRECT: Tree traversal
interface TreeNode<T> {
  value: T
  children: TreeNode<T>[]
}

function sumTree(node: TreeNode<number>): number {
  return node.value + node.children.reduce((sum, child) => sum + sumTree(child), 0)
}

// ✅ CORRECT: Array processing without loops
function findMax(numbers: readonly number[]): number {
  if (numbers.length === 1) return numbers[0]

  const [first, ...rest] = numbers
  const restMax = findMax(rest)

  return first > restMax ? first : restMax
}

// ⚠️ CAUTION: Deep recursion can cause stack overflow
// Use trampolining or iterative approaches for large inputs
```

#### Effect.ts with Recursion

```typescript
import { Effect } from 'effect'

// ✅ CORRECT: Recursive Effect program
function processPages(page: number): Effect.Effect<User[], ApiError, HttpClient> {
  return Effect.gen(function* () {
    const response = yield* fetchPage(page)

    if (response.hasNextPage) {
      const nextPageUsers = yield* processPages(page + 1)
      return [...response.users, ...nextPageUsers]
    }

    return response.users
  })
}

// ✅ CORRECT: Tail-recursive Effect
function retryUntilSuccess<A, E>(
  effect: Effect.Effect<A, E>,
  maxAttempts: number,
  attempt: number = 1
): Effect.Effect<A, E> {
  if (attempt >= maxAttempts) {
    return effect
  }

  return effect.pipe(
    Effect.catchAll(() => retryUntilSuccess(effect, maxAttempts, attempt + 1))
  )
}
```

## Functional Programming Patterns in Omnera

### Pattern 1: Pure Business Logic

**Principle**: Keep business logic pure, use Effect for side effects.

```typescript
// ✅ CORRECT: Pure business logic
function calculateOrderTotal(items: readonly OrderItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

function applyDiscount(total: number, discountPercent: number): number {
  return total * (1 - discountPercent / 100)
}

function calculateFinalPrice(items: readonly OrderItem[], discountPercent: number): number {
  const subtotal = calculateOrderTotal(items)
  return applyDiscount(subtotal, discountPercent)
}

// ✅ CORRECT: Effect wraps side effects
function processOrder(order: Order): Effect.Effect<Receipt, OrderError, Database | Payment> {
  return Effect.gen(function* () {
    // Pure calculation
    const total = calculateFinalPrice(order.items, order.discount)

    // Side effects via Effect
    const paymentResult = yield* processPayment(total)
    yield* saveOrder(order)

    return { orderId: order.id, total, paymentId: paymentResult.id }
  })
}
```

### Pattern 2: Immutable State Updates

**Principle**: Never mutate data, always return new values.

```typescript
// ✅ CORRECT: Immutable updates
interface AppState {
  readonly user: User | null
  readonly cart: readonly CartItem[]
  readonly loading: boolean
}

function addToCart(state: AppState, item: CartItem): AppState {
  return {
    ...state,
    cart: [...state.cart, item], // New array
  }
}

function updateUser(state: AppState, user: User): AppState {
  return {
    ...state,
    user, // New user reference
  }
}

function setLoading(state: AppState, loading: boolean): AppState {
  return {
    ...state,
    loading,
  }
}

// ❌ INCORRECT: Mutation
function addToCartMutating(state: AppState, item: CartItem): void {
  state.cart.push(item) // Mutation!
  state.loading = true // Mutation!
}
```

### Pattern 3: Function Composition for Data Transformation

**Principle**: Build complex transformations from simple functions.

```typescript
// ✅ CORRECT: Composable transformations
interface RawUser {
  id: number
  name: string
  email: string
  created_at: string
}

interface User {
  id: number
  displayName: string
  contact: string
  joinedAt: Date
}

const normalizeEmail = (raw: RawUser): RawUser => ({
  ...raw,
  email: raw.email.toLowerCase().trim(),
})

const formatName = (raw: RawUser): RawUser => ({
  ...raw,
  name: raw.name.trim().replace(/\s+/g, ' '),
})

const toUser = (raw: RawUser): User => ({
  id: raw.id,
  displayName: raw.name,
  contact: raw.email,
  joinedAt: new Date(raw.created_at),
})

// Compose transformation pipeline
function transformRawUser(raw: RawUser): User {
  return pipe(raw, normalizeEmail, formatName, toUser)
}

// ✅ CORRECT: Array transformations
function transformUsers(rawUsers: readonly RawUser[]): readonly User[] {
  return rawUsers.map(transformRawUser)
}
```

### Pattern 4: Effect Pipelines

**Principle**: Chain Effect operations declaratively.

```typescript
import { Effect } from 'effect'

// ✅ CORRECT: Declarative Effect pipeline
const userProfileProgram = Effect.gen(function* () {
  const userId = 1

  // Fetch data in parallel
  const { user, posts, stats } = yield* Effect.all({
    user: fetchUser(userId),
    posts: fetchUserPosts(userId),
    stats: fetchUserStats(userId),
  })

  // Transform data (pure)
  const profile = {
    ...user,
    postCount: posts.length,
    totalViews: stats.views,
  }

  return profile
}).pipe(
  Effect.retry({ times: 3 }),
  Effect.timeout('10 seconds'),
  Effect.catchTag('UserNotFoundError', () => Effect.succeed(defaultProfile)),
  Effect.catchAll((error) => {
    console.error('Failed to fetch profile:', error)
    return Effect.succeed(emptyProfile)
  })
)
```

### Pattern 5: Dependency Injection

**Principle**: Make dependencies explicit, inject via Effect Context.

```typescript
import { Effect, Context, Layer } from 'effect'

// ✅ CORRECT: Define service interface
class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    readonly findById: (id: number) => Effect.Effect<User, UserNotFoundError>
    readonly save: (user: User) => Effect.Effect<void, DatabaseError>
  }
>() {}

class Logger extends Context.Tag('Logger')<
  Logger,
  {
    readonly info: (message: string) => Effect.Effect<void>
    readonly error: (message: string) => Effect.Effect<void>
  }
>() {}

// ✅ CORRECT: Use services in business logic
const getUserProfile = (id: number): Effect.Effect<User, UserNotFoundError, UserRepository | Logger> =>
  Effect.gen(function* () {
    const logger = yield* Logger
    const repo = yield* UserRepository

    yield* logger.info(`Fetching user ${id}`)
    const user = yield* repo.findById(id)
    yield* logger.info(`Found user ${user.name}`)

    return user
  })

// ✅ CORRECT: Provide implementations
const UserRepositoryLive = Layer.succeed(UserRepository, {
  findById: (id) => fetchUserFromDatabase(id),
  save: (user) => saveUserToDatabase(user),
})

const LoggerLive = Layer.succeed(Logger, {
  info: (message) => Effect.sync(() => console.log(`[INFO] ${message}`)),
  error: (message) => Effect.sync(() => console.error(`[ERROR] ${message}`)),
})

const AppLayer = Layer.mergeAll(UserRepositoryLive, LoggerLive)

// Run with dependencies
const program = getUserProfile(1)
Effect.runPromise(Effect.provide(program, AppLayer))
```

## Do's and Don'ts

### ✅ DO

1. **Write Pure Functions**
   - Keep functions deterministic and side-effect free
   - Use Effect for side effects

2. **Embrace Immutability**
   - Use `readonly` and `as const` extensively
   - Never mutate objects or arrays
   - Create new values instead of modifying existing ones

3. **Compose Small Functions**
   - Build complex logic from simple, reusable pieces
   - Use `pipe` and `compose` for transformation pipelines

4. **Make Dependencies Explicit**
   - Use Effect Context for dependency injection
   - Avoid hidden dependencies and global state

5. **Handle Errors Explicitly**
   - Use Effect's type-safe error handling
   - Make error types explicit in function signatures

6. **Use TypeScript Strictly**
   - Enable strict mode
   - Use readonly types
   - Avoid `any` and `unknown` without guards

7. **Prefer Declarative Code**
   - Express WHAT to do, not HOW
   - Use `map`, `filter`, `reduce` over loops
   - Use Effect combinators over imperative control flow

8. **Test Pure Functions**
   - Pure functions are trivial to test
   - No mocking needed for pure logic

### ❌ DON'T

1. **Mutate Data**
   ```typescript
   // ❌ DON'T
   function addItem(items: Item[], item: Item): void {
     items.push(item)
   }

   // ✅ DO
   function addItem(items: readonly Item[], item: Item): readonly Item[] {
     return [...items, item]
   }
   ```

2. **Mix Side Effects with Business Logic**
   ```typescript
   // ❌ DON'T
   function calculateAndSave(data: Data): number {
     const result = calculate(data)
     database.save(result) // Side effect mixed with logic
     return result
   }

   // ✅ DO
   function calculate(data: Data): number {
     return data.value * 2
   }

   function saveCalculation(data: Data): Effect.Effect<number, DatabaseError, Database> {
     return Effect.gen(function* () {
       const result = calculate(data) // Pure
       yield* Database.save(result) // Side effect
       return result
     })
   }
   ```

3. **Use Mutable State**
   ```typescript
   // ❌ DON'T
   let counter = 0
   function increment(): number {
     return ++counter
   }

   // ✅ DO
   function increment(counter: number): number {
     return counter + 1
   }
   ```

4. **Rely on Non-Deterministic Functions**
   ```typescript
   // ❌ DON'T
   function generateId(): string {
     return String(Math.random())
   }

   // ✅ DO
   function generateId(): Effect.Effect<string, never, Random> {
     return Effect.gen(function* () {
       const random = yield* Random
       return yield* random.nextString()
     })
   }
   ```

5. **Use Exceptions for Flow Control**
   ```typescript
   // ❌ DON'T
   function divide(a: number, b: number): number {
     if (b === 0) throw new Error('Division by zero')
     return a / b
   }

   // ✅ DO
   function divide(a: number, b: number): Effect.Effect<number, DivisionError, never> {
     if (b === 0) {
       return Effect.fail(new DivisionError({ message: 'Division by zero' }))
     }
     return Effect.succeed(a / b)
   }
   ```

6. **Create Hidden Dependencies**
   ```typescript
   // ❌ DON'T
   function saveUser(user: User): void {
     globalDatabase.save(user) // Hidden dependency
   }

   // ✅ DO
   function saveUser(user: User): Effect.Effect<void, DatabaseError, Database> {
     return Effect.gen(function* () {
       const db = yield* Database
       yield* db.save(user)
     })
   }
   ```

## TypeScript Features for FP

### 1. Readonly Types

```typescript
// Readonly properties
interface User {
  readonly id: number
  readonly name: string
}

// Readonly arrays
const numbers: readonly number[] = [1, 2, 3]

// Readonly tuples
const pair: readonly [string, number] = ['age', 25]

// Deep readonly with as const
const config = {
  api: {
    url: 'https://api.example.com',
    timeout: 5000,
  },
} as const
```

### 2. Union Types for Error Handling

```typescript
type Result<T, E> =
  | { readonly _tag: 'Success'; readonly value: T }
  | { readonly _tag: 'Failure'; readonly error: E }

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { _tag: 'Failure', error: 'Division by zero' }
  }
  return { _tag: 'Success', value: a / b }
}

const result = divide(10, 2)
if (result._tag === 'Success') {
  console.log(result.value) // Type narrowed to number
}
```

### 3. Discriminated Unions

```typescript
type Shape =
  | { readonly kind: 'circle'; readonly radius: number }
  | { readonly kind: 'rectangle'; readonly width: number; readonly height: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      return shape.width * shape.height
  }
}
```

### 4. Utility Types

```typescript
// Readonly<T> - makes all properties readonly
type ReadonlyUser = Readonly<User>

// Partial<T> - makes all properties optional
type PartialUser = Partial<User>

// Required<T> - makes all properties required
type RequiredConfig = Required<Config>

// Pick<T, K> - picks specific properties
type UserBasicInfo = Pick<User, 'id' | 'name'>

// Omit<T, K> - omits specific properties
type UserWithoutPassword = Omit<User, 'password'>

// Record<K, T> - creates object type with specific keys and values
type UserMap = Record<number, User>
```

## Integration with React

React 19 components benefit from FP principles:

```typescript
import { useState, useEffect } from 'react'
import { Effect } from 'effect'

// ✅ CORRECT: Pure presentational component
interface UserCardProps {
  readonly user: User
  readonly onEdit: (user: User) => void
}

function UserCard({ user, onEdit }: UserCardProps) {
  // Pure render function
  return (
    <div className="card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Edit</button>
    </div>
  )
}

// ✅ CORRECT: State management with immutability
function UserList() {
  const [users, setUsers] = useState<readonly User[]>([])

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]) // Immutable update
  }

  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, ...updates } : user
      )
    )
  }

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onEdit={updateUser} />
      ))}
    </div>
  )
}

// ✅ CORRECT: Effect integration with React
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const program = fetchUser(userId).pipe(
      Effect.provide(UserRepositoryLive)
    )

    Effect.runPromise(program)
      .then(setUser)
      .catch(console.error)
  }, [userId])

  if (!user) return <div>Loading...</div>

  return <UserCard user={user} onEdit={() => {}} />
}
```

## Testing FP Code

Pure functions and Effect programs are easy to test:

```typescript
import { test, expect } from 'bun:test'
import { Effect, Layer } from 'effect'

// ✅ Testing pure functions (trivial)
test('calculateTotal sums item prices', () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ]

  expect(calculateTotal(items)).toBe(35)
})

// ✅ Testing with mock services
test('getUserProfile fetches user', async () => {
  const MockUserRepository = Layer.succeed(UserRepository, {
    findById: (id) => Effect.succeed({ id, name: 'Test User', email: 'test@example.com' }),
  })

  const program = getUserProfile(1).pipe(
    Effect.provide(MockUserRepository)
  )

  const user = await Effect.runPromise(program)

  expect(user.name).toBe('Test User')
})

// ✅ Testing error handling
test('divide returns error for division by zero', async () => {
  const result = await Effect.runPromise(
    divide(10, 0).pipe(Effect.either)
  )

  expect(result._tag).toBe('Left')
})
```

## Performance Considerations

### When FP is Fast

- **Pure Functions**: Easy to memoize and cache
- **Immutable Data**: Can be shared safely across threads
- **Effect Fibers**: Lightweight concurrency model
- **Lazy Evaluation**: Compute only what's needed

### Potential Overhead

- **Object Creation**: Creating new objects for immutability
- **Deep Recursion**: Can cause stack overflow (use trampolining)
- **Excessive Composition**: Very long chains may have overhead

### Optimization Strategies

```typescript
// ✅ Memoization for expensive pure functions
const memoize = <A, B>(fn: (a: A) => B): ((a: A) => B) => {
  const cache = new Map<A, B>()

  return (a: A) => {
    if (cache.has(a)) {
      return cache.get(a)!
    }

    const result = fn(a)
    cache.set(a, result)
    return result
  }
}

const expensiveCalculation = memoize((n: number) => {
  // Expensive computation
  return n ** 2
})

// ✅ Structural sharing for immutability
// Libraries like Immutable.js provide efficient immutable data structures
// React 19 compiler optimizes immutable updates automatically

// ✅ Effect caching
const cachedUser = fetchUser(1).pipe(Effect.cached)
```

## Resources and References

### Documentation

- [Effect.ts Official Documentation](https://effect.website/docs/introduction)
- [Effect Patterns](./docs/infrastructure/framework/effect-patterns.md)
- [Effect Schema](./docs/infrastructure/framework/effect-schema.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Functional Programming Guide](https://dev.to/dhanush9952/a-guide-to-functional-programming-18h9)

### Books and Articles

- "Functional Programming in TypeScript" - Giulio Canti
- "Composing Software" - Eric Elliott
- "Professor Frisby's Mostly Adequate Guide to Functional Programming"

### Community

- Effect Discord: https://discord.gg/effect-ts
- TypeScript Discord: https://discord.gg/typescript

## Summary

Functional Programming in Omnera means:

1. **Pure Functions** - No side effects, deterministic behavior
2. **Immutability** - Never mutate data, always create new values
3. **Composition** - Build complex logic from simple, reusable pieces
4. **Explicit Effects** - Use Effect.ts to manage side effects
5. **Type Safety** - Leverage TypeScript's strict type system
6. **Declarative Code** - Express WHAT to do, not HOW
7. **Testability** - Pure functions and Effect programs are easy to test

By following these principles, Omnera achieves:

- **Predictable code** - Pure functions behave consistently
- **Maintainable systems** - Composable, testable, understandable code
- **Reliable applications** - Explicit error handling and immutability prevent bugs
- **Developer productivity** - Effect abstractions make complex patterns simple

Embrace functional programming, and write code that's elegant, robust, and joy to maintain.
