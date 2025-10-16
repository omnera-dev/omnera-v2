## Racing Sinks: First Completion Wins

The `Sink.race` operation allows multiple sinks to compete for completion. The first sink to finish provides the result.

**Example** (Racing Two Sinks to Capture the First Result)

```ts twoslash
import { Sink, Console, Stream, Schedule, Effect } from 'effect'

const stream = Stream.make('1', '2', '3', '4', '5').pipe(
  Stream.schedule(Schedule.spaced('10 millis'))
)

const sink1 = Sink.forEach((s: string) => Console.log(`sink 1: ${s}`)).pipe(Sink.as(1))

const sink2 = Sink.forEach((s: string) => Console.log(`sink 2: ${s}`)).pipe(Sink.as(2))

// Race the two sinks, the result will be from the first to complete
const sink = Sink.race(sink1, sink2)

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
1
*/
```

# [Creating Sinks](https://effect.website/docs/sink/creating/)
