## Increasing Delays Between Executions

### exponential

A schedule that recurs using exponential backoff, with each delay increasing exponentially.
Returns the current duration between recurrences.

**Example** (Exponential Backoff Schedule)

```ts twoslash collapse={3-26}
import { Array, Chunk, Duration, Effect, Schedule } from "effect"

const log = (
  schedule: Schedule.Schedule<unknown>,
  delay: Duration.DurationInput = 0
): void => {
  const maxRecurs = 10
  const delays = Chunk.toArray(
    Effect.runSync(
      Schedule.run(
        Schedule.delays(Schedule.addDelay(schedule, () => delay)),
        Date.now(),
        Array.range(0, maxRecurs)
      )
    )
  )
  delays.forEach((duration, i) => {
    console.log(
      i === maxRecurs
        ? "..."
        : i === delays.length - 1
        ? "(end)"
        : `#${i + 1}: ${Duration.toMillis(duration)}ms`
    )
  })
}

const schedule = Schedule.exponential("10 millis")

log(schedule)
/*
Output:
#1: 10ms < exponential
#2: 20ms
#3: 40ms
#4: 80ms
#5: 160ms
#6: 320ms
#7: 640ms
#8: 1280ms
#9: 2560ms
#10: 5120ms
...
*/
```

### fibonacci

A schedule that always recurs, increasing delays by summing the preceding two delays (similar to the fibonacci sequence). Returns the current duration between recurrences.

**Example** (Fibonacci Delay Schedule)

```ts twoslash collapse={3-26}
import { Array, Chunk, Duration, Effect, Schedule } from "effect"

const log = (
  schedule: Schedule.Schedule<unknown>,
  delay: Duration.DurationInput = 0
): void => {
  const maxRecurs = 10
  const delays = Chunk.toArray(
    Effect.runSync(
      Schedule.run(
        Schedule.delays(Schedule.addDelay(schedule, () => delay)),
        Date.now(),
        Array.range(0, maxRecurs)
      )
    )
  )
  delays.forEach((duration, i) => {
    console.log(
      i === maxRecurs
        ? "..."
        : i === delays.length - 1
        ? "(end)"
        : `#${i + 1}: ${Duration.toMillis(duration)}ms`
    )
  })
}

const schedule = Schedule.fibonacci("10 millis")

log(schedule)
/*
Output:
#1: 10ms < fibonacci
#2: 10ms
#3: 20ms
#4: 30ms
#5: 50ms
#6: 80ms
#7: 130ms
#8: 210ms
#9: 340ms
#10: 550ms
...
*/
```

# [Cron](https://effect.website/docs/scheduling/cron/)
