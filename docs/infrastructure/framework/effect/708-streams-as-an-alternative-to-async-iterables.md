## Streams as an Alternative to Async Iterables

When working with asynchronous data sources, such as async iterables, you often need to consume data in a loop until a certain condition is met. Streams provide a similar approach and offer additional flexibility.

With async iterables, data is processed in a loop until a break or return statement is encountered. To replicate this behavior with Streams, consider these options:

| API         | Description                                                                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `takeUntil` | Takes elements from a stream until a specified condition is met, similar to breaking out of a loop.                                                                   |
| `toPull`    | Returns an effect that continuously pulls data chunks from the stream. This effect can fail with `None` when the stream is finished or with `Some` error if it fails. |

**Example** (Using `Stream.toPull`)

```ts twoslash
import { Stream, Effect } from "effect"

// Simulate a chunked stream
const stream = Stream.fromIterable([1, 2, 3, 4, 5]).pipe(
  Stream.rechunk(2)
)

const program = Effect.gen(function* () {
  // Create an effect to get data chunks from the stream
  const getChunk = yield* Stream.toPull(stream)

  // Continuously fetch and process chunks
  while (true) {
    const chunk = yield* getChunk
    console.log(chunk)
  }
})

Effect.runPromise(Effect.scoped(program)).then(console.log, console.error)
/*
Output:
{ _id: 'Chunk', values: [ 1, 2 ] }
{ _id: 'Chunk', values: [ 3, 4 ] }
{ _id: 'Chunk', values: [ 5 ] }
(FiberFailure) Error: {
  "_id": "Option",
  "_tag": "None"
}
*/
```
