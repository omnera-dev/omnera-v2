## Exposing the Cause in The Success Channel

You can use the `Effect.cause` function to expose the cause of an effect, which is a more detailed representation of failures, including error messages and defects.

**Example** (Logging the Cause of Failure)

```ts twoslash
import { Effect, Console } from "effect"

//      ┌─── Effect<number, string, never>
//      ▼
const program = Effect.fail("Oh uh!").pipe(Effect.as(2))

//      ┌─── Effect<void, never, never>
//      ▼
const recovered = Effect.gen(function* () {
  const cause = yield* Effect.cause(program)
  yield* Console.log(cause)
})
```
