## Ensuring

In this section, we'll explore a scenario where we need to perform actions after the finalization of a stream. To achieve this, we can utilize the `Stream.ensuring` operator.

Consider a situation where our application has completed its primary logic and finalized some resources, but we also need to perform additional actions afterward. We can use `Stream.ensuring` for this purpose:

```ts twoslash
import { Stream, Console, Effect } from "effect"

const program = Stream.fromEffect(Console.log("Application Logic.")).pipe(
  Stream.concat(Stream.finalizer(Console.log("Finalizing the stream"))),
  Stream.ensuring(
    Console.log("Doing some other works after stream's finalization")
  )
)

Effect.runPromise(Stream.runCollect(program)).then(console.log)
/*
Output:
Application Logic.
Finalizing the stream
Doing some other works after stream's finalization
{
  _id: "Chunk",
  values: [ undefined, undefined ]
}
*/
```

In this code example, we start with our application logic represented by the `Application Logic.` message. We then use `Stream.finalizer` to specify the finalization step, which logs `Finalizing the stream`. After that, we use `Stream.ensuring` to indicate that we want to perform additional tasks after the stream's finalization, resulting in the message `Performing additional tasks after stream's finalization`. This ensures that our post-finalization actions are executed as expected.

# [TestClock](https://effect.website/docs/testing/testclock/)
