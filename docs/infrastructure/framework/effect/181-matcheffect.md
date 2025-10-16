## matchEffect

The `Effect.matchEffect` function is similar to [Effect.match](#match), but it
enables you to perform side effects in the handlers for both success and
failure outcomes.

This is useful when you need to execute additional actions,
like logging or notifying users, based on whether an effect succeeds or
fails.

**Example** (Handling Success and Failure with Side Effects)

```ts twoslash
import { Effect } from "effect"

const success: Effect.Effect<number, Error> = Effect.succeed(42)
const failure: Effect.Effect<number, Error> = Effect.fail(
  new Error("Uh oh!")
)

const program1 = Effect.matchEffect(success, {
  onFailure: (error) =>
    Effect.succeed(`failure: ${error.message}`).pipe(
      Effect.tap(Effect.log)
    ),
  onSuccess: (value) =>
    Effect.succeed(`success: ${value}`).pipe(Effect.tap(Effect.log))
})

console.log(Effect.runSync(program1))
/*
Output:
timestamp=... level=INFO fiber=#0 message="success: 42"
success: 42
*/

const program2 = Effect.matchEffect(failure, {
  onFailure: (error) =>
    Effect.succeed(`failure: ${error.message}`).pipe(
      Effect.tap(Effect.log)
    ),
  onSuccess: (value) =>
    Effect.succeed(`success: ${value}`).pipe(Effect.tap(Effect.log))
})

console.log(Effect.runSync(program2))
/*
Output:
timestamp=... level=INFO fiber=#1 message="failure: Uh oh!"
failure: Uh oh!
*/
```
