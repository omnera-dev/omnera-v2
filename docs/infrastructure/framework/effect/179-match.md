## match

`Effect.match` lets you define custom handlers for both success and failure
scenarios. You provide separate functions to handle each case, allowing you
to process the result if the effect succeeds, or handle the error if the
effect fails.

This is useful for structuring your code to respond differently to success or failure without triggering side effects.

**Example** (Handling Both Success and Failure Cases)

```ts twoslash
import { Effect } from 'effect'

const success: Effect.Effect<number, Error> = Effect.succeed(42)

const program1 = Effect.match(success, {
  onFailure: (error) => `failure: ${error.message}`,
  onSuccess: (value) => `success: ${value}`,
})

// Run and log the result of the successful effect
Effect.runPromise(program1).then(console.log)
// Output: "success: 42"

const failure: Effect.Effect<number, Error> = Effect.fail(new Error('Uh oh!'))

const program2 = Effect.match(failure, {
  onFailure: (error) => `failure: ${error.message}`,
  onSuccess: (value) => `success: ${value}`,
})

// Run and log the result of the failed effect
Effect.runPromise(program2).then(console.log)
// Output: "failure: Uh oh!"
```
