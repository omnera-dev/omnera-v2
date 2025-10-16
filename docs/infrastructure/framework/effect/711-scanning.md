## Scanning

Stream scanning allows you to apply a function cumulatively to each element in the stream, emitting every intermediate result. Unlike `reduce`, which only provides a final result, `scan` offers a step-by-step view of the accumulation process.

**Example** (Cumulative Addition)

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.range(1, 5).pipe(Stream.scan(0, (a, b) => a + b))

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 0, 1, 3, 6, 10, 15 ] }
*/
```

If you need only the final accumulated value, you can use [Stream.runFold](/docs/stream/consuming-streams/#using-a-fold-operation):

**Example** (Final Accumulated Result)

```ts twoslash
import { Stream, Effect } from 'effect'

const fold = Stream.range(1, 5).pipe(Stream.runFold(0, (a, b) => a + b))

Effect.runPromise(fold).then(console.log) // Output: 15
```
