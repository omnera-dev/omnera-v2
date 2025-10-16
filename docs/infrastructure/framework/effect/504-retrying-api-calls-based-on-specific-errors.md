## Retrying API Calls Based on Specific Errors

Sometimes, retries should only happen for certain error conditions. For example, if an API call fails with a `401 Unauthorized` response, retrying might make sense, while a `404 Not Found` error should not trigger a retry.

**Example** (Retrying Only on Specific Error Codes)

```ts twoslash
import { Console, Effect, Data } from "effect"

// Custom error class for handling status codes
class Err extends Data.TaggedError("Err")<{
  readonly message: string
  readonly status: number
}> {}

// Function to make the API call
const getJson = (url: string) =>
  Effect.tryPromise({
    try: () =>
      fetch(url).then((res) => {
        if (!res.ok) {
          console.log(res.status)
          throw new Err({ message: res.statusText, status: res.status })
        }
        return res.json() as unknown
      }),
    catch: (e) => e as Err
  })

// Program that retries only when the error status is 401 (Unauthorized)
const program = (url: string) =>
  getJson(url).pipe(
    Effect.retry({ while: (err) => err.status === 401 }),
    Effect.catchAll(Console.error)
  )

// Test case: API returns 401 (triggers multiple retries)
Effect.runFork(
  program("https://dummyjson.com/auth/products/1?delay=1000")
)
/*
Output:
401
401
401
401
...
*/

// Test case: API returns 404 (no retries)
Effect.runFork(program("https://dummyjson.com/-"))
/*
Output:
404
Err [Error]: Not Found
*/
```
