## Exposing Errors in The Success Channel

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

This function becomes especially useful when recovering from effects that may fail when using [Effect.gen](/docs/getting-started/using-generators/#understanding-effectgen):

**Example** (Using `Effect.either` to Handle Errors)

```ts twoslash
import { Effect, Either, Console } from 'effect'

// Simulate a task that fails
//
//      ┌─── Either<number, string, never>
//      ▼
const program = Effect.fail('Oh uh!').pipe(Effect.as(2))

//      ┌─── Either<number, never, never>
//      ▼
const recovered = Effect.gen(function* () {
  //      ┌─── Either<number, string>
  //      ▼
  const failureOrSuccess = yield* Effect.either(program)
  if (Either.isLeft(failureOrSuccess)) {
    const error = failureOrSuccess.left
    yield* Console.log(`failure: ${error}`)
    return 0
  } else {
    const value = failureOrSuccess.right
    yield* Console.log(`success: ${value}`)
    return value
  }
})

Effect.runPromise(recovered).then(console.log)
/*
Output:
failure: Oh uh!
0
*/
```
