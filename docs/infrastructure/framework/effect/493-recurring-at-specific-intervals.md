## Recurring at specific intervals

You can define schedules that control the time between executions. The difference between `spaced` and `fixed` schedules lies in how the interval is measured:

- `spaced` delays each repetition from the **end** of the previous one.
- `fixed` ensures repetitions occur at **regular intervals**, regardless of execution time.

### spaced

A schedule that repeats indefinitely, each repetition spaced the specified duration from the last run.
It returns the number of recurrences each time it runs.

**Example** (Recurring with Delay Between Executions)

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

const schedule = Schedule.spaced('200 millis')

//               ┌─── Simulating an effect that takes
//               │    100 milliseconds to complete
//               ▼
log(schedule, '100 millis')
/*
Output:
#1: 300ms < spaced
#2: 300ms
#3: 300ms
#4: 300ms
#5: 300ms
#6: 300ms
#7: 300ms
#8: 300ms
#9: 300ms
#10: 300ms
...
*/
```

The first delay is approximately 100 milliseconds, as the initial execution is not affected by the schedule. Subsequent delays are approximately 200 milliseconds apart, demonstrating the effect of the `spaced` schedule.

### fixed

A schedule that recurs at fixed intervals. It returns the number of recurrences each time it runs.
If the action run between updates takes longer than the interval, then the action will be run immediately, but re-runs will not "pile up".

```text showLineNumbers=false
|-----interval-----|-----interval-----|-----interval-----|
|---------action--------|action-------|action------------|
```

**Example** (Fixed Interval Recurrence)

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

const schedule = Schedule.fixed('200 millis')

//               ┌─── Simulating an effect that takes
//               │    100 milliseconds to complete
//               ▼
log(schedule, '100 millis')
/*
Output:
#1: 300ms < fixed
#2: 200ms
#3: 200ms
#4: 200ms
#5: 200ms
#6: 200ms
#7: 200ms
#8: 200ms
#9: 200ms
#10: 200ms
...
*/
```
