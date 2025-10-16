## Why Not Throw Errors?

In traditional programming, when an error occurs, it is often handled by throwing an exception:

```ts twoslash
// Type signature doesn't show possible exceptions
const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('Cannot divide by zero')
  }
  return a / b
}
```

However, throwing errors can be problematic. The type signatures of functions do not indicate that they can throw exceptions, making it difficult to reason about potential errors.

To address this issue, Effect introduces dedicated constructors for creating effects that represent both success and failure: `Effect.succeed` and `Effect.fail`. These constructors allow you to explicitly handle success and failure cases while **leveraging the type system to track errors**.

### succeed

Creates an `Effect` that always succeeds with a given value.

Use this function when you need an effect that completes successfully with a specific value
without any errors or external dependencies.

**Example** (Creating a Successful Effect)

```ts twoslash
import { Effect } from 'effect'

//      ┌─── Effect<number, never, never>
//      ▼
const success = Effect.succeed(42)
```

The type of `success` is `Effect<number, never, never>`, which means:

- It produces a value of type `number`.
- It does not generate any errors (`never` indicates no errors).
- It requires no additional data or dependencies (`never` indicates no requirements).

```text showLineNumbers=false
         ┌─── Produces a value of type number
         │       ┌─── Does not generate any errors
         │       │      ┌─── Requires no dependencies
         ▼       ▼      ▼
Effect<number, never, never>
```

### fail

Creates an `Effect` that represents an error that can be recovered from.

Use this function to explicitly signal an error in an `Effect`. The error
will keep propagating unless it is handled. You can handle the error with
functions like [Effect.catchAll](/docs/error-management/expected-errors/#catchall) or
[Effect.catchTag](/docs/error-management/expected-errors/#catchtag).

**Example** (Creating a Failed Effect)

```ts twoslash
import { Effect } from 'effect'

//      ┌─── Effect<never, Error, never>
//      ▼
const failure = Effect.fail(new Error('Operation failed due to network error'))
```

The type of `failure` is `Effect<never, Error, never>`, which means:

- It never produces a value (`never` indicates that no successful result will be produced).
- It fails with an error, specifically an `Error`.
- It requires no additional data or dependencies (`never` indicates no requirements).

```text showLineNumbers=false
         ┌─── Never produces a value
         │      ┌─── Fails with an Error
         │      │      ┌─── Requires no dependencies
         ▼      ▼      ▼
Effect<never, Error, never>
```

Although you can use `Error` objects with `Effect.fail`, you can also pass strings, numbers, or more complex objects depending on your error management strategy.

Using "tagged" errors (objects with a `_tag` field) can help identify error types and works well with standard Effect functions, like [Effect.catchTag](/docs/error-management/expected-errors/#catchtag).

**Example** (Using Tagged Errors)

```ts twoslash
import { Effect, Data } from 'effect'

class HttpError extends Data.TaggedError('HttpError')<{}> {}

//      ┌─── Effect<never, HttpError, never>
//      ▼
const program = Effect.fail(new HttpError())
```
