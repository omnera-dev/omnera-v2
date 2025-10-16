## From Effect

You can generate a stream from an Effect workflow by employing the `Stream.fromEffect` constructor. For instance, consider the following stream, which generates a single random number:

```ts twoslash
import { Stream, Random, Effect } from "effect"

const stream = Stream.fromEffect(Random.nextInt)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// Example Output: { _id: 'Chunk', values: [ 1042302242 ] }
```

This method allows you to seamlessly transform the output of an Effect into a stream, providing a straightforward way to work with asynchronous operations within your streams.
