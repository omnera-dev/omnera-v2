## Common Constructors

### make

You can create a pure stream by using the `Stream.make` constructor. This constructor accepts a variable list of values as its arguments.

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.make(1, 2, 3)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [ 1, 2, 3 ] }
```

### empty

Sometimes, you may require a stream that doesn't produce any values. In such cases, you can use `Stream.empty`. This constructor creates a stream that remains empty.

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.empty

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [] }
```

### void

If you need a stream that contains a single `void` value, you can use `Stream.void`. This constructor is handy when you want to represent a stream with a single event or signal.

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.void

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [ undefined ] }
```

### range

To create a stream of integers within a specified range `[min, max]` (including both endpoints, `min` and `max`), you can use `Stream.range`. This is particularly useful for generating a stream of sequential numbers.

```ts twoslash
import { Stream, Effect } from 'effect'

// Creating a stream of numbers from 1 to 5
const stream = Stream.range(1, 5)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [ 1, 2, 3, 4, 5 ] }
```

### iterate

With `Stream.iterate`, you can generate a stream by applying a function iteratively to an initial value. The initial value becomes the first element produced by the stream, followed by subsequent values produced by `f(init)`, `f(f(init))`, and so on.

```ts twoslash
import { Stream, Effect } from 'effect'

// Creating a stream of incrementing numbers
const stream = Stream.iterate(1, (n) => n + 1) // Produces 1, 2, 3, ...

Effect.runPromise(Stream.runCollect(stream.pipe(Stream.take(5)))).then(console.log)
// { _id: 'Chunk', values: [ 1, 2, 3, 4, 5 ] }
```

### scoped

`Stream.scoped` is used to create a single-valued stream from a scoped resource. It can be handy when dealing with resources that require explicit acquisition, usage, and release.

```ts twoslash
import { Stream, Effect, Console } from 'effect'

// Creating a single-valued stream from a scoped resource
const stream = Stream.scoped(
  Effect.acquireUseRelease(
    Console.log('acquire'),
    () => Console.log('use'),
    () => Console.log('release')
  )
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
acquire
use
release
{ _id: 'Chunk', values: [ undefined ] }
*/
```
