## Timing Out

When working with streams, there are scenarios where you may want to handle timeouts, such as terminating a stream if it doesn't produce a value within a certain duration. In this section, we'll explore how to manage timeouts using various operators.

### timeout

The `Stream.timeout` operator allows you to set a timeout on a stream. If the stream does not produce a value within the specified duration, it terminates.

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.fromEffect(Effect.never).pipe(Stream.timeout('2 seconds'))

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
{
  _id: "Chunk",
  values: []
}
*/
```

### timeoutFail

The `Stream.timeoutFail` operator combines a timeout with a custom failure message. If the stream times out, it fails with the specified error message.

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.fromEffect(Effect.never).pipe(
  Stream.timeoutFail(() => 'timeout', '2 seconds')
)

Effect.runPromiseExit(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'timeout' }
}
*/
```

### timeoutFailCause

Similar to `Stream.timeoutFail`, `Stream.timeoutFailCause` combines a timeout with a custom failure cause. If the stream times out, it fails with the specified cause.

```ts twoslash
import { Stream, Effect, Cause } from 'effect'

const stream = Stream.fromEffect(Effect.never).pipe(
  Stream.timeoutFailCause(() => Cause.die('timeout'), '2 seconds')
)

Effect.runPromiseExit(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Die', defect: 'timeout' }
}
*/
```

### timeoutTo

The `Stream.timeoutTo` operator allows you to switch to another stream if the first stream does not produce a value within the specified duration.

```ts twoslash
import { Stream, Effect } from 'effect'

const stream = Stream.fromEffect(Effect.never).pipe(
  Stream.timeoutTo('2 seconds', Stream.make(1, 2, 3))
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
{
  _id: "Chunk",
  values: [ 1, 2, 3 ]
}
*/
```

# [Introduction to Streams](https://effect.website/docs/stream/introduction/)
