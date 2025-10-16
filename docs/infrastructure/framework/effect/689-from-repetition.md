## From Repetition

### Repeating a Single Value

You can create a stream that endlessly repeats a specific value using the `Stream.repeatValue` constructor:

```ts twoslash
import { Stream, Effect } from "effect"

const stream = Stream.repeatValue(0)

Effect.runPromise(Stream.runCollect(stream.pipe(Stream.take(5)))).then(
  console.log
)
// { _id: 'Chunk', values: [ 0, 0, 0, 0, 0 ] }
```

### Repeating a Stream's Content

`Stream.repeat` allows you to create a stream that repeats a specified stream's content according to a schedule. This can be useful for generating recurring events or values.

```ts twoslash
import { Stream, Effect, Schedule } from "effect"

// Creating a stream that repeats a value indefinitely
const stream = Stream.repeat(Stream.succeed(1), Schedule.forever)

Effect.runPromise(Stream.runCollect(stream.pipe(Stream.take(5)))).then(
  console.log
)
// { _id: 'Chunk', values: [ 1, 1, 1, 1, 1 ] }
```

### Repeating an Effect's Result

Imagine you have an effectful API call, and you want to use the result of that call to create a stream. You can achieve this by creating a stream from the effect and repeating it indefinitely.

Here's an example of generating a stream of random numbers:

```ts twoslash
import { Stream, Effect, Random } from "effect"

const stream = Stream.repeatEffect(Random.nextInt)

Effect.runPromise(Stream.runCollect(stream.pipe(Stream.take(5)))).then(
  console.log
)
/*
Example Output:
{
  _id: 'Chunk',
  values: [ 1666935266, 604851965, 2194299958, 3393707011, 4090317618 ]
}
*/
```

### Repeating an Effect with Termination

You can repeatedly evaluate a given effect and terminate the stream based on specific conditions.

In this example, we're draining an `Iterator` to create a stream from it:

```ts twoslash
import { Stream, Effect, Option } from "effect"

const drainIterator = <A>(it: Iterator<A>): Stream.Stream<A> =>
  Stream.repeatEffectOption(
    Effect.sync(() => it.next()).pipe(
      Effect.andThen((res) => {
        if (res.done) {
          return Effect.fail(Option.none())
        }
        return Effect.succeed(res.value)
      })
    )
  )
```

### Generating Ticks

You can create a stream that emits `void` values at specified intervals using the `Stream.tick` constructor. This is useful for creating periodic events.

```ts twoslash
import { Stream, Effect } from "effect"

const stream = Stream.tick("100 millis")

Effect.runPromise(Stream.runCollect(stream.pipe(Stream.take(5)))).then(
  console.log
)
/*
Output:
{
  _id: 'Chunk',
  values: [ undefined, undefined, undefined, undefined, undefined ]
}
*/
```
