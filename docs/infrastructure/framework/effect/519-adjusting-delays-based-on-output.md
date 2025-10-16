## Adjusting Delays Based on Output

The `Schedule.modifyDelay` combinator allows you to dynamically change the delay of a schedule based on the number of repetitions or other output conditions.

**Example** (Reducing Delay After a Certain Number of Repetitions)

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

const schedule = Schedule.modifyDelay(
  Schedule.spaced("1 second"),
  (out, duration) => (out > 2 ? "100 millis" : duration)
)

log(schedule)
/*
Output:
#1: 1000ms
#2: 1000ms
#3: 1000ms
#4: 100ms  < modifyDelay
#5: 100ms
#6: 100ms
#7: 100ms
#8: 100ms
#9: 100ms
#10: 100ms
...
*/
```

The delay modification applies dynamically during execution. In this example, the first three repetitions follow the original `1-second` spacing. After that, the delay drops to `100 milliseconds`, making subsequent repetitions occur more frequently.
