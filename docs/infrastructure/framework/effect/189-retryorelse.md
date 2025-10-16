## retryOrElse

The `Effect.retryOrElse` function attempts to retry a failing effect multiple times according to a defined [Schedule](/docs/scheduling/introduction/) policy.

If the retries are exhausted and the effect still fails, it runs a fallback effect instead.

This function is useful when you want to handle failures gracefully by specifying an alternative action after repeated failures.

**Example** (Retrying with Fallback)

```ts twoslash
import { Effect, Schedule, Console } from 'effect'

let count = 0

// Simulates an effect with possible failures
const task = Effect.async<string, Error>((resume) => {
  if (count <= 2) {
    count++
    console.log('failure')
    resume(Effect.fail(new Error()))
  } else {
    console.log('success')
    resume(Effect.succeed('yay!'))
  }
})

// Retry the task with a delay between retries and a maximum of 2 retries
const policy = Schedule.addDelay(Schedule.recurs(2), () => '100 millis')

// If all retries fail, run the fallback effect
const repeated = Effect.retryOrElse(
  task,
  policy,
  // fallback
  () => Console.log('orElse').pipe(Effect.as('default value'))
)

Effect.runPromise(repeated).then(console.log)
/*
Output:
failure
failure
failure
orElse
default value
*/
```

# [Sandboxing](https://effect.website/docs/error-management/sandboxing/)
