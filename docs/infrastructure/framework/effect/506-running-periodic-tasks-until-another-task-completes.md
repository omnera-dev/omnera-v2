## Running Periodic Tasks Until Another Task Completes

There are cases where we need to repeatedly perform an action at fixed intervals until another longer-running task finishes. This pattern is common in polling mechanisms or periodic logging.

**Example** (Running a Scheduled Task Until Completion)

```ts twoslash
import { Effect, Console, Schedule } from "effect"

// Define a long-running effect
// (e.g., a task that takes 5 seconds to complete)
const longRunningEffect = Console.log("done").pipe(
  Effect.delay("5 seconds")
)

// Define an action to run periodically
const action = Console.log("action...")

// Define a fixed interval schedule
const schedule = Schedule.fixed("1.5 seconds")

// Run the action repeatedly until the long-running task completes
const program = Effect.race(
  Effect.repeat(action, schedule),
  longRunningEffect
)

Effect.runPromise(program)
/*
Output:
action...
action...
action...
action...
done
*/
```

# [Introduction](https://effect.website/docs/scheduling/introduction/)
