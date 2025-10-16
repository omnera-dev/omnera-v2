## Filtering Input

Sinks can also filter incoming elements based on specific conditions with `Sink.filterInput`. This operation allows the sink to process only elements that meet certain criteria.

**Example** (Filtering Negative Numbers in Chunks of Three)

In the example below, elements are collected in chunks of three, but only positive numbers are included:

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

// Define a stream with positive, negative, and zero values
const stream = Stream.fromIterable([1, -2, 0, 1, 3, -3, 4, 2, 0, 1, -3, 1, 1, 6]).pipe(
  Stream.transduce(
    // Collect chunks of 3, filtering out non-positive numbers
    Sink.collectAllN<number>(3).pipe(Sink.filterInput((n) => n > 0))
  )
)

Effect.runPromise(Stream.runCollect(stream)).then((chunk) => console.log('%o', chunk))
/*
Output:
{
  _id: 'Chunk',
  values: [
    { _id: 'Chunk', values: [ 1, 1, 3, [length]: 3 ] },
    { _id: 'Chunk', values: [ 4, 2, 1, [length]: 3 ] },
    { _id: 'Chunk', values: [ 1, 1, 6, [length]: 3 ] },
    { _id: 'Chunk', values: [ [length]: 0 ] },
    [length]: 4
  ]
}
*/
```

# [Ref](https://effect.website/docs/state-management/ref/)
