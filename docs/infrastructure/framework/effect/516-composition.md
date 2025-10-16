## Composition

Schedules can be composed in different ways:

| Mode             | Description                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| **Union**        | Combines two schedules and recurs if either schedule wants to continue, using the shorter delay.   |
| **Intersection** | Combines two schedules and recurs only if both schedules want to continue, using the longer delay. |
| **Sequencing**   | Combines two schedules by running the first one fully, then switching to the second.               |

### Union

Combines two schedules and recurs if either schedule wants to continue, using the shorter delay.

**Example** (Combining Exponential and Spaced Intervals)

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

const schedule = Schedule.union(
  Schedule.exponential("100 millis"),
  Schedule.spaced("1 second")
)

log(schedule)
/*
Output:
#1: 100ms  < exponential
#2: 200ms
#3: 400ms
#4: 800ms
#5: 1000ms < spaced
#6: 1000ms
#7: 1000ms
#8: 1000ms
#9: 1000ms
#10: 1000ms
...
*/
```

The `Schedule.union` operator selects the shortest delay at each step, so when combining an exponential schedule with a spaced interval, the initial recurrences will follow the exponential backoff, then settle into the spaced interval once the delays exceed that value.

### Intersection

Combines two schedules and recurs only if both schedules want to continue, using the longer delay.

**Example** (Limiting Exponential Backoff with a Fixed Number of Retries)

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

const schedule = Schedule.intersect(
  Schedule.exponential("10 millis"),
  Schedule.recurs(5)
)

log(schedule)
/*
Output:
#1: 10ms  < exponential
#2: 20ms
#3: 40ms
#4: 80ms
#5: 160ms
(end)     < recurs
*/
```

The `Schedule.intersect` operator enforces both schedules' constraints. In this example, the schedule follows an exponential backoff but stops after 5 recurrences due to the `Schedule.recurs(5)` limit.

### Sequencing

Combines two schedules by running the first one fully, then switching to the second.

**Example** (Switching from Fixed Retries to Periodic Execution)

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

const schedule = Schedule.andThen(
  Schedule.recurs(5),
  Schedule.spaced("1 second")
)

log(schedule)
/*
Output:
#1: 0ms    < recurs
#2: 0ms
#3: 0ms
#4: 0ms
#5: 0ms
#6: 1000ms < spaced
#7: 1000ms
#8: 1000ms
#9: 1000ms
#10: 1000ms
...
*/
```

The first schedule runs until completion, after which the second schedule takes over. In this example, the effect initially executes 5 times with no delay, then continues every 1 second.
