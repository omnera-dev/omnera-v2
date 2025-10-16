## From Success and Failure

Much like the `Effect` data type, you can generate a `Stream` using the `fail` and `succeed` functions:

```ts twoslash
import { Stream, Effect } from "effect"

// Creating a stream that can emit errors
const streamWithError: Stream.Stream<never, string> =
  Stream.fail("Uh oh!")

Effect.runPromise(Stream.runCollect(streamWithError))
// throws Error: Uh oh!

// Creating a stream that emits a numeric value
const streamWithNumber: Stream.Stream<number> = Stream.succeed(5)

Effect.runPromise(Stream.runCollect(streamWithNumber)).then(console.log)
// { _id: 'Chunk', values: [ 5 ] }
```
