## Recovery from Some Errors

In stream processing, there may be situations where you need to recover from specific types of failures. The `Stream.catchSome` and `Stream.catchSomeCause` functions come to the rescue, allowing you to handle and mitigate errors selectively.

If you want to recover from a particular error, you can use `Stream.catchSome`:

```ts twoslash
import { Stream, Effect, Option } from 'effect'

const s1 = Stream.make(1, 2, 3).pipe(
  Stream.concat(Stream.fail('Oh! Error!')),
  Stream.concat(Stream.make(4, 5))
)

const s2 = Stream.make('a', 'b', 'c')

const stream = Stream.catchSome(s1, (error) => {
  if (error === 'Oh! Error!') {
    return Option.some(s2)
  }
  return Option.none()
})

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: "Chunk",
  values: [ 1, 2, 3, "a", "b", "c" ]
}
*/
```

To recover from a specific cause, you can use the `Stream.catchSomeCause` function:

```ts twoslash
import { Stream, Effect, Option, Cause } from 'effect'

const s1 = Stream.make(1, 2, 3).pipe(
  Stream.concat(Stream.dieMessage('Oh! Error!')),
  Stream.concat(Stream.make(4, 5))
)

const s2 = Stream.make('a', 'b', 'c')

const stream = Stream.catchSomeCause(s1, (cause) => {
  if (Cause.isDie(cause)) {
    return Option.some(s2)
  }
  return Option.none()
})

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: "Chunk",
  values: [ 1, 2, 3, "a", "b", "c" ]
}
*/
```
