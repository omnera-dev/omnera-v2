## Collecting Leftovers

If a sink doesn't consume all elements from the upstream source, the remaining elements are called leftovers. To capture these leftovers, use `Sink.collectLeftover`, which returns a tuple containing the result of the sink operation and any unconsumed elements.

**Example** (Collecting Leftover Elements)

```ts twoslash
import { Stream, Sink, Effect } from "effect"

const stream = Stream.make(1, 2, 3, 4, 5)

// Take the first 3 elements and collect any leftovers
const sink1 = Sink.take<number>(3).pipe(Sink.collectLeftover)

Effect.runPromise(Stream.run(stream, sink1)).then(console.log)
/*
Output:
[
  { _id: 'Chunk', values: [ 1, 2, 3 ] },
  { _id: 'Chunk', values: [ 4, 5 ] }
]
*/

// Take only the first element and collect the rest as leftovers
const sink2 = Sink.head<number>().pipe(Sink.collectLeftover)

Effect.runPromise(Stream.run(stream, sink2)).then(console.log)
/*
Output:
[
  { _id: 'Option', _tag: 'Some', value: 1 },
  { _id: 'Chunk', values: [ 2, 3, 4, 5 ] }
]
*/
```
