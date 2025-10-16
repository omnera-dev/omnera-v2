## Common Constructors

### head

The `Sink.head` sink retrieves only the first element from a stream, wrapping it in `Some`. If the stream has no elements, it returns `None`.

**Example** (Retrieving the First Element)

```ts twoslash
import { Stream, Sink, Effect } from "effect"

const nonEmptyStream = Stream.make(1, 2, 3, 4)

Effect.runPromise(Stream.run(nonEmptyStream, Sink.head())).then(
  console.log
)
/*
Output:
{ _id: 'Option', _tag: 'Some', value: 1 }
*/

const emptyStream = Stream.empty

Effect.runPromise(Stream.run(emptyStream, Sink.head())).then(console.log)
/*
Output:
{ _id: 'Option', _tag: 'None' }
*/
```

### last

The `Sink.last` sink retrieves only the last element from a stream, wrapping it in `Some`. If the stream has no elements, it returns `None`.

**Example** (Retrieving the Last Element)

```ts twoslash
import { Stream, Sink, Effect } from "effect"

const nonEmptyStream = Stream.make(1, 2, 3, 4)

Effect.runPromise(Stream.run(nonEmptyStream, Sink.last())).then(
  console.log
)
/*
Output:
{ _id: 'Option', _tag: 'Some', value: 4 }
*/

const emptyStream = Stream.empty

Effect.runPromise(Stream.run(emptyStream, Sink.last())).then(console.log)
/*
Output:
{ _id: 'Option', _tag: 'None' }
*/
```

### count

The `Sink.count` sink consumes all elements of the stream and counts the number of elements fed to it.

```ts twoslash
import { Stream, Sink, Effect } from "effect"

const stream = Stream.make(1, 2, 3, 4)

Effect.runPromise(Stream.run(stream, Sink.count)).then(console.log)
// Output: 4
```

### sum

The `Sink.sum` sink consumes all elements of the stream and sums incoming numeric values.

```ts twoslash
import { Stream, Sink, Effect } from "effect"

const stream = Stream.make(1, 2, 3, 4)

Effect.runPromise(Stream.run(stream, Sink.sum)).then(console.log)
// Output: 10
```

### take

The `Sink.take` sink takes the specified number of values from the stream and results in a [Chunk](/docs/data-types/chunk/) data type.

```ts twoslash
import { Stream, Sink, Effect } from "effect"

const stream = Stream.make(1, 2, 3, 4)

Effect.runPromise(Stream.run(stream, Sink.take(3))).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 2, 3 ] }
*/
```

### drain

The `Sink.drain` sink ignores its inputs, effectively discarding them.

```ts twoslash
import { Stream, Console, Sink, Effect } from "effect"

const stream = Stream.make(1, 2, 3, 4).pipe(Stream.tap(Console.log))

Effect.runPromise(Stream.run(stream, Sink.drain)).then(console.log)
/*
Output:
1
2
3
4
undefined
*/
```

### timed

The `Sink.timed` sink executes the stream and measures its execution time, providing the [Duration](/docs/data-types/duration/).

```ts twoslash
import { Stream, Schedule, Sink, Effect } from "effect"

const stream = Stream.make(1, 2, 3, 4).pipe(
  Stream.schedule(Schedule.spaced("100 millis"))
)

Effect.runPromise(Stream.run(stream, Sink.timed)).then(console.log)
/*
Output:
{ _id: 'Duration', _tag: 'Millis', millis: 408 }
*/
```

### forEach

The `Sink.forEach` sink executes the provided effectful function for every element fed to it.

```ts twoslash
import { Stream, Console, Sink, Effect } from "effect"

const stream = Stream.make(1, 2, 3, 4)

Effect.runPromise(Stream.run(stream, Sink.forEach(Console.log))).then(
  console.log
)
/*
Output:
1
2
3
4
undefined
*/
```
