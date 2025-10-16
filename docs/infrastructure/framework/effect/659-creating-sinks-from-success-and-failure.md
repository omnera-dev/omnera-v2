## Creating Sinks from Success and Failure

Just as you can define streams to hold or manipulate data, you can also create sinks with specific success or failure outcomes using the `Sink.fail` and `Sink.succeed` functions.

### Succeeding Sink

This example creates a sink that doesn’t consume any elements from its upstream source but instead immediately succeeds with a specified numeric value:

**Example** (Sink that Always Succeeds with a Value)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 2, 3, 4)

Effect.runPromise(Stream.run(stream, Sink.succeed(0))).then(console.log)
// Output: 0
```

### Failing Sink

In this example, the sink also doesn’t consume any elements from its upstream source. Instead, it fails with a specified error message of type `string`:

**Example** (Sink that Always Fails with an Error Message)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

const stream = Stream.make(1, 2, 3, 4)

Effect.runPromiseExit(Stream.run(stream, Sink.fail('fail!'))).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'fail!' }
}
*/
```
