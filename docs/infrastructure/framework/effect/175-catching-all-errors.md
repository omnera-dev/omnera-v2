## Catching All Errors

### either

The `Effect.either` function transforms an `Effect<A, E, R>` into an effect that encapsulates both potential failure and success within an [Either](/docs/data-types/either/) data type:

```ts showLineNumbers=false
Effect<A, E, R> -> Effect<Either<A, E>, never, R>
```

This means if you have an effect with the following type:

```ts showLineNumbers=false
Effect<string, HttpError, never>
```

and you call `Effect.either` on it, the type becomes:

```ts showLineNumbers=false
Effect<Either<string, HttpError>, never, never>
```

The resulting effect cannot fail because the potential failure is now represented within the `Either`'s `Left` type.
The error type of the returned `Effect` is specified as `never`, confirming that the effect is structured to not fail.

By yielding an `Either`, we gain the ability to "pattern match" on this type to handle both failure and success cases within the generator function.

**Example** (Using `Effect.either` to Handle Errors)

```ts twoslash
import { Effect, Either, Random, Data } from "effect"

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
const recovered = Effect.gen(function* () {
  //      ┌─── Either<string, HttpError | ValidationError>
  //      ▼
  const failureOrSuccess = yield* Effect.either(program)
  if (Either.isLeft(failureOrSuccess)) {
    // Failure case: you can extract the error from the `left` property
    const error = failureOrSuccess.left
    return `Recovering from ${error._tag}`
  } else {
    // Success case: you can extract the value from the `right` property
    return failureOrSuccess.right
  }
})
```

As you can see since all errors are handled, the error type of the resulting effect `recovered` is `never`:

```ts showLineNumbers=false
const recovered: Effect<string, never, never>
```

We can make the code less verbose by using the `Either.match` function, which directly accepts the two callback functions for handling errors and successful values:

**Example** (Simplifying with `Either.match`)

```ts twoslash collapse={3-19}
import { Effect, Either, Random, Data } from "effect"

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
const recovered = Effect.gen(function* () {
  //      ┌─── Either<string, HttpError | ValidationError>
  //      ▼
  const failureOrSuccess = yield* Effect.either(program)
  return Either.match(failureOrSuccess, {
    onLeft: (error) => `Recovering from ${error._tag}`,
    onRight: (value) => value // Do nothing in case of success
  })
})
```

### option

Transforms an effect to encapsulate both failure and success using the [Option](/docs/data-types/option/) data type.

The `Effect.option` function wraps the success or failure of an effect within the
`Option` type, making both cases explicit. If the original effect succeeds,
its value is wrapped in `Option.some`. If it fails, the failure is mapped to
`Option.none`.

The resulting effect cannot fail directly, as the error type is set to `never`. However, fatal errors like defects are not encapsulated.

**Example** (Using `Effect.option` to Handle Errors)

```ts twoslash
import { Effect } from "effect"

const maybe1 = Effect.option(Effect.succeed(1))

Effect.runPromiseExit(maybe1).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Success',
  value: { _id: 'Option', _tag: 'Some', value: 1 }
}
*/

const maybe2 = Effect.option(Effect.fail("Uh oh!"))

Effect.runPromiseExit(maybe2).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Success',
  value: { _id: 'Option', _tag: 'None' }
}
*/

const maybe3 = Effect.option(Effect.die("Boom!"))

Effect.runPromiseExit(maybe3).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Die', defect: 'Boom!' }
}
*/
```

### catchAll

Handles all errors in an effect by providing a fallback effect.

The `Effect.catchAll` function catches any errors that may occur during the
execution of an effect and allows you to handle them by specifying a fallback
effect. This ensures that the program continues without failing by recovering
from errors using the provided fallback logic.

<Aside type="note" title="Recoverable Errors Only">
  `Effect.catchAll` only handles recoverable errors. It will not recover
  from unrecoverable defects. See [Effect.catchAllCause](#catchallcause)
  for handling all types of failures.
</Aside>

**Example** (Providing Recovery Logic for Recoverable Errors)

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
  Effect.catchAll((error) =>
    Effect.succeed(`Recovering from ${error._tag}`)
  )
)
```

We can observe that the type in the error channel of our program has changed to `never`:

```ts showLineNumbers=false
const recovered: Effect<string, never, never>
```

indicating that all errors have been handled.

### catchAllCause

Handles both recoverable and unrecoverable errors by providing a recovery effect.

The `Effect.catchAllCause` function allows you to handle all errors, including
unrecoverable defects, by providing a recovery effect. The recovery logic is
based on the `Cause` of the error, which provides detailed information about
the failure.

**Example** (Recovering from All Errors)

```ts twoslash
import { Cause, Effect } from "effect"

// Define an effect that may fail with a recoverable or unrecoverable error
const program = Effect.fail("Something went wrong!")

// Recover from all errors by examining the cause
const recovered = program.pipe(
  Effect.catchAllCause((cause) =>
    Cause.isFailType(cause)
      ? Effect.succeed("Recovered from a regular error")
      : Effect.succeed("Recovered from a defect")
  )
)

Effect.runPromise(recovered).then(console.log)
// Output: "Recovered from a regular error"
```

<Aside type="tip" title="When to Recover from Defects">
  Defects are unexpected errors that typically shouldn't be recovered
  from, as they often indicate serious issues. However, in some cases,
  such as dynamically loaded plugins, controlled recovery might be needed.
</Aside>
