## Retry a Failing Stream

Sometimes, streams may encounter failures that are temporary or recoverable. In such cases, the `Stream.retry` operator comes in handy. It allows you to specify a retry schedule, and the stream will be retried according to that schedule.

**Example**

```ts twoslash
import { Stream, Effect, Schedule } from "effect"
import * as NodeReadLine from "node:readline"

const stream = Stream.make(1, 2, 3).pipe(
  Stream.concat(
    Stream.fromEffect(
      Effect.gen(function* () {
        const s = yield* readLine("Enter a number: ")
        const n = parseInt(s)
        if (Number.isNaN(n)) {
          return yield* Effect.fail("NaN")
        }
        return n
      })
    ).pipe(Stream.retry(Schedule.exponential("1 second")))
  )
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
Enter a number: a
Enter a number: b
Enter a number: c
Enter a number: 4
{
  _id: "Chunk",
  values: [ 1, 2, 3, 4 ]
}
*/

const readLine = (message: string): Effect.Effect<string> =>
  Effect.promise(
    () =>
      new Promise((resolve) => {
        const rl = NodeReadLine.createInterface({
          input: process.stdin,
          output: process.stdout
        })
        rl.question(message, (answer) => {
          rl.close()
          resolve(answer)
        })
      })
  )
```

In this example, the stream asks the user to input a number, but if an invalid value is entered (e.g., "a," "b," "c"), it fails with "NaN." However, we use `Stream.retry` with an exponential backoff schedule, which means it will retry after a delay of increasing duration. This allows us to handle temporary errors and eventually collect valid input.
