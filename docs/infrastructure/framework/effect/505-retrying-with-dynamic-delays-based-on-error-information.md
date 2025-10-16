## Retrying with Dynamic Delays Based on Error Information

Some API errors, such as `429 Too Many Requests`, include a `Retry-After` header that specifies how long to wait before retrying. Instead of using a fixed delay, we can dynamically adjust the retry interval based on this value.

**Example** (Using the `Retry-After` Header for Retry Delays)

This approach ensures that the retry delay adapts dynamically to the server's response, preventing unnecessary retries while respecting the provided `Retry-After` value.

```ts twoslash
import { Duration, Effect, Schedule, Data } from "effect"

// Custom error class representing a "Too Many Requests" response
class TooManyRequestsError extends Data.TaggedError(
  "TooManyRequestsError"
)<{ readonly retryAfter: number }> {}

let n = 1
const request = Effect.gen(function* () {
  // Simulate failing a particular number of times
  if (n < 3) {
    const retryAfter = n * 500
    console.log(`Attempt #${n++}, retry after ${retryAfter} millis...`)
    // Simulate retrieving the retry-after header
    return yield* Effect.fail(new TooManyRequestsError({ retryAfter }))
  }
  console.log("Done")
  return "some result"
})

// Retry policy that extracts the retry delay from the error
const policy = Schedule.identity<TooManyRequestsError>().pipe(
  Schedule.addDelay((error) =>
    error._tag === "TooManyRequestsError"
      ? // Wait for the specified retry-after duration
        Duration.millis(error.retryAfter)
      : Duration.zero
  ),
  // Limit retries to 5 attempts
  Schedule.intersect(Schedule.recurs(5))
)

const program = request.pipe(Effect.retry(policy))

Effect.runFork(program)
/*
Output:
Attempt #1, retry after 500 millis...
Attempt #2, retry after 1000 millis...
Done
*/
```
