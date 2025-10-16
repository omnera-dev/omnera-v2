## Using a Sink

To consume a stream using a Sink, you can pass the `Sink` to the `Stream.run` function. Here's an example:

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const effect = Stream.make(1, 2, 3).pipe(Stream.run(Sink.sum))

Effect.runPromise(effect).then(console.log)
// Output: 6
```

In this example, we use a `Sink` to calculate the sum of the elements in the stream.

# [Creating Streams](https://effect.website/docs/stream/creating/)
