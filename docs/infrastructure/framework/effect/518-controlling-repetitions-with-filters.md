## Controlling Repetitions with Filters

You can use `Schedule.whileInput` or `Schedule.whileOutput` to limit how long a schedule continues based on conditions applied to its input or output.

**Example** (Stopping Based on Output)

```ts twoslash collapse={3-26}
import { Array, Chunk, Duration, Effect, Schedule } from 'effect'

const log = (schedule: Schedule.Schedule<unknown>, delay: Duration.DurationInput = 0): void => {
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
        ? '...'
        : i === delays.length - 1
          ? '(end)'
          : `#${i + 1}: ${Duration.toMillis(duration)}ms`
    )
  })
}

const schedule = Schedule.whileOutput(Schedule.recurs(5), (n) => n <= 2)

log(schedule)
/*
Output:
#1: 0ms < recurs
#2: 0ms
#3: 0ms
(end)   < whileOutput
*/
```

`Schedule.whileOutput` filters repetitions based on the output of the schedule. In this example, the schedule stops once the output exceeds `2`, even though `Schedule.recurs(5)` allows up to 5 repetitions.
