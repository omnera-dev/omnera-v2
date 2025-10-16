## Detecting Changes in a Stream

The `Stream.changes` operation detects and emits elements that differ from their preceding elements within a stream. This can be useful for tracking changes or deduplicating consecutive values.

**Example** (Emitting Distinct Consecutive Elements)

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.make(1, 1, 1, 2, 2, 3, 4).pipe(Stream.changes)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 2, 3, 4 ] }
*/
```
