## matchCause

The `Effect.matchCause` function allows you to handle failures with access to
the full [cause](/docs/data-types/cause/) of the failure within a fiber.

This is useful for differentiating between different types of errors, such as regular failures,
defects, or interruptions. You can provide specific handling logic for each
failure type based on the cause.

**Example** (Handling Different Failure Causes)

```ts twoslash
import { Effect } from "effect"

const task: Effect.Effect<number, Error> = Effect.die("Uh oh!")

const program = Effect.matchCause(task, {
  onFailure: (cause) => {
    switch (cause._tag) {
      case "Fail":
        // Handle standard failure
        return `Fail: ${cause.error.message}`
      case "Die":
        // Handle defects (unexpected errors)
        return `Die: ${cause.defect}`
      case "Interrupt":
        // Handle interruption
        return `${cause.fiberId} interrupted!`
    }
    // Fallback for other causes
    return "failed due to other causes"
  },
  onSuccess: (value) =>
    // task completes successfully
    `succeeded with ${value} value`
})

Effect.runPromise(program).then(console.log)
// Output: "Die: Uh oh!"
```
