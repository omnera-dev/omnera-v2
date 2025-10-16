## From Asynchronous Callback

Imagine you have an asynchronous function that relies on callbacks. If you want to capture the results emitted by those callbacks as a stream, you can use the `Stream.async` function. This function is designed to adapt functions that invoke their callbacks multiple times and emit the results as a stream.

Let's break down how to use it in the following example:

```ts twoslash
import { Stream, Effect, Chunk, Option, StreamEmit } from 'effect'

const events = [1, 2, 3, 4]

const stream = Stream.async((emit: StreamEmit.Emit<never, never, number, void>) => {
  events.forEach((n) => {
    setTimeout(() => {
      if (n === 3) {
        // Terminate the stream
        emit(Effect.fail(Option.none()))
      } else {
        // Add the current item to the stream
        emit(Effect.succeed(Chunk.of(n)))
      }
    }, 100 * n)
  })
})

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [ 1, 2 ] }
```

The `StreamEmit.Emit<R, E, A, void>` type represents an asynchronous callback that can be called multiple times. This callback takes a value of type `Effect<Chunk<A>, Option<E>, R>`. Here's what each of the possible outcomes means:

- When the value provided to the callback results in a `Chunk<A>` upon success, it signifies that the specified elements should be emitted as part of the stream.

- If the value passed to the callback results in a failure with `Some<E>`, it indicates the termination of the stream with the specified error.

- When the value passed to the callback results in a failure with `None`, it serves as a signal for the end of the stream, essentially terminating it.

To put it simply, this type allows you to specify how your asynchronous callback interacts with the stream, determining when to emit elements, when to terminate with an error, or when to signal the end of the stream.
