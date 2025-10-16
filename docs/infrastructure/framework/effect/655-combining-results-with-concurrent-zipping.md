## Combining Results with Concurrent Zipping

To run two sinks concurrently and combine their results, use `Sink.zip`. This operation executes both sinks concurrently and combines their outcomes into a tuple.

**Example** (Running Two Sinks Concurrently and Combining Results)

```ts twoslash
import { Sink, Console, Stream, Schedule, Effect } from 'effect'

const stream = Stream.make('1', '2', '3', '4', '5').pipe(
  Stream.schedule(Schedule.spaced('10 millis'))
)

const sink1 = Sink.forEach((s: string) => Console.log(`sink 1: ${s}`)).pipe(Sink.as(1))

const sink2 = Sink.forEach((s: string) => Console.log(`sink 2: ${s}`)).pipe(Sink.as(2))

// Combine the two sinks to run concurrently and collect results in a tuple
const sink = Sink.zip(sink1, sink2, { concurrent: true })

Effect.runPromise(Stream.run(stream, sink)).then(console.log)
/*
Output:
sink 1: 1
sink 2: 1
sink 1: 2
sink 2: 2
sink 1: 3
sink 2: 3
sink 1: 4
sink 2: 4
sink 1: 5
sink 2: 5
[ 1, 2 ]
*/
```
