## Merging

Sometimes, you may want to interleave elements from two streams and create a single output stream. In such cases, `Stream.concat` isn't suitable because it waits for the first stream to complete before consuming the second. For interleaving elements as they become available, `Stream.merge` and its variants are designed for this purpose.

### merge

The `Stream.merge` operation combines elements from two source streams into a single stream, interleaving elements as they are produced. Unlike `Stream.concat`, `Stream.merge` does not wait for one stream to finish before starting the other.

**Example** (Interleaving Two Streams with `Stream.merge`)

```ts twoslash
import { Schedule, Stream, Effect } from "effect"

// Create two streams with different emission intervals
const s1 = Stream.make(1, 2, 3).pipe(
  Stream.schedule(Schedule.spaced("100 millis"))
)
const s2 = Stream.make(4, 5, 6).pipe(
  Stream.schedule(Schedule.spaced("200 millis"))
)

// Merge s1 and s2 into a single stream that interleaves their values
const merged = Stream.merge(s1, s2)

Effect.runPromise(Stream.runCollect(merged)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 4, 2, 3, 5, 6 ] }
*/
```

### Termination Strategy

When merging two streams, it's important to consider the termination strategy, especially if each stream has a different lifetime.
By default, `Stream.merge` waits for both streams to terminate before ending the merged stream. However, you can modify this behavior with `haltStrategy`, selecting from four termination strategies:

| Termination Strategy | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `"left"`             | The merged stream terminates when the left-hand stream terminates.   |
| `"right"`            | The merged stream terminates when the right-hand stream terminates.  |
| `"both"` (default)   | The merged stream terminates only when both streams have terminated. |
| `"either"`           | The merged stream terminates as soon as either stream terminates.    |

**Example** (Using `haltStrategy: "left"` to Control Stream Termination)

```ts twoslash
import { Stream, Schedule, Effect } from "effect"

const s1 = Stream.range(1, 5).pipe(
  Stream.schedule(Schedule.spaced("100 millis"))
)
const s2 = Stream.repeatValue(0).pipe(
  Stream.schedule(Schedule.spaced("200 millis"))
)

const merged = Stream.merge(s1, s2, { haltStrategy: "left" })

Effect.runPromise(Stream.runCollect(merged)).then(console.log)
/*
Output:
{
  _id: 'Chunk',
  values: [
    1, 0, 2, 3,
    0, 4, 5
  ]
}
*/
```

### mergeWith

In some cases, you may want to merge two streams while transforming their elements into a unified type. `Stream.mergeWith` is designed for this purpose, allowing you to specify transformation functions for each source stream.

**Example** (Merging and Transforming Two Streams)

```ts twoslash
import { Schedule, Stream, Effect } from "effect"

const s1 = Stream.make("1", "2", "3").pipe(
  Stream.schedule(Schedule.spaced("100 millis"))
)
const s2 = Stream.make(4.1, 5.3, 6.2).pipe(
  Stream.schedule(Schedule.spaced("200 millis"))
)

const merged = Stream.mergeWith(s1, s2, {
  // Convert string elements from `s1` to integers
  onSelf: (s) => parseInt(s),
  // Round down decimal elements from `s2`
  onOther: (n) => Math.floor(n)
})

Effect.runPromise(Stream.runCollect(merged)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 4, 2, 3, 5, 6 ] }
*/
```
