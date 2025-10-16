## Pattern Matching

You can handle different outcomes of an `Exit` using the `Exit.match` function.
This function lets you provide two separate callbacks to handle both success and failure cases of an `Effect` execution.

**Example** (Matching Success and Failure States)

```ts twoslash
import { Effect, Exit, Cause } from "effect"

//      ┌─── Exit<number, never>
//      ▼
const simulatedSuccess = Effect.runSyncExit(Effect.succeed(1))

console.log(
  Exit.match(simulatedSuccess, {
    onFailure: (cause) =>
      `Exited with failure state: ${Cause.pretty(cause)}`,
    onSuccess: (value) => `Exited with success value: ${value}`
  })
)
// Output: "Exited with success value: 1"

//      ┌─── Exit<never, string>
//      ▼
const simulatedFailure = Effect.runSyncExit(
  Effect.failCause(Cause.fail("error"))
)

console.log(
  Exit.match(simulatedFailure, {
    onFailure: (cause) =>
      `Exited with failure state: ${Cause.pretty(cause)}`,
    onSuccess: (value) => `Exited with success value: ${value}`
  })
)
// Output: "Exited with failure state: Error: error"
```
