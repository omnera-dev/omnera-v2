## Collecting

### Collecting All Elements

To gather all elements from a data stream into a [Chunk](/docs/data-types/chunk/), use the `Sink.collectAll` sink.

The final output is a chunk containing all elements from the stream, in the order they were emitted.

**Example** (Collecting All Stream Elements)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 2, 3, 4)

Effect.runPromise(Stream.run(stream, Sink.collectAll())).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 2, 3, 4 ] }
*/
```

### Collecting a Specified Number

To collect a fixed number of elements from a stream into a [Chunk](/docs/data-types/chunk/), use `Sink.collectAllN`. This sink stops collecting once it reaches the specified limit.

**Example** (Collecting a Limited Number of Elements)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 2, 3, 4, 5)

Effect.runPromise(
  Stream.run(
    stream,
    // Collect the first 3 elements into a Chunk
    Sink.collectAllN(3)
  )
).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 2, 3 ] }
*/
```

### Collecting While Meeting a Condition

To gather elements from a stream while they satisfy a specific condition, use `Sink.collectAllWhile`. This sink collects elements until the provided predicate returns `false`.

**Example** (Collecting Elements Until a Condition Fails)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 2, 0, 4, 0, 6, 7)

Effect.runPromise(
  Stream.run(
    stream,
    // Collect elements while they are not equal to 0
    Sink.collectAllWhile((n) => n !== 0)
  )
).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 2 ] }
*/
```

### Collecting into a HashSet

To accumulate stream elements into a `HashSet`, use `Sink.collectAllToSet()`. This ensures that each element appears only once in the final set.

**Example** (Collecting Unique Elements into a HashSet)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 2, 2, 3, 4, 4)

Effect.runPromise(Stream.run(stream, Sink.collectAllToSet())).then(console.log)
/*
Output:
{ _id: 'HashSet', values: [ 1, 2, 3, 4 ] }
*/
```

### Collecting into HashSets of a Specific Size

For controlled collection into a `HashSet` with a specified maximum size, use `Sink.collectAllToSetN`. This sink gathers unique elements up to the given limit.

**Example** (Collecting Unique Elements with a Set Size Limit)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 2, 2, 3, 4, 4)

Effect.runPromise(
  Stream.run(
    stream,
    // Collect unique elements, limiting the set size to 3
    Sink.collectAllToSetN(3)
  )
).then(console.log)
/*
Output:
{ _id: 'HashSet', values: [ 1, 2, 3 ] }
*/
```

### Collecting into a HashMap

For more complex collection scenarios, `Sink.collectAllToMap` lets you gather elements into a `HashMap<K, A>` with a specified keying and merging strategy.
This sink requires both a key function to define each element's grouping and a merge function to combine values sharing the same key.

**Example** (Grouping and Merging Stream Elements in a HashMap)

In this example, we use `(n) => n % 3` to determine map keys and `(a, b) => a + b` to merge elements with the same key:

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 3, 2, 3, 1, 5, 1)

Effect.runPromise(
  Stream.run(
    stream,
    Sink.collectAllToMap(
      (n) => n % 3, // Key function to group by element value
      (a, b) => a + b // Merge function to sum values with the same key
    )
  )
).then(console.log)
/*
Output:
{ _id: 'HashMap', values: [ [ 0, 6 ], [ 1, 3 ], [ 2, 7 ] ] }
*/
```

### Collecting into a HashMap with Limited Keys

To accumulate elements into a `HashMap` with a maximum number of keys, use `Sink.collectAllToMapN`. This sink collects elements until it reaches the specified key limit, requiring a key function to define the grouping of each element and a merge function to combine values with the same key.

**Example** (Limiting Collected Keys in a HashMap)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 3, 2, 3, 1, 5, 1)

Effect.runPromise(
  Stream.run(
    stream,
    Sink.collectAllToMapN(
      3, // Maximum of 3 keys
      (n) => n, // Key function to group by element value
      (a, b) => a + b // Merge function to sum values with the same key
    )
  )
).then(console.log)
/*
Output:
{ _id: 'HashMap', values: [ [ 1, 2 ], [ 2, 2 ], [ 3, 6 ] ] }
*/
```
