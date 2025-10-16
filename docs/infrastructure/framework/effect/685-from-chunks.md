## From Chunks

You can construct a stream from a `Chunk` like this:

```ts twoslash
import { Stream, Chunk, Effect } from "effect"

// Creating a stream with values from a single Chunk
const stream = Stream.fromChunk(Chunk.make(1, 2, 3))

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [ 1, 2, 3 ] }
```

Moreover, you can create a stream from multiple `Chunk`s as well:

```ts twoslash
import { Stream, Chunk, Effect } from "effect"

// Creating a stream with values from multiple Chunks
const stream = Stream.fromChunks(Chunk.make(1, 2, 3), Chunk.make(4, 5, 6))

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [ 1, 2, 3, 4, 5, 6 ] }
```
