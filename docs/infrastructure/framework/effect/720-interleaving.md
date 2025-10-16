## Interleaving

### interleave

The `Stream.interleave` operator lets you pull one element at a time from each of two streams, creating a new interleaved stream. If one stream finishes first, the remaining elements from the other stream continue to be pulled until both streams are exhausted.

**Example** (Basic Interleaving of Two Streams)

```ts twoslash
import { Stream, Effect } from "effect"

const s1 = Stream.make(1, 2, 3)
const s2 = Stream.make(4, 5, 6)

const stream = Stream.interleave(s1, s2)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 4, 2, 5, 3, 6 ] }
*/
```

### interleaveWith

For more complex interleaving, `Stream.interleaveWith` provides additional control by using a third stream of `boolean` values to dictate the interleaving pattern. When this stream emits `true`, an element is taken from the left-hand stream; otherwise, an element is taken from the right-hand stream.

**Example** (Custom Interleaving Logic Using `Stream.interleaveWith`)

```ts twoslash
import { Stream, Effect } from "effect"

const s1 = Stream.make(1, 3, 5, 7, 9)
const s2 = Stream.make(2, 4, 6, 8, 10)

// Define a boolean stream to control interleaving
const booleanStream = Stream.make(true, false, false).pipe(Stream.forever)

const stream = Stream.interleaveWith(s1, s2, booleanStream)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: 'Chunk',
  values: [
    1, 2,  4, 3, 6,
    8, 5, 10, 7, 9
  ]
}
*/
```
