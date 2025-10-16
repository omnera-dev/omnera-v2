## Error Tracking

In Effect, if a program can fail with multiple types of errors, they are automatically tracked as a union of those error types.
This allows you to know exactly what errors can occur during execution, making error handling more precise and predictable.

The example below illustrates how errors are automatically tracked for you.

**Example** (Automatically Tracking Errors)

```ts twoslash
import { Effect, Random, Data } from 'effect'

class HttpError extends Data.TaggedError('HttpError')<{}> {}

class ValidationError extends Data.TaggedError('ValidationError')<{}> {}

//      ┌─── Effect<string, HttpError | ValidationError, never>
//      ▼
const program = Effect.gen(function* () {
  // Generate two random numbers between 0 and 1
  const n1 = yield* Random.next
  const n2 = yield* Random.next

  // Simulate an HTTP error
  if (n1 < 0.5) {
    return yield* Effect.fail(new HttpError())
  }
  // Simulate a validation error
  if (n2 < 0.5) {
    return yield* Effect.fail(new ValidationError())
  }

  return 'some result'
})
```

Effect automatically keeps track of the possible errors that can occur during the execution of the program as a union:

```ts "HttpError | ValidationError" showLineNumbers=false
const program: Effect<string, HttpError | ValidationError, never>
```

indicating that it can potentially fail with either a `HttpError` or a `ValidationError`.
