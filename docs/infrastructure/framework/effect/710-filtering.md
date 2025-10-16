## Filtering

The `Stream.filter` operation allows you to pass through only elements that meet a specific condition. It's a way to retain elements in a stream that satisfy a particular criteria while discarding the rest.

**Example** (Filtering Even Numbers)

```ts twoslash
import { Stream, Effect } from "effect"

const stream = Stream.range(1, 11).pipe(Stream.filter((n) => n % 2 === 0))

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 2, 4, 6, 8, 10 ] }
*/
```
