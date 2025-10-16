## From Schedule

We can create a stream from a `Schedule` that does not require any further input. The stream will emit an element for each value output from the schedule, continuing for as long as the schedule continues:

```ts twoslash
import { Effect, Stream, Schedule } from 'effect'

// Emits values every 1 second for a total of 10 emissions
const schedule = Schedule.spaced('1 second').pipe(Schedule.compose(Schedule.recurs(10)))

const stream = Stream.fromSchedule(schedule)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: 'Chunk',
  values: [
    0, 1, 2, 3, 4,
    5, 6, 7, 8, 9
  ]
}
*/
```

# [Error Handling in Streams](https://effect.website/docs/stream/error-handling/)
