## Scheduling

When working with streams, you may need to introduce specific time intervals between each element's emission. The `Stream.schedule` combinator allows you to set these intervals.

**Example** (Adding a Delay Between Stream Emissions)

```ts twoslash
import { Stream, Schedule, Console, Effect } from 'effect'

// Create a stream that emits values with a 1-second delay between each
const stream = Stream.make(1, 2, 3, 4, 5).pipe(
  Stream.schedule(Schedule.spaced('1 second')),
  Stream.tap(Console.log)
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
1
2
3
4
5
{
  _id: "Chunk",
  values: [ 1, 2, 3, 4, 5 ]
}
*/
```

In this example, we've used the `Schedule.spaced("1 second")` schedule to introduce a one-second gap between each emission in the stream.

# [Resourceful Streams](https://effect.website/docs/stream/resourceful-streams/)
