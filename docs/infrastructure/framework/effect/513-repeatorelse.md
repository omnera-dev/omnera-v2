## repeatOrElse

The `repeatOrElse` function returns a new effect that repeats the specified effect according to the given schedule or until the first failure.
When a failure occurs, the failure value and schedule output are passed to a specified handler.
Scheduled recurrences are in addition to the initial execution, so `Effect.repeat(action, Schedule.once)` executes `action` once initially and then repeats it an additional time if it succeeds.

**Example** (Handling Failure During Repeats)

```ts twoslash
import { Effect, Schedule } from "effect"

let count = 0

// Define an async effect that simulates an action with possible failures
const action = Effect.async<string, string>((resume) => {
  if (count > 1) {
    console.log("failure")
    resume(Effect.fail("Uh oh!"))
  } else {
    count++
    console.log("success")
    resume(Effect.succeed("yay!"))
  }
})

// Define a schedule that repeats up to 2 times
// with a 100ms delay between attempts
const policy = Schedule.addDelay(Schedule.recurs(2), () => "100 millis")

// Provide a handler to run when failure occurs after the retries
const program = Effect.repeatOrElse(action, policy, () =>
  Effect.sync(() => {
    console.log("orElse")
    return count - 1
  })
)

Effect.runPromise(program).then((n) => console.log(`repetitions: ${n}`))
/*
Output:
success
success
failure
orElse
repetitions: 1
*/
```
