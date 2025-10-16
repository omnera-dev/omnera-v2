## Ignoring Leftovers

If leftover elements are not needed, you can ignore them using `Sink.ignoreLeftover`. This approach discards any unconsumed elements, so the sink operation focuses only on the elements it needs.

**Example** (Ignoring Leftover Elements)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 2, 3, 4, 5)

// Take the first 3 elements and ignore any remaining elements
const sink = Sink.take<number>(3).pipe(Sink.ignoreLeftover, Sink.collectLeftover)

Effect.runPromise(Stream.run(stream, sink)).then(console.log)
/*
Output:
[ { _id: 'Chunk', values: [ 1, 2, 3 ] }, { _id: 'Chunk', values: [] } ]
*/
```

# [Sink Operations](https://effect.website/docs/sink/operations/)
