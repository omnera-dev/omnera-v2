## From Iterables

### fromIterable

You can create a pure stream from an `Iterable` of values using the `Stream.fromIterable` constructor. It's a straightforward way to convert a collection of values into a stream.

```ts twoslash
import { Stream, Effect } from 'effect'

const numbers = [1, 2, 3]

const stream = Stream.fromIterable(numbers)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [ 1, 2, 3 ] }
```

### fromIterableEffect

When you have an effect that produces a value of type `Iterable`, you can employ the `Stream.fromIterableEffect` constructor to generate a stream from that effect.

For instance, let's say you have a database operation that retrieves a list of users. Since this operation involves effects, you can utilize `Stream.fromIterableEffect` to convert the result into a `Stream`:

```ts twoslash
import { Stream, Effect, Context } from 'effect'

class Database extends Context.Tag('Database')<
  Database,
  { readonly getUsers: Effect.Effect<Array<string>> }
>() {}

const getUsers = Database.pipe(Effect.andThen((_) => _.getUsers))

const stream = Stream.fromIterableEffect(getUsers)

Effect.runPromise(
  Stream.runCollect(
    stream.pipe(
      Stream.provideService(Database, {
        getUsers: Effect.succeed(['user1', 'user2']),
      })
    )
  )
).then(console.log)
// { _id: 'Chunk', values: [ 'user1', 'user2' ] }
```

This enables you to work seamlessly with effects and convert their results into streams for further processing.

### fromAsyncIterable

Async iterables are another type of data source that can be converted into a stream. With the `Stream.fromAsyncIterable` constructor, you can work with asynchronous data sources and handle potential errors gracefully.

```ts twoslash
import { Stream, Effect } from 'effect'

const myAsyncIterable = async function* () {
  yield 1
  yield 2
}

const stream = Stream.fromAsyncIterable(
  myAsyncIterable(),
  (e) => new Error(String(e)) // Error Handling
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [ 1, 2 ] }
```

In this code, we define an async iterable and then create a stream named `stream` from it. Additionally, we provide an error handler function to manage any potential errors that may occur during the conversion.
