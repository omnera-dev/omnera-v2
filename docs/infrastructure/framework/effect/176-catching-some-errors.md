## Catching Some Errors

### either

The [`Effect.either`](#either) function, which was previously shown as a way to catch all errors, can also be used to catch specific errors.

By yielding an `Either`, we gain the ability to "pattern match" on this type to handle both failure and success cases within the generator function.

**Example** (Handling Specific Errors with `Effect.either`)

```ts twoslash
import { Effect, Random, Either, Data } from "effect"

class HttpError extends Data.TaggedError("HttpError")<{}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

//      ┌─── Effect<string, HttpError | ValidationError, never>
//      ▼
const program = Effect.gen(function* () {
  const n1 = yield* Random.next
  const n2 = yield* Random.next
  if (n1 < 0.5) {
    return yield* Effect.fail(new HttpError())
  }
  if (n2 < 0.5) {
    return yield* Effect.fail(new ValidationError())
  }
  return "some result"
})

//      ┌─── Effect<string, ValidationError, never>
//      ▼
const recovered = Effect.gen(function* () {
  const failureOrSuccess = yield* Effect.either(program)
  if (Either.isLeft(failureOrSuccess)) {
    const error = failureOrSuccess.left
    // Only handle HttpError errors
    if (error._tag === "HttpError") {
      return "Recovering from HttpError"
    } else {
      // Rethrow ValidationError
      return yield* Effect.fail(error)
    }
  } else {
    return failureOrSuccess.right
  }
})
```

We can observe that the type in the error channel of our program has changed to only show `ValidationError`:

```ts "ValidationError" showLineNumbers=false
const recovered: Effect<string, ValidationError, never>
```

indicating that `HttpError` has been handled.

If we also want to handle `ValidationError`, we can easily add another case to our code:

```ts twoslash collapse={3-17} {28-30}
import { Effect, Random, Either, Data } from "effect"

class HttpError extends Data.TaggedError("HttpError")<{}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

const program = Effect.gen(function* () {
  const n1 = yield* Random.next
  const n2 = yield* Random.next
  if (n1 < 0.5) {
    return yield* Effect.fail(new HttpError())
  }
  if (n2 < 0.5) {
    return yield* Effect.fail(new ValidationError())
  }
  return "some result"
})

//      ┌─── Effect<string, never, never>
//      ▼
const recovered = Effect.gen(function* () {
  const failureOrSuccess = yield* Effect.either(program)
  if (Either.isLeft(failureOrSuccess)) {
    const error = failureOrSuccess.left
    // Handle both HttpError and ValidationError
    if (error._tag === "HttpError") {
      return "Recovering from HttpError"
    } else {
      return "Recovering from ValidationError"
    }
  } else {
    return failureOrSuccess.right
  }
})
```

We can observe that the type in the error channel has changed to `never`:

```ts showLineNumbers=false
const recovered: Effect<string, never, never>
```

indicating that all errors have been handled.

### catchSome

Catches and recovers from specific types of errors, allowing you to attempt recovery only for certain errors.

`Effect.catchSome` lets you selectively catch and handle errors of certain
types by providing a recovery effect for specific errors. If the error
matches a condition, recovery is attempted; if not, it doesn't affect the
program. This function doesn't alter the error type, meaning the error type
remains the same as in the original effect.

**Example** (Handling Specific Errors with `Effect.catchSome`)

```ts twoslash
import { Effect, Random, Option, Data } from "effect"

class HttpError extends Data.TaggedError("HttpError")<{}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

//      ┌─── Effect<string, HttpError | ValidationError, never>
//      ▼
const program = Effect.gen(function* () {
  const n1 = yield* Random.next
  const n2 = yield* Random.next
  if (n1 < 0.5) {
    return yield* Effect.fail(new HttpError())
  }
  if (n2 < 0.5) {
    return yield* Effect.fail(new ValidationError())
  }
  return "some result"
})

//      ┌─── Effect<string, HttpError | ValidationError, never>
//      ▼
const recovered = program.pipe(
  Effect.catchSome((error) => {
    // Only handle HttpError errors
    if (error._tag === "HttpError") {
      return Option.some(Effect.succeed("Recovering from HttpError"))
    } else {
      return Option.none()
    }
  })
)
```

In the code above, `Effect.catchSome` takes a function that examines the error and decides whether to attempt recovery or not. If the error matches a specific condition, recovery can be attempted by returning `Option.some(effect)`. If no recovery is possible, you can simply return `Option.none()`.

It's important to note that while `Effect.catchSome` lets you catch specific errors, it doesn't alter the error type itself.
Therefore, the resulting effect will still have the same error type as the original effect:

```ts "HttpError | ValidationError" showLineNumbers=false
const recovered: Effect<string, HttpError | ValidationError, never>
```

### catchIf

Recovers from specific errors based on a predicate.

`Effect.catchIf` works similarly to [`Effect.catchSome`](#catchsome), but it allows you to
recover from errors by providing a predicate function. If the predicate
matches the error, the recovery effect is applied. This function doesn't
alter the error type, so the resulting effect still carries the original
error type unless a user-defined type guard is used to narrow the type.

**Example** (Catching Specific Errors with a Predicate)

```ts twoslash
import { Data, Effect, Random } from "effect"

class HttpError extends Data.TaggedError("HttpError")<{}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

//      ┌─── Effect<string, HttpError | ValidationError, never>
//      ▼
const program = Effect.gen(function* () {
  const n1 = yield* Random.next
  const n2 = yield* Random.next
  if (n1 < 0.5) {
    return yield* Effect.fail(new HttpError())
  }
  if (n2 < 0.5) {
    return yield* Effect.fail(new ValidationError())
  }
  return "some result"
})

//      ┌─── Effect<string, ValidationError, never>
//      ▼
const recovered = program.pipe(
  Effect.catchIf(
    // Only handle HttpError errors
    (error) => error._tag === "HttpError",
    () => Effect.succeed("Recovering from HttpError")
  )
)
```

It's important to note that for TypeScript versions < 5.5, while `Effect.catchIf` lets you catch specific errors, it **doesn't alter the error type** itself.
Therefore, the resulting effect will still have the same error type as the original effect:

```ts "HttpError | ValidationError" showLineNumbers=false
const recovered: Effect<string, HttpError | ValidationError, never>
```

In TypeScript versions >= 5.5, improved type narrowing causes the resulting error type to be inferred as `ValidationError`.

#### Workaround For TypeScript versions < 5.5

If you provide a [user-defined type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) instead of a predicate, the resulting error type will be pruned, returning an `Effect<string, ValidationError, never>`:

```ts twoslash collapse={3-19} {25-26}
import { Data, Effect, Random } from "effect"

class HttpError extends Data.TaggedError("HttpError")<{}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

//      ┌─── Effect<string, HttpError | ValidationError, never>
//      ▼
const program = Effect.gen(function* () {
  const n1 = yield* Random.next
  const n2 = yield* Random.next
  if (n1 < 0.5) {
    return yield* Effect.fail(new HttpError())
  }
  if (n2 < 0.5) {
    return yield* Effect.fail(new ValidationError())
  }
  return "some result"
})

//      ┌─── Effect<string, ValidationError, never>
//      ▼
const recovered = program.pipe(
  Effect.catchIf(
    // User-defined type guard
    (error): error is HttpError => error._tag === "HttpError",
    () => Effect.succeed("Recovering from HttpError")
  )
)
```

### catchTag

Catches and handles specific errors by their `_tag` field, which is used as a discriminator.

`Effect.catchTag` is useful when your errors are tagged with a `_tag` field
that identifies the error type. You can use this function to handle specific
error types by matching the `_tag` value. This allows for precise error
handling, ensuring that only specific errors are caught and handled.

The error type must have a `_tag` field to use `Effect.catchTag`. This field
is used to identify and match errors.

**Example** (Handling Errors by Tag)

```ts twoslash
import { Effect, Random, Data } from "effect"

class HttpError extends Data.TaggedError("HttpError")<{}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

//      ┌─── Effect<string, HttpError | ValidationError, never>
//      ▼
const program = Effect.gen(function* () {
  const n1 = yield* Random.next
  const n2 = yield* Random.next
  if (n1 < 0.5) {
    return yield* Effect.fail(new HttpError())
  }
  if (n2 < 0.5) {
    return yield* Effect.fail(new ValidationError())
  }
  return "some result"
})

//      ┌─── Effect<string, ValidationError, never>
//      ▼
const recovered = program.pipe(
  // Only handle HttpError errors
  Effect.catchTag("HttpError", (_HttpError) =>
    Effect.succeed("Recovering from HttpError")
  )
)
```

In the example above, the `Effect.catchTag` function allows us to handle `HttpError` specifically.
If a `HttpError` occurs during the execution of the program, the provided error handler function will be invoked,
and the program will proceed with the recovery logic specified within the handler.

We can observe that the type in the error channel of our program has changed to only show `ValidationError`:

```ts showLineNumbers=false
const recovered: Effect<string, ValidationError, never>
```

indicating that `HttpError` has been handled.

If we also wanted to handle `ValidationError`, we can simply add another `catchTag`:

**Example** (Handling Multiple Error Types with `catchTag`)

```ts twoslash collapse={3-19} {28-30}
import { Effect, Random, Data } from "effect"

class HttpError extends Data.TaggedError("HttpError")<{}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

//      ┌─── Effect<string, HttpError | ValidationError, never>
//      ▼
const program = Effect.gen(function* () {
  const n1 = yield* Random.next
  const n2 = yield* Random.next
  if (n1 < 0.5) {
    return yield* Effect.fail(new HttpError())
  }
  if (n2 < 0.5) {
    return yield* Effect.fail(new ValidationError())
  }
  return "some result"
})

//      ┌─── Effect<string, never, never>
//      ▼
const recovered = program.pipe(
  // Handle both HttpError and ValidationError
  Effect.catchTag("HttpError", (_HttpError) =>
    Effect.succeed("Recovering from HttpError")
  ),
  Effect.catchTag("ValidationError", (_ValidationError) =>
    Effect.succeed("Recovering from ValidationError")
  )
)
```

We can observe that the type in the error channel of our program has changed to `never`:

```ts showLineNumbers=false
const recovered: Effect<string, never, never>
```

indicating that all errors have been handled.

<Aside type="caution" title="Error Type Requirement">
  The error type must have a readonly `_tag` field to use `catchTag`. This
  field is used to identify and match errors.
</Aside>

### catchTags

Handles multiple errors in a single block of code using their `_tag` field.

`Effect.catchTags` is a convenient way to handle multiple error types at
once. Instead of using [`Effect.catchTag`](#catchtag) multiple times, you can pass an
object where each key is an error type's `_tag`, and the value is the handler
for that specific error. This allows you to catch and recover from multiple
error types in a single call.

**Example** (Handling Multiple Tagged Error Types at Once)

```ts twoslash
import { Effect, Random, Data } from "effect"

class HttpError extends Data.TaggedError("HttpError")<{}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

//      ┌─── Effect<string, HttpError | ValidationError, never>
//      ▼
const program = Effect.gen(function* () {
  const n1 = yield* Random.next
  const n2 = yield* Random.next
  if (n1 < 0.5) {
    return yield* Effect.fail(new HttpError())
  }
  if (n2 < 0.5) {
    return yield* Effect.fail(new ValidationError())
  }
  return "some result"
})

//      ┌─── Effect<string, never, never>
//      ▼
const recovered = program.pipe(
  Effect.catchTags({
    HttpError: (_HttpError) =>
      Effect.succeed(`Recovering from HttpError`),
    ValidationError: (_ValidationError) =>
      Effect.succeed(`Recovering from ValidationError`)
  })
)
```

This function takes an object where each property represents a specific error `_tag` (`"HttpError"` and `"ValidationError"` in this case),
and the corresponding value is the error handler function to be executed when that particular error occurs.

<Aside type="caution" title="Error Type Requirement">
  The error type must have a readonly `_tag` field to use `catchTag`. This
  field is used to identify and match errors.
</Aside>
