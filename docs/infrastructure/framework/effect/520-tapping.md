## Tapping

`Schedule.tapInput` and `Schedule.tapOutput` allow you to perform additional effectful operations on a schedule's input or output without modifying its behavior.

**Example** (Logging Schedule Outputs)

```ts twoslash collapse={3-26}
import { Array, Chunk, Duration, Effect, Schedule, Console } from 'effect'

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

const schedule = Schedule.tapOutput(Schedule.recurs(2), (n) => Console.log(`Schedule Output: ${n}`))

log(schedule)
/*
Output:
Schedule Output: 0
Schedule Output: 1
Schedule Output: 2
#1: 0ms
#2: 0ms
(end)
*/
```

`Schedule.tapOutput` runs an effect before each recurrence, using the schedule's current output as input. This can be useful for logging, debugging, or triggering side effects.

# [Schema Annotations](https://effect.website/docs/schema/annotations/)
