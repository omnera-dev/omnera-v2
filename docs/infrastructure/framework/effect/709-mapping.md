## Mapping

### Basic Mapping

The `Stream.map` operation applies a specified function to each element in a stream, creating a new stream with the transformed values.

**Example** (Incrementing Each Element by 1)

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.make(1, 2, 3).pipe(
  Stream.map((n) => n + 1) // Increment each element by 1
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 2, 3, 4 ] }
*/
```

### Mapping to a Constant Value

The `Stream.as` method allows you to replace each success value in a stream with a specified constant value. This can be useful when you want all elements in the stream to emit a uniform value, regardless of the original data.

**Example** (Mapping to `null`)

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.range(1, 5).pipe(Stream.as(null))

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ null, null, null, null, null ] }
*/
```

### Effectful Mapping

For transformations involving effects, use `Stream.mapEffect`. This function applies an effectful operation to each element in the stream, producing a new stream with effectful results.

**Example** (Random Number Generation)

```ts twoslash
import { Stream, Random, Effect } from 'effect'

const stream = Stream.make(10, 20, 30).pipe(
  // Generate a random number between 0 and each element
  Stream.mapEffect((n) => Random.nextIntBetween(0, n))
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Example Output:
{ _id: 'Chunk', values: [ 5, 9, 22 ] }
*/
```

To handle multiple effectful transformations concurrently, you can use the [concurrency](/docs/concurrency/basic-concurrency/#concurrency-options) option. This option allows a specified number of effects to run concurrently, with results emitted downstream in their original order.

**Example** (Fetching URLs Concurrently)

```ts twoslash
import { Stream, Effect } from 'effect'

const fetchUrl = (url: string) =>
  Effect.gen(function* () {
    console.log(`Fetching ${url}`)
    yield* Effect.sleep('100 millis')
    console.log(`Fetching ${url} done`)
    return [`Resource 0-${url}`, `Resource 1-${url}`, `Resource 2-${url}`]
  })

const stream = Stream.make('url1', 'url2', 'url3').pipe(
  // Fetch each URL concurrently with a limit of 2
  Stream.mapEffect(fetchUrl, { concurrency: 2 })
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
Fetching url1
Fetching url2
Fetching url1 done
Fetching url3
Fetching url2 done
Fetching url3 done
{
  _id: 'Chunk',
  values: [
    [ 'Resource 0-url1', 'Resource 1-url1', 'Resource 2-url1' ],
    [ 'Resource 0-url2', 'Resource 1-url2', 'Resource 2-url2' ],
    [ 'Resource 0-url3', 'Resource 1-url3', 'Resource 2-url3' ]
  ]
}
*/
```

### Stateful Mapping

`Stream.mapAccum` is similar to `Stream.map`, but it applies a transformation with state tracking, allowing you to map and accumulate values within a single operation. This is useful for tasks like calculating a running total in a stream.

**Example** (Calculating a Running Total)

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.range(1, 5).pipe(
  //                                  ┌─── next state
  //                                  │          ┌─── emitted value
  //                                  ▼          ▼
  Stream.mapAccum(0, (state, n) => [state + n, state + n])
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 3, 6, 10, 15 ] }
*/
```

### Mapping and Flattening

The `Stream.mapConcat` operation is similar to `Stream.map`, but it goes further by mapping each element to zero or more elements (as an `Iterable`) and then flattening the entire stream. This is particularly useful for transforming each element into multiple values.

**Example** (Splitting and Flattening a Stream)

```ts twoslash
import { Stream, Effect } from 'effect'

const numbers = Stream.make('1-2-3', '4-5', '6').pipe(Stream.mapConcat((s) => s.split('-')))

Effect.runPromise(Stream.runCollect(numbers)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ '1', '2', '3', '4', '5', '6' ] }
*/
```
