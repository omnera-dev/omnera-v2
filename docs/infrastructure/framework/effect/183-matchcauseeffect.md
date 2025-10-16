## matchCauseEffect

The `Effect.matchCauseEffect` function works similarly to [Effect.matchCause](#matchcause),
but it also allows you to perform additional side effects based on the
failure cause.

This function provides access to the complete [cause](/docs/data-types/cause/) of the
failure, making it possible to differentiate between various failure types,
and allows you to respond accordingly while performing side effects (like
logging or other operations).

**Example** (Handling Different Failure Causes with Side Effects)

```ts twoslash
import { Effect, Console } from 'effect'

const task: Effect.Effect<number, Error> = Effect.die('Uh oh!')

const program = Effect.matchCauseEffect(task, {
  onFailure: (cause) => {
    switch (cause._tag) {
      case 'Fail':
        // Handle standard failure with a logged message
        return Console.log(`Fail: ${cause.error.message}`)
      case 'Die':
        // Handle defects (unexpected errors) by logging the defect
        return Console.log(`Die: ${cause.defect}`)
      case 'Interrupt':
        // Handle interruption and log the fiberId that was interrupted
        return Console.log(`${cause.fiberId} interrupted!`)
    }
    // Fallback for other causes
    return Console.log('failed due to other causes')
  },
  onSuccess: (value) =>
    // Log success if the task completes successfully
    Console.log(`succeeded with ${value} value`),
})

Effect.runPromise(program)
// Output: "Die: Uh oh!"
```

# [Parallel and Sequential Errors](https://effect.website/docs/error-management/parallel-and-sequential-errors/)
