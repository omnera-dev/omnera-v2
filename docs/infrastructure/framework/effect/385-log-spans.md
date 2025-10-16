## Log Spans

Effect provides built-in support for log spans, which allow you to measure and log the duration of specific tasks or sections of your code. This feature is helpful for tracking how long certain operations take, giving you better insights into the performance of your application.

**Example** (Measuring Task Duration with a Log Span)

```ts twoslash
import { Effect } from "effect"

const program = Effect.gen(function* () {
  // Simulate a delay to represent a task taking time
  yield* Effect.sleep("1 second")
  // Log a message indicating the job is done
  yield* Effect.log("The job is finished!")
}).pipe(
  // Apply a log span labeled "myspan" to measure
  // the duration of this operation
  Effect.withLogSpan("myspan")
)

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message="The job is finished!" myspan=1011ms
*/
```
